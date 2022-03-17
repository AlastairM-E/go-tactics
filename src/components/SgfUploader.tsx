import { useEffect, useState } from "react";
import {
  Button,
  Container,
  Input,
  UnorderedList,
  ListItem,
  Text,
  FormLabel,
  FormControl,
  Flex,
} from "@chakra-ui/react";
import React from "react";
import { GoGameInterface, IndexedDBHelper } from "../main";
import { createDb } from "../helper";

type userFile = File | void;
type GameExplorerProps = {
  setupGoBoard: (uploadedGoGame: GoGameInterface) => void;
  clearBoard: () => void;
};
type sgfUploaderProps = {
  setupGoBoard: (uploadedGoGame: GoGameInterface) => void;
  addGoGameToDb: (uploadedGoGame: GoGameInterface) => void;
};
type DBGameSection = [IDBValidKey, GoGameInterface[]];
type DBGameSections = void | DBGameSection[];

const dbName = "goGameStore";
const storeName = "goGames";
let goGameDb: undefined | IndexedDBHelper = undefined;

function SgfUploader({ setupGoBoard, addGoGameToDb }: sgfUploaderProps) {
  const [file, setFile]: [
    userFile,
    React.Dispatch<React.SetStateAction<userFile>>
  ] = useState();

  const handleSelectFile = (event: any) => {
    const [selectedFile] = event.target.files;
    setFile(selectedFile);
  };
  const handleUploadFile = async () => {
    if (file) {
      const formData = new FormData();
      formData.append("sgf", file, file.name);

      const uploadedSgfFile = await fetch(
        `${process.env.GATSBY_SITE_DOMAIN}:${process.env.GATSBY_UPLOAD_SGF_PORT}/uploadSgf`,
        {
          method: "POST",
          body: formData,
        }
      );
      const uploadedGoGame: GoGameInterface = await uploadedSgfFile.json();
      setupGoBoard(uploadedGoGame);
      await addGoGameToDb(uploadedGoGame);
    }
  };

  return (
    <FormControl>
      <FormLabel>Upload New Go Game</FormLabel>
      <Input
        data-testid="fileUploader"
        type="file"
        onChange={handleSelectFile}
        padding={1}
        margin={1}
      />
      <Button data-testid="submitFile" onClick={handleUploadFile} margin={1}>
        Upload File
      </Button>
    </FormControl>
  );
}

const hoverStyles = {
  border: "rgba(0,0,0,1) solid 2px",
  cursor: "pointer",
};

const activeStyles = {
  background: "#718096",
  color: "white",
};

function GameFileExplorer({ setupGoBoard, clearBoard }: GameExplorerProps) {
  const [goGamesStored, setGoGamesStored]: [DBGameSections, any] = useState();

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
    const GoGamesFileSystem = await allGoGameDbKeys.map((key, index) => {
      return [key, allGoGameDbEntries[index]];
    });
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

  const byKeyLength = ([keyA]: any, [keyB]: any) => keyA.length - keyB.length;

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
                          <Flex>
                            <Text>{goGame.gameName}</Text>
                            <Button
                              data-testid={`${key}-${goGame.gameName}-delete-button`
                                .split(" ")
                                .join("-")}
                              onClick={() => deleteGoGameFromDb(key, goGame.id)}
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
