import assert from "node:assert/strict";
import { after, before, test } from "node:test";
import { createApp } from "../src/app.js";
import { KnowledgeItem } from "../src/models/KnowledgeItem.js";

let server;
let baseUrl;
let originalFindOne;

before(async () => {
  originalFindOne = KnowledgeItem.findOne;
  KnowledgeItem.findOne = ({ key }) => ({
    select: () => ({
      lean: async () => ({
        key,
        title: key === "refusal" ? "Outside Chativo scope" : "Test answer",
        blocks: [{ type: "paragraph", text: key === "refusal" ? "I can only answer questions about Chativo." : "Verified Chativo response." }],
        sources: []
      })
    })
  });

  server = createApp().listen(0);
  await new Promise(resolve => server.once("listening", resolve));
  baseUrl = `http://127.0.0.1:${server.address().port}`;
});

after(async () => {
  KnowledgeItem.findOne = originalFindOne;
  await new Promise((resolve, reject) => server.close(error => error ? reject(error) : resolve()));
});

test("GET / identifies the backend API", async () => {
  const response = await fetch(baseUrl);
  const payload = await response.json();

  assert.equal(response.status, 200);
  assert.equal(payload.success, true);
  assert.match(payload.message, /backend API is running/i);
  assert.equal(payload.health, "/api/health");
});

test("serverless health initializes the database connection", async () => {
  let connectionAttempts = 0;
  const app = createApp({
    connectDatabaseOnRequest: true,
    ensureDatabaseConnection: async () => {
      connectionAttempts += 1;
    }
  });
  const testServer = app.listen(0);
  await new Promise(resolve => testServer.once("listening", resolve));

  try {
    const response = await fetch(`http://127.0.0.1:${testServer.address().port}/api/health`);
    const payload = await response.json();

    assert.equal(response.status, 200);
    assert.equal(payload.database, "connected");
    assert.equal(connectionAttempts, 1);
  } finally {
    await new Promise((resolve, reject) => {
      testServer.close(error => error ? reject(error) : resolve());
    });
  }
});

test("serverless health reports a failed database connection without leaking details", async () => {
  const originalError = console.error;
  console.error = () => {};
  const app = createApp({
    connectDatabaseOnRequest: true,
    ensureDatabaseConnection: async () => {
      throw new Error("mongodb://secret-connection-string");
    }
  });
  const testServer = app.listen(0);
  await new Promise(resolve => testServer.once("listening", resolve));

  try {
    const response = await fetch(`http://127.0.0.1:${testServer.address().port}/api/health`);
    const responseText = await response.text();
    const payload = JSON.parse(responseText);

    assert.equal(response.status, 503);
    assert.equal(payload.database, "disconnected");
    assert.doesNotMatch(responseText, /secret-connection-string/);
  } finally {
    console.error = originalError;
    await new Promise((resolve, reject) => {
      testServer.close(error => error ? reject(error) : resolve());
    });
  }
});

test("POST /api/chat returns a grounded Chativo answer", async () => {
  const response = await fetch(`${baseUrl}/api/chat`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ message: "Which models does Chativo support?" })
  });
  const payload = await response.json();

  assert.equal(response.status, 200);
  assert.equal(payload.type, "answer");
  assert.equal(payload.intent, "models");
  assert.equal(payload.answer.key, "models");
});

test("POST /api/chat understands a misspelled contact paraphrase", async () => {
  const response = await fetch(`${baseUrl}/api/chat`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ message: "What about phnoe and emails details?" })
  });
  const payload = await response.json();

  assert.equal(response.status, 200);
  assert.equal(payload.type, "answer");
  assert.equal(payload.intent, "contact");
  assert.equal(payload.answer.key, "contact");
});

test("POST /api/chat retrieves indexed website information without Gemini", async () => {
  const response = await fetch(`${baseUrl}/api/chat`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ message: "Compare Claude vs Gemini" })
  });
  const payload = await response.json();

  assert.equal(response.status, 200);
  assert.equal(payload.intent, "website");
  assert.equal(payload.answer.key, "website");
  assert.equal(payload.assistantMode, "website-retrieval-fallback");
  assert.match(payload.answer.sources[0].url, /claude-vs-gemini/);
});

test("POST /api/chat classifies a trained Roman Urdu question", async () => {
  const response = await fetch(`${baseUrl}/api/chat`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ message: "Chativo ka refund policy kya hai?" })
  });
  const payload = await response.json();

  assert.equal(response.status, 200);
  assert.equal(payload.type, "answer");
  assert.equal(payload.intent, "refund");
  assert.equal(payload.answer.key, "refund");
});

test("POST /api/chat answers an informal Roman Urdu Chativo benefits question", async () => {
  const response = await fetch(`${baseUrl}/api/chat`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      message: "chativo meri help kese kr skta hai jo doosre chatbot nhi kr skte?"
    })
  });
  const payload = await response.json();

  assert.equal(response.status, 200);
  assert.equal(payload.type, "answer");
  assert.equal(payload.intent, "website");
  assert.equal(payload.answer.key, "website");
  assert.equal(payload.assistantMode, "website-retrieval-fallback");
  assert.ok(payload.answer.sources.length > 0);
});

test("POST /api/chat refuses an irrelevant question", async () => {
  const response = await fetch(`${baseUrl}/api/chat`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ message: "What is the weather tomorrow?" })
  });
  const payload = await response.json();

  assert.equal(response.status, 200);
  assert.equal(payload.type, "refusal");
  assert.equal(payload.intent, "refusal");
  assert.match(payload.answer.blocks[0].text, /only answer questions about Chativo/i);
});

test("POST /api/chat blocks general-knowledge questions at the scope guard", async () => {
  const response = await fetch(`${baseUrl}/api/chat`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      message: "Who is the prime minister of Pakistan?",
      lastIntent: "company"
    })
  });
  const payload = await response.json();

  assert.equal(response.status, 200);
  assert.equal(payload.type, "refusal");
  assert.equal(payload.intent, "refusal");
  assert.equal(payload.assistantMode, "scope-guard");
  assert.match(payload.answer.blocks[0].text, /only answer questions about Chativo/i);
});

test("POST /api/chat refuses standalone questions about external AI products", async () => {
  const response = await fetch(`${baseUrl}/api/chat`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ message: "What is Gemini?" })
  });
  const payload = await response.json();

  assert.equal(response.status, 200);
  assert.equal(payload.type, "refusal");
  assert.equal(payload.intent, "refusal");
  assert.equal(payload.assistantMode, "scope-guard");
});

test("POST /api/chat validates empty questions", async () => {
  const response = await fetch(`${baseUrl}/api/chat`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ message: "" })
  });

  assert.equal(response.status, 400);
});

for (const origin of ["http://localhost:5174", "http://127.0.0.1:5174"]) {
  test(`development CORS allows ${origin}`, async () => {
    const response = await fetch(`${baseUrl}/api/health`, {
      headers: { Origin: origin }
    });

    assert.equal(response.headers.get("access-control-allow-origin"), origin);
  });
}

test("development CORS rejects a non-local unconfigured origin", async () => {
  const originalError = console.error;
  console.error = () => {};
  try {
    const response = await fetch(`${baseUrl}/api/health`, {
      headers: { Origin: "https://untrusted.example" }
    });
    const payload = await response.json();

    assert.equal(response.status, 403);
    assert.match(payload.error, /not allowed/i);
  } finally {
    console.error = originalError;
  }
});
