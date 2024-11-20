import fs from "fs";
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
    console.error("cannot find the line start with: ", from);
  }
}
