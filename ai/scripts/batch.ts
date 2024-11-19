import dotenv from "dotenv";
import { appendWithTimestamp } from "../utils";
import path from "path";
import OpenAI, { toFile } from "openai";
import { sleep } from "../utils";

dotenv.config();

export async function batchTask(data: BatchUploadData[]) {
  const jsonl = data.map((v) => JSON.stringify(v)).join("\n");
  const blob = new Blob([jsonl]);
  const file = await toFile(blob, "test.jsonl");

  try {
    const client = new OpenAI({
      apiKey: process.env.DASHSCOPE_API_KEY,
      baseURL: "https://dashscope.aliyuncs.com/compatible-mode/v1",
    });

    // 1. upload file
    const fileObj = await client.files.create({
      file,
      purpose: "batch",
    });
    console.log(">> fileObj", fileObj);

    // 2. create batch task
    const batch = await client.batches.create({
      input_file_id: fileObj.id,
      endpoint: "/v1/chat/completions",
      completion_window: "24h",
    });

    const targetOutput = path.resolve(__dirname, "../data/batch_task.jsonl");
    console.log(">> batch: ", batch);
    appendWithTimestamp(targetOutput, JSON.stringify(batch));

    // 3. wait for process result
    await batchCheck(batch.id as `batch_${string}`);
  } catch (error) {
    console.error("Error during the request: \n", error);
    return null;
  }
}

export async function batchCheck(batchId: `batch_${string}`) {
  try {
    const client = new OpenAI({
      apiKey: process.env.DASHSCOPE_API_KEY,
      baseURL: "https://dashscope.aliyuncs.com/compatible-mode/v1",
    });

    while (true) {
      const batch = await client.batches.retrieve(batchId);
      const currentTime = new Date().toISOString();
      console.log(
        `[${currentTime}] Logging after 1 minute of sleep, batch status is:`,
      );
      console.log(batch);

      await sleep(120_000);
    }
  } catch (error) {
    console.log(`错误信息：${error}`);
    console.log(
      "请参考文档：https://help.aliyun.com/zh/model-studio/developer-reference/error-code",
    );
    return null;
  }
}

export async function batchResultDownload(
  output_file_id: `file-batch_output-${string}`,
) {
  try {
    const client = new OpenAI({
      apiKey: process.env.DASHSCOPE_API_KEY,
      baseURL: "https://dashscope.aliyuncs.com/compatible-mode/v1",
    });

    const content = await client.files.content(output_file_id);

    const targetOutput = path.resolve(__dirname, "../data/batch_result.jsonl");
    appendWithTimestamp(targetOutput, await content.text());
  } catch (error) {
    console.log(`错误信息：${error}`);
    console.log(
      "请参考文档：https://help.aliyun.com/zh/model-studio/developer-reference/error-code",
    );
    return null;
  }
}

export type BatchUploadData = {
  custom_id: `request-${string}`;
  method: "POST";
  url: "/v1/chat/completions";
  body: {
    model: string;
    messages: [
      { role: "system"; content: string },
      { role: "user"; content: string },
    ];
  };
};
