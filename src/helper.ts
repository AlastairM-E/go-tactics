import GoBoard, { SignMap, Sign, Vertex } from "@sabaki/go-board";
import { openDB } from "idb";
import { GoGameInterface, GoMove, IndexedDBHelper } from "./main";

const BLACK_STONE: Sign = 1;
const WHITE_STONE: Sign = -1;

const createGoBoard = (boardSize: number): SignMap => {
  const emptyGoBoard = [];
  const BLANK_BOARD_POINT: Sign = 0;

  const createGoBoardRow = (rowLength: number) => {
    const emptyRow: Sign[] = [];
    for (let index = 0; index < rowLength; index += 1) {
      emptyRow.push(BLANK_BOARD_POINT);
    }
    return emptyRow;
  };

  for (let index = 0; index < boardSize; index += 1) {
    const goBoardRow = createGoBoardRow(boardSize);
    emptyGoBoard.push(goBoardRow);
  }

  return emptyGoBoard;
};

const createDb = async (
  dbName: string,
  storeName: string
): Promise<IndexedDBHelper> => {
  const dbPromise = await openDB(dbName, 1, {
    upgrade(db) {
      db.createObjectStore(storeName);
    },
  });

  async function get(key: IDBValidKey) {
    return (await dbPromise).get(storeName, key);
  }
  async function getAll() {
    return (await dbPromise).getAll(storeName);
  }
  async function set(key: IDBValidKey, val: GoGameInterface[]) {
    return (await dbPromise).put(storeName, val, key);
  }
  async function del(key: IDBValidKey) {
    return (await dbPromise).delete(storeName, key);
  }
  async function keys() {
    return (await dbPromise).getAllKeys(storeName);
  }

  return await {
    get,
    set,
    del,
    getAll,
    keys,
  };
};

const turnGoMoveToBoardMove = (
  [stoneColor, coordinates]: GoMove,
  currentGoBoard: GoBoard
): [Sign, Vertex] => {
  const moveColor = stoneColor === "B" ? BLACK_STONE : WHITE_STONE;
  const moveVertex = currentGoBoard.parseVertex(coordinates);

  return [moveColor, moveVertex];
};

const moveOptions = {
  preventSuicide: true,
  preventKo: true,
  preventOverwrite: true,
};

const newGoGame: GoGameInterface = {
  id: "randomGame",
  gameName: "[Default Game]",
  initialStones: [],
  moves: [],
  rules: "tromp-taylor",
  komi: 7.5,
  boardXSize: 9,
  boardYSize: 9,
};

export {
  createGoBoard,
  createDb,
  turnGoMoveToBoardMove,
  moveOptions,
  newGoGame,
};
