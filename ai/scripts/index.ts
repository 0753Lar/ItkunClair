import dotenv from "dotenv";
import { batchCheck, batchResultHandle, fileCheck } from "./batch";
import { processSuccessBatch } from "./processSuccessBatch";

dotenv.config();

async function main() {
  await processSuccessBatch();
}

main();
