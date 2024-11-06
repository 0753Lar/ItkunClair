import dbConnect from "@/lib/dbConnect";
import mongoose from "mongoose";
import { IPhrase, phraseSchema } from "@/models/Phrase";
import { IWord, wordSchema } from "@/models/Word";
import { exit } from "process";

const override = process.argv.includes("--override");

interface WordJson {
  word: string;
  translations: { translation: string; type: string }[];
  phrases?: { phrase: string; translation: string }[];
}

async function seedDB() {
  try {
    await dbConnect();

    const CET4Word = mongoose.model("cet4_word", wordSchema);
    const CET6Word = mongoose.model("cet6_word", wordSchema);
    const CET4Phrase = mongoose.model("cet4_phrase", phraseSchema);
    const CET6Phrase = mongoose.model("cet6_phrase", phraseSchema);

    if (!override) {
      const models = [CET4Word, CET4Phrase, CET6Word, CET6Phrase];

      for (const model of models) {
        const count = await model.countDocuments();

        if (count > 0) {
          console.warn(
            `[WARNNING] Cancel the seeding as ${model.modelName} already exist, you can put '--override' to override all existing documents.`
          );
          exit(0);
        }
      }
    }

    await CET4Word.deleteMany({});
    await CET6Word.deleteMany({});
    await CET4Phrase.deleteMany({});
    await CET6Phrase.deleteMany({});

    const CET4: WordJson[] = (await import("@/assets/vocabulary/CET-4.json"))
      .default;
    await insertNewVocabulary(CET4, CET4Word, CET4Phrase);

    const CET6: WordJson[] = (await import("@/assets/vocabulary/CET-6.json"))
      .default;
    await insertNewVocabulary(CET6, CET6Word, CET6Phrase);
    exit(0);
  } catch (err) {
    console.log(err);
  }
}

async function insertNewVocabulary(
  wordList: WordJson[],
  WordModel: mongoose.Model<IWord>,
  PhraseModel: mongoose.Model<IPhrase>
) {
  for (let i = 0; i < wordList.length; i++) {
    const item = wordList[i];
    try {
      const doc = await PhraseModel.insertMany(item.phrases ?? [], {
        ordered: false,
      });
      const word = new WordModel({
        word: item.word,
        translations: item.translations,
        phraseIds: doc.map((field) => field._id),
      });

      await word.save();
    } catch (error) {
      console.log(`❌❌❌ ${JSON.stringify(item, null, 2)}\n ${error}`);
    }
  }
  console.info(
    `🚀🚀🚀 [insertNewVocabulary] done with collection [${WordModel.modelName}] and [${PhraseModel.modelName}]!!`
  );
}

seedDB();
