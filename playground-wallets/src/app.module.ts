import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { GameWallet, Transaction, UserWallet } from 'entitites/userWallet';
import { WalletService } from 'wallet.service';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'postgres',
      database: 'casino_wallets',
      autoLoadEntities: true,
      synchronize: true,
      entities: [UserWallet, Transaction, GameWallet],
    }),
    TypeOrmModule.forFeature([UserWallet, GameWallet, Transaction]),
  ],
  controllers: [AppController],
  providers: [AppService, WalletService],
})
export class AppModule {}
