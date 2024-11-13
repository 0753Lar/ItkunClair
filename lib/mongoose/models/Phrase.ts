import mongoose from "mongoose";

export interface IPhrase {
  phrase: string;
  translation: string;
  wordId: mongoose.Schema.Types.ObjectId;
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
  wordId: { type: mongoose.Schema.Types.ObjectId, required: true },
});

export const CET4_PHRASE = "cet4_phrase";
export const CET6_PHRASE = "cet6_phrase";
