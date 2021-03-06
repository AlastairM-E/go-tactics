import { Sign } from "@sabaki/go-board";
import GoBoard from "@sabaki/go-board";

export type GoMove = ["B" | "W", string];

export interface GoGameInterface {
  id: string;
  gameName: string;
  initialStones: string[][];
  moves: GoMove[];
  rules: string;
  komi: number;
  boardXSize: number;
  boardYSize: number;
  nextPlayer?: "B" | "W";
  setup?: boolean;
}

export type IndexedDBHelper = {
  get: (key: IDBValidKey) => Promise<GoGameInterface[]>;
  set: (key: IDBValidKey, val: GoGameInterface[]) => Promise<IDBValidKey>;
  del: (key: IDBValidKey) => Promise<void>;
  getAll: () => Promise<GoGameInterface[][]>;
  keys: () => Promise<IDBValidKey[]>;
};

export type goBoardState = {
  goGame: GoGameInterface;
  goBoard: GoBoard;
  goHistory: GoBoard[];
  currentMove: number;
  userPlayer: Sign;
};
