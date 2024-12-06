"use server";

import { CET4_WORD, CET6_WORD, IWord } from "../models/Word";
import { clientConnect } from "../db";
import mongoose from "mongoose";
import { OXFORD_3000_WORD, OXFORD_5000_WORD } from "../models/FormalWord";
import { FormalWord } from "@/ai/data/template/word";

export async function fetchWords(
  wordModel: typeof CET4_WORD | typeof CET6_WORD,
  count: number = 50,
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

export async function fetchFormalWords(
  wordModel: typeof OXFORD_3000_WORD | typeof OXFORD_5000_WORD,
  count: number = 50,
) {
  try {
    await clientConnect();
    return await mongoose
      .model(wordModel)
      .aggregate<FormalWord>([
        { $sample: { size: count } },
        {
          $project: {
            _id: 0,
            word: 1,
            meaning: 1,
            phonetics: 1,
            "examples.context": 1,
            "examples.sentence": 1,
            "examples.translation": 1,
            "root_analysis.root": 1,
            "root_analysis.meaning": 1,
            "root_analysis.derived_words.word": 1,
            "root_analysis.derived_words.meaning": 1,
            "collocations.phrase": 1,
            "collocations.translation": 1,
            mnemonics: 1,
          },
        },
      ])
      .then((list) => list);
  } catch (error) {
    console.error(error);
    return [];
  }
}
