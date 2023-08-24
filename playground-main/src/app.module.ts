import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { GameModule } from 'game/game.module';

@Module({
  imports: [ScheduleModule.forRoot(), GameModule],
  exports: [],
})
export class AppModule {}
