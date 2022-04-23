/* eslint-disable no-undef */
/// <reference  types="cypress" />

const byPoint = (x, y) =>
  `[data-x="${String(x - 1)}"][data-y="${String(y - 1)}"]`;
const byTestId = (id) => `[data-testid="${id}"]`;
// const byTestClassName = (className) => `[data-testClassName="${className}"]`;

const databaseName = "goGameStore";
// const vertexes = ".shudan-vertex";
const blackStones = ".shudan-inner.shudan-stone-image.shudan-sign_1";
const whiteStones = ".shudan-inner.shudan-stone-image.shudan-sign_-1";

/* No need to change test */
describe("Go Board can make moves on the board", () => {
  before(() => {
    indexedDB.deleteDatabase(databaseName);
    cy.visit("/");
    cy.wait(5_000);
  });

  after(() => {
    indexedDB.deleteDatabase(databaseName);
  });

  it("[Default Game] - black/,white default, in go game, current color -> next = opposite color", () => {
    const INITIAL_NUMBER_OF_BLACK_STONES = 0;
    const INITIAL_NUMBER_OF_WHITE_STONES = 0;
    const ONE_BLACK_STONE = 1;
    const ONE_WHITE_STONE = 1;
    const TWO_BLACK_STONES = 2;
    const TWO_WHITE_STONES = 2;

    cy.get(blackStones).should("have.length", INITIAL_NUMBER_OF_BLACK_STONES);
    cy.get(whiteStones).should("have.length", INITIAL_NUMBER_OF_WHITE_STONES);

    cy.get(byPoint(1, 1)).click();
    cy.get(blackStones).should("have.length", ONE_BLACK_STONE);
    cy.get(whiteStones).should("have.length", INITIAL_NUMBER_OF_WHITE_STONES);

    cy.get(byPoint(1, 9)).click();
    cy.get(blackStones).should("have.length", ONE_BLACK_STONE);
    cy.get(whiteStones).should("have.length", ONE_WHITE_STONE);

    cy.get(byPoint(9, 1)).click();
    cy.get(byPoint(9, 9)).click();
    cy.get(blackStones).should("have.length", TWO_BLACK_STONES);
    cy.get(whiteStones).should("have.length", TWO_WHITE_STONES);
    cy.get(byTestId("tableMove1")).should("exist");
    cy.get(byTestId("tableMove2")).should("exist");
    cy.get(byTestId("tableMove3")).should("exist");
    cy.get(byTestId("tableMove4")).should("exist");

    cy.get(byTestId("backButton")).click();
    cy.get(byTestId("backButton")).click();
    cy.get(blackStones).should("have.length", ONE_BLACK_STONE);
    cy.get(whiteStones).should("have.length", ONE_WHITE_STONE);
    cy.get(byTestId("tableMove1")).should("exist");
    cy.get(byTestId("tableMove2")).should("exist");
    cy.get(byTestId("tableMove3")).should("exist");
    cy.get(byTestId("tableMove4")).should("exist");

    cy.get(byPoint(5, 5)).click();
    cy.get(blackStones).should("have.length", TWO_BLACK_STONES);
    cy.get(whiteStones).should("have.length", ONE_WHITE_STONE);
    cy.get(byTestId("tableMove1")).should("exist");
    cy.get(byTestId("tableMove2")).should("exist");
    cy.get(byTestId("tableMove3")).should("exist");
    cy.get(byTestId("tableMove4")).should("not.exist");
  });
});

/* Play moves inside the board when resummoned */
// - this requires branches to be made, since you want to return to the original game as well.
