import { HttpsProxyAgent } from "https-proxy-agent";
import { wordJsonSchema } from "../data/template/word";
import axios from "axios";

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
      timeout: 60_000,
      params: { cacheBuster: Date.now() },
      headers: {
        Authorization: `Bearer ${process.env.HUGGING_FACE_API_KEY}`,
        "Content-Type": "application/json",
        "Cache-Control": "no-cache",
      },
      httpAgent:
        process.argv[2] === "--proxy"
          ? new HttpsProxyAgent("http:localhost:7890")
          : undefined,
      httpsAgent:
        process.argv[2] === "--proxy"
          ? new HttpsProxyAgent("http:localhost:7890")
          : undefined,
    },
  );

  return res;
}
