import mongoose from "mongoose";
import { exit } from "process";
import { clientConnect } from "@/lib/mongoose/db";
import dotenv from "dotenv";
import * as readline from "readline";
import {
  OXFORD_3000_WORD,
  OXFORD_5000_WORD,
} from "@/lib/mongoose/models/FormalWord";
import { FormalWord } from "@/ai/data/template/word";
import { getAlphabet, Letter } from "@/utils/nodeUtils";

type FormalWordBook = {
  [K in Letter]?: FormalWord[];
};

const override = process.argv.includes("--override");
dotenv.config({ path: ".env" });

if (!process.env.MONGODB_URI) {
  throw new Error("Please add your MongoDB URI to the environment variables");
}

async function seedDB() {
  try {
    await clientConnect(process.env.MONGODB_URI);

    const vocabLoadders = [
      [
        OXFORD_3000_WORD,
        async () =>
          (await import("@/assets/ai_formated_words/oxford3000_partial.json"))
            .default as unknown as FormalWordBook,
      ],
      [
        OXFORD_5000_WORD,
        async () =>
          (await import("@/assets/ai_formated_words/Oxford_raw_5000.json"))
            .default as unknown as FormalWordBook,
      ],
    ] as const;

    for (let index = 0; index < vocabLoadders.length; index++) {
      const [modelName, loader] = vocabLoadders[index];
      const model = mongoose.model<FormalWord>(modelName);
      if ((await model.countDocuments()) > 0) {
        if (!override) {
          console.warn(
            `[WARNNING] Cancel the seeding as ${modelName} already exist, you can put '--override' to override all existing documents.`,
          );
          continue;
        } else {
          console.info(`emptying collections for[${modelName}]...`);
          model.deleteMany({});
        }
      }

      await insertNewVocabulary(await loader(), model);
    }
  } catch (err) {
    console.log(err);
  }
  await mongoose.connection.close();
  exit(0);
}

async function insertNewVocabulary(
  wordList: FormalWordBook,
  modal: mongoose.Model<FormalWord>,
) {
  console.info(`Inserting vocabulary: [${modal.modelName}]\n`);

  const alphabet = getAlphabet();

  for (let i = 0; i < alphabet.length; i++) {
    const letter = alphabet[i].toUpperCase();
    const item = wordList[letter as Letter];
    if (item) {
      for (let j = 0; j < item.length; j++) {
        const word = item[j];

        try {
          const instance = new modal(word);
          await instance.save();
        } catch (error) {
          console.log(
            `\n❌❌❌ ${error} \n ${JSON.stringify(word, null, 2)}\n`,
          );
        }

        if (j !== 0) {
          readline.clearLine(process.stdout, 0);
        }
        readline.cursorTo(process.stdout, 0);
        process.stdout.write(`Progress: ${letter} - ${j + 1}/${item.length}`);
      }
    }
  }

  console.info(
    `\n🚀🚀🚀 [insertNewVocabulary] done with collection [${modal.modelName}]!!\n`,
  );
}

seedDB();
