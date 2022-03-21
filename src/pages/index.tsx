import React, { useLayoutEffect, useState } from "react";
import { Goban } from "@sabaki/shudan";
import "../lib/shudan/css/goban.css";
import Board, { Sign, SignMap, Vertex } from "@sabaki/go-board";
import {
  Container,
  Divider,
  Text,
  ChakraProvider,
  Center,
  Grid,
  GridItem,
} from "@chakra-ui/react";
import { GoGameInterface, GoMove } from "../main";
import GameErrorMessage from "../components/GameErrorMessage";
import moveSound from "../audio/placeStone.mp3";
import GameFileExplorer from "../components/GameFileExplorer";
import { createGoBoard, moveOptions } from "../helper";
import AnalysisControls from "../components/AnalysisControls";

const BLACK_STONE: Sign = 1;
const WHITE_STONE: Sign = -1;
const ADJUST_INDEX = 1;
const BOARD_SIZE = 9;
const initGoBoard: SignMap = createGoBoard(BOARD_SIZE);
const FIRST_MOVE = 0;
const newGoGame: GoGameInterface = {
  id: "randomGame",
  gameName: "[Default Game]",
  initialStones: [],
  moves: [],
  rules: "tromp-taylor",
  komi: 7.5,
  boardXSize: BOARD_SIZE,
  boardYSize: BOARD_SIZE,
};

const VERTEX_SIZE_9_X_9 = 40;
const VERTEX_SIZE_13_X_13 = 30;
const VERTEX_SIZE_19_X_19 = 22;

function IndexPage() {
  const [goBoard, setGoBoard] = useState(new Board(initGoBoard));
  const [goGame, setGoGame] = useState(newGoGame);
  const [currentMove, setCurrentMove] = useState(FIRST_MOVE);
  const [userPlayer, setUserPlayer] = useState(BLACK_STONE);
  const [goHistory, setGoHistory] = useState([goBoard]);
  const [gameErrorMessage, setGameErrorMessage] = useState("");
  const [vertexSize, setVertexSize] = useState(VERTEX_SIZE_9_X_9);

  useLayoutEffect(() => {
    switch (goGame.boardXSize) {
      case 9:
        setVertexSize(VERTEX_SIZE_9_X_9);
        break;
      case 13:
        setVertexSize(VERTEX_SIZE_13_X_13);
        break;
      case 19:
        setVertexSize(VERTEX_SIZE_19_X_19);
        break;

      default:
        setVertexSize(VERTEX_SIZE_19_X_19);
        break;
    }
  }, [goGame]);

  const setupGoBoard = (goGame: GoGameInterface): void => {
    const newInitGoGame = createGoBoard(goGame.boardXSize);
    const newGoBoard = new Board(newInitGoGame);

    setGoGame(goGame);
    setCurrentMove(FIRST_MOVE);

    setGoBoard(newGoBoard);
    setGoHistory([newGoBoard]);
  };

  const clearBoard = () => setupGoBoard(newGoGame);

  const turnGoMoveToBoardMove = ([stoneColor, coordinates]: GoMove): [
    Sign,
    Vertex
  ] => {
    const moveColor = stoneColor === "B" ? BLACK_STONE : WHITE_STONE;
    const moveVertex = goBoard.parseVertex(coordinates);

    return [moveColor, moveVertex];
  };

  const addMoveToGoGame = (nextGoMove: GoMove, nextBoardPosition: Board) => {
    const byOnlyPastMoves = (move: GoMove, index: number) => {
      return index < currentMove;
    };
    const byUpToCurrentBoardPosition = (board: Board, index: number) => {
      return index <= currentMove;
    };

    const pastGoMoves = goGame.moves.filter(byOnlyPastMoves);
    const updatedMoves = [...pastGoMoves, nextGoMove];
    const updatedGoGame = { ...goGame, moves: updatedMoves };

    const pastGoHistory = goHistory.filter(byUpToCurrentBoardPosition);
    const updatedGoHistory = [...pastGoHistory, nextBoardPosition];

    setGoGame(updatedGoGame);
    setGoHistory(updatedGoHistory);
    setCurrentMove(updatedMoves.length);

    return updatedGoGame;
  };

  const changePlayerStoneColor = (goMoves: GoMove[]) => {
    if (goMoves.length === FIRST_MOVE) {
      setUserPlayer(WHITE_STONE);
    } else {
      const [currentColor] = goMoves[currentMove];
      const nextStoneColor = currentColor === "B" ? WHITE_STONE : BLACK_STONE;

      setUserPlayer(nextStoneColor);
    }
  };

  const playBoardPosition = (boardPosition: Board) => {
    setGoBoard(boardPosition);

    const audioMoveSound: any = document?.getElementById("moveSound");
    audioMoveSound.play();
  };

  const handleGoMoveClick = async (event: unknown, [x, y]: number[]) => {
    try {
      const parsedVertex: string = goBoard.stringifyVertex([x, y]);
      const colorOfStone = userPlayer === BLACK_STONE ? "B" : "W";
      const goMove: GoMove = [colorOfStone, parsedVertex];

      const [moveColor, moveVertex] = turnGoMoveToBoardMove(goMove);
      const newGoBoard = goBoard.makeMove(moveColor, moveVertex, moveOptions);

      const updatedGoGame = addMoveToGoGame(goMove, newGoBoard);
      playBoardPosition(newGoBoard);
      changePlayerStoneColor(updatedGoGame.moves);
    } catch ($error: any) {
      console.log($error);
      setGameErrorMessage($error.message);
    }
  };

  const { MoveBar, MoveTable } = AnalysisControls({
    goMoves: goGame.moves,
    currentMoveState: [currentMove, setCurrentMove],
    goHistoryState: [goHistory, setGoHistory],
    playBoardPosition,
    turnGoMoveToBoardMove,
  });

  return (
    <ChakraProvider>
      <audio id="moveSound" src={moveSound} />

      <Grid
        templateColumns={[
          "repeat(1, 1fr)",
          "repeat(1, 1fr)",
          "repeat(3, 1fr)",
          "repeat(4, 1fr)",
        ]}
        templateRows={["repeat(3, 400px)", "repeat(2, 400px)"]}
      >
        <GridItem>
          <Container>
            <GameFileExplorer
              setupGoBoard={setupGoBoard}
              clearBoard={clearBoard}
            />
          </Container>
        </GridItem>
        <GridItem colSpan={2}>
          <Container>
            <Center>
              <Text fontSize="2xl">{goGame.gameName}</Text>
            </Center>

            <Center>
              <Divider />
              <Goban
                vertexSize={vertexSize}
                signMap={goBoard.signMap}
                onVertexClick={handleGoMoveClick}
                showCoordinates
              />
              <Divider />
            </Center>
            <MoveBar />
          </Container>
        </GridItem>

        <GridItem colSpan={1}>
          <Container>
            <Container margin={1}>
              <GameErrorMessage gameErrorMessage={gameErrorMessage} />
            </Container>
            <Divider />
            <MoveTable />
          </Container>
        </GridItem>
      </Grid>
    </ChakraProvider>
  );
}

export default IndexPage;
