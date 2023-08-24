import { Module } from '@nestjs/common';
import { GameDomainModule } from './domain/game-domain.module';
import { RepositoriesModule } from './repositories/repositories.module';

@Module({
  imports: [RepositoriesModule, GameDomainModule],
})
export class GameModule {}
