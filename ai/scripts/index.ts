import dotenv from "dotenv";
import { qwenPlus } from "../modals/qwen";
import Oxford3000 from "@/assets/ai_vocabulary/Oxford3000.json";
import prompt from "../data/template/word";
import { batchCheck, batchTask, BatchUploadData } from "./batch";

dotenv.config();

async function main() {
  console.log(await batchCheck("batch_d8393c59-c5c6-47d4-8453-a04d34688590"));
  return;

  const data = getJsonlContent();
  await batchTask(data);
}

main();

function getJsonlContent() {
  const systemContent = prompt.systemPrompt();

  const list = Oxford3000["Z"];

  const jsonlContent = list.map(
    (word, i) =>
      ({
        custom_id: `request-${i}`,
        method: "POST",
        url: "/v1/chat/completions",
        body: {
          model: qwenPlus.name,
          messages: [
            { role: "system", content: systemContent },
            { role: "user", content: prompt.userPrompt(word) },
          ],
        },
      }) satisfies BatchUploadData,
  );

  return jsonlContent;
}
