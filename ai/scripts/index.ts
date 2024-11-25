import dotenv from "dotenv";
import path from "path";
import { batchSync, getTaskPath } from "./batchSync";

dotenv.config();

async function main() {
  const targetRaw = path.resolve(
    __dirname,
    "../data/raw/",
    (await getTaskPath()).trim(),
  );

  await batchSync(targetRaw);
}

main();
