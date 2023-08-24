import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import {
  GameWallet,
  Transaction,
  UserWallet,
  WalletStatus,
} from 'entitites/userWallet';
import { DataSource, Repository } from 'typeorm';

@Injectable()
export class WalletService {
  readonly #logger = new Logger();
  readonly #gameWallets: Repository<GameWallet>;
  readonly #userWallets: Repository<UserWallet>;
  readonly #transactions: Repository<Transaction>;
  readonly #dataSource: DataSource;

  constructor(
    @InjectRepository(GameWallet)
    gameWallets: Repository<GameWallet>,
    @InjectRepository(UserWallet)
    userWallet: Repository<UserWallet>,
    @InjectRepository(GameWallet)
    transactions: Repository<Transaction>,
    @InjectDataSource()
    dataSource: DataSource,
  ) {
    this.#gameWallets = gameWallets;
    this.#userWallets = userWallet;
    this.#transactions = transactions;
    this.#dataSource = dataSource;
  }

  public async createGameWallet() {
    const wallet = new GameWallet();
    wallet.amount = 0;
    wallet.status = WalletStatus.Open;

    return await this.#gameWallets.save(wallet);
  }

  public async getGameWallet(gameId: number) {
    const wallet = await this.#gameWallets.findOneBy({ id: gameId });
    if (!wallet) {
      throw new NotFoundException();
    }
  }

  public async createUserWallet(amount: number) {
    const user = new UserWallet();
    user.amount = amount;

    return await this.#userWallets.save(user);
  }

  public async getUserWallet(id: number) {
    return await this.#userWallets.findOneBy({ id });
  }

  public async transfer({ userId, gameId, amount }: any) {
    const runner = this.#dataSource.createQueryRunner();

    await runner.startTransaction();

    try {
      const userResult = await runner.manager.decrement(
        UserWallet,
        { id: userId },
        'amount',
        amount,
      );

      if (!userResult.affected) {
        throw new Error('User wallet is not found');
      }

      const gameResult = await runner.manager.increment(
        GameWallet,
        { id: gameId, status: WalletStatus.Open },
        'amount',
        amount,
      );

      this.#logger.log('Game result', gameResult.raw);
      if (!gameResult.affected) {
        throw new Error('User wallet is not found');
      }

      const transactionResult = await runner.manager.query(
        `INSERT INTO public.transactions (type, amount, "userId", "gameId") VALUES ('to-game', ${amount}, ${userId}, ${gameId}) RETURNING id`,
      );

      await runner.commitTransaction();
      this.#logger.log('transaction commited', transactionResult);

      return {
        id: transactionResult[0].id,
        amount: amount,
        userId: userId,
        gameWalletId: gameId,
      };
    } catch (e) {
      this.#logger.error('cannot transfer money', JSON.stringify(e));
      await runner.rollbackTransaction();
      this.#logger.error('transaction rollbacked');
    } finally {
      await runner.release();
    }
  }

  public async pay({ userId, gameId }: any) {
    const runner = this.#dataSource.createQueryRunner();

    await runner.startTransaction();

    try {
      const wallet = await runner.manager.findOne(GameWallet, {
        where: { id: gameId },
      });

      if (!wallet) {
        throw new Error('Wallet is not found');
      }

      const amount = Number(wallet.amount);

      this.#logger.log(`transafer to user userId=${userId}, amount=${amount}`);

      const userResult = await runner.manager.increment(
        UserWallet,
        { id: userId },
        'amount',
        amount,
      );

      this.#logger.log(
        `transafer to user userId=${userId}, ${JSON.stringify(userResult)}`,
      );

      if (!userResult.affected) {
        throw new Error('User wallet is not found');
      }

      const gameResult = await runner.manager.update(
        GameWallet,
        { id: gameId },
        { amount: 0 },
      );
      if (!gameResult.affected) {
        throw new Error('User wallet is not found');
      }

      await runner.manager.query(
        `INSERT INTO public.transactions (type, amount, "userId", "gameId") VALUES ('to-user', ${amount}, ${userId}, ${gameId})`,
      );

      await runner.commitTransaction();
      this.#logger.log('transaction commited');
    } catch (e) {
      this.#logger.error('cannot transfer money', e);
      await runner.rollbackTransaction();
    } finally {
      await runner.release();
    }
  }

  public async closeWallet(gameId: number) {
    const result = await this.#gameWallets.update(
      {
        id: gameId,
        status: WalletStatus.Open,
      },
      {
        status: WalletStatus.Closed,
      },
    );

    if (!result.affected) {
      throw new Error('opened game is not found');
    }
  }
}
