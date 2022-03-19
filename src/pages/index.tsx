import React, { useState } from "react";
import { Goban } from "@sabaki/shudan";
import "../lib/shudan/css/goban.css";
import Board, { Sign, SignMap, Vertex } from "@sabaki/go-board";
import {
  Container,
  HStack,
  Divider,
  Text,
  ChakraProvider,
} from "@chakra-ui/react";
import { GoGameInterface, GoMove } from "../main";
import GameErrorMessage from "../components/GameErrorMessage";
import moveSound from "../audio/placeStone.mp3";
import GameFileExplorer from "../components/GameFileExplorer";
import { createGoBoard, moveOptions } from "../helper";
import AnalysisControls from "../components/AnalysisControls";

const BLACK_STONE: Sign = 1;
const WHITE_STONE: Sign = -1;
const BOARD_SIZE = 9;
const initGoBoard: SignMap = createGoBoard(BOARD_SIZE);
const userPlayer = BLACK_STONE;
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

function IndexPage() {
  const [goBoard, setGoBoard] = useState(new Board(initGoBoard));
  const [goGame, setGoGame] = useState(newGoGame);
  const [currentMove, setCurrentMove] = useState(FIRST_MOVE);
  const [goHistory, setGoHistory] = useState([goBoard]);
  const [gameErrorMessage, setGameErrorMessage] = useState("");

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
      playBoardPosition(newGoBoard);
    } catch ($error: any) {
      setGameErrorMessage($error.message);
    }
  };

  return (
    <ChakraProvider>
      <audio id="moveSound" src={moveSound} />
      <HStack spacing={1} margin={4}>
        <AnalysisControls
          goMoves={goGame.moves}
          playBoardPosition={playBoardPosition}
          currentMoveState={[currentMove, setCurrentMove]}
          goHistoryState={[goHistory, setGoHistory]}
          turnGoMoveToBoardMove={turnGoMoveToBoardMove}
        >
          <Text fontSize="2xl" textAlign="center">
            {goGame.gameName}
          </Text>
          <GameErrorMessage gameErrorMessage={gameErrorMessage} />
          <Divider />
          <Goban
            vertexSize={24}
            signMap={goBoard.signMap}
            onVertexClick={handleGoMoveClick}
            showCoordinates
          />
          <Divider />
        </AnalysisControls>
        <Container>
          <GameFileExplorer
            setupGoBoard={setupGoBoard}
            clearBoard={clearBoard}
          />
        </Container>
      </HStack>
    </ChakraProvider>
  );
}

export default IndexPage;
