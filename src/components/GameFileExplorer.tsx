import { useEffect, useState } from "react";
import {
  Button,
  Container,
  UnorderedList,
  ListItem,
  Text,
  Flex,
} from "@chakra-ui/react";
import React from "react";
import { GoGameInterface, IndexedDBHelper } from "../main";
import { createDb } from "../helper";
import SgfUploader from "./SgfUploader";

type GameExplorerProps = {
  setupGoBoard: (uploadedGoGame: GoGameInterface) => void;
  clearBoard: () => void;
};
type DBGameSection = [IDBValidKey, GoGameInterface[]];
type DBGameSections = void | DBGameSection[];

const dbName = "goGameStore";
const storeName = "goGames";
let goGameDb: undefined | IndexedDBHelper = undefined;

const hoverStyles = {
  border: "rgba(0,0,0,1) solid 2px",
  cursor: "pointer",
};

const activeStyles = {
  background: "#718096",
  color: "white",
};

function GameFileExplorer({ setupGoBoard, clearBoard }: GameExplorerProps) {
  const [goGamesStored, setGoGamesStored]: [
    DBGameSections,
    React.Dispatch<React.SetStateAction<DBGameSections>>
  ] = useState();

  useEffect(() => {
    const setupDb = async () => {
      if (!goGameDb) {
        goGameDb = await createDb(dbName, storeName);
        syncGameFileExplorer();
      }
    };

    setupDb();
  });

  const syncGameFileExplorer = async () => {
    if (!goGameDb) return undefined;

    const allGoGameDbEntries = await goGameDb.getAll();
    const allGoGameDbKeys = await goGameDb.keys();
    const GoGamesFileSystem: DBGameSections = await allGoGameDbKeys.map(
      (key, index) => {
        return [key, allGoGameDbEntries[index]];
      }
    );
    setGoGamesStored(GoGamesFileSystem);
  };

  const addGoGameToDb = async (goGame: GoGameInterface) => {
    if (!goGameDb) return undefined;

    const goGameKey = `${goGame.boardXSize}x${goGame.boardYSize}`;
    const allGoGamesInThatKey = await goGameDb.get(goGameKey);
    let newGameSection = [goGame];

    if (allGoGamesInThatKey) {
      newGameSection = [...allGoGamesInThatKey, goGame];
    }

    await goGameDb.set(goGameKey, newGameSection);
    syncGameFileExplorer();
  };

  const deleteGoGameFromDb = async (
    goGameKey: IDBValidKey,
    goGameId: string
  ) => {
    if (!goGameDb) return undefined;
    if (!goGamesStored) return undefined;

    const bySectionKey = ([key]: DBGameSection) => key === goGameKey;
    const byMatchingGameId = ({ id }: { id: string }) => id !== goGameId;

    const [[key, section]] = goGamesStored.filter(bySectionKey);
    const updatedGoGameSection = section.filter(byMatchingGameId);

    if (updatedGoGameSection.length === 0) {
      await goGameDb.del(key);
    } else {
      await goGameDb.set(key, updatedGoGameSection);
    }

    syncGameFileExplorer();
    clearBoard();
  };

  const byKeyLength = ([keyA]: DBGameSection, [keyB]: DBGameSection) => {
    return String(keyA).length - String(keyB).length;
  };

  return (
    <>
      <SgfUploader setupGoBoard={setupGoBoard} addGoGameToDb={addGoGameToDb} />
      <Text>Go Games</Text>
      {goGamesStored
        ? goGamesStored.sort(byKeyLength).map(([key, goGames]) => {
            return (
              <Container key={String(key)}>
                <Text fontSize={"xl"} data-testid={`${key}Section`}>
                  {key}
                </Text>
                <Container>
                  <UnorderedList>
                    {goGames.map((goGame: GoGameInterface, index) => {
                      return (
                        <ListItem
                          border={"rgba(0,0,0,0) solid 2px"}
                          padding={1}
                          margin={1}
                          key={`${goGame.gameName}${String(index)}`}
                          data-testid={`${key}-${goGame.gameName}`
                            .split(" ")
                            .join("-")}
                          data-testClassName={`${key}Games`}
                          _hover={hoverStyles}
                          _active={activeStyles}
                          onClick={() => setupGoBoard(goGame)}
                        >
                          <Flex alignItems="center">
                            <Text fontSize="sm">{goGame.gameName}</Text>
                            <Button
                              margin={1}
                              data-testid={`${key}-${goGame.gameName}-delete-button`
                                .split(" ")
                                .join("-")}
                              onClick={() => deleteGoGameFromDb(key, goGame.id)}
                              fontSize="sm"
                            >
                              Delete
                            </Button>
                          </Flex>
                        </ListItem>
                      );
                    })}
                  </UnorderedList>
                </Container>
              </Container>
            );
          })
        : undefined}
    </>
  );
}

export default GameFileExplorer;
