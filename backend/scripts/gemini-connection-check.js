import assert from "node:assert/strict";
import "../src/config/env.js";
import { geminiAssistant } from "../src/services/geminiAssistant.js";

if (!geminiAssistant.isConfigured()) {
  console.error("GEMINI_API_KEY is empty in backend/.env.");
  process.exit(1);
}

const result = await geminiAssistant.classify(
  "Mujhe Chativo ke tamam packages ki qeemat bata dein"
);

assert.ok(result, "Gemini returned no usable classification.");
assert.equal(result.intent, "pricing");
assert.equal(result.language, "roman_urdu");

console.log(`Gemini connection passed with intent=${result.intent} language=${result.language}.`);

