import mongoose from "mongoose";
import {
  CET4_PHRASE,
  CET6_PHRASE,
  IPhrase,
} from "@/lib/mongoose/models/Phrase";
import { CET4_WORD, CET6_WORD, IWord } from "@/lib/mongoose/models/Word";
import { exit } from "process";
import { clientConnect } from "@/lib/mongoose/db";
import dotenv from "dotenv";
import * as readline from "readline";

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

    const models = [
      mongoose.model(CET4_WORD),
      mongoose.model(CET6_WORD),
      mongoose.model(CET4_PHRASE),
      mongoose.model(CET6_PHRASE),
    ];

    if (!override) {
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

    console.info("emptying collections...");
    models.forEach((m) => m.deleteMany({}));

    const CET4 = (await import("@/assets/vocabulary/CET-4.json")).default;
    await insertNewVocabulary(
      CET4 as WordJson[],
      mongoose.model<IWord>(CET4_WORD),
      mongoose.model<IPhrase>(CET4_PHRASE)
    );

    const CET6 = (await import("@/assets/vocabulary/CET-6.json")).default;
    await insertNewVocabulary(
      CET6 as WordJson[],
      mongoose.model<IWord>(CET6_WORD),
      mongoose.model<IPhrase>(CET6_PHRASE)
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
  console.info(
    `Inserting vocabulary: [${WordModel.modelName}] and [${PhraseModel.modelName}]\n`
  );
  for (let i = 0; i < wordList.length; i++) {
    const item = wordList[i];
    try {
      const word = new WordModel({
        word: item.word,
        translations: item.translations,
      });
      await word.save();

      const arr = item.phrases?.map((v) => ({ ...v, wordId: word._id })) || [];
      await PhraseModel.insertMany(arr, {
        ordered: false,
      });

      if (i !== 0) {
        readline.clearLine(process.stdout, 0);
      }
      readline.cursorTo(process.stdout, 0);
      process.stdout.write(`Progress: ${i + 1}/${wordList.length}`);
    } catch (error) {
      console.log(`\n❌❌❌ ${JSON.stringify(item, null, 2)}\n ${error}`);
    }
  }
  console.info(
    `\n🚀🚀🚀 [insertNewVocabulary] done with collection [${WordModel.modelName}] and [${PhraseModel.modelName}]!!\n`
  );
}

seedDB();
