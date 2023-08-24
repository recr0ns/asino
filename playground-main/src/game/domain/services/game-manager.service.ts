import { Inject, Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import {
  CREATE_USE_CASE,
  FINISH_USE_CASE,
} from 'game/domain/game-domain.di-constants';
import { CreateUseCase } from 'game/domain/use-cases/create.use-case';
import { FinishUseCase } from 'game/domain/use-cases/finish.use-case';

@Injectable()
export class GameManagerService {
  constructor(
    @Inject(CREATE_USE_CASE) private readonly createUseCase: CreateUseCase,
    @Inject(FINISH_USE_CASE) private readonly finishUseCase: FinishUseCase,
  ) {}

  @Cron('0 * * * * *')
  createGameJob() {
    this.createUseCase.execute();
  }

  @Cron('30 * * * * *')
  terminateGameJob() {
    this.finishUseCase.execute();
  }
}
