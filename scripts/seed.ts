import mongoose from "mongoose";
import {
  CET4PhraseModel,
  CET6PhraseModel,
  IPhrase,
} from "@/lib/mongoose/models/Phrase";
import {
  CET4WordModel,
  CET6WordModel,
  IWord,
} from "@/lib/mongoose/models/Word";
import { exit } from "process";
import { clientConnect } from "@/lib/mongoose/db";
import dotenv from "dotenv";

const override = process.argv.includes("--override");
dotenv.config({ path: ".env.local" });

if (!process.env.MONGODB_URI) {
  throw new Error("Please add your MongoDB URI to the environment variables");
}

interface WordJson {
  word: string;
  translations: { translation: string; type: string }[];
  phrases?: { phrase: string; translation: string }[];
}

async function seedDB() {
  try {
    await clientConnect(process.env.MONGODB_URI);

    if (!override) {
      const models = [
        CET4WordModel,
        CET4PhraseModel,
        CET6WordModel,
        CET6PhraseModel,
      ];

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

    await CET4WordModel.deleteMany({});
    await CET6WordModel.deleteMany({});
    await CET4PhraseModel.deleteMany({});
    await CET6PhraseModel.deleteMany({});

    const CET4 = (await import("@/assets/vocabulary/CET-4.json")).default;
    await insertNewVocabulary(
      CET4 as WordJson[],
      CET4WordModel,
      CET4PhraseModel
    );

    const CET6 = (await import("@/assets/vocabulary/CET-6.json")).default;
    await insertNewVocabulary(
      CET6 as WordJson[],
      CET6WordModel,
      CET6PhraseModel
    );
  } catch (err) {
    console.log(err);
  }
  await mongoose.connection.close();
  exit(0);
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
    `\n🚀🚀🚀 [insertNewVocabulary] done with collection [${WordModel.modelName}] and [${PhraseModel.modelName}]!!\n`
  );
}

seedDB();
