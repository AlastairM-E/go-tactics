/* eslint-disable no-undef */
/// <reference  types="cypress" />

const byTestId = (id) => `[data-testid="${id}"]`;
const byTestClassName = (className) => `[data-testClassName="${className}"]`;

const databaseName = "goGameStore";
const vertexes = ".shudan-vertex";
const blackStones = ".shudan-inner.shudan-stone-image.shudan-sign_1";
const whiteStones = ".shudan-inner.shudan-stone-image.shudan-sign_-1";

describe("SGF file Uploader", () => {
  before(() => {
    indexedDB.deleteDatabase(databaseName);
    cy.visit("/");
    cy.wait(5_000);
  });

  after(() => {
    indexedDB.deleteDatabase(databaseName);
  });

  it("render a 9x9 sgf file with the correct number of stones on", () => {
    const NUMBER_OF_BLACK_STONES = 21;
    const NUMBER_OF_WHITE_STONES = 19;
    const TOTAL_GAME_MOVES = 42;
    cy.get(byTestId("fileUploader")).attachFile("9x9_go_game.sgf");
    cy.get(byTestId("submitFile")).click();
    cy.wait(1_000);
    cy.get(byTestId(`tableMove${TOTAL_GAME_MOVES}`)).click();
    cy.get(blackStones).should("have.length", NUMBER_OF_BLACK_STONES);
    cy.get(whiteStones).should("have.length", NUMBER_OF_WHITE_STONES);
  });

  it("adds that 9x9 go Game to the sgf file explorer", () => {
    const SINGLE_GAME = 1;
    cy.get(byTestClassName("9x9Games")).should("have.length", SINGLE_GAME);
  });

  it("can render another Go Game of a different size (13 x 13) after file uploading a game", () => {
    const NUMBER_OF_BLACK_STONES = 50;
    const NUMBER_OF_WHITE_STONES = 53;
    const TOTAL_GAME_MOVES = 111;
    cy.get(byTestId("fileUploader")).attachFile("13x13_go_game.sgf");
    cy.get(byTestId("submitFile")).click();
    cy.wait(1_000);
    cy.get(byTestId(`tableMove${TOTAL_GAME_MOVES}`)).click();

    cy.get(blackStones).should("have.length", NUMBER_OF_BLACK_STONES);
    cy.get(whiteStones).should("have.length", NUMBER_OF_WHITE_STONES);

    const SINGLE_GAME = 1;
    cy.get(byTestClassName("13x13Games")).should("have.length", SINGLE_GAME);
  });

  it("can render another Go Game of a different size (19 x 19) after file uploading a game", () => {
    const NUMBER_OF_BLACK_STONES = 58;
    const NUMBER_OF_WHITE_STONES = 57;
    const TOTAL_GAME_MOVES = 115;
    cy.get(byTestId("fileUploader")).attachFile("19x19_go_game.sgf");
    cy.get(byTestId("submitFile")).click();
    cy.wait(1_000);
    cy.get(byTestId(`tableMove${TOTAL_GAME_MOVES}`)).click();

    cy.get(blackStones).should("have.length", NUMBER_OF_BLACK_STONES);
    cy.get(whiteStones).should("have.length", NUMBER_OF_WHITE_STONES);
  });

  it("can render a 19x19 handicap game", () => {
    const NUMBER_OF_BLACK_STONES = 35;
    const NUMBER_OF_WHITE_STONES = 31;
    const TOTAL_GAME_MOVES = 66;
    cy.get(byTestId("fileUploader")).attachFile("handicap_19x19_go_game.sgf");
    cy.get(byTestId("submitFile")).click();
    cy.wait(1_000);
    cy.get(byTestId(`tableMove${TOTAL_GAME_MOVES}`)).click();

    cy.get(blackStones).should("have.length", NUMBER_OF_BLACK_STONES);
    cy.get(whiteStones).should("have.length", NUMBER_OF_WHITE_STONES);
  });

  it("adds that 19x19 go Game to the sgf file explorer", () => {
    const TWO_GAMES = 2;
    cy.get(byTestClassName("19x19Games")).should("have.length", TWO_GAMES);
  });
});

describe("Checking the GameFile Explorer works", () => {
  before(() => {
    indexedDB.deleteDatabase(databaseName);
    cy.visit("/");
    cy.wait(5_000);
  });

  after(() => {
    indexedDB.deleteDatabase(databaseName);
  });

  it("has data which will not clear after 1 reload", () => {
    const SINGLE_GAME = 1;
    const TWO_GAMES = 2;

    cy.get(byTestId("fileUploader")).attachFile("9x9_go_game.sgf");
    cy.get(byTestId("submitFile")).click();
    cy.wait(2_500);
    cy.get(byTestId("fileUploader")).attachFile("13x13_go_game.sgf");
    cy.get(byTestId("submitFile")).click();
    cy.wait(2_500);
    cy.get(byTestId("fileUploader")).attachFile("19x19_go_game.sgf");
    cy.get(byTestId("submitFile")).click();
    cy.wait(2_500);
    cy.get(byTestId("fileUploader")).attachFile("handicap_19x19_go_game.sgf");
    cy.get(byTestId("submitFile")).click();
    cy.wait(2_500);

    cy.visit("/");

    cy.get(byTestClassName("9x9Games")).should("have.length", SINGLE_GAME);
    cy.get(byTestClassName("13x13Games")).should("have.length", SINGLE_GAME);
    cy.get(byTestClassName("19x19Games")).should("have.length", TWO_GAMES);
  });

  it("On Click of the 9x9 [skrzyniu vs. I_get_a_bit_bored] game, it will move to that game", () => {
    const INITIAL_NUMBER_OF_BOARD_STONES = 0;

    const SECOND_MOVE_NUMBER_OF_BLACK_STONES = 1;
    const SECOND_MOVE_NUMBER_OF_WHITE_STONES = 1;

    cy.get(byTestId("9x9Section")).click();
    cy.wait(2_500);
    cy.get(byTestId("9x9-skrzyniu-vs.-I_get_a_bit_bored")).click();

    cy.get(blackStones).should("have.length", INITIAL_NUMBER_OF_BOARD_STONES);
    cy.get(whiteStones).should("have.length", INITIAL_NUMBER_OF_BOARD_STONES);

    cy.get(byTestId("forwardButton")).click();
    cy.get(byTestId("forwardButton")).click();

    cy.get(blackStones).should(
      "have.length",
      SECOND_MOVE_NUMBER_OF_BLACK_STONES
    );
    cy.get(whiteStones).should(
      "have.length",
      SECOND_MOVE_NUMBER_OF_WHITE_STONES
    );
  });

  it("On Click of the 19x19 [goggly vs. I_get_a_bit_bored] game, it will move to that game", () => {
    const NUMBER_OF_9_X_9_VERTEXES = 9 * 9;
    const NUMBER_OF_19_X_19_VERTEXES = 19 * 19;
    const INITIAL_NUMBER_OF_BOARD_STONES = 0;
    const SECOND_MOVE_NUMBER_OF_BLACK_STONES = 1;
    const SECOND_MOVE_NUMBER_OF_WHITE_STONES = 1;

    cy.get(vertexes).should("have.length", NUMBER_OF_9_X_9_VERTEXES);

    cy.get(byTestId("19x19Section")).click();
    cy.wait(2_500);
    cy.get(byTestId("19x19-goggly-vs.-I_get_a_bit_bored")).click();

    cy.get(vertexes).should("have.length", NUMBER_OF_19_X_19_VERTEXES);

    cy.get(blackStones).should("have.length", INITIAL_NUMBER_OF_BOARD_STONES);
    cy.get(whiteStones).should("have.length", INITIAL_NUMBER_OF_BOARD_STONES);

    cy.get(byTestId("forwardButton")).click();
    cy.get(byTestId("forwardButton")).click();

    cy.get(blackStones).should(
      "have.length",
      SECOND_MOVE_NUMBER_OF_BLACK_STONES
    );
    cy.get(whiteStones).should(
      "have.length",
      SECOND_MOVE_NUMBER_OF_WHITE_STONES
    );
  });

  it("Should delete the go game from the game File explorer cleanly", () => {
    const DEFAULT_NUMBER_OF_VERTEXES = 9 * 9;

    cy.get(
      byTestId("9x9-skrzyniu-vs.-I_get_a_bit_bored-delete-button")
    ).click();

    cy.get(byTestId("9x9Section")).should("not.exist");
    cy.get(byTestId("9x9-skrzyniu-vs.-I_get_a_bit_bored")).should("not.exist");

    cy.get(vertexes).should("have.length", DEFAULT_NUMBER_OF_VERTEXES);

    cy.get(
      byTestId("19x19-goggly-vs.-I_get_a_bit_bored-delete-button")
    ).click();
    cy.get(byTestId("19x19-goggly-vs.-I_get_a_bit_bored")).should("not.exist");

    cy.get(vertexes).should("have.length", DEFAULT_NUMBER_OF_VERTEXES);
  });
});
