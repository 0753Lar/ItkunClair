import mongoose from "mongoose";
import {
  FormalWordSchema,
  OXFORD_3000_WORD,
  OXFORD_5000_WORD,
} from "./models/FormalWord";

export async function clientConnect(url?: string) {
  await mongoose.connect(url || process.env.MONGODB_URI || "");
  buildModal();
  return mongoose.connection;
}

function buildModal() {
  const modelNames = mongoose.modelNames();
  if (!modelNames.includes(OXFORD_3000_WORD)) {
    mongoose.model(OXFORD_3000_WORD, FormalWordSchema);
  }
  if (!modelNames.includes(OXFORD_5000_WORD)) {
    mongoose.model(OXFORD_5000_WORD, FormalWordSchema);
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
