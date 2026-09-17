import "../src/config/env.js";
import { connectDatabase, disconnectDatabase } from "../src/config/database.js";
import { knowledgeItems } from "../src/data/knowledge.js";
import { allTrainingQuestions } from "../src/data/allTrainingQuestions.js";
import { getWebsiteDataset } from "../src/services/websiteKnowledge.js";
import { seedKnowledge } from "../src/services/knowledgeSeeder.js";

const mongoUri = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/chativo_assistant";

try {
  await connectDatabase(mongoUri);
  await seedKnowledge();
  const websiteDataset = getWebsiteDataset();
  console.log(`Seeded ${knowledgeItems.length} answers, ${allTrainingQuestions.length} bilingual training questions, and ${websiteDataset.pageCount} website pages.`);
} finally {
  await disconnectDatabase();
}
