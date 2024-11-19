import fs from "fs";
import readline from "readline";

/**
 * @returns ['a','b','c',...,'z']
 */
export function getAlphabet() {
  const alphabet = Array.from({ length: 26 }, (_, i) =>
    String.fromCharCode(97 + i),
  );

  return alphabet;
}

export function appendWithTimestamp(targetOutput: string, data: string) {
  const currentTime = new Date().toISOString();
  const formattedData = `{"${currentTime}":${data}}\n`;

  if (!fs.existsSync(targetOutput)) {
    fs.writeFileSync(targetOutput, formattedData, "utf8");
  } else {
    fs.appendFileSync(targetOutput, formattedData, "utf8");
  }
}

export function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function readJSONLFile(
  filePath: string,
): Promise<unknown[] | null> {
  const fileStream = fs.createReadStream(filePath);

  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity, // Recognize all instances of CR LF (\r\n) as line breaks
  });

  const arr = [];

  for await (const line of rl) {
    if (line.trim()) {
      try {
        const jsonObject = JSON.parse(line);
        arr.push(jsonObject);
      } catch (error) {
        console.error("Invalid JSON line:\n", error);
        return null;
      }
    }
  }

  return arr;
}
