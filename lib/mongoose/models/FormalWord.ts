import { FormalWord } from "@/ai/data/template/word";
import mongoose from "mongoose";

export const FormalWordSchema = new mongoose.Schema<FormalWord>({
  word: { type: String, required: true },
  meaning: {
    type: Map,
    of: String,
    required: true,
  },
  phonetics: {
    us: { type: String, required: true },
    uk: { type: String, required: true },
  },
  examples: [
    {
      context: { type: String, required: true },
      sentence: { type: String, required: true },
      translation: { type: String, required: true },
    },
  ],
  root_analysis: {
    root: { type: String, required: true },
    meaning: { type: String, required: true },
    derived_words: [
      {
        word: { type: String, required: true },
        meaning: { type: String, required: true },
      },
    ],
  },
  collocations: [
    {
      phrase: { type: String, required: true },
      translation: { type: String, required: true },
    },
  ],
  mnemonics: { type: String, required: true },
});

export const OXFORD_3000_WORD = "oxford_3000_word";
export const OXFORD_5000_WORD = "oxford_5000_word";
