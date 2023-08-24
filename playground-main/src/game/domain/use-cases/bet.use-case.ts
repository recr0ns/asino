import {
  BadRequestException,
  ForbiddenException,
  Inject,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { WalletClient } from 'clients/wallet.client';
import { GameRepository } from 'game/repositories/game.repository';
import { GAME_REPOSITORY } from 'game/repositories/repositories.di-constants';

export class BetUseCase {
  readonly #logger = new Logger();

  constructor(
    @Inject(GAME_REPOSITORY)
    private readonly games: GameRepository,
    private readonly wallet: WalletClient,
  ) {}

  public async execute(userId: number, amount: number) {
    const currentGame = this.games.current();

    if (currentGame?.status !== 'ready') {
      throw new ForbiddenException('cannot bet, game status is incorrect');
    }

    let transaction;
    try {
      transaction = await this.wallet.bet({
        userId,
        gameWalletId: currentGame.walletId,
        amount,
      });
      if (!transaction) {
        throw new BadRequestException('transaction was not created');
      }
    } catch (e) {
      // TODO: смотреть на тип ошибки и возвращать соотвествующий статус код
      this.#logger.warn(
        'Cannot bet',
        {
          userId,
          index: currentGame.index,
          walletId: currentGame.walletId,
          amount,
        },
        e,
      );
      throw new InternalServerErrorException('transaction was not created');
    }

    this.#logger.log(
      `User bet userId=${userId}, gameId=${currentGame.index}, walletId=${
        currentGame.walletId
      }, transaction=${JSON.stringify(transaction)}`,
    );

    this.games.addUser(userId, amount);
    return {
      game: this.games.current(),
      transaction,
    };
  }
}
