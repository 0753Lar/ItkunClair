import mongoose from "mongoose";
import { CET4_WORD, CET6_WORD, wordSchema } from "./models/Word";
import { CET4_PHRASE, CET6_PHRASE, phraseSchema } from "./models/Phrase";

export async function clientConnect(url?: string) {
  await mongoose.connect(url || process.env.MONGODB_URI || "");
  buildModal();
  return mongoose.connection;
}

function buildModal() {
  const modelNames = mongoose.modelNames();
  if (!modelNames.includes(CET4_WORD)) {
    mongoose.model(CET4_WORD, wordSchema);
  }
  if (!modelNames.includes(CET6_WORD)) {
    mongoose.model(CET6_WORD, wordSchema);
  }
  if (!modelNames.includes(CET4_PHRASE)) {
    mongoose.model(CET4_PHRASE, phraseSchema);
  }
  if (!modelNames.includes(CET6_PHRASE)) {
    mongoose.model(CET6_PHRASE, phraseSchema);
  }
}

const gracefulShutdown = async () => {
  try {
    await mongoose.connection.close();
    console.log("Mongoose connection closed due to server shutdown");
    process.exit(0);
  } catch (error) {
    console.error("Error during Mongoose connection close:", error);
    process.exit(1);
  }
};

// Handle termination signals
process.on("SIGINT", gracefulShutdown); // Interrupt signal (e.g., Ctrl+C)
process.on("SIGTERM", gracefulShutdown); // Termination signal (e.g., from Kubernetes or hosting platform)
