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

export const CET4_PHRASE = "cet4_phrase";
export const CET6_PHRASE = "cet6_phrase";

const CET4PhraseModel = mongoose.modelNames().includes(CET4_PHRASE)
  ? mongoose.model(CET4_PHRASE)
  : mongoose.model(CET4_PHRASE, phraseSchema);
const CET6PhraseModel = mongoose.modelNames().includes(CET6_PHRASE)
  ? mongoose.model(CET6_PHRASE)
  : mongoose.model(CET6_PHRASE, phraseSchema);

export { CET4PhraseModel, CET6PhraseModel };
