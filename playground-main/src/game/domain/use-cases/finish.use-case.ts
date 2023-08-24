import { Inject, Logger } from '@nestjs/common';
import { WalletClient } from 'clients/wallet.client';
import { GameRepository } from 'game/repositories/game.repository';
import { GAME_REPOSITORY } from 'game/repositories/repositories.di-constants';

export class FinishUseCase {
  readonly #logger = new Logger();

  constructor(
    @Inject(GAME_REPOSITORY)
    private readonly games: GameRepository,
    private readonly wallet: WalletClient,
  ) {}

  public async execute() {
    this.#logger.log('Finish game');

    const game = this.games.current();
    if (!game) {
      return;
    }

    this.games.setStatus('closed');

    await this.wallet.disableIncome(game.walletId);

    this.#logger.log(`Income disabled`, game);
    const winner = Array.from(game.users.keys())[0]; // some game winner logic

    this.#logger.log(`Winner is userId=${winner}`);
    if (!winner) {
      return;
    }

    this.#logger.log('Game winner', {
      userId: winner,
      index: game.index,
      walletId: game.walletId,
    });

    let amount;
    try {
      amount = await this.wallet.closeWallet({
        gameWalletId: game.walletId,
        userId: winner,
      });
    } catch (e) {
      this.#logger.warn(
        'Cannot transfer prize',
        {
          userId: winner,
          index: game.index,
          walletId: game.walletId,
        },
        e,
      );
      throw e;
    }

    this.games.setStatus('terminated');

    return {
      winner,
      amount,
    };
  }
}
