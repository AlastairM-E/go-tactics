import { Alert, AlertIcon, AlertTitle } from "@chakra-ui/react";
import React from "react";

type GameErrorMessageProps = { gameErrorMessage: string };

function GameErrorMessage({ gameErrorMessage }: GameErrorMessageProps) {
  if (gameErrorMessage !== "") {
    return (
      <Alert status="error" variant="top-accent">
        <AlertIcon />
        <AlertTitle>{gameErrorMessage}</AlertTitle>
      </Alert>
    );
  } else {
    return null;
  }
}

export default GameErrorMessage;
