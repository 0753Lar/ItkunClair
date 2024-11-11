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

export const CET4_WORD = "cet4_word";
export const CET6_WORD = "cet6_word";

const CET4WordModel = mongoose.modelNames().includes(CET4_WORD)
  ? mongoose.model(CET4_WORD)
  : mongoose.model(CET4_WORD, wordSchema);

const CET6WordModel = mongoose.modelNames().includes(CET6_WORD)
  ? mongoose.model(CET6_WORD)
  : mongoose.model(CET6_WORD, wordSchema);

export { CET4WordModel, CET6WordModel };
