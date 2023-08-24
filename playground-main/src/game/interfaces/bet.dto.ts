import { ApiProperty } from '@nestjs/swagger';

export class BetDto {
  @ApiProperty({
    type: 'integer',
  })
  userId: never;

  @ApiProperty({
    type: 'number',
  })
  amount: number;
}
