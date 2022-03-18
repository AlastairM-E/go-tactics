import express from "express";
import multer from "multer";
import sgf from "../lib/sgf/src/main.js";
import { GoGameInterface, GoMove } from "../src/main.js";
import path from "path";
import cors from "cors";

require("dotenv").config({
  path: ".env",
});

type GoGameData = { [index: string]: string[] };
interface SgfParsedInterface {
  id: number;
  data: GoGameData;
  parentId: void | number;
  children: [SgfParsedInterface];
}
type SgfParsedFile = [SgfParsedInterface];
type StoneColor = "B" | "W";

const app = express();
const upload = multer();
const port = process.env.PORT || process.env.SITE_PORT;

const translateMoveToCoordinate = (move: string, boardSize: number) => {
  const SINGLE_CHARACTER = 0;
  const DIFFERENCE_WITH_I_CHAR_REMOVED = 1;
  const FIRST_Y_AXIS_ROW = "A";
  const PASS = "";

  if (move === PASS) {
    return PASS;
  }

  const upperCaseMove = move.toUpperCase();
  const sgfExcludedIAsciiCode = "I".charCodeAt(SINGLE_CHARACTER);
  const [xAxis, yAxis] = upperCaseMove.split("");

  const baseYAxisAsciiCode = FIRST_Y_AXIS_ROW.charCodeAt(SINGLE_CHARACTER);
  const moveXAxisAsciiCode = xAxis.charCodeAt(SINGLE_CHARACTER);
  const moveYAxisAsciiCode = yAxis.charCodeAt(SINGLE_CHARACTER);

  const yCoordinate = String(
    boardSize - (moveYAxisAsciiCode - baseYAxisAsciiCode)
  );
  let xCoordinate = xAxis;

  if (moveXAxisAsciiCode >= sgfExcludedIAsciiCode) {
    const bumpedUpXAxisFromIRow =
      moveXAxisAsciiCode + DIFFERENCE_WITH_I_CHAR_REMOVED;
    xCoordinate = String.fromCharCode(bumpedUpXAxisFromIRow);
  }

  const moveCoordinate = `${xCoordinate}${yCoordinate}`;

  return moveCoordinate;
};

const translateSgfParsedGoGame = (
  goGame: SgfParsedInterface
): GoGameInterface => {
  const [boardSize] = goGame.data["SZ"];
  const [komi] = goGame.data["KM"];
  const [rules] = goGame.data["RU"];
  const [gameName] = goGame.data["GN"];
  const gameId = `${String(goGame.id)}${gameName.split(" ").join("-")}`;

  const moves: GoMove[] = [];
  const BLACK_STONE = "B";
  const WHITE_STONE = "W";
  const additionalBlackStones = goGame.data["AB"];
  const additionalWhiteStones = goGame.data["AW"];

  const addMoves =
    (stoneColor: StoneColor) =>
    (move: string, index: number, array: string[]) => {
      moves.push([
        stoneColor,
        translateMoveToCoordinate(move, Number(boardSize)),
      ]);
    };

  additionalBlackStones?.forEach(addMoves(BLACK_STONE));
  additionalWhiteStones?.forEach(addMoves(WHITE_STONE));

  const translatedGoGame: GoGameInterface = {
    id: gameId,
    gameName,
    initialStones: [],
    moves: moves,
    rules: rules,
    komi: Number(komi),
    boardXSize: Number(boardSize),
    boardYSize: Number(boardSize),
    setup: true,
  };

  let currentPlayer: StoneColor = BLACK_STONE;
  let [nextMove] = goGame.children;

  while (nextMove?.children) {
    if (nextMove.data[BLACK_STONE]) {
      currentPlayer = BLACK_STONE;
    }

    if (nextMove.data[WHITE_STONE]) {
      currentPlayer = WHITE_STONE;
    }

    const [currentMove] = nextMove.data[currentPlayer];
    const currentCoordinate = translateMoveToCoordinate(
      currentMove,
      Number(boardSize)
    );

    translatedGoGame.moves.push([currentPlayer, currentCoordinate]);
    [nextMove] = nextMove.children;
  }

  return translatedGoGame;
};

app.use(
  cors({
    origin: `${process.env.CORS_SITE_DOMAIN}`,
  })
);

app.use(express.static(path.join(__dirname, "../build")));

app.get("/", function (req, res) {
  res.sendFile(path.join(__dirname, "../build", "index.html"));
});

app.post("/uploadSgf", upload.single("sgf"), (req, res) => {
  const uploadedFileText = req.file?.buffer.toString();
  const [parsedSgfFile]: SgfParsedFile = sgf.parse(uploadedFileText);
  const uploadedGoGame = translateSgfParsedGoGame(parsedSgfFile);
  res.json(uploadedGoGame);
});

app.listen(port, () => {
  console.log(`Hello world, listening on port: ${port}`);
});
