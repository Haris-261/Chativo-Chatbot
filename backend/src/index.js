import "./config/env.js";
import { createApp } from "./app.js";
import { connectDatabase, disconnectDatabase } from "./config/database.js";
import { seedKnowledge } from "./services/knowledgeSeeder.js";

const port = Number(process.env.PORT) || 5000;
const mongoUri = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/chativo_assistant";

async function connectWithRetry(uri, attempts = 120) {
  for (let attempt = 1; attempt <= attempts; attempt += 1) {
    try {
      return await connectDatabase(uri);
    } catch (error) {
      if (attempt === attempts) throw error;
      if (attempt === 1 || attempt % 10 === 0) {
        console.log(`Waiting for MongoDB (${attempt}/${attempts})...`);
      }
      await new Promise(resolve => setTimeout(resolve, 2000));
    }
  }
}

try {
  await connectWithRetry(mongoUri);
  console.log('Connected to database successfully');
  await seedKnowledge();
  const server = createApp().listen(port, () => {
    console.log(`Chativo API listening on http://localhost:${port}`);
  });

  async function shutdown(signal) {
    console.log(`${signal} received. Closing Chativo API.`);
    server.close(async () => {
      await disconnectDatabase();
      process.exit(0);
    });
  }

  process.on("SIGINT", () => shutdown("SIGINT"));
  process.on("SIGTERM", () => shutdown("SIGTERM"));
} catch (error) {
  console.error("Unable to start the Chativo API:", error.message);
  process.exit(1);
}
