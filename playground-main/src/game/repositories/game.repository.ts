type Game = {
  index: number;
  walletId: number | null;
  users: Map<number, number>;
  status: 'new' | 'ready' | 'closed' | 'terminated';
};

let _index = 0;
function getIndex() {
  return ++_index;
}

let game: Game | null = null;

export class GameRepository {
  public current() {
    return game;
  }

  public create() {
    game = {
      index: getIndex(),
      walletId: null,
      users: new Map(),
      status: 'new',
    };
  }

  public setWallet(walletId: number) {
    if (!game || game.walletId) {
      throw new Error('Incorrect game data');
    }
    game.walletId = walletId;
  }

  public addUser(userId: number, amount: number) {
    if (!game) {
      throw new Error('Incorrect game data');
    }
    const currentAmount = game.users.get(userId) ?? 0;
    const targetAmount = currentAmount + amount;

    game.users.set(userId, targetAmount);
  }

  public setStatus(status: Game['status']) {
    if (!game) {
      throw new Error('Incorrect game data');
    }

    game.status = status;
  }
}
