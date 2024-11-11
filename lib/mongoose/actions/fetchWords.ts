import { CET4WordModel } from "../models/Word";
import { clientConnect } from "../db";

export async function fetchWords() {
  await clientConnect();

  return await CET4WordModel.find({});
}
