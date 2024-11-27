import fs, { createReadStream } from "fs";
import path from "path";
import readline from "readline";

export type Letter = Uppercase<ReturnType<typeof getAlphabet>[number]>;

export function getAlphabet() {
  return [
    "a",
    "b",
    "c",
    "d",
    "e",
    "f",
    "g",
    "h",
    "i",
    "j",
    "k",
    "l",
    "m",
    "n",
    "o",
    "p",
    "q",
    "r",
    "s",
    "t",
    "u",
    "v",
    "w",
    "x",
    "y",
    "z",
  ] as const;
}

export function appendWithTimestamp(
  targetOutput: string,
  data: string,
  flag?: string,
) {
  const currentTime = new Date().toISOString();
  const formattedData = `[${currentTime}]${flag ? "-" + flag : ""}\n${data}\n`;

  if (!fs.existsSync(targetOutput)) {
    fs.writeFileSync(targetOutput, formattedData, "utf8");
  } else {
    fs.appendFileSync(targetOutput, formattedData, "utf8");
  }
}

export function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function handleJSONLFile(
  filePath: string,
  lineHandler: (line: string) => Promise<void>,
  from?: string,
) {
  const fileStream = fs.createReadStream(filePath);

  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity, // Recognize all instances of CR LF (\r\n) as line breaks
  });
  let start = Boolean(from) ? false : true;
  for await (const line of rl) {
    const trimedLine = line.trim();
    if (!start) {
      if (trimedLine.startsWith(from!)) {
        start = true;
      }
    } else {
      await lineHandler(trimedLine);
    }
  }
  if (!start) {
    throw new Error("cannot find the line start with: " + from);
  }
}

export function parseJsonString(str: string) {
  try {
    const match = str.match(/```json\n([\s\S]*?)\n```/);
    if (match?.[1]) {
      return JSON.parse(match[1]);
    } else {
      console.error(">> match error,", "\n", str);
      return null;
    }
  } catch (error) {
    console.error(">> parsing content error,", error, "\n", str);
    return null;
  }
}

export function pick(book: { [K in Letter]?: string[] }, ...letter: Letter[]) {
  return Object.assign({}, ...letter.map((v) => ({ [v]: book[v] })));
}

export async function rawToJSON(inputPath: string) {
  const rs = createReadStream(inputPath);

  const rl = readline.createInterface({
    input: rs,
    crlfDelay: Infinity, // Recognize all instances of CR LF (\r\n) as line breaks
  });

  const record: Record<string, string[]> = {};

  for await (const line of rl) {
    const trimedLine = line.trim();
    const letter = trimedLine[0].toUpperCase();
    if (!record[letter]) {
      record[letter] = [trimedLine];
    } else if (record[letter].includes(trimedLine)) {
      continue;
    } else {
      record[letter].push(trimedLine);
    }
  }

  return record;
}

export function ensureWriteFileSync(location: string, data: string) {
  const dir = path.dirname(location);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  if (!fs.existsSync(location)) {
    fs.writeFileSync(location, data, "utf8");
  } else {
    fs.appendFileSync(location, data, "utf8");
  }
}
