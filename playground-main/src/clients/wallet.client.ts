import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { WALLET_SERVICE_CLIENT } from 'di-constants';
import {
  IWalletClient,
  TBetPayload,
  TBetResult,
  TCloseWalletPayload,
} from './wallet.interfaces';

@Injectable()
export class WalletClient implements IWalletClient {
  readonly #client: ClientProxy;

  constructor(@Inject(WALLET_SERVICE_CLIENT) client: ClientProxy) {
    this.#client = client;
  }

  async echo(text: string): Promise<string> {
    return await this.#client.send('echo', text).toPromise();
  }

  async createWallet(): Promise<number> {
    return await this.#client.send('createWallet', {}).toPromise();
  }

  async disableIncome(gameWalletId: number): Promise<void> {
    return await this.#client.send('disableIncome', gameWalletId).toPromise();
  }

  async bet(payload: TBetPayload): Promise<TBetResult> {
    return await this.#client.send('bet', payload).toPromise();
  }

  async closeWallet(payload: TCloseWalletPayload): Promise<number> {
    return await this.#client.send('closeWallet', payload).toPromise();
  }

  async createUser(amount: number): Promise<any> {
    return await this.#client.send('createUser', { amount }).toPromise();
  }

  async getUser(id: number): Promise<any> {
    return await this.#client.send('getUser', { id }).toPromise();
  }
}
