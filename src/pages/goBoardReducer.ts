import GoBoard, { Sign } from "@sabaki/go-board";
import {
  createGoBoard,
  moveOptions,
  newGoGame,
  turnGoMoveToBoardMove,
} from "../helper";
import { goBoardState, GoGameInterface, GoMove } from "../main";

interface SetupBoardInterface {
  type: "SETUP_BOARD";
  payload: GoGameInterface;
}

interface AddGoMoveInterface {
  type: "ADD_GO_MOVE";
  payload: GoMove;
}

type Action = SetupBoardInterface | AddGoMoveInterface;

const FIRST_MOVE = 0;
const BLACK_STONE: Sign = 1;
const WHITE_STONE: Sign = -1;

const changePlayerStoneColor = (goMoves: GoMove[], nextMoveIndex: number) => {
  if (goMoves.length === FIRST_MOVE) {
    return WHITE_STONE;
  } else {
    const [currentColor] = goMoves[nextMoveIndex];
    const nextStoneColor = currentColor === "B" ? WHITE_STONE : BLACK_STONE;

    return nextStoneColor;
  }
};

const goBoardReducer = (state: goBoardState, action: Action): goBoardState => {
  switch (action.type) {
    case "SETUP_BOARD":
      return (() => {
        const goGameToSetup = action.payload;
        const newInitGoGame = createGoBoard(goGameToSetup.boardXSize);
        const initGoBoard = new GoBoard(newInitGoGame);

        const [moveColor, moveVertex] = turnGoMoveToBoardMove(
          goGameToSetup.moves[FIRST_MOVE],
          initGoBoard
        );

        const newGoBoard = initGoBoard.makeMove(
          moveColor,
          moveVertex,
          moveOptions
        );

        const nextGoHistory = [newGoBoard];
        const nextCurrentMove = FIRST_MOVE;

        return {
          goGame: goGameToSetup,
          currentMove: FIRST_MOVE,
          goHistory: nextGoHistory,
          goBoard: nextGoHistory[nextCurrentMove],
          userPlayer: changePlayerStoneColor(
            goGameToSetup.moves,
            nextCurrentMove
          ),
        };
      })();

    case "ADD_GO_MOVE":
      return (() => {
        const goMoveToAdd = action.payload;
        const filteredMoves = state.goGame.moves.filter(
          (move, index) => index <= state.currentMove
        );
        const nextMoves = [...filteredMoves, goMoveToAdd];
        const nextGoGame = {
          ...state.goGame,
          moves: nextMoves,
        };
        const nextCurrentMove = nextGoGame.moves.length - 1;
        const [moveColor, moveVertex] = turnGoMoveToBoardMove(
          nextGoGame.moves[nextCurrentMove],
          state.goBoard
        );

        const newGoBoard = state.goBoard.makeMove(
          moveColor,
          moveVertex,
          moveOptions
        );

        const nextGoHistory = [...state.goHistory, newGoBoard];

        return {
          goGame: nextGoGame,
          currentMove: nextCurrentMove,
          goHistory: nextGoHistory,
          goBoard: nextGoHistory[nextCurrentMove],
          userPlayer: changePlayerStoneColor(nextGoGame.moves, nextCurrentMove),
        };
      })();

    default:
      console.error(
        "Default has been triggered - no valid action type specificed"
      );
      throw Error("Issue handling Go Game");
  }
};

export default goBoardReducer;

/*
        Input:
        - takes in a GoMove e.g. ['B', 'A4'].

        Output:
        - GoGame - moves are all moves up to previous current move, then add paylod on that, no other moves. Rest stay the same.
        - goHistory: up tp current plus the history state of the added go move.
        - currentMove: past ucrrent mvoe + 1 (becuase of the added move).
        - userPlayer: from nextGoGame.moves & nextcurrentMove.
        - goBoard: nextGoHistory[nextCurrentMove]
      */
