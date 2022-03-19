import { FormControl, FormLabel, Input, Button } from "@chakra-ui/react";
import { useState } from "react";
import { GoGameInterface } from "../main";

type userFile = File | void;

type sgfUploaderProps = {
  setupGoBoard: (uploadedGoGame: GoGameInterface) => void;
  addGoGameToDb: (uploadedGoGame: GoGameInterface) => void;
};

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
        `${process.env.REACT_APP_SITE_DOMAIN}/uploadSgf`,
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

export default SgfUploader;
