// @flow

import type {
  AddressUtxoRequest, AddressUtxoResponse,
  TxBodiesRequest, TxBodiesResponse,
  UtxoSumRequest, UtxoSumResponse,
  HistoryRequest, HistoryResponse,
  BestBlockRequest, BestBlockResponse,
  SignedRequest, SignedResponse,
  FilterUsedRequest, FilterUsedResponse,
  ServerStatusRequest, ServerStatusResponse
} from './types';

import type { IFetcher } from './IFetcher';

import axios from 'axios';
import {
  Logger,
  stringifyError
} from '../../../../utils/logging';
import {
  GetTxsBodiesForUTXOsApiError,
  GetUtxosForAddressesApiError,
  GetUtxosSumsForAddressesApiError,
  GetTxHistoryForAddressesApiError,
  GetBestBlockError,
  SendTransactionApiError,
  CheckAdressesInUseApiError,
  InvalidWitnessError,
  ServerStatusError,
} from '../../errors';

import type { ConfigType } from '../../../../../config/config-types';

declare var CONFIG: ConfigType;
const backendUrl = CONFIG.network.backendUrl;

/**
 * Makes calls to Yoroi backend service
 * https://github.com/Emurgo/yoroi-backend-service/
 */
export class RemoteFetcher implements IFetcher {

  lastLaunchVersion: () => string;
  currentLocale: () => string;

  constructor(lastLaunchVersion: () => string, currentLocale: () => string) {
    this.lastLaunchVersion = lastLaunchVersion;
    this.currentLocale = currentLocale;
  }

  getUTXOsForAddresses: AddressUtxoRequest => Promise<AddressUtxoResponse> = (body) => (
    axios(
      `${backendUrl}/api/txs/utxoForAddresses`,
      {
        method: 'post',
        data: {
          addresses: body.addresses
        },
        headers: {
          'yoroi-version': this.lastLaunchVersion(),
          'yoroi-locale': this.currentLocale()
        }
      }
    ).then(response => response.data)
      .catch((error) => {
        Logger.error('RemoteFetcher::getUTXOsForAddresses error: ' + stringifyError(error));
        throw new GetUtxosForAddressesApiError();
      })
  )

  getTxsBodiesForUTXOs: TxBodiesRequest => Promise<TxBodiesResponse> = (body) => (
    axios(
      `${backendUrl}/api/txs/txBodies`,
      {
        method: 'post',
        data: {
          txsHashes: body.txsHashes
        },
        headers: {
          'yoroi-version': this.lastLaunchVersion(),
          'yoroi-locale': this.currentLocale()
        }
      }
    ).then(response => response.data)
      .catch((error) => {
        Logger.error('RemoteFetcher::getTxsBodiesForUTXOs error: ' + stringifyError(error));
        throw new GetTxsBodiesForUTXOsApiError();
      })
  )

  getUTXOsSumsForAddresses: UtxoSumRequest => Promise<UtxoSumResponse> = (body) => (
    axios(
      `${backendUrl}/api/txs/utxoSumForAddresses`,
      {
        method: 'post',
        data: {
          addresses: body.addresses
        },
        headers: {
          'yoroi-version': this.lastLaunchVersion(),
          'yoroi-locale': this.currentLocale()
        }
      }
    ).then(response => response.data)
      .catch((error) => {
        Logger.error('RemoteFetcher::getUTXOsSumsForAddresses error: ' + stringifyError(error));
        throw new GetUtxosSumsForAddressesApiError();
      })
  )

  getTransactionsHistoryForAddresses: HistoryRequest => Promise<HistoryResponse> = (body) => (
    axios(
      `${backendUrl}/api/v2/txs/history`,
      {
        method: 'post',
        data: body,
        headers: {
          'yoroi-version': this.lastLaunchVersion(),
          'yoroi-locale': this.currentLocale()
        }
      }
    ).then(response => {
      // TODO: remove this once we rename the field in the backend-service
      return response.data.map(resp => {
        if (resp.height != null) {
          return resp;
        }
        const height = resp.block_num;
        delete resp.block_num;
        return {
          ...resp,
          height,
        };
      });
    })
      .catch((error) => {
        Logger.error('RemoteFetcher::getTransactionsHistoryForAddresses error: ' + stringifyError(error));
        throw new GetTxHistoryForAddressesApiError();
      })
  )

  getBestBlock: BestBlockRequest => Promise<BestBlockResponse> = (_body) => (
    axios(
      `${backendUrl}/api/v2/bestblock`,
      {
        method: 'get'
      }
    ).then(response => response.data)
      .catch((error) => {
        Logger.error('RemoteFetcher::getBestBlock error: ' + stringifyError(error));
        throw new GetBestBlockError();
      })
  )

  sendTx: SignedRequest => Promise<SignedResponse> = (body) => {
    const signedTxHex = Buffer.from(
      body.signedTx.to_hex(),
      'hex'
    );
    const signedTx64 = Buffer.from(signedTxHex).toString('base64');
    return axios(
      `${backendUrl}/api/txs/signed`,
      {
        method: 'post',
        data: {
          signedTx: signedTx64
        },
        headers: {
          'yoroi-version': this.lastLaunchVersion(),
          'yoroi-locale': this.currentLocale()
        }
      }
    ).then(() => ({
      txId: body.signedTx.id()
    }))
      .catch((error) => {
        Logger.error('RemoteFetcher::sendTx error: ' + stringifyError(error));
        if (error.request.response.includes('Invalid witness')) {
          throw new InvalidWitnessError();
        }
        throw new SendTransactionApiError();
      });
  }

  checkAddressesInUse: FilterUsedRequest => Promise<FilterUsedResponse> = (body) => (
    axios(
      `${backendUrl}/api/addresses/filterUsed`,
      {
        method: 'post',
        data: {
          addresses: body.addresses
        },
        headers: {
          'yoroi-version': this.lastLaunchVersion(),
          'yoroi-locale': this.currentLocale()
        }
      }
    ).then(response => response.data)
      .catch((error) => {
        Logger.error('RemoteFetcher::checkAddressesInUse error: ' + stringifyError(error));
        throw new CheckAdressesInUseApiError();
      })
  )

  checkServerStatus: ServerStatusRequest => Promise<ServerStatusResponse> = (_body) => (
    axios(
      `${backendUrl}/api/status`,
      {
        method: 'get'
      }
    ).then(response => response.data)
      .catch((error) => {
        Logger.error('RemoteFetcher::checkServerStatus error: ' + stringifyError(error));
        throw new ServerStatusError();
      })
  )
}
