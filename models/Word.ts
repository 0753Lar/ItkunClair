import mongoose from "mongoose";

export interface IWord {
  word: string;
  translations: {
    translation: string;
    type: string;
  }[];
  phraseIds: string[];
}

const translationSchema = new mongoose.Schema({
  translation: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    required: true,
  },
});

export const wordSchema = new mongoose.Schema<IWord>({
  word: {
    type: String,
    required: true,
  },
  translations: [
    {
      type: translationSchema,
      required: true,
    },
  ],
  phraseIds: [String],
});
