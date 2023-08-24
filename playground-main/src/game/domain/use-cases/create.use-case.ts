import { Inject, Logger } from '@nestjs/common';
import { WalletClient } from 'clients/wallet.client';
import { GameRepository } from 'game/repositories/game.repository';
import { GAME_REPOSITORY } from 'game/repositories/repositories.di-constants';

export class CreateUseCase {
  readonly #logger = new Logger();

  constructor(
    @Inject(GAME_REPOSITORY)
    private readonly games: GameRepository,
    private readonly wallets: WalletClient,
  ) {}

  public async execute() {
    this.#logger.log('Create game');

    const walletId = await this.wallets.createWallet();

    this.games.create();
    this.games.setWallet(walletId);
    this.games.setStatus('ready');

    const current = this.games.current();

    this.#logger.log(current);
    return current;
  }
}
