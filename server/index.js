"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
var express_1 = __importDefault(require("express"));
var multer_1 = __importDefault(require("multer"));
var main_js_1 = __importDefault(require("../src/lib/sgf/src/main.js"));
var path_1 = __importDefault(require("path"));
var cors_1 = __importDefault(require("cors"));
require("dotenv").config({
    path: ".env"
});
var app = (0, express_1["default"])();
var upload = (0, multer_1["default"])();
var translateMoveToCoordinate = function (move, boardSize) {
    var SINGLE_CHARACTER = 0;
    var DIFFERENCE_WITH_I_CHAR_REMOVED = 1;
    var FIRST_Y_AXIS_ROW = "A";
    var PASS = "";
    if (move === PASS) {
        return PASS;
    }
    var upperCaseMove = move.toUpperCase();
    var sgfExcludedIAsciiCode = "I".charCodeAt(SINGLE_CHARACTER);
    var _a = upperCaseMove.split(""), xAxis = _a[0], yAxis = _a[1];
    var baseYAxisAsciiCode = FIRST_Y_AXIS_ROW.charCodeAt(SINGLE_CHARACTER);
    var moveXAxisAsciiCode = xAxis.charCodeAt(SINGLE_CHARACTER);
    var moveYAxisAsciiCode = yAxis.charCodeAt(SINGLE_CHARACTER);
    var yCoordinate = String(boardSize - (moveYAxisAsciiCode - baseYAxisAsciiCode));
    var xCoordinate = xAxis;
    if (moveXAxisAsciiCode >= sgfExcludedIAsciiCode) {
        var bumpedUpXAxisFromIRow = moveXAxisAsciiCode + DIFFERENCE_WITH_I_CHAR_REMOVED;
        xCoordinate = String.fromCharCode(bumpedUpXAxisFromIRow);
    }
    var moveCoordinate = "".concat(xCoordinate).concat(yCoordinate);
    return moveCoordinate;
};
var translateSgfParsedGoGame = function (goGame) {
    var boardSize = goGame.data["SZ"][0];
    var komi = goGame.data["KM"][0];
    var rules = goGame.data["RU"][0];
    var gameName = goGame.data["GN"][0];
    var gameId = "".concat(String(goGame.id)).concat(gameName.split(" ").join("-"));
    var moves = [];
    var BLACK_STONE = "B";
    var WHITE_STONE = "W";
    var additionalBlackStones = goGame.data["AB"];
    var additionalWhiteStones = goGame.data["AW"];
    var addMoves = function (stoneColor) {
        return function (move, index, array) {
            moves.push([
                stoneColor,
                translateMoveToCoordinate(move, Number(boardSize)),
            ]);
        };
    };
    additionalBlackStones === null || additionalBlackStones === void 0 ? void 0 : additionalBlackStones.forEach(addMoves(BLACK_STONE));
    additionalWhiteStones === null || additionalWhiteStones === void 0 ? void 0 : additionalWhiteStones.forEach(addMoves(WHITE_STONE));
    var translatedGoGame = {
        id: gameId,
        gameName: gameName,
        initialStones: [],
        moves: moves,
        rules: rules,
        komi: Number(komi),
        boardXSize: Number(boardSize),
        boardYSize: Number(boardSize),
        setup: true
    };
    var currentPlayer = BLACK_STONE;
    var nextMove = goGame.children[0];
    while (nextMove === null || nextMove === void 0 ? void 0 : nextMove.children) {
        if (nextMove.data[BLACK_STONE]) {
            currentPlayer = BLACK_STONE;
        }
        if (nextMove.data[WHITE_STONE]) {
            currentPlayer = WHITE_STONE;
        }
        var currentMove = nextMove.data[currentPlayer][0];
        var currentCoordinate = translateMoveToCoordinate(currentMove, Number(boardSize));
        translatedGoGame.moves.push([currentPlayer, currentCoordinate]);
        nextMove = nextMove.children[0];
    }
    return translatedGoGame;
};
app.use((0, cors_1["default"])({
    origin: "".concat(process.env.REACT_APP_SITE_DOMAIN, ":").concat(process.env.CORS_SITE_PORT)
}));
app.use(express_1["default"].static(path_1["default"].join(__dirname, "../build")));
app.get("/", function (req, res) {
    res.sendFile(path_1["default"].join(__dirname, "../build", "index.html"));
});
app.post("/uploadSgf", upload.single("sgf"), function (req, res) {
    var _a;
    var uploadedFileText = (_a = req.file) === null || _a === void 0 ? void 0 : _a.buffer.toString();
    var parsedSgfFile = main_js_1["default"].parse(uploadedFileText)[0];
    var uploadedGoGame = translateSgfParsedGoGame(parsedSgfFile);
    res.json(uploadedGoGame);
});
app.listen(process.env.REACT_APP_SITE_PORT, function () {
    console.log("Hello world, listening on port: ".concat(process.env.REACT_APP_SITE_PORT));
});
