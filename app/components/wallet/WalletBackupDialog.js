// @flow
import React, { Component } from 'react';
import { observer } from 'mobx-react';
import WalletBackupPrivacyWarningDialog from './backup-recovery/WalletBackupPrivacyWarningDialog';
import WalletRecoveryPhraseDisplayDialog from './backup-recovery/WalletRecoveryPhraseDisplayDialog';
import WalletRecoveryPhraseEntryDialog from './backup-recovery/WalletRecoveryPhraseEntryDialog';

type Props = {
  currentStep: ?string,
  canPhraseBeShown: boolean,
  isPrivacyNoticeAccepted: boolean,
  countdownRemaining: number,
  isTermDeviceAccepted: boolean,
  canFinishBackup: boolean,
  isTermRecoveryAccepted: boolean,
  isValid: boolean,
  isSubmitting: boolean,
  recoveryPhrase: string,
  recoveryPhraseSorted: Array<{ word: string, isActive: boolean }>,
  enteredPhrase: Array<{ word: string }>,
  onCancelBackup: Function,
  onAcceptPrivacyNotice: Function,
  onContinue: Function,
  onStartWalletBackup: Function,
  onAcceptTermDevice: Function,
  onAcceptTermRecovery: Function,
  onAddWord: Function,
  onClear: Function,
  onFinishBackup: Function,
  onRestartBackup: Function,
};

@observer
export default class WalletBackupDialog extends Component<Props> {

  render() {
    const {
      currentStep, onCancelBackup,
      canPhraseBeShown, isPrivacyNoticeAccepted,
      countdownRemaining, onAcceptPrivacyNotice,
      onContinue, recoveryPhrase,
      onStartWalletBackup, isTermDeviceAccepted,
      enteredPhrase, canFinishBackup,
      isTermRecoveryAccepted, isValid, isSubmitting,
      onAcceptTermDevice, onAcceptTermRecovery,
      onAddWord, onClear, onFinishBackup,
      onRestartBackup, recoveryPhraseSorted,
    } = this.props;

    if (currentStep === 'privacyWarning') {
      return (
        <WalletBackupPrivacyWarningDialog
          canPhraseBeShown={canPhraseBeShown}
          isPrivacyNoticeAccepted={isPrivacyNoticeAccepted}
          countdownRemaining={countdownRemaining}
          onAcceptPrivacyNotice={onAcceptPrivacyNotice}
          onCancelBackup={onCancelBackup}
          onContinue={onContinue}
        />
      );
    }

    if (currentStep === 'recoveryPhraseDisplay') {
      return (
        <WalletRecoveryPhraseDisplayDialog
          recoveryPhrase={recoveryPhrase}
          onStartWalletBackup={onStartWalletBackup}
          onCancelBackup={onCancelBackup}
        />
      );
    }

    if (currentStep === 'recoveryPhraseEntry') {
      return (
        <WalletRecoveryPhraseEntryDialog
          isTermDeviceAccepted={isTermDeviceAccepted}
          enteredPhrase={enteredPhrase}
          canFinishBackup={canFinishBackup}
          isTermRecoveryAccepted={isTermRecoveryAccepted}
          isValid={isValid}
          isSubmitting={isSubmitting}
          onAcceptTermDevice={onAcceptTermDevice}
          onAcceptTermRecovery={onAcceptTermRecovery}
          onAddWord={onAddWord}
          onCancelBackup={onCancelBackup}
          onClear={onClear}
          onFinishBackup={onFinishBackup}
          onRestartBackup={onRestartBackup}
          recoveryPhraseSorted={recoveryPhraseSorted}
        />
      );
    }

    // We should never get to this point
    // TODO: use proper types to make sure this is not possible
    return <br />;
  }
}
