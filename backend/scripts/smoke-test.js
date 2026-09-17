import assert from "node:assert/strict";
import "../src/config/env.js";
import { createApp } from "../src/app.js";
import { connectDatabase, disconnectDatabase } from "../src/config/database.js";

const mongoUri = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/chativo_assistant";
const originalGeminiApiKey = process.env.GEMINI_API_KEY;
process.env.GEMINI_API_KEY = "";

const checks = [
  ["Tell me about Chativo plans", "pricing", "answer", "deterministic-fallback"],
  ["What about phnoe and emails details?", "contact", "answer", "deterministic-fallback"],
  ["Chativo ka refund policy kya hai?", "refund", "answer", "deterministic-fallback"],
  ["Compare Claude vs Gemini", "website", "answer", "website-retrieval-fallback"],
  ["Does Chativo have an Android app?", "unknown", "refusal", "deterministic-fallback"],
  ["What is the Bitcoin price?", "refusal", "refusal", "scope-guard"],
  ["Who is the prime minister of Pakistan?", "refusal", "refusal", "scope-guard"]
];

let server;

try {
  await connectDatabase(mongoUri);
  server = createApp().listen(0);
  await new Promise(resolve => server.once("listening", resolve));

  const baseUrl = `http://127.0.0.1:${server.address().port}`;
  for (const [message, expectedIntent, expectedType, expectedMode] of checks) {
    const response = await fetch(`${baseUrl}/api/chat`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message })
    });
    const payload = await response.json();

    assert.equal(response.status, 200);
    assert.equal(payload.intent, expectedIntent);
    assert.equal(payload.type, expectedType);
    assert.equal(payload.assistantMode, expectedMode);
    console.log(`PASS ${expectedIntent}: ${message}`);
  }
} finally {
  if (server) {
    await new Promise((resolve, reject) => {
      server.close(error => error ? reject(error) : resolve());
    });
  }
  await disconnectDatabase();
  if (originalGeminiApiKey === undefined) delete process.env.GEMINI_API_KEY;
  else process.env.GEMINI_API_KEY = originalGeminiApiKey;
}
