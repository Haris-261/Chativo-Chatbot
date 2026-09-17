import fs from "node:fs";
import { fileURLToPath } from "node:url";

const dataPath = fileURLToPath(new URL("../data/generated/websiteKnowledge.json", import.meta.url));
const dataset = JSON.parse(fs.readFileSync(dataPath, "utf8"));

const stopWords = new Set([
  "a", "about", "all", "an", "and", "are", "as", "at", "be", "best", "by", "can", "chativo",
  "do", "does", "for", "from", "give", "how", "i", "in", "is", "it", "me", "model", "models",
  "of", "on", "or", "please", "show", "tell", "that", "the", "this", "to", "what", "which", "with",
  "you", "your", "ai", "aur", "batao", "hai", "hain", "ka", "ke", "ki", "kya", "mein", "mujhe"
]);

const aliases = new Map([
  ["behtar", "better"],
  ["doosre", "alternative"],
  ["dusre", "alternative"],
  ["farq", "difference"],
  ["faida", "benefit"],
  ["madad", "help"],
  ["muqabla", "compare"],
  ["qeemat", "price"],
  ["talba", "students"],
  ["likhai", "writing"],
  ["tehqeeq", "research"],
  ["kese", "how"],
  ["skta", "can"],
  ["skte", "can"]
]);

function normalizeToken(token) {
  const aliased = aliases.get(token) || token;
  if (aliased.length > 5 && aliased.endsWith("s")) return aliased.slice(0, -1);
  return aliased;
}

function tokenize(text) {
  return (String(text).toLowerCase().match(/[a-z0-9]+/g) || [])
    .map(normalizeToken)
    .filter(token => token.length >= 3 && !stopWords.has(token));
}

function scoreChunk(queryTokens, page, chunk) {
  const pathTokens = new Set(tokenize(page.path.replaceAll("/", " ")));
  const titleTokens = new Set(tokenize(page.title));
  const headingTokens = new Set(tokenize(page.headings.join(" ")));
  const chunkTokens = new Set(tokenize(chunk));

  const baseScore = queryTokens.reduce((score, token) => {
    if (pathTokens.has(token)) return score + 7;
    if (titleTokens.has(token)) return score + 5;
    if (headingTokens.has(token)) return score + 3;
    if (chunkTokens.has(token)) return score + 1;
    return score;
  }, 0);
  const matchingPathTokens = queryTokens.filter(token => pathTokens.has(token)).length;
  const pathPrecisionBonus = matchingPathTokens > 0
    ? (matchingPathTokens / pathTokens.size) * 10
    : 0;

  return baseScore + pathPrecisionBonus;
}

export function findWebsiteMatches(question, limit = 4) {
  const queryTokens = [...new Set(tokenize(question))];
  if (queryTokens.length === 0) return [];

  const bestByPage = dataset.pages.map(page => {
    let best = null;
    for (const chunk of page.chunks) {
      const score = scoreChunk(queryTokens, page, chunk);
      if (!best || score > best.score) best = { chunk, score };
    }
    return {
      title: page.title,
      url: page.url,
      path: page.path,
      type: page.type,
      text: best?.chunk || "",
      score: best?.score || 0
    };
  });

  return bestByPage
    .filter(match => match.score >= 3)
    .sort((left, right) => right.score - left.score)
    .slice(0, limit);
}

export function buildWebsiteFallbackAnswer(matches) {
  if (!Array.isArray(matches) || matches.length === 0) return null;

  const primary = matches[0];
  return {
    key: "website",
    title: primary.title,
    blocks: [{
      type: "paragraph",
      text: primary.text.replace(/\n+/g, " ").trim()
    }],
    sources: matches.slice(0, 3).map(match => ({
      label: match.title,
      url: match.url
    }))
  };
}

export function shouldUseWebsiteKnowledge(question, classification, matches) {
  if (matches.length === 0) return false;
  if (classification?.intent === "refusal") return false;

  const text = String(question).toLowerCase();
  const exploresWebsiteContent = /\b(blog|article|review|website|site|page|compare|comparison|versus|vs|alternative|research|coding|writing|student|freelancer|pakistan|farq|muqabla|chatbot|faida|madad|doosre|dusre)\b/.test(text);

  return exploresWebsiteContent && matches[0].score >= 5;
}

export function getWebsiteDataset() {
  return dataset;
}
