import dotenv from "dotenv";
import { huggingfaceModalHandler, workWithUnitOfTask } from "./process";

dotenv.config();

async function main() {
  await workWithUnitOfTask(huggingfaceModalHandler);
}

main();
