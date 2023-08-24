import { Module } from '@nestjs/common';
import {
  BET_USE_CASE,
  CREATE_USE_CASE,
  FINISH_USE_CASE,
} from './game-domain.di-constants';
import { RepositoriesModule } from 'game/repositories/repositories.module';
import { GameController } from 'game/controllers/game.controller';
import { BetUseCase } from './use-cases/bet.use-case';
import { WalletClient } from 'clients/wallet.client';
import { GameRepository } from 'game/repositories/game.repository';
import { WALLET_SERVICE_CLIENT } from 'di-constants';
import { ClientProxyFactory, Transport } from '@nestjs/microservices';
import { CreateUseCase } from './use-cases/create.use-case';
import { FinishUseCase } from './use-cases/finish.use-case';
import { GameManagerService } from './services/game-manager.service';

@Module({
  imports: [RepositoriesModule],
  controllers: [GameController],
  providers: [
    {
      provide: WALLET_SERVICE_CLIENT,
      useFactory: () => {
        return ClientProxyFactory.create({
          transport: Transport.TCP,
          options: {
            port: 12003,
            host: 'localhost',
          },
        });
      },
    },
    WalletClient,
    GameRepository,
    GameManagerService,
    {
      provide: BET_USE_CASE,
      useClass: BetUseCase,
    },
    {
      provide: CREATE_USE_CASE,
      useClass: CreateUseCase,
    },
    {
      provide: FINISH_USE_CASE,
      useClass: FinishUseCase,
    },
  ],
})
export class GameDomainModule {}
