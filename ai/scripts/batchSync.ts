import fs from "fs";

import readline from "readline";
import { huggingfaceCall } from "./huggingfaceCall";
import { userPrompt } from "../data/template/word";
import { ensureWriteFileSync } from "@/utils/nodeUtils";
import path from "path";

export async function getTaskPath() {
  return path.resolve(__dirname, "./task.txt");
}

export async function batchSync(rawLocation: string) {
  const copyPath = copyRaw(rawLocation);

  const isAllFinished = await isFileEmpty(copyPath);
  if (isAllFinished) {
    fs.writeFileSync(await getTaskPath(), "", "utf8");
  } else {
    await processFile(copyPath);
  }
}

function copyRaw(rawLocation: string) {
  const copyPath = rawLocation.split(".").join("_copy.");

  if (!fs.existsSync(copyPath)) {
    fs.copyFileSync(rawLocation, copyPath);
  }
  return copyPath;
}

async function processFile(wipFile: string) {
  const tempFilePath = wipFile + ".tmp"; // Temporary file path
  const targetOutputPath = wipFile.split(".").join("_result.");
  const readStream = fs.createReadStream(wipFile);
  let writeStream: fs.WriteStream | null = null;

  const rl = readline.createInterface({
    input: readStream,
    crlfDelay: Infinity,
  });
  let count = 0;
  let lineRemoved = false;
  for await (const line of rl) {
    if (!line.trim()) {
      continue;
    }
    console.log(`>> In progress word: ${line}`);
    if (!lineRemoved) {
      let success = false;
      while (!success) {
        count++;
        const content = userPrompt(line.trim());
        const res = await huggingfaceCall(content);
        const text = res.data[0].generated_text;
        if (text) {
          try {
            const obj = JSON.parse(text); // check the result parsable or not
            ensureWriteFileSync(targetOutputPath, JSON.stringify(obj) + "\n");
            success = true;
            writeStream = fs.createWriteStream(tempFilePath);
            process.stdout.write(
              `Finished: ${line.trim()} with ${count} times`,
            );
          } catch (error) {
            console.log(">> Parsing error: ", error, "\n");
          }
        }
      }
      lineRemoved = true;
    } else {
      writeStream?.write(line + "\n");
    }
  }

  rl.close();
  writeStream?.end();
  fs.renameSync(tempFilePath, wipFile);
}

async function isFileEmpty(filePath: string) {
  try {
    const fileStream = fs.createReadStream(filePath);
    const rl = readline.createInterface({
      input: fileStream,
      crlfDelay: Infinity,
    });

    for await (const line of rl) {
      if (line.trim() !== "") {
        return false;
      }
    }

    return true;
  } catch (error) {
    console.error(`>> Error reading file: ${error}`);
    return false;
  }
}
