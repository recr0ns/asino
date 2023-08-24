import {
  BadRequestException,
  Body,
  ClassSerializerInterceptor,
  Controller,
  Get,
  Inject,
  Logger,
  Post,
  Query,
  UseInterceptors,
} from '@nestjs/common';
import { ApiOperation, ApiProperty, ApiTags } from '@nestjs/swagger';
import { WalletClient } from 'clients/wallet.client';
import { BET_USE_CASE } from 'game/domain/game-domain.di-constants';
import { BetUseCase } from 'game/domain/use-cases/bet.use-case';
import { BetDto } from 'game/interfaces/bet.dto';
import { GameRepository } from 'game/repositories/game.repository';
import { GAME_REPOSITORY } from 'game/repositories/repositories.di-constants';

class EchoDto {
  @ApiProperty({
    description: 'Echo text',
    type: 'string',
  })
  text: string;
}

class CreateUserDto {
  @ApiProperty({
    description: 'Amount',
    type: 'number',
  })
  amount: number;
}

@Controller('/game')
@ApiTags('game')
@UseInterceptors(ClassSerializerInterceptor)
export class GameController {
  readonly #logger = new Logger();
  readonly #betUseCase: BetUseCase;
  readonly #games: GameRepository;

  constructor(
    @Inject(BET_USE_CASE) betUseCase: BetUseCase,
    @Inject(GAME_REPOSITORY) games: GameRepository,
    private readonly wallets: WalletClient,
  ) {
    this.#betUseCase = betUseCase;
    this.#games = games;
  }

  @Post('/echo')
  @ApiOperation({
    summary: 'Echo',
  })
  public async echo(@Query() payload: EchoDto) {
    this.#logger.log(payload);
    return this.wallets.echo(payload.text);
  }

  @Post()
  @ApiOperation({
    description: 'Create bet',
  })
  public async bet(@Body() payload: BetDto) {
    if (payload.amount <= 0) {
      throw new BadRequestException();
    }

    return this.#betUseCase.execute(payload.userId, payload.amount);
  }

  @Post('/user')
  @ApiOperation({
    description: 'create user',
  })
  public async createUser(@Body() payload: CreateUserDto) {
    return this.wallets.createUser(payload.amount);
  }

  @Get()
  @ApiOperation({
    summary: 'get current game',
  })
  public async getCurrentGame() {
    // для быстроты разработки
    const current = this.#games.current();
    if (!current) {
      return null;
    }

    return current;
  }

  @Get('/user/:id')
  @ApiOperation({
    summary: 'get user wallet',
  })
  public async getUserWallet(@Query('id') id: number) {
    return this.wallets.getUser(id);
  }
}
