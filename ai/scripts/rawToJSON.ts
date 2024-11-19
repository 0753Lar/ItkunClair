import fs, { createReadStream } from "fs";
import readline from "readline";

export async function rawToJSON(inputPath: string, outputPath: string) {
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

  fs.writeFileSync(outputPath, JSON.stringify(record), "utf-8");
}
