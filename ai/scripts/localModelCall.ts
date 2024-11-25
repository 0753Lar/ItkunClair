import axios from "axios";

export async function localModelCall(prompt: string) {
  const res = await axios.post("http://localhost:11434/api/generate", {
    model: "mistral:7b-instruct",
    prompt,
    stream: false,
    format: "json",
    options: {
      temperature: 0.5,
    },
  });

  return res;
}
