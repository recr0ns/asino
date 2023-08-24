import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { UserWallet } from 'entitites/userWallet';
import { WalletService } from 'wallet.service';

@Controller()
export class AppController {
  constructor(private readonly wallets: WalletService) {}

  @MessagePattern('echo')
  async echo(text: string): Promise<string> {
    return Promise.resolve('MS:' + text);
  }

  @MessagePattern('createWallet')
  async createWallet(): Promise<number> {
    const wallet = await this.wallets.createGameWallet();
    return wallet.id;
  }

  @MessagePattern('createUser')
  async createUserWallet({ amount }: any): Promise<UserWallet> {
    const wallet = await this.wallets.createUserWallet(amount);
    return wallet;
  }

  @MessagePattern('getUser')
  async getUserWallet({ id }: any): Promise<UserWallet> {
    const wallet = await this.wallets.getUserWallet(id);
    return wallet;
  }

  @MessagePattern('disableIncome')
  async disableIncome(walletId: number): Promise<void> {
    await this.wallets.closeWallet(walletId);
  }

  @MessagePattern('bet')
  async bet({ userId, gameWalletId, amount }: any): Promise<any> {
    const tx = await this.wallets.transfer({
      userId,
      gameId: gameWalletId,
      amount,
    });

    return tx;
  }

  @MessagePattern('closeWallet')
  async closeWallet({ userId, gameWalletId }: any): Promise<void> {
    await this.wallets.pay({ userId, gameId: gameWalletId });
  }
}
