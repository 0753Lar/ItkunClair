import dotenv from "dotenv";
import { workWithUnitOfTask } from "./process";
dotenv.config();

async function main() {
  await workWithUnitOfTask();
}

main();
