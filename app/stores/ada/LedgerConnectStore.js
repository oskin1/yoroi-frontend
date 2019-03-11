// @flow
// Handles Connect to Ledger Hardware Wallet dialog

import { observable, action } from 'mobx';

import {
  LedgerBridge,
  BIP44_HARDENED_CARDANO_FIRST_ACCOUNT_SUB_PATH as CARDANO_FIRST_ACCOUNT_SUB_PATH
} from 'yoroi-extension-ledger-bridge';
import type {
  GetVersionResponse,
  GetExtendedPublicKeyResponse,
} from '@cardano-foundation/ledgerjs-hw-app-cardano';

import Config from '../../config';
import environment from '../../environment';

import Store from '../base/Store';
import Wallet from '../../domain/Wallet';
import LocalizedRequest from '../lib/LocalizedRequest';

import type {
  CreateHardwareWalletRequest,
  CreateHardwareWalletResponse,
} from '../../api/common';

// This is actually just an interface
import {
  HWConnectStoreTypes,
  StepState,
  ProgressStep,
  ProgressInfo,
  HWDeviceInfo
} from '../../types/HWConnectStoreTypes';

import {
  prepareLedgerBridger,
  disposeLedgerBridgeIFrame
} from '../../utils/iframeHandler';

import globalMessages from '../../i18n/global-messages';
import LocalizableError, { UnexpectedError } from '../../i18n/LocalizableError';
import { CheckAdressesInUseApiError } from '../../api/ada/errors';

import {
  Logger,
  stringifyData,
  stringifyError
} from '../../utils/logging';

/** TODO: TrezorConnectStore and LedgerConnectStore has many common methods
  * try to make a common base class */
export default class LedgerConnectStore extends Store implements HWConnectStoreTypes {

  // =================== VIEW RELATED =================== //
  @observable progressInfo: ProgressInfo;
  error: ?LocalizableError;
  hwDeviceInfo: ?HWDeviceInfo;
  ledgerBridge: ?LedgerBridge;

  get defaultWalletName(): string {
    // Ledger doesn’t provide any device name so using hard-coded name
    return Config.wallets.hardwareWallet.ledgerNanoS.DEFAULT_WALLET_NAME;
  }

  get isActionProcessing(): boolean {
    return this.progressInfo.stepState === StepState.PROCESS;
  }
  // =================== VIEW RELATED =================== //

  // =================== API RELATED =================== //
  createHWRequest: LocalizedRequest<CreateHardwareWalletResponse> =
    new LocalizedRequest(this.api.ada.createHardwareWallet);

  /** While ledger wallet creation is taking place, we need to block users from starting a
    * ledger wallet creation on a seperate wallet and explain to them why the action is blocked */
  @observable isCreateHWActive: boolean = false;
  // =================== API RELATED =================== //

  setup() {
    this._reset();
    const ledgerConnectAction = this.actions.ada.ledgerConnect;
    ledgerConnectAction.init.listen(this._init);
    ledgerConnectAction.cancel.listen(this._cancel);
    ledgerConnectAction.submitAbout.listen(this._submitAbout);
    ledgerConnectAction.goBackToAbout.listen(this._goBackToAbout);
    ledgerConnectAction.submitConnect.listen(this._submitConnect);
    ledgerConnectAction.submitSave.listen(this._submitSave);
  }

  /** setup() is called when stores are being created
    * _init() is called when connect dailog is about to show */
  _init = (): void => {
    Logger.debug('LedgerConnectStore::_init called');
    if (this.ledgerBridge == null) {
      Logger.debug('LedgerConnectStore::_init new LedgerBridge created');
      this.ledgerBridge = new LedgerBridge();
    }
  }

  @action _cancel = (): void => {
    this.teardown();
  };

  teardown(): void {
    this._reset();
    super.teardown();
  }

  @action _reset = (): void => {
    disposeLedgerBridgeIFrame();
    this.ledgerBridge = undefined;

    this.progressInfo = {
      currentStep: ProgressStep.ABOUT,
      stepState: StepState.LOAD,
    };

    this.error = undefined;
    this.hwDeviceInfo = undefined;
  };

  // =================== ABOUT =================== //
  /** ABOUT dialog submit(Next button) */
  @action _submitAbout = (): void => {
    this.error = undefined;
    this.progressInfo.currentStep = ProgressStep.CONNECT;
    this.progressInfo.stepState = StepState.LOAD;
  };
  // =================== ABOUT =================== //

  // =================== CONNECT =================== //
  /** CONNECT dialog goBack button */
  @action _goBackToAbout = (): void => {
    this.error = undefined;
    this.progressInfo.currentStep = ProgressStep.ABOUT;
    this.progressInfo.stepState = StepState.LOAD;
  };

  /** CONNECT dialog submit (Connect button) */
  @action _submitConnect = (): void => {
    this.error = undefined;
    this.progressInfo.currentStep = ProgressStep.CONNECT;
    this.progressInfo.stepState = StepState.PROCESS;
    this._checkAndStoreHWDeviceInfo();
  };

  _checkAndStoreHWDeviceInfo = async (): Promise<void> => {
    try {
      if (this.ledgerBridge) {
        // Since this.ledgerBridge is undefinable flow need to know that it's a LedgerBridge
        const ledgerBridge: LedgerBridge = this.ledgerBridge;
        await prepareLedgerBridger(ledgerBridge);

        const versionResp: GetVersionResponse = await ledgerBridge.getVersion();

        Logger.debug(stringifyData(versionResp));
        // https://github.com/bitcoin/bips/blob/master/bip-0044.mediawiki#examples
        Logger.debug(stringifyData(CARDANO_FIRST_ACCOUNT_SUB_PATH));

        // get Cardano's first account's
        // i.e hdPath = [2147483692, 2147485463, 2147483648]
        const extendedPublicKeyResp: GetExtendedPublicKeyResponse
          = await ledgerBridge.getExtendedPublicKey(CARDANO_FIRST_ACCOUNT_SUB_PATH);

        this.hwDeviceInfo = this._normalizeHWResponse(versionResp, extendedPublicKeyResp);

        this._goToSaveLoad();
        Logger.info('Ledger device OK');
      } else {
        throw new Error(`LedgerBridge Error: LedgerBridge is undefined`);
      }
    } catch (error) {
      this._handleConnectError(error);
    }
  };

  _normalizeHWResponse = (
    versionResp: GetVersionResponse,
    extendedPublicKeyResp: GetExtendedPublicKeyResponse
  ): HWDeviceInfo => {
    if (!this._validateHWResponse(versionResp, extendedPublicKeyResp)) {
      throw new UnexpectedError();
    }

    return {
      publicMasterKey: extendedPublicKeyResp.publicKeyHex + extendedPublicKeyResp.chainCodeHex,
      hwFeatures: {
        vendor: Config.wallets.hardwareWallet.ledgerNanoS.VENDOR,
        model: Config.wallets.hardwareWallet.ledgerNanoS.MODEL,
        label: '',
        deviceId: '',
        language: '',
        majorVersion: parseInt(versionResp.major, 10),
        minorVersion: parseInt(versionResp.minor, 10),
        patchVersion: parseInt(versionResp.patch, 10),
      }
    };
  }

  _validateHWResponse = (
    versionResp: GetVersionResponse,
    extendedPublicKeyResp: GetExtendedPublicKeyResponse
  ): boolean => {
    if (versionResp == null) {
      throw new UnexpectedError();
    }

    if (extendedPublicKeyResp == null) {
      throw new UnexpectedError();
    }

    return true;
  };

  _handleConnectError = (error: any): void => {
    Logger.error(`LedgerConnectStore::_checkAndStoreHWDeviceInfo ${stringifyError(error)}`);

    this.hwDeviceInfo = undefined;
    this.error = this._convertToLocalizableError(error);

    this._goToConnectError();
  };

  /** Converts error(from API or Ledger API) to LocalizableError */
  _convertToLocalizableError = (error: any): LocalizableError => {
    let localizableError: ?LocalizableError = null;

    console.log(JSON.stringify(error, null, 2));

    if (error instanceof LocalizableError) {
      // It means some API Error has been thrown
      localizableError = error;
    } else if (error && error.message) {
      // Ledger device related error happend, convert then to LocalizableError
      switch (error.message) {
        case 'TransportError: Failed to sign with Ledger device: U2F TIMEOUT':
          localizableError = new LocalizableError(globalMessages.ledgerError101);
          break;
        case 'TransportStatusError: Ledger device: Action rejected by user':
          localizableError = new LocalizableError(globalMessages.hwError101);
          break;
        default:
          /** we are not able to figure out why Error is thrown
            * make it, Something unexpected happened */
          Logger.error(`LedgerConnectStore::_convertToLocalizableError::error: ${error.message}`);
          localizableError = new UnexpectedError();
          break;
      }
    }

    if (!localizableError) {
      /** we are not able to figure out why Error is thrown
        * make it, Something unexpected happened */
      localizableError = new UnexpectedError();
    }

    return localizableError;
  }

  @action _goToConnectError = (): void => {
    this.progressInfo.currentStep = ProgressStep.CONNECT;
    this.progressInfo.stepState = StepState.ERROR;
  };
  // =================== CONNECT =================== //

  // =================== SAVE =================== //
  @action _goToSaveLoad = (): void => {
    this.error = null;
    this.progressInfo.currentStep = ProgressStep.SAVE;
    this.progressInfo.stepState = StepState.LOAD;
  };

  /** SAVE dialog submit (Save button) */
  @action _submitSave = (walletName: string): void => {
    this.error = null;
    this.progressInfo.currentStep = ProgressStep.SAVE;
    this.progressInfo.stepState = StepState.PROCESS;
    this._saveHW(walletName);
  };

  /** creates new wallet and loads it */
  _saveHW = async (walletName: string): Promise<void>  => {
    try {
      Logger.debug('LedgerConnectStore::_saveHW:: called');
      this._setIsCreateHWActive(true);
      this.createHWRequest.reset();

      const reqParams = this._prepareCreateHWReqParams(walletName);
      const ledgerWallet: CreateHardwareWalletResponse =
        await this.createHWRequest.execute(reqParams).promise;

      if (ledgerWallet) {
        await this._onSaveSucess(ledgerWallet);
      } else {
        // this Error will be converted to LocalizableError()
        throw new Error();
      }
    } catch (error) {
      Logger.error(`LedgerConnectStore::_saveHW::error ${stringifyError(error)}`);

      if (error instanceof CheckAdressesInUseApiError) {
        // redirecting CheckAdressesInUseApiError -> hwConnectDialogSaveError101
        // because for user hwConnectDialogSaveError101 is more meaningful in this context
        this.error = new LocalizableError(globalMessages.hwConnectDialogSaveError101);
      } else if (error instanceof LocalizableError) {
        this.error = error;
      } else {
        // some unknow error
        this.error = new UnexpectedError();
      }
      this._goToSaveError();
    } finally {
      this.createHWRequest.reset();
      this._setIsCreateHWActive(false);
    }
  };

  _prepareCreateHWReqParams = (walletName: string): CreateHardwareWalletRequest => {
    if (this.hwDeviceInfo == null
      || this.hwDeviceInfo.publicMasterKey == null
      || this.hwDeviceInfo.hwFeatures == null) {
      throw new UnexpectedError();
    }

    return {
      walletName,
      publicMasterKey: this.hwDeviceInfo.publicMasterKey,
      hwFeatures: this.hwDeviceInfo.hwFeatures
    };
  };

  async _onSaveSucess(ledgerWallet: Wallet): Promise<void> {
    // close the active dialog
    Logger.debug('LedgerConnectStore::_onSaveSucess success, closing dialog');
    this.actions.dialogs.closeActiveDialog.trigger();

    const { wallets } = this.stores.substores[environment.API];
    await wallets._patchWalletRequestWithNewWallet(ledgerWallet);

    // goto the wallet transactions page
    Logger.debug('LedgerConnectStore::_onSaveSucess setting new walles as active wallet');
    wallets.goToWalletRoute(ledgerWallet.id);

    // fetch its data
    Logger.debug('LedgerConnectStore::_onSaveSucess loading wallet data');
    wallets.refreshWalletsData();

    // Load the Yoroi with Trezor Icon
    this.stores.topbar.initCategories();

    // show success notification
    wallets.showLedgerNanoSWalletIntegratedNotification();

    // TODO: [LEDGER] not sure if it actully destroying this Store ??
    this.teardown();
    Logger.info('SUCCESS: Ledger Connected Wallet created and loaded');
  }

  @action _goToSaveError = (): void => {
    this.progressInfo.currentStep = ProgressStep.SAVE;
    this.progressInfo.stepState = StepState.ERROR;
  };
  // =================== SAVE =================== //

  // =================== API =================== //
  @action _setIsCreateHWActive = (active: boolean): void => {
    this.isCreateHWActive = active;
  };
  // =================== API =================== //
}
