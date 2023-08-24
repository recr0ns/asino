import { Module } from '@nestjs/common';
import { GameRepository } from './game.repository';
import { GAME_REPOSITORY } from './repositories.di-constants';

@Module({
  providers: [{ provide: GAME_REPOSITORY, useClass: GameRepository }],
  exports: [GAME_REPOSITORY],
})
export class RepositoriesModule {}
