import {
  Table,
  Thead,
  Tr,
  Th,
  Tbody,
  Td,
  Container,
  Divider,
  Tfoot,
} from "@chakra-ui/react";
import { GoMove } from "../main";

type MoveTableProps = {
  goMoves: GoMove[];
  currentMove: number;
  playUpTo: (moveNumber: number) => void;
  captures: {
    blackStones: number;
    whiteStones: number;
  };
};

type MoveCellProps = {
  move: TableMove;
  currentMove: number;
  playUpTo: (moveNumber: number) => void;
};

type TableMove = { number: number | void; coordinates: string };

const PASS = "";
const tableBorderStyle = "2px solid black";

const hoverStyles = {
  background: "#2D3748 !important",
  color: "white",
  cursor: "pointer",
};

const activeStyles = {
  background: "#718096",
  color: "white",
};

const MoveCell = ({ move, currentMove, playUpTo }: MoveCellProps) => {
  const ADJUST_TO_ARRAY_INDEX = 1;
  const moveNumber = move.number
    ? move.number - ADJUST_TO_ARRAY_INDEX
    : undefined;
  return (
    <>
      <Td border={tableBorderStyle}>{move.number ? move.number : ""}</Td>
      <Td
        _hover={hoverStyles}
        _active={activeStyles}
        border={tableBorderStyle}
        style={currentMove === moveNumber ? activeStyles : undefined}
        onClick={() => (moveNumber ? playUpTo(moveNumber) : undefined)}
        data-testid={move.number ? `tableMove${move.number}` : undefined}
      >
        {move.coordinates}
      </Td>
    </>
  );
};

function MoveTable({
  goMoves,
  currentMove,
  captures,
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
    <Container>
      {goMoves.length ? (
        <>
          <Container height={300} overflowY="scroll" margin={1} paddingX={1}>
            <Table>
              <Thead>
                <Tr background="white">
                  <Th border={tableBorderStyle}></Th>
                  <Th border={tableBorderStyle}>Black</Th>
                  <Th border={tableBorderStyle}></Th>
                  <Th border={tableBorderStyle}>White</Th>
                </Tr>
              </Thead>
              <Tbody>
                {createMovePairs().map(
                  ([blackMove, whiteMove]: TableMove[], index: number) => {
                    return (
                      <Tr
                        key={`${blackMove.coordinates}${
                          whiteMove.coordinates
                        }${String(index)}`}
                        data-testClassName="moveRow"
                      >
                        <MoveCell
                          move={blackMove}
                          currentMove={currentMove}
                          playUpTo={playUpTo}
                        />
                        <MoveCell
                          move={whiteMove}
                          currentMove={currentMove}
                          playUpTo={playUpTo}
                        />
                      </Tr>
                    );
                  }
                )}
              </Tbody>
            </Table>
          </Container>
          <Divider />

          <Table margin={1}>
            <Tfoot>
              <Tr border={tableBorderStyle}>
                <Th border={tableBorderStyle}>Black Captures</Th>
                <Th border={tableBorderStyle}>{captures.blackStones}</Th>
                <Th border={tableBorderStyle}>White Captures</Th>
                <Th border={tableBorderStyle}>{captures.whiteStones}</Th>
              </Tr>
            </Tfoot>
          </Table>
        </>
      ) : undefined}
    </Container>
  );
}

export default MoveTable;
