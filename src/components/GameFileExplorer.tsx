import { useEffect, useState } from "react";
import {
  Button,
  Text,
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Box,
  Tbody,
  Table,
  Td,
  Tr,
  Thead,
} from "@chakra-ui/react";
import React from "react";
import { GoGameInterface, IndexedDBHelper } from "../main";
import { createDb } from "../helper";
import SgfUploader from "./SgfUploader";
import { DeleteIcon } from "@chakra-ui/icons";

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
  cursor: "pointer",
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
      <Accordion allowMultiple>
        {goGamesStored
          ? goGamesStored.sort(byKeyLength).map(([key, goGames]) => {
              return (
                <>
                  <Table>
                    <Thead>
                      <Tr>
                        <Text data-testid={`${key}Section`}>{key}</Text>
                      </Tr>
                    </Thead>
                    <Tbody>
                      {goGames.map((goGame: GoGameInterface, index) => {
                        return (
                          <Tr
                            padding={1}
                            margin={1}
                            key={`${goGame.gameName}${String(index)}`}
                            data-testid={`${key}-${goGame.gameName}`
                              .split(" ")
                              .join("-")}
                            data-testClassName={`${key}Games`}
                            onClick={() => setupGoBoard(goGame)}
                            alignItems="center"
                            border={"2px solid black"}
                            _hover={hoverStyles}
                          >
                            <Td
                              borderRight={"2px solid black"}
                              _hover={{
                                background: "green.500",
                                color: "white",
                              }}
                            >
                              <Text fontSize="sm">{goGame.gameName}</Text>
                            </Td>
                            <Td
                              onClick={() => deleteGoGameFromDb(key, goGame.id)}
                              textAlign="center"
                              _hover={{
                                background: "red.500",
                                color: "white",
                              }}
                            >
                              <DeleteIcon
                                margin={1}
                                data-testid={`${key}-${goGame.gameName}-delete-button`
                                  .split(" ")
                                  .join("-")}
                              />
                            </Td>
                          </Tr>
                        );
                      })}
                    </Tbody>
                  </Table>
                </>
              );
            })
          : undefined}
      </Accordion>
    </>
  );
}

//           Section 1 title

//     </h2>
//     <AccordionPanel pb={4}>
//       Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
//       tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim
//       veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea
//       commodo consequat.
//     </AccordionPanel>
//   </AccordionItem>

//   <AccordionItem>
//     <h2>
//       <AccordionButton>
//         <Box flex='1' textAlign='left'>
//           Section 2 title
//         </Box>
//         <AccordionIcon />
//       </AccordionButton>
//     </h2>
//
//       Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
//       tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim
//       veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea
//       commodo consequat.
//     </AccordionPanel>
//   </AccordionItem>
// </Accordion>

export default GameFileExplorer;
