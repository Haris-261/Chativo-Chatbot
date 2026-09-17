import { knowledgeItems } from "../src/data/knowledge.js";
import { allTrainingQuestions } from "../src/data/allTrainingQuestions.js";
import { classifyQuestion, normalize } from "../src/services/questionClassifier.js";

const knowledgeKeys = new Set(knowledgeItems.map(item => item.key));
const seenQuestions = new Map();
const failures = [];

for (const sample of allTrainingQuestions) {
  const normalizedQuestion = normalize(sample.question);
  const existingIntent = seenQuestions.get(normalizedQuestion);

  if (existingIntent && existingIntent !== sample.intent) {
    failures.push({
      question: sample.question,
      expected: sample.intent,
      actual: `duplicate of ${existingIntent}`
    });
    continue;
  }

  seenQuestions.set(normalizedQuestion, sample.intent);

  if (!knowledgeKeys.has(sample.intent)) {
    failures.push({
      question: sample.question,
      expected: sample.intent,
      actual: "missing knowledge record"
    });
    continue;
  }

  const actualIntent = classifyQuestion(sample.question).intent;
  if (actualIntent !== sample.intent) {
    failures.push({
      question: sample.question,
      expected: sample.intent,
      actual: actualIntent
    });
  }
}

const total = allTrainingQuestions.length;
const passed = total - failures.length;
const accuracy = total === 0 ? 0 : (passed / total) * 100;

console.log(`Catalog intent accuracy: ${passed}/${total} (${accuracy.toFixed(2)}%)`);

if (failures.length > 0) {
  console.log("\nFailed cases:");
  for (const failure of failures) {
    console.log(`- ${failure.question}\n  expected=${failure.expected} actual=${failure.actual}`);
  }
  process.exitCode = 1;
} else {
  console.log("Every catalog question maps to its expected grounded response.");
}
