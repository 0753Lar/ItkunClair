import { ensureWriteFileSync } from "@/utils/nodeUtils";
import axios from "axios";
import fs from "fs";
import readline from "readline";
import { FormalWord, userPrompt } from "../data/template/word";
import path from "path";
import { huggingfaceCall } from "./huggingfaceCall";
import { exit } from "process";
import { localModelCall } from "./localModelCall";
import { sleep } from "@/utils";

let HFAttempt = 0;
let targetRaw: string | null = null;

export async function localModelhandler(word: string) {
  try {
    const res = await localModelCall(userPrompt(word));
    const obj = JSON.parse(res.data.response);
    console.log(obj);

    return obj;
  } catch (error) {
    console.log(">> localModelhandler error: \n", error);
    return null;
  }
}

export async function huggingfaceModalHandler(word: string) {
  console.log(` -------------------WIP :${word}---------------------`);
  try {
    const res = await huggingfaceCall(userPrompt(word));
    const obj = JSON.parse(res.data[0].generated_text);
    return obj;
  } catch (error) {
    console.log(">> huggingfaceModalHandler error: \n", error);
    return null;
  }
}

export function getJSONOutputPath() {
  const outputPath = targetRaw
    ? targetRaw.split(".")[0] + ".json"
    : path.resolve(__dirname, "../data/data.json");
  if (!fs.existsSync(outputPath)) {
    fs.writeFileSync(outputPath, JSON.stringify({}), "utf-8");
  }
  return outputPath;
}

async function getTaskPath() {
  return path.resolve(__dirname, "./task.txt");
}

function copyRawIfNotExist(rawLocation: string) {
  const copyPath = rawLocation.split(".").join("_copy.");

  if (!fs.existsSync(copyPath)) {
    fs.copyFileSync(rawLocation, copyPath);
  }
  return copyPath;
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

export async function workWithUnitOfTask(
  handler: (word: string) => Promise<FormalWord | null>,
) {
  const taskPath = await getTaskPath();

  const { getLines, validNext, close } = createRl(taskPath);

  const line = await validNext();
  if (!line) {
    return;
  }
  targetRaw = path.resolve(__dirname, "../data/raw/", line);
  const copyRawPath = copyRawIfNotExist(targetRaw);
  const isAllFinished = await isFileEmpty(copyRawPath);
  if (isAllFinished) {
    fs.unlinkSync(copyRawPath);
    close();
    if (!removeLinesOrderly(taskPath, getLines())) {
      throw new Error("failed to remove line");
    }
    return await workWithUnitOfTask(handler);
  } else {
    await processUnitOfWork(copyRawPath, handler);
    await workWithUnitOfTask(handler);
  }
}

async function processUnitOfWork(
  filePath: string,
  handler: (word: string) => Promise<FormalWord | null>,
) {
  const targetOutputPath = filePath.split(".").join("_result.");
  const { getLines, rl, validNext } = createRl(filePath);

  const nextLine = await validNext();
  if (!nextLine) {
    return await workWithUnitOfTask(handler);
  }

  let count = 0;
  let success = false;
  while (!success) {
    if (HFAttempt >= 10) {
      console.log("-------------------REACH MAX ERROR ATTEMPT---------------");
      exit(0);
    } else if (count >= 10) {
      console.log(
        "-------------------REACH MAX DUPLICATE ATTEMPT---------------",
      );
      exit(0);
    }
    count++;
    try {
      const obj = await handler(
        count >= 5 ? `[${nextLine.trim()}]` : nextLine.trim(),
      );
      if (obj) {
        try {
          if (obj.word == nextLine.trim()) {
            appendWordIntoJSON(getJSONOutputPath(), obj);
            ensureWriteFileSync(targetOutputPath, JSON.stringify(obj) + "\n");
            success = true;
            process.stdout.write(
              `>============================> Finished: [${nextLine}] with ${count} times\n`,
            );
          } else {
            console.log(
              `>> generated wrong word: ${obj.word} with ${count} times.`,
            );
            await sleep(10_000);
          }
        } catch (error) {
          console.log(">> Parsing error: ", error, "\n");
          await sleep(10_000);
        }
      }
    } catch (error) {
      console.log(">> hugging face error: ", error, "\n");
      HFAttempt++;
      await sleep(10_000);
    }
  }

  rl.close();
  removeLinesOrderly(filePath, getLines());
}

function removeLinesOrderly(filePath: string, num: number) {
  try {
    const content = fs.readFileSync(filePath, "utf8");
    const separator = "\n";
    const lines = content.split(separator);

    fs.writeFileSync(filePath, lines.slice(num).join(separator), "utf8");
    return true;
  } catch (error) {
    console.error(error);
    return false;
  }
}

async function appendWordIntoJSON(jsonpath: string, item: FormalWord) {
  const datasource = JSON.parse(fs.readFileSync(jsonpath, "utf-8"));
  const letter = item.word[0].toUpperCase();

  if (!datasource[letter]) {
    datasource[letter] = [item];
  } else {
    datasource[letter].push(item);
  }
  fs.writeFileSync(jsonpath, JSON.stringify(datasource), "utf-8");
}

function createRl(filePath: string) {
  const fileStream = fs.createReadStream(filePath);

  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity,
  });

  const iterator = rl[Symbol.asyncIterator]();
  let lines = 0;
  async function validNext() {
    let res = await iterator.next();
    lines++;
    while (!res.done) {
      if (res.value.trim()) {
        return res.value;
      } else {
        res = await iterator.next();
        lines++;
      }
    }
    return null;
  }

  return {
    rl,
    getLines: () => lines,
    validNext,
    close: () => rl.close(),
  };
}

type DictionaryapiResponse = {
  word: string;
  phonetic: string;
  phonetics: { text: string; audio?: string }[];
}[];

export async function phoneticsCall(
  word: string,
): Promise<{ us: string | null; uk: string | null }> {
  const res = await axios.get<DictionaryapiResponse>(
    `https://api.dictionaryapi.dev/api/v2/entries/en/${word}`,
  );
  const { data } = res;
  if (!Array.isArray(data)) {
    return { us: null, uk: null };
  }

  const us = data[0].phonetics?.find((v: { audio?: string }) =>
    v.audio?.includes("-us"),
  );

  const uk = data[0].phonetics?.find((v: { audio?: string }) =>
    v.audio?.includes("-uk"),
  );

  return { us: us?.text || null, uk: uk?.text || null };
}
