import { ensureWriteFileSync, sleep } from "@/utils/nodeUtils";
import axios from "axios";
import fs from "fs";
import readline from "readline";
import { FormalWord, userPrompt } from "../data/template/word";
import path from "path";
import { huggingfaceCall } from "./huggingfaceCall";
import { copyRawIfNotExist, getTaskPath, isFileEmpty } from "./batchSync";

let HFAttempt = 0;

export async function workWithUnitOfTask() {
  if (HFAttempt >= 10) {
    console.log("-------------------REACH MAX ATTEMPT---------------");
    return;
  }
  const taskPath = await getTaskPath();

  const { getLines, validNext, close } = createRl(taskPath);

  const line = await validNext();
  if (!line) {
    return;
  }
  const targetRaw = path.resolve(__dirname, "../data/raw/", line);
  const copyRawPath = copyRawIfNotExist(targetRaw);
  const isAllFinished = await isFileEmpty(copyRawPath);
  if (isAllFinished) {
    fs.unlinkSync(copyRawPath);
    close();
    if (!removeLinesOrderly(taskPath, getLines())) {
      throw new Error("failed to remove line");
    }
    return await workWithUnitOfTask();
  } else {
    await processUnitOfFile(copyRawPath);
  }
}
async function processUnitOfFile(filePath: string) {
  const targetOutputPath = filePath.split(".").join("_result.");
  const { getLines, rl } = createRl(filePath);
  let count = 0;
  let lineRemoved = false;
  for await (const line of rl) {
    if (!line.trim()) {
      continue;
    }
    if (!lineRemoved) {
      console.log(`>============================> In progress word: [${line}]`);
      let success = false;
      while (!success) {
        count++;
        const content = userPrompt(line.trim());
        try {
          const res = await huggingfaceCall(content);
          const text = res.data[0].generated_text;
          if (text) {
            try {
              const obj = JSON.parse(text) as FormalWord; // check the result parsable or not
              if (obj.word == line.trim()) {
                ensureWriteFileSync(
                  targetOutputPath,
                  JSON.stringify(obj) + "\n",
                );
                success = true;
                process.stdout.write(
                  `>============================> Finished: [${line.trim()}] with ${count} times`,
                );
              }
            } catch (error) {
              console.log(">> Parsing error: ", error, "\n");
            }
          }
        } catch (error) {
          console.log(">> hugging face error: ", error, "\n");
          HFAttempt++;
          await sleep(100_000);
        }
      }
      lineRemoved = true;
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

const sourcePath = path.resolve(__dirname, "../data/data.json");
if (!fs.existsSync(sourcePath)) {
  fs.writeFileSync(sourcePath, JSON.stringify({}), "utf-8");
}

export async function appendWordIntoJSON(jsonpath: string, item: FormalWord) {
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

export async function readlineFromRawResult(
  rawPath: string,
  rawResultPath: string,
) {
  const rawFileStream = fs.createReadStream(rawPath);
  const rawResultFileStream = fs.createReadStream(rawResultPath);

  const rawRl = readline.createInterface({
    input: rawFileStream,
    crlfDelay: Infinity,
  });

  const rawResultRl = readline.createInterface({
    input: rawResultFileStream,
    crlfDelay: Infinity,
  });

  const rawIterator = rawRl[Symbol.asyncIterator]();
  const rawResultIterator = rawResultRl[Symbol.asyncIterator]();

  while (true) {
    const [rawLine, rawResultLine] = await Promise.all([
      rawIterator.next(),
      rawResultIterator.next(),
    ]);

    if (rawLine.done || rawResultLine.done) {
      break;
    }

    const obj: FormalWord = JSON.parse(rawResultLine.value.trim());

    // const { us, uk } = await phoneticsCall(obj.word);
    // if (us) {
    //   obj.phonetics.us = us;
    // }
    // if (uk) {
    //   obj.phonetics.uk = uk;
    // }
    appendWordIntoJSON(sourcePath, obj);
  }
  rawRl.close();
  rawResultRl.close();
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
