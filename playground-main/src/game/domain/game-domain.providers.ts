import { Provider } from '@nestjs/common';
import {
  BET_USE_CASE,
  CREATE_USE_CASE,
  FINISH_USE_CASE,
  GAME_MANAGER,
} from './game-domain.di-constants';
import { BetUseCase } from './use-cases/bet.use-case';
import { CreateUseCase } from './use-cases/create.use-case';
import { FinishUseCase } from './use-cases/finish.use-case';
import { GameManagerService } from './services/game-manager.service';

export const providers: Provider[] = [
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
  { provide: GAME_MANAGER, useClass: GameManagerService },
];
