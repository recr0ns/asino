import {
  Check,
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('user_wallets')
@Check('"amount" >= 0')
export class UserWallet {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  amount: number;

  @OneToMany(() => UserWallet, (u) => u.transactions)
  transactions: Transaction[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

@Entity('game_wallets')
@Check('"amount" >= 0')
export class GameWallet {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  amount: number;

  @Column('varchar', { length: 255, nullable: false })
  status: WalletStatus;

  @OneToMany(() => GameWallet, (u) => u.transactions)
  transactions: Transaction[];

  @CreateDateColumn()
  createdAt: Date;
}

@Entity('transactions')
@Check('"amount" >= 0')
export class Transaction {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column('varchar', { length: 10, nullable: false })
  type: string;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  amount: number;

  @ManyToOne(() => UserWallet, (user) => user.transactions)
  user: UserWallet;

  @ManyToOne(() => GameWallet, (game) => game.transactions, {})
  game: GameWallet;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

export enum WalletStatus {
  Open = 'open',
  Closed = 'closed',
}
