/* eslint-disable no-undef */
/// <reference  types="cypress" />

/* Reason for only E2E tests */
// - Fairly small application, with pieces not really being shared.
// - In addition, if I go too gradualar, then I may have trouble maintaining my tests.
// - Therefore, I have decided to do cypress end to end testing (TDD) to simplify the amount of testing
// and to test multiple bits of the application.
// - If this was a more serious production app, more integration tests would be wanted, specificially for api endpoints.
// - However, it is not, so I have gone for a light E2E approach.

const byTestId = (id) => `[data-testid="${id}"]`;
const byTestClassName = (className) => `[data-testClassName="${className}"]`;

const databaseName = "goGameStore";
const vertexes = ".shudan-vertex";
const blackStones = ".shudan-inner.shudan-stone-image.shudan-sign_1";
const whiteStones = ".shudan-inner.shudan-stone-image.shudan-sign_-1";

describe("Forward and Back buttons", () => {
  before(() => {
    indexedDB.deleteDatabase(databaseName);
    cy.visit("/");
    cy.wait(5_000);
  });

  after(() => {
    indexedDB.deleteDatabase(databaseName);
  });

  it("9x9 go board when initally loaded should be empty, but get more moves with forward and back buttons", () => {
    const FIRST_MOVE_NUMBER_OF_BLACK_STONES = 1;
    const FIRST_MOVE_NUMBER_OF_WHITE_STONES = 0;
    const SECOND_MOVE_NUMBER_OF_BLACK_STONES = 1;
    const SECOND_MOVE_NUMBER_OF_WHITE_STONES = 1;

    cy.get(byTestId("fileUploader")).attachFile("9x9_go_game.sgf");
    cy.get(byTestId("submitFile")).click();
    cy.wait(1_000);
    cy.get(blackStones).should(
      "have.length",
      FIRST_MOVE_NUMBER_OF_BLACK_STONES
    );
    cy.get(whiteStones).should(
      "have.length",
      FIRST_MOVE_NUMBER_OF_WHITE_STONES
    );

    cy.get(byTestId("backButton")).should("be.disabled");
    cy.get(byTestId("forwardButton")).click();
    cy.get(byTestId("backButton")).should("not.be.disabled");
    cy.get(blackStones).should(
      "have.length",
      SECOND_MOVE_NUMBER_OF_BLACK_STONES
    );
    cy.get(whiteStones).should(
      "have.length",
      SECOND_MOVE_NUMBER_OF_WHITE_STONES
    );

    const FOURTH_MOVE_NUMBER_OF_BLACK_STONES = 2;
    const FOURTH_MOVE_NUMBER_OF_WHITE_STONES = 2;

    cy.get(byTestId("forwardButton")).click();
    cy.get(byTestId("forwardButton")).click();
    cy.get(blackStones).should(
      "have.length",
      FOURTH_MOVE_NUMBER_OF_BLACK_STONES
    );
    cy.get(whiteStones).should(
      "have.length",
      FOURTH_MOVE_NUMBER_OF_WHITE_STONES
    );

    const THIRD_MOVE_NUMBER_OF_BLACK_STONES = 2;
    const THIRD_MOVE_NUMBER_OF_WHITE_STONES = 1;
    cy.get(byTestId("backButton")).click();
    cy.get(blackStones).should(
      "have.length",
      THIRD_MOVE_NUMBER_OF_BLACK_STONES
    );
    cy.get(whiteStones).should(
      "have.length",
      THIRD_MOVE_NUMBER_OF_WHITE_STONES
    );

    cy.get(byTestId("backButton")).click();
    cy.get(byTestId("backButton")).click();
    cy.get(byTestId("backButton")).should("be.disabled");
    cy.get(blackStones).should(
      "have.length",
      FIRST_MOVE_NUMBER_OF_BLACK_STONES
    );
    cy.get(whiteStones).should(
      "have.length",
      FIRST_MOVE_NUMBER_OF_WHITE_STONES
    );
  });

  it("Should hop between sgf file uploads at the correct board size", () => {
    const NUMBER_OF_9_X_9_VERTEXES = 9 * 9;
    const NUMBER_OF_13_X_13_VERTEXES = 13 * 13;

    cy.get(vertexes).should("have.length", NUMBER_OF_9_X_9_VERTEXES);
    cy.get(byTestId("fileUploader")).attachFile("13x13_go_game.sgf");
    cy.get(byTestId("submitFile")).click();
    cy.wait(1_000);
    cy.get(vertexes).should("have.length", NUMBER_OF_13_X_13_VERTEXES);

    cy.get(byTestId("forwardButton")).click();
    cy.get(byTestId("backButton")).click();

    cy.get(vertexes).should("have.length", NUMBER_OF_13_X_13_VERTEXES);
  });
});

describe("Go Game Table", () => {
  before(() => {
    indexedDB.deleteDatabase(databaseName);
    cy.visit("/");
    cy.wait(2_500);
  });

  after(() => {
    indexedDB.deleteDatabase(databaseName);
  });

  it("renders a table when a file is entered", () => {
    const NO_ROWS = 0;
    const TOTAL_GAME_MOVES = 21;

    cy.get(byTestId("moveRow")).should("have.length", NO_ROWS);
    cy.get(byTestId("fileUploader")).attachFile("9x9_go_game.sgf");
    cy.get(byTestId("submitFile")).click();
    cy.wait(1_000);
    cy.get(byTestClassName("moveRow")).should("have.length", TOTAL_GAME_MOVES);
  });

  // TODO: fix error
  it("goes to a particular move when you click a table entry, backwards & forwards", () => {
    const FIRST_MOVE = 1;
    const NUMBER_OF_BLACK_STONES_ON_THE_FIRST_MOVE = 1;
    const NUMBER_OF_WHITE_STONES_ON_THE_FIRST_MOVE = 0;

    cy.get(byTestId(`tableMove${FIRST_MOVE}`)).click();
    cy.get(blackStones).should(
      "have.length",
      NUMBER_OF_BLACK_STONES_ON_THE_FIRST_MOVE
    );
    cy.get(whiteStones).should(
      "have.length",
      NUMBER_OF_WHITE_STONES_ON_THE_FIRST_MOVE
    );

    const FOURTH_MOVE = 4;
    const NUMBER_OF_BLACK_STONES_ON_THE_FOURTH_MOVE = 2;
    const NUMBER_OF_WHITE_STONES_ON_THE_FOURTH_MOVE = 2;
    cy.get(byTestId(`tableMove${FOURTH_MOVE}`)).click();
    cy.get(blackStones).should(
      "have.length",
      NUMBER_OF_BLACK_STONES_ON_THE_FOURTH_MOVE
    );
    cy.get(whiteStones).should(
      "have.length",
      NUMBER_OF_WHITE_STONES_ON_THE_FOURTH_MOVE
    );

    cy.get(byTestId("backButton")).click();

    const NUMBER_OF_BLACK_STONES_ON_THE_THIRD_MOVE = 2;
    const NUMBER_OF_WHITE_STONES_ON_THE_THIRD_MOVE = 1;
    cy.get(blackStones).should(
      "have.length",
      NUMBER_OF_BLACK_STONES_ON_THE_THIRD_MOVE
    );
    cy.get(whiteStones).should(
      "have.length",
      NUMBER_OF_WHITE_STONES_ON_THE_THIRD_MOVE
    );

    cy.get(byTestId("backButton")).click();
    cy.get(byTestId("backButton")).click();
    cy.get(blackStones).should(
      "have.length",
      NUMBER_OF_BLACK_STONES_ON_THE_FIRST_MOVE
    );
    cy.get(whiteStones).should(
      "have.length",
      NUMBER_OF_WHITE_STONES_ON_THE_FIRST_MOVE
    );
  });
});
