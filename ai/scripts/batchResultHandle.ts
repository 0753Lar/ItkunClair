import path from "path";
import { readJSONLFile } from "../utils";
import fs from "fs";

export async function batchResultHandle() {
  const resultFile = path.resolve(__dirname, "../data/batch_result.jsonl");

  const arr = await readJSONLFile(resultFile);

  if (!arr) {
    return;
  }

  const targetOutput = path.resolve(
    __dirname,
    "../data/batch_result_precessed.jsonl",
  );

  fs.writeFileSync(targetOutput, JSON.stringify(arr), "utf8");
}
