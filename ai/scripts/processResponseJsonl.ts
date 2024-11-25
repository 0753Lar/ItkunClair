import {
  appendWithTimestamp,
  handleJSONLFile,
  parseJsonString,
} from "../../utils/nodeUtils";
import path from "path";
import fs from "fs";

export async function processResponseJsonl(
  inputJsonlLocation: string,
  outputJsonLocation: string,
  errorJsonlLocation?: string,
  isBatch?: boolean,
) {
  const map: Record<string, unknown[]> = {};
  const errorArr: string[] = [];
  await handleJSONLFile(inputJsonlLocation, async (line) => {
    if (!line || line.startsWith("[")) {
    } else {
      const data = JSON.parse(line);
      const result = parseJsonString(
        isBatch
          ? data.response.body.choices[0].message.content
          : data.choices[0].message.content,
      );
      if (!result) {
        errorArr.push(line);
        return;
      }
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
  });
  fs.writeFileSync(outputJsonLocation, JSON.stringify(map), "utf8");

  if (!errorJsonlLocation) {
    errorJsonlLocation = path.resolve(__dirname, "../data/error.jsonl");
  }
  if (errorArr.length) {
    for (let i = 0; i < errorArr.length; i++) {
      const element = errorArr[i];
      await appendWithTimestamp(errorJsonlLocation, element);
    }
  }
}
