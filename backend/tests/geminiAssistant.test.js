import assert from "node:assert/strict";
import test from "node:test";
import {
  createGeminiAssistant,
  looksLikeRomanUrdu
} from "../src/services/geminiAssistant.js";

test("detects common Roman Urdu wording", () => {
  assert.equal(looksLikeRomanUrdu("Chativo ke plans kitne ke hain?"), true);
  assert.equal(looksLikeRomanUrdu(
    "chativo meri help kese kr skta hai jo doosre chatbot nhi kr skte?"
  ), true);
  assert.equal(looksLikeRomanUrdu("What are the Chativo plans?"), false);
});

test("uses structured Gemini classification", async () => {
  const client = {
    models: {
      generateContent: async () => ({
        text: JSON.stringify({ intent: "contact", language: "roman_urdu", confidence: 0.97 })
      })
    }
  };
  const assistant = createGeminiAssistant({ client, model: "test-model" });
  const result = await assistant.classify("Phone aur email bata dein");

  assert.deepEqual(result, {
    intent: "contact",
    type: "answer",
    language: "roman_urdu",
    confidence: 0.97
  });
});

test("accepts JSON wrapped in harmless Gemini response prose", async () => {
  const client = {
    models: {
      generateContent: async () => ({
        text: 'Here is the result:\n```json\n{"intent":"pricing","language":"roman_urdu","confidence":0.98}\n```'
      })
    }
  };
  const assistant = createGeminiAssistant({ client });
  const result = await assistant.classify("Chativo ke plans ki qeemat kya hai?");

  assert.equal(result.intent, "pricing");
  assert.equal(result.language, "roman_urdu");
});

test("retries a temporary Gemini availability error", async () => {
  let attempts = 0;
  const client = {
    models: {
      generateContent: async () => {
        attempts += 1;
        if (attempts === 1) throw new Error("503 UNAVAILABLE");
        return {
          text: JSON.stringify({ intent: "pricing", language: "english", confidence: 0.96 })
        };
      }
    }
  };
  const assistant = createGeminiAssistant({ client, retryDelayMs: 0 });
  const result = await assistant.classify("What do the Chativo plans cost?");

  assert.equal(result.intent, "pricing");
  assert.equal(attempts, 2);
});

test("retries classification when Gemini returns text without JSON", async () => {
  let attempts = 0;
  let requestConfig;
  const client = {
    models: {
      generateContent: async request => {
        attempts += 1;
        requestConfig = request.config;
        if (attempts === 1) return { text: "I will classify this request." };
        return {
          text: JSON.stringify({ intent: "pricing", language: "roman_urdu", confidence: 0.98 })
        };
      }
    }
  };
  const assistant = createGeminiAssistant({ client, retryDelayMs: 0 });
  const result = await assistant.classify("Chativo ke packages ki qeemat bata dein");

  assert.equal(result.intent, "pricing");
  assert.equal(attempts, 2);
  assert.equal(requestConfig.maxOutputTokens, 512);
  assert.equal(requestConfig.thinkingConfig.thinkingLevel, "low");
});

test("rejects a low-confidence Gemini classification", async () => {
  const client = {
    models: {
      generateContent: async () => ({
        text: JSON.stringify({ intent: "pricing", language: "english", confidence: 0.4 })
      })
    }
  };
  const assistant = createGeminiAssistant({ client });

  assert.equal(await assistant.classify("unclear message"), null);
});

test("rewrites only the grounded answer in Roman Urdu", async () => {
  const client = {
    models: {
      generateContent: async () => ({ text: "Chativo ke teen paid plans hain." })
    }
  };
  const assistant = createGeminiAssistant({ client });
  const answer = {
    key: "pricing",
    title: "Packages and pricing",
    blocks: [{ type: "paragraph", text: "Chativo has three paid plans." }],
    sources: []
  };
  const rewritten = await assistant.rewriteInRomanUrdu(answer);

  assert.match(rewritten.title, /Roman Urdu/);
  assert.equal(rewritten.blocks[0].text, "Chativo ke teen paid plans hain.");
  assert.equal(rewritten.key, "pricing");
});

test("answers from supplied website context and preserves source links", async () => {
  const client = {
    models: {
      generateContent: async () => ({ text: "Claude focuses on careful reasoning while Gemini integrates with Google's ecosystem." })
    }
  };
  const assistant = createGeminiAssistant({ client });
  const answer = await assistant.answerFromWebsite("Compare Claude and Gemini", [{
    title: "Claude vs Gemini",
    url: "https://chativo.mbstack.net/blog/claude-vs-gemini",
    text: "Approved comparison context",
    score: 10
  }]);

  assert.equal(answer.key, "website");
  assert.equal(answer.sources.length, 1);
  assert.match(answer.sources[0].url, /claude-vs-gemini/);
});
