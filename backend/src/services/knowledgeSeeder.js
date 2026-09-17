import { knowledgeItems } from "../data/knowledge.js";
import { allTrainingQuestions } from "../data/allTrainingQuestions.js";
import { KnowledgeItem } from "../models/KnowledgeItem.js";
import { TrainingQuestion } from "../models/TrainingQuestion.js";
import { WebsitePage } from "../models/WebsitePage.js";
import { normalize } from "./questionClassifier.js";
import { getWebsiteDataset } from "./websiteKnowledge.js";

export async function seedKnowledge() {
  const operations = knowledgeItems.map(item => ({
    updateOne: {
      filter: { key: item.key },
      update: { $set: item },
      upsert: true
    }
  }));

  const questionOperations = allTrainingQuestions.map(item => ({
    updateOne: {
      filter: { normalizedQuestion: normalize(item.question) },
      update: {
        $set: {
          ...item,
          normalizedQuestion: normalize(item.question)
        }
      },
      upsert: true
    }
  }));

  const websiteDataset = getWebsiteDataset();
  const syncedAt = new Date(websiteDataset.generatedAt);
  const websiteOperations = websiteDataset.pages.map(page => ({
    updateOne: {
      filter: { url: page.url },
      update: { $set: { ...page, syncedAt } },
      upsert: true
    }
  }));

  await Promise.all([
    KnowledgeItem.bulkWrite(operations, { ordered: false }),
    TrainingQuestion.bulkWrite(questionOperations, { ordered: false }),
    WebsitePage.bulkWrite(websiteOperations, { ordered: false })
  ]);
}
