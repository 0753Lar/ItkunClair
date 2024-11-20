import path from "path";
import { handleJSONLFile } from "../utils";
import { successLogLocatioin } from "./batch";

import fs from "fs";

export async function processSuccessBatch() {
  const map: Record<string, unknown[]> = {};
  await handleJSONLFile(successLogLocatioin, async (line) => {
    try {
      if (!line || line.startsWith("[")) {
      } else {
        const data = JSON.parse(line);
        const result = parseJsonString(
          data.response.body.choices[0].message.content,
        );
        const firstLetter = result.word[0] as string;

        if (!firstLetter) {
          return console.log(">> cannot find firstLetter: ", result);
        }
        const letter = firstLetter.toUpperCase();
        if (!map[letter]) {
          map[letter] = [result];
        } else {
          map[letter].push(result);
        }
      }
    } catch (error) {
      console.info(">> parsing line error: \n", error, "\n", line);
    }
  });
  fs.writeFileSync(
    path.resolve(__dirname, "../data/success.json"),
    JSON.stringify(map),
    "utf8",
  );
}

function parseJsonString(str: string) {
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
