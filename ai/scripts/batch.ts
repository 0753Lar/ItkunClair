import dotenv from "dotenv";
import {
  appendWithTimestamp,
  getAlphabet,
  handleJSONLFile,
  Letter,
} from "../../utils/nodeUtils";
import path from "path";
import OpenAI, { toFile } from "openai";
import { sleep } from "../../utils/nodeUtils";
import { Modal } from "../modals/modalDefinition";
import { HttpsProxyAgent } from "https-proxy-agent";
import { systemPrompt, userPrompt } from "../data/template/word";

dotenv.config();

export const batchLogLocation = path.resolve(
  __dirname,
  "../data/batch_task.jsonl",
);
export const successLogLocatioin = path.resolve(
  __dirname,
  "../data/batch_success.jsonl",
);
export const errorLogLocatioin = path.resolve(
  __dirname,
  "../data/batch_error.jsonl",
);

export async function startBatch(
  book: { [K in Letter]?: string[] },
  model: Modal,
) {
  const alphabet = getAlphabet();
  const systemContent = systemPrompt();

  for (let i = 0; i < alphabet.length; i++) {
    const letter = alphabet[i].toUpperCase() as Letter;
    const list = book[letter];

    if (!list) {
      console.info(">> no letter in book: ", letter, book[letter]);
      continue;
    }

    const jsonlContent = list.map((word, i) => ({
      custom_id: `request-${letter}-${i}-${word.replaceAll(" ", "")}`,
      method: "POST",
      url: "/v1/chat/completions",
      body: {
        model: model.name,
        temperature: 0.5,
        messages: [
          { role: "system", content: systemContent },
          { role: "user", content: userPrompt(word) },
        ],
        max_tokens: 2048,
        response_format: {
          type: "json_object",
        },
      },
    }));

    process.stdout.write(
      `===============> Progress: ${i + 1}/${alphabet.length} ::Letter[${letter}] has [${list.length}] words in one batch `,
    );
    await batchTask(jsonlContent, letter);
  }
}
export async function batchResultHandle(from?: string) {
  try {
    const client = new OpenAI(getOpenAIConfig());

    await handleJSONLFile(
      batchLogLocation,
      async (line) => {
        if (line.startsWith("[")) {
        } else {
          const batch = JSON.parse(line) as OpenAI.Batches.Batch;
          const res = await client.batches.retrieve(batch.id);
          if (res.output_file_id) {
            const content = await client.files.content(res.output_file_id);
            appendWithTimestamp(successLogLocatioin, await content.text());
          }
          if (res.error_file_id) {
            const content = await client.files.content(res.error_file_id);
            appendWithTimestamp(errorLogLocatioin, await content.text());
          }
        }
      },
      from,
    );
  } catch (error) {
    console.log(`错误信息：${error}`);
    return null;
  }
}

export async function batchTask(data: unknown[], flag?: string) {
  const jsonl = data.map((v) => JSON.stringify(v)).join("\n");
  const blob = new Blob([jsonl]);
  const file = await toFile(blob, `vocabulary-${flag}.jsonl`);

  try {
    const client = new OpenAI(getOpenAIConfig());

    // 1. upload file
    const fileObj = await client.files.create({
      file,
      purpose: "batch",
    });
    console.log(`>> fileObj: [${flag}]`, fileObj);

    // 2. create batch task
    const batch = await client.batches.create({
      input_file_id: fileObj.id,
      endpoint: "/v1/chat/completions",
      completion_window: "24h",
    });

    console.log(`>> batch: [${flag}]`, batch);
    appendWithTimestamp(batchLogLocation, JSON.stringify(batch), flag);
  } catch (error) {
    console.error("Error during the request: \n", error);
    return null;
  }
}

export async function fileCheck(fileId: `file-${string}`) {
  try {
    const client = new OpenAI(getOpenAIConfig());
    const res = await client.files.content(fileId);
    console.log(res);
    return res;
  } catch (error) {
    console.log(`错误信息：${error}`);
    return null;
  }
}

export async function batchCheck(batchId: `batch_${string}`) {
  try {
    const client = new OpenAI(getOpenAIConfig());

    while (true) {
      const batch = await client.batches.retrieve(batchId);
      const currentTime = new Date().toISOString();
      console.log(
        `[${currentTime}] Logging after 2 minute of sleep, batch status is:`,
      );
      console.log(batch);

      await sleep(120_000);
    }
  } catch (error) {
    console.log(`错误信息：${error}`);
    return null;
  }
}

export function getOpenAIConfig() {
  const isOpenAI = !!process.env.OPENAI_API_KEY;
  const apiKey = isOpenAI
    ? process.env.OPENAI_API_KEY
    : process.env.DASHSCOPE_API_KEY;
  const httpAgent = isOpenAI
    ? new HttpsProxyAgent("http:localhost:7890")
    : undefined;

  if (!apiKey) {
    throw new Error("Please provide any of the API KEY!!!");
  }
  const baseURL = isOpenAI
    ? "https://api.openai.com/v1"
    : "https://dashscope.aliyuncs.com/compatible-mode/v1";
  return {
    apiKey,
    baseURL,
    httpAgent,
  };
}
