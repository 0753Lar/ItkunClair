import dotenv from "dotenv";
import path from "path";
import { batchSync, getTaskPath } from "./batchSync";
import fs from "fs";
dotenv.config();

async function main() {
  const taskPath = fs.readFileSync(await getTaskPath(), "utf-8").trim();
  const targetRaw = path.resolve(__dirname, "../data/raw/", taskPath);

  await batchSync(targetRaw);
}

main();
