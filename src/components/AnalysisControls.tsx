import React from "react";
import { Button, Text, Center, Divider, Container } from "@chakra-ui/react";
import { GoMove } from "../main";
import GoBoard, { Sign, Vertex } from "@sabaki/go-board";
import { moveOptions } from "../helper";
import MoveTable from "./MoveTable";

type AnalysisControlsProps = {
  goMoves: GoMove[];
  playBoardPosition: any;
  currentMoveState: [number, any];
  goHistoryState: [GoBoard[], any];
  turnGoMoveToBoardMove: ([stoneColor, coordinates]: GoMove) => [Sign, Vertex];
};

const FIRST_MOVE = 0;
const VISIBLE = 1;
const NOT_VISIBLE = 0;
const BLACK_STONE: Sign = 1;
const WHITE_STONE: Sign = -1;

function AnalysisControls({
  goMoves,
  playBoardPosition,
  currentMoveState,
  goHistoryState,
  turnGoMoveToBoardMove,
}: AnalysisControlsProps) {
  const [currentMove, setCurrentMove] = currentMoveState;
  const [goHistory, setGoHistory] = goHistoryState;
  const captures = {
    blackStones: goHistory[currentMove].getCaptures(BLACK_STONE),
    whiteStones: goHistory[currentMove].getCaptures(WHITE_STONE),
  };

  const playUpTo = (moveNumber: number) => {
    if (moveNumber > goMoves.length) return undefined;
    if (goHistory[moveNumber]) {
      playBoardPosition(goHistory[moveNumber]);
    } else {
      const currentGoHistory = goHistory;
      let nextBoardPosition: GoBoard | void = undefined;

      for (let index = currentMove; moveNumber > index; index += 1) {
        const NEXT_INDEX = index + 1;

        if (currentGoHistory[NEXT_INDEX]) continue;

        const [moveColor, moveVertex] = turnGoMoveToBoardMove(goMoves[index]);
        nextBoardPosition = currentGoHistory[index].makeMove(
          moveColor,
          moveVertex,
          moveOptions
        );
        currentGoHistory[NEXT_INDEX] = nextBoardPosition;
      }

      setGoHistory(currentGoHistory);
      playBoardPosition(nextBoardPosition);
    }

    setCurrentMove(moveNumber);
  };

  return {
    MoveBar: function () {
      return (
        <Container>
          <Center>
            <Button
              data-testid="backButton"
              onClick={() => playUpTo(currentMove - 1)}
              disabled={currentMove === FIRST_MOVE}
            >
              {"<"}
            </Button>
            <Text
              opacity={currentMove > FIRST_MOVE ? VISIBLE : NOT_VISIBLE}
              margin={1}
            >
              {currentMove}/{goMoves.length}
            </Text>
            <Button
              data-testid="forwardButton"
              onClick={() => playUpTo(currentMove + 1)}
              disabled={currentMove === goMoves.length}
            >
              {">"}
            </Button>
          </Center>
        </Container>
      );
    },
    MoveTable: function () {
      return (
        <MoveTable
          currentMove={currentMove}
          goMoves={goMoves}
          playUpTo={playUpTo}
          captures={captures}
        />
      );
    },
  };
}
export default AnalysisControls;
