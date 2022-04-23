import GoBoard, { Sign } from "@sabaki/go-board";
import { createGoBoard, moveOptions, turnGoMoveToBoardMove } from "../helper";
import { goBoardState, GoGameInterface, GoMove } from "../main";

interface SetupBoardInterface {
  type: "SETUP_BOARD";
  payload: GoGameInterface;
}

type Action = SetupBoardInterface;

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

    default:
      console.error(
        "Default has been triggered - no valid action type specificed"
      );
      return state;
  }
};

export default goBoardReducer;
