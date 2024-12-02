import dotenv from "dotenv";
import { localModelhandler, workWithUnitOfTask } from "./process";

dotenv.config();

async function main() {
  await workWithUnitOfTask(localModelhandler);
}

main();
