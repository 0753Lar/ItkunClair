import dotenv from "dotenv";
import path from "path";
import { batchSync } from "./batchSync";
dotenv.config();

async function main() {
  await batchSync(path.resolve(__dirname, "../data/raw/Oxford_raw_5000.txt"));
}

main();
