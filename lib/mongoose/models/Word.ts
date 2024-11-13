import mongoose from "mongoose";

export interface IWord {
  word: string;
  translations: {
    translation: string;
    type: string;
  }[];
}

export const wordSchema = new mongoose.Schema<IWord>({
  word: {
    type: String,
    required: true,
  },
  translations: [
    {
      translation: {
        type: String,
        required: true,
      },
      type: {
        type: String,
        required: true,
      },
    },
  ],
});

export const CET4_WORD = "cet4_word";
export const CET6_WORD = "cet6_word";
