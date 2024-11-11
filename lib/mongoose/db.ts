import mongoose from "mongoose";

export async function clientConnect(url?: string) {
  await mongoose.connect(url || process.env.MONGODB_URI || "");

  return mongoose.connection;
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
