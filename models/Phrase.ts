import mongoose from "mongoose";

export interface IPhrase {
  phrase: string;
  translation: string;
}

export const phraseSchema = new mongoose.Schema<IPhrase>({
  phrase: {
    type: String,
    required: true,
  },
  translation: {
    type: String,
    required: true,
  },
});
