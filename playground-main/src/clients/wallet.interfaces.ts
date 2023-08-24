export type TBetResult = {
  transactionId: number;
  amount: number;
  userId: number;
  gameWalletId: number;
};

export type TBetPayload = {
  userId: number;
  gameWalletId: number;
  amount: number;
};

export type TCloseWalletPayload = {
  userId: number;
  gameWalletId: number;
};

export interface IWalletClient {
  createWallet(): Promise<number>;
  disableIncome(gameWalletId: number): Promise<void>;
  bet(payload: TBetPayload): Promise<TBetResult>;
  closeWallet(payload: TCloseWalletPayload): Promise<number>;
}
