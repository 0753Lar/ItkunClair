import {
  ensureWriteFileSync,
  getAlphabet,
  Letter,
  parseJsonString,
} from "@/utils/nodeUtils";
import { HttpsProxyAgent } from "https-proxy-agent";
import { userPrompt, wordJsonSchema } from "../data/template/word";
import path from "path";
import readline from "readline";
import axios from "axios";

const huggingfaceLogLocation = path.resolve(
  __dirname,
  "../data/huggingfaceParsedResult.jsonl",
);

export async function huggingfaceBatch(book: { [K in Letter]?: string[] }) {
  const alphabet = getAlphabet();

  for (let i = 0; i < alphabet.length; i++) {
    const letter = alphabet[i].toUpperCase() as Letter;
    const list = book[letter];

    if (!list) {
      continue;
    }

    process.stdout.write(
      `===============> Progress: ${i + 1}/${alphabet.length} ::Letter[${letter}] has [${list.length}] words in one batch \n`,
    );

    for (let j = 0; j < list.length; j++) {
      const word = list[j];
      let isValid = false;
      let jsonObj = null;
      while (!isValid) {
        const res = await huggingfaceCall(userPrompt(word));
        const parsedContent = parseJsonString(res.data[0].generated_text ?? "");
        if (parsedContent) {
          isValid = true;
          jsonObj = parsedContent;
        }
      }

      ensureWriteFileSync(huggingfaceLogLocation, JSON.stringify(jsonObj));

      if (j !== 0) {
        readline.clearLine(process.stdout, 0);
      }
      readline.cursorTo(process.stdout, 0);
      process.stdout.write(`Finished: ${word} - ${j + 1}/${list.length}`);
    }
  }
}

export async function huggingfaceCall(userContent: string) {
  const res = await axios.post(
    "https://api-inference.huggingface.co/models/Qwen/Qwen2.5-Coder-32B-Instruct",
    {
      inputs: userContent,
      parameters: {
        temperature: 0.5,
        max_new_tokens: 3000,
        return_full_text: false,
        grammar: {
          type: "json",
          value: wordJsonSchema,
        },
      },
      stream: false,
    },
    {
      headers: {
        Authorization: `Bearer ${process.env.HUGGING_FACE_API_KEY}`,
        "Content-Type": "application/json",
      },
      httpAgent: new HttpsProxyAgent("http:localhost:7890"),
      httpsAgent: new HttpsProxyAgent("http:localhost:7890"),
    },
  );

  return res;
}
