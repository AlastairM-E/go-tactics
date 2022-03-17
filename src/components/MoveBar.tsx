import React from "react";
import {
  Button,
  Text,
  HStack,
  Table,
  Thead,
  Tr,
  Td,
  Th,
  Tbody,
  VStack,
  Container,
  Flex,
  Tfoot,
} from "@chakra-ui/react";
import { GoMove } from "../main";
import GoBoard, { Sign, Vertex } from "@sabaki/go-board";
import { moveOptions } from "../helper";

type MoveBarProps = {
  goMoves: GoMove[];
  playBoardPosition: any;
  currentMoveState: [number, any];
  goHistoryState: [GoBoard[], any];
  children: any;
  turnGoMoveToBoardMove: ([stoneColor, coordinates]: GoMove) => [Sign, Vertex];
};

type MoveTableProps = {
  goMoves: GoMove[];
  currentMove: number;
  children: any;
  playUpTo: (moveNumber: number) => void;
};

type TableMove = { number: number | void; coordinates: string };

const FIRST_MOVE = 0;
const PASS = "";
const tableBorderStyle = "2px solid black !important";

function MoveTable({
  goMoves,
  currentMove,
  children,
  playUpTo,
}: MoveTableProps) {
  const createMovePairs = () => {
    const separatedGoMoves: TableMove[][] = [];

    goMoves.forEach(([stoneColor, coordinates], index) => {
      const DECREMENT_TO_GET_MOVE_INTO_PAIR = 1;
      const MOVE_NUMBER_ADJUSTMENT = 1;
      const LATEST_MOVE_PAIR =
        separatedGoMoves.length - DECREMENT_TO_GET_MOVE_INTO_PAIR;

      const tableCoordinates: TableMove = {
        number: index + MOVE_NUMBER_ADJUSTMENT,
        coordinates: coordinates !== PASS ? coordinates : "Pass",
      };

      if (stoneColor === "B") {
        separatedGoMoves.push([tableCoordinates]);
      }

      if (stoneColor === "W") {
        separatedGoMoves[LATEST_MOVE_PAIR].push(tableCoordinates);
      }
    });

    const movePairs = separatedGoMoves.map(([blackMove, whiteMove]) => {
      const blankMove = { number: undefined, coordinates: "---" };
      if (blackMove === undefined) {
        return [blankMove, whiteMove];
      }

      if (whiteMove === undefined) {
        return [blackMove, blankMove];
      }

      return [blackMove, whiteMove];
    });

    return movePairs;
  };

  return (
    <Table display="block" colorScheme="blackAlpha" variant="striped">
      <Thead>
        <Tr>
          <Th border={tableBorderStyle}></Th>
          <Th border={tableBorderStyle}>Black</Th>
          <Th border={tableBorderStyle}></Th>
          <Th border={tableBorderStyle}>White</Th>
        </Tr>
      </Thead>
      <Tbody display="block" height={300} overflowY="scroll">
        {createMovePairs().map(
          ([blackMove, whiteMove]: TableMove[], index: number) => {
            const hoverStyles = {
              background: "#2D3748 !important",
              color: "white",
              cursor: "pointer",
            };

            const activeStyles = {
              background: "#718096",
              color: "white",
            };

            const TableMoveCell = ({ move }: { move: TableMove }) => {
              return (
                <>
                  <Td border={tableBorderStyle}>
                    {move.number ? move.number : ""}
                  </Td>
                  <Td
                    _hover={hoverStyles}
                    _active={activeStyles}
                    border={tableBorderStyle}
                    style={
                      currentMove === move.number ? activeStyles : undefined
                    }
                    onClick={() =>
                      move.number ? playUpTo(move.number) : undefined
                    }
                    data-testid={
                      move.number ? `tableMove${move.number}` : undefined
                    }
                  >
                    {move.coordinates}
                  </Td>
                </>
              );
            };

            return (
              <Tr
                key={`${blackMove.coordinates}${whiteMove.coordinates}${String(
                  index
                )}`}
                data-testClassName="moveRow"
              >
                <TableMoveCell move={blackMove} />
                <TableMoveCell move={whiteMove} />
              </Tr>
            );
          }
        )}
      </Tbody>
      {children}
    </Table>
  );
}

function MoveBar({
  goMoves,
  playBoardPosition,
  currentMoveState,
  goHistoryState,
  turnGoMoveToBoardMove,
  children,
}: MoveBarProps) {
  const [currentMove, setCurrentMove] = currentMoveState;
  const [goHistory, setGoHistory] = goHistoryState;
  const VISIBLE = 1;
  const NOT_VISIBLE = 0;
  const BLACK_STONE: Sign = 1;
  const WHITE_STONE: Sign = -1;

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

  return (
    <HStack>
      <VStack>
        <MoveTable
          currentMove={currentMove}
          goMoves={goMoves}
          playUpTo={playUpTo}
        >
          <Tfoot>
            <Tr>
              <Th border={tableBorderStyle}>Black Captures</Th>
              <Th border={tableBorderStyle}>
                {goHistory[currentMove].getCaptures(BLACK_STONE)}
              </Th>
              <Th border={tableBorderStyle}>White Captures</Th>
              <Th border={tableBorderStyle}>
                {goHistory[currentMove].getCaptures(WHITE_STONE)}
              </Th>
            </Tr>
          </Tfoot>
        </MoveTable>
      </VStack>
      <Container>
        {children}
        <Flex>
          <Button
            data-testid="backButton"
            onClick={() => playUpTo(currentMove - 1)}
            disabled={currentMove === FIRST_MOVE}
          >
            {"<"}
          </Button>
          <Text opacity={currentMove > FIRST_MOVE ? VISIBLE : NOT_VISIBLE}>
            {currentMove}/{goMoves.length}
          </Text>
          <Button
            data-testid="forwardButton"
            onClick={() => playUpTo(currentMove + 1)}
          >
            {">"}
          </Button>
        </Flex>
      </Container>
    </HStack>
  );
}
export default MoveBar;
