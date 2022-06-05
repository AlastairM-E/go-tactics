import GoBoard, { Sign, Vertex } from "@sabaki/go-board";
import { createGoBoard, moveOptions, newGoGame } from "../helper";
import { goBoardState, GoGameInterface, GoMove } from "../main";
import goBoardReducer from "../pages/goBoardReducer";

/* Test Statergy - TDD a working reducer */
// - Why TDD, because this is pure logic and I really needs this reducer to work bug free.
// - This is because it manages the major of the game state, which most other functionality
// depends on being correct.

// In terms fo doing this refactor
// * Idea is that at first these will be helper functions, which once tested will be added into the actually app.
// * Then, once all instances of each state is replaced, useReducer will be the next step.

/* Find and list all the functionality needed */
// This is where:
// - setState on either goBoard, currentMove, goGame or goHistory has been called.
// - List out the names of those methods down below, then I will work through them in the future.
// - put a comment on the function as well.
// - not once a setState is cleared.

/*
  # Go Board Reducer- methods to implement.
  * setupGoBoard. v/^
  * addMoveToGoGame. v/^
      - playBoardPosition.
      - changePlayerStoneColor.
  * playUpTo.
    - playBoardPosition.
    - changePlayerStoneColor.
*/

const FIRST_MOVE = 0;
const BLACK_STONE: Sign = 1;
const WHITE_STONE: Sign = -1;
const NINE_X_NINE = 9;
const newGoBoard = new GoBoard(createGoBoard(NINE_X_NINE));

let initialState: goBoardState = {
  goBoard: newGoBoard,
  currentMove: FIRST_MOVE,
  goGame: newGoGame,
  goHistory: [],
  userPlayer: BLACK_STONE,
};

const turnGoMoveToBoardMove = (
  [stoneColor, coordinates]: GoMove,
  currentGoBoard: GoBoard
): [Sign, Vertex] => {
  const moveColor = stoneColor === "B" ? BLACK_STONE : WHITE_STONE;
  const moveVertex = currentGoBoard.parseVertex(coordinates);

  return [moveColor, moveVertex];
};

beforeEach(() => {
  initialState = {
    goBoard: newGoBoard,
    currentMove: FIRST_MOVE,
    goGame: newGoGame,
    goHistory: [],
    userPlayer: BLACK_STONE,
  };
});

test("goBoardReducer can setup a Go Board from a Go Game", () => {
  // ARRANGE
  const BOARD_SIZE = 13;
  const nextGoGame: GoGameInterface = {
    id: "randomGame",
    gameName: "[Default Game]",
    initialStones: [],
    moves: [
      ["B", "E4"],
      ["W", "A2"],
      ["B", "F5"],
    ],
    rules: "tromp-taylor",
    komi: 7.5,
    boardXSize: BOARD_SIZE,
    boardYSize: BOARD_SIZE,
  };
  const initGoBoard = new GoBoard(createGoBoard(BOARD_SIZE));
  const [nextPlayer, nextGoMove] = turnGoMoveToBoardMove(
    nextGoGame.moves[FIRST_MOVE],
    initGoBoard
  );
  const nextBoardPosition = initGoBoard.makeMove(
    nextPlayer,
    nextGoMove,
    moveOptions
  );

  // ACT
  const { goGame, goBoard, currentMove, goHistory, userPlayer } =
    goBoardReducer(initialState, {
      type: "SETUP_BOARD",
      payload: nextGoGame,
    });

  // ASSERT
  expect(goGame).toStrictEqual(nextGoGame);
  expect(goBoard).toStrictEqual(nextBoardPosition);
  expect(currentMove).toStrictEqual(FIRST_MOVE);
  expect(goHistory).toStrictEqual([nextBoardPosition]);
  expect(userPlayer).toStrictEqual(WHITE_STONE);
});

test("goBoardReducer can add a GoMove to the goBoard & co from a GoMove given", () => {
  // ARRANGE
  const addedMove: GoMove = ["W", "A4"];
  const nextGoGame: GoGameInterface = {
    ...newGoGame,
    moves: [addedMove],
  };
  const LATEST_MOVE = nextGoGame.moves.length - 1;
  const initGoBoard = new GoBoard(createGoBoard(newGoGame.boardXSize));

  const nextGoHistory = nextGoGame.moves.map((move) => {
    const [currentPlayer, currentMove] = turnGoMoveToBoardMove(
      move,
      initGoBoard
    );
    return initGoBoard.makeMove(currentPlayer, currentMove, moveOptions);
  });

  // ACT
  const { goGame, goBoard, currentMove, goHistory, userPlayer } =
    goBoardReducer(initialState, {
      type: "ADD_GO_MOVE",
      payload: addedMove,
    });

  // ASSERT
  expect(goGame).toStrictEqual(nextGoGame);
  expect(goBoard).toStrictEqual(nextGoHistory[LATEST_MOVE]);
  expect(currentMove).toStrictEqual(LATEST_MOVE);
  expect(goHistory).toStrictEqual(nextGoHistory);
  expect(userPlayer).toStrictEqual(BLACK_STONE);
});

test("goReducer and play a move from the goGame based on moveNumber", () => {
  // ARRANGE
  const MOVE_WANTED = 2;
  const BOARD_SIZE = 13;
  const currentGoGame: GoGameInterface = {
    id: "randomGame",
    gameName: "[Default Game]",
    initialStones: [],
    moves: [
      ["B", "E4"],
      ["W", "A2"],
      ["B", "F5"],
      ["W", "D4"],
      ["B", "B2"],
      ["W", "E5"],
    ],
    rules: "tromp-taylor",
    komi: 7.5,
    boardXSize: BOARD_SIZE,
    boardYSize: BOARD_SIZE,
  };

  initialState = {
    ...initialState,
    goGame: currentGoGame,
  };
  const nextGoGame = currentGoGame;
  const initGoBoard = new GoBoard(createGoBoard(currentGoGame.boardXSize));

  const nextGoHistory = nextGoGame.moves.map((move) => {
    const [currentPlayer, currentMove] = turnGoMoveToBoardMove(
      move,
      initGoBoard
    );
    return initGoBoard.makeMove(currentPlayer, currentMove, moveOptions);
  });

  // ACT
  const { goGame, goBoard, currentMove, goHistory, userPlayer } =
    goBoardReducer(initialState, {
      type: "PLAY_MOVE_FROM_GAME",
      payload: MOVE_WANTED,
    });
  // ASSERT
  expect(goGame).toStrictEqual(nextGoGame);
  expect(goBoard).toStrictEqual(nextGoHistory[MOVE_WANTED]);
  expect(currentMove).toStrictEqual(MOVE_WANTED);
  expect(goHistory).toStrictEqual(nextGoHistory);
  expect(userPlayer).toStrictEqual(WHITE_STONE);
  // expect(userPlayer).toStrictEqual(theNextColorForTheOpponent);
  // expect(goGame).toStrictEqual(goGame);
  // expect(goHistory).toStrictEqual(goHistoryUpToThatPoint || goHistory);
  // expect(currentMove).toStrictEqual(moveAskedFor);
  // expect(goBoard).toStrictEqual(boardPositionFromMoveAsked)
});

export {};
