"use server";

import { CET4_WORD, CET6_WORD, IWord } from "../models/Word";
import { clientConnect } from "../db";
import mongoose from "mongoose";

export async function fetchWords(
  wordModel: typeof CET4_WORD | typeof CET6_WORD,
  count: number = 50
) {
  try {
    await clientConnect();
    return await mongoose
      .model(wordModel)
      .aggregate<IWord>([
        { $sample: { size: count } },
        {
          $project: {
            _id: 0,
            word: 1,
            "translations.translation": 1,
            "translations.type": 1,
          },
        },
      ])
      .then((list) => list);
  } catch (error) {
    console.error(error);
    return [];
  }
}
