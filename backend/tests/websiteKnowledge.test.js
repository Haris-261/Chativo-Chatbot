import assert from "node:assert/strict";
import test from "node:test";
import {
  buildWebsiteFallbackAnswer,
  findWebsiteMatches,
  shouldUseWebsiteKnowledge
} from "../src/services/websiteKnowledge.js";

test("ranks the matching Chativo comparison article", () => {
  const matches = findWebsiteMatches("Compare Claude vs Gemini", 3);

  assert.ok(matches.length > 0);
  assert.match(matches[0].path, /claude-vs-gemini/);
  assert.equal(shouldUseWebsiteKnowledge(
    "Compare Claude vs Gemini",
    { intent: "models" },
    matches
  ), true);
});

test("builds a source-linked answer without Gemini", () => {
  const matches = findWebsiteMatches("Compare Claude vs Gemini", 3);
  const answer = buildWebsiteFallbackAnswer(matches);

  assert.equal(answer.key, "website");
  assert.ok(answer.blocks[0].text.length > 0);
  assert.match(answer.sources[0].url, /claude-vs-gemini/);
});

test("does not retrieve website knowledge for an unrelated request", () => {
  const matches = findWebsiteMatches("What is the Bitcoin price?", 3);
  assert.equal(shouldUseWebsiteKnowledge(
    "What is the Bitcoin price?",
    { intent: "refusal" },
    matches
  ), false);
});

test("scope refusal overrides matching words from indexed pages", () => {
  const question = "Show me a website article about the prime minister of Pakistan";
  const matches = findWebsiteMatches(question, 3);

  assert.equal(shouldUseWebsiteKnowledge(
    question,
    { intent: "refusal" },
    matches
  ), false);
});

test("maps Roman Urdu comparison wording into website retrieval", () => {
  const matches = findWebsiteMatches("Claude aur Gemini mein kya farq hai?", 3);

  assert.ok(matches.length > 0);
  assert.equal(shouldUseWebsiteKnowledge(
    "Claude aur Gemini mein kya farq hai?",
    { intent: "models" },
    matches
  ), true);
});

test("retrieves Chativo benefits asked in informal Roman Urdu", () => {
  const question = "chativo meri help kese kr skta hai jo doosre chatbot nhi kr skte?";
  const matches = findWebsiteMatches(question, 3);

  assert.ok(matches.length > 0);
  assert.equal(shouldUseWebsiteKnowledge(
    question,
    { intent: "unknown" },
    matches
  ), true);
});
