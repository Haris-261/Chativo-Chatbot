import assert from "node:assert/strict";
import test from "node:test";
import { classifyQuestion } from "../src/services/questionClassifier.js";

const cases = [
  ["What is Chativo?", "overview"],
  ["Which models are included?", "models"],
  ["How much does it cost?", "pricing"],
  ["Tell me about the Plus plan", "plus"],
  ["Can I get a refund?", "refund"],
  ["How do I cancel my subscription?", "cancel"],
  ["What about phnoe and emails details?", "contact"],
  ["Could you share a way to reach the team?", "contact"],
  ["Which AI engines can I compare?", "models"],
  ["Can I return to an earlier conversation?", "history"],
  ["What fee will I pay per month?", "pricing"],
  ["What is the capital of France?", "refusal"],
  ["Who is the prime minister of Pakistan?", "refusal"],
  ["Who is the prime minister?", "refusal"],
  ["Chativo, who is the prime minister of Pakistan?", "refusal"],
  ["What is Gemini?", "refusal"],
  ["Explain Claude to me", "refusal"],
  ["Compare Claude vs Gemini", "models"],
  ["Write me a poem", "refusal"],
  ["Write an email for me", "refusal"],
  ["Does Chativo encrypt every prompt?", "unknown"]
];

for (const [question, expected] of cases) {
  test(`classifies: ${question}`, () => {
    assert.equal(classifyQuestion(question).intent, expected);
  });
}

test("keeps a documented follow-up in context", () => {
  assert.equal(classifyQuestion("Tell me more", "refund").intent, "refund");
});

test("switches plans during a follow-up", () => {
  assert.equal(classifyQuestion("What about Pro?", "plus").intent, "pro");
});
