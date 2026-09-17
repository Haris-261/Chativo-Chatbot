import { Router } from "express";
import rateLimit from "express-rate-limit";
import { KnowledgeItem } from "../models/KnowledgeItem.js";
import { geminiAssistant, looksLikeRomanUrdu } from "../services/geminiAssistant.js";
import { classifyQuestion } from "../services/questionClassifier.js";
import {
  buildWebsiteFallbackAnswer,
  findWebsiteMatches,
  shouldUseWebsiteKnowledge
} from "../services/websiteKnowledge.js";

export const chatRouter = Router();

function findKnowledgeAnswer(intent) {
  return KnowledgeItem.findOne({ key: intent })
    .select("key title blocks sources -_id")
    .lean();
}

chatRouter.use(rateLimit({
  windowMs: 60_000,
  limit: 40,
  standardHeaders: "draft-7",
  legacyHeaders: false,
  message: { error: "Too many questions. Please wait a moment and try again." }
}));

chatRouter.post("/", async (request, response, next) => {
  try {
    const { message, lastIntent } = request.body ?? {};
    if (typeof message !== "string" || !message.trim()) {
      return response.status(400).json({ error: "A question is required." });
    }
    if (message.length > 500) {
      return response.status(400).json({ error: "Questions must be 500 characters or fewer." });
    }

    const previousIntent = typeof lastIntent === "string" ? lastIntent : null;
    const localClassification = classifyQuestion(message, previousIntent);
    const romanUrdu = looksLikeRomanUrdu(message);

    // A deterministic rejection is final. Do not send unrelated questions to
    // website retrieval or Gemini, where they could be incorrectly promoted.
    if (localClassification.intent === "refusal") {
      const answer = await findKnowledgeAnswer("refusal");
      if (!answer) {
        return response.status(503).json({ error: "The Chativo knowledge base is not ready." });
      }

      return response.json({
        type: "refusal",
        intent: "refusal",
        answer,
        assistantMode: "scope-guard"
      });
    }

    const websiteMatches = findWebsiteMatches(message);

    if (shouldUseWebsiteKnowledge(message, localClassification, websiteMatches)) {
      let websiteAnswer = null;
      let usedGemini = false;
      if (geminiAssistant.isConfigured()) {
        websiteAnswer = await geminiAssistant.answerFromWebsite(message, websiteMatches, romanUrdu);
        usedGemini = Boolean(websiteAnswer);
      }
      websiteAnswer ||= buildWebsiteFallbackAnswer(websiteMatches);

      if (websiteAnswer) {
        return response.json({
          type: "answer",
          intent: "website",
          answer: websiteAnswer,
          assistantMode: usedGemini ? "gemini-website-grounded" : "website-retrieval-fallback"
        });
      }
    }

    let classification = localClassification;
    let geminiClassification = null;

    if (geminiAssistant.isConfigured() && localClassification.intent === "unknown") {
      geminiClassification = await geminiAssistant.classify(message, previousIntent);
      if (geminiClassification) classification = geminiClassification;
    }

    const answer = await findKnowledgeAnswer(classification.intent);

    if (!answer) {
      return response.status(503).json({ error: "The Chativo knowledge base is not ready." });
    }

    const wantsRomanUrdu = geminiClassification?.language === "roman_urdu" || romanUrdu;
    const finalAnswer = wantsRomanUrdu
      ? await geminiAssistant.rewriteInRomanUrdu(answer)
      : answer;

    return response.json({
      type: classification.type,
      intent: classification.intent,
      answer: finalAnswer,
      assistantMode: geminiAssistant.isConfigured() ? "gemini-grounded" : "deterministic-fallback"
    });
  } catch (error) {
    next(error);
  }
});
