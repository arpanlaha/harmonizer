import React, { ChangeEvent, ReactElement, useState } from "react";
import { Head } from "../components";
import { getHarmony } from "../utils/api";

import "../styles/style.scss";

export default function Home(): ReactElement {
  const [file, setFile] = useState<File | null>(null);
  const [response, setResponse] = useState<string | null>(null);

  const handleFile = (e: ChangeEvent<HTMLInputElement>): void =>
    setFile(e.target.files ? e.target.files[0] : null);

  const handleSubmit = async (): Promise<void> => {
    if (file !== null) {
      const harmony = await getHarmony(file);
      if (harmony) {
        setResponse(JSON.stringify(harmony));
      }
    }
  };

  return (
    <>
      <Head />
      <div>Hello world!</div>
      <input type="file" onChange={handleFile} />
      <button disabled={file === null} onClick={handleSubmit}>
        Submit
      </button>
      {response}
    </>
  );
}
