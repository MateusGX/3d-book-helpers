import { useEffect, useState } from "react";
import { useDropzone } from "react-dropzone";

export const readFile = (file: File, callback: (data: any) => void) => {
  const reader = new FileReader();
  reader.onloadend = (event) => {
    if (event.target) {
      const result = event.target.result;
      try {
        callback(JSON.parse(result as string));
      } catch (e) {
        callback(null);
        console.error("Invalid JSON file");
      }
    }
  };
  reader.readAsText(file);
};

export const useReadFile = () => {
  const { open, getInputProps, acceptedFiles } = useDropzone({
    noClick: true,
    noKeyboard: true,
    maxFiles: 1,
    accept: {
      "application/json": [".json"],
    },
  });
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    if (!acceptedFiles.length) return;
    readFile(acceptedFiles[0], setData);
  }, [acceptedFiles]);

  return { selectFile: open, getInputProps, fileData: data };
};
