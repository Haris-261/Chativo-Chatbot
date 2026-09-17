import { allTrainingQuestions } from "../data/allTrainingQuestions.js";

const intentPatterns = [
  ["refund", ["refund", "money back", "charged twice", "duplicate charge", "billing dispute"]],
  ["cancel", ["cancel", "cancellation", "stop renewal", "unsubscribe"]],
  ["contact", ["contact", "contact details", "phone", "phone number", "telephone", "email", "support email", "customer service", "get in touch", "reach support", "reach the team", "talk to someone", "helpline"]],
  ["payment", ["payment", "safepay", "billing", "checkout", "currency", "tax"]],
  ["starter", ["starter", "starter plan", "starter package"]],
  ["plus", ["plus", "plus plan", "plus package"]],
  ["pro", ["pro", "pro plan", "pro package"]],
  ["pricing", ["pricing", "chativo plans", "price", "plans", "package", "subscription", "how much", "cost", "monthly", "per month", "fee"]],
  ["free", ["free", "guest", "trial", "try before", "without paying", "without an account", "no card"]],
  ["models", ["model", "models", "ai engine", "ai engines", "chatgpt", "claude", "perplexity", "gemini", "grok", "openai", "anthropic"]],
  ["history", ["history", "saved chat", "save chat", "sync chat", "conversations saved", "previous chat", "old chat", "earlier conversation", "past conversation", "persist"]],
  ["projects", ["project", "projects", "organize", "organization"]],
  ["streaming", ["stream", "streaming", "speed", "live response", "response time"]],
  ["themes", ["theme", "dark mode", "light mode", "appearance"]],
  ["login", ["login", "log in", "sign in", "forgot password"]],
  ["account", ["account", "register", "registration", "sign up", "create account", "credentials"]],
  ["company", ["company", "owner", "owns", "who built", "mb stack", "jurisdiction", "governing law"]],
  ["limitations", ["limitation", "accurate", "accuracy", "hallucination", "hallucinate", "truth", "official app", "unlimited"]],
  ["usecases", ["who is it for", "use case", "useful for", "freelancer", "student", "developer", "researcher", "writer", "business"]],
  ["terms", ["terms", "acceptable use", "prohibited", "intellectual property", "ownership", "owns my output"]],
  ["data", ["privacy", "data", "retention", "secure", "security", "confidential", "training", "prompt ownership"]],
  ["how", ["how does", "how it works", "how do i use", "workflow", "compare and continue", "steps"]],
  ["overview", ["what is chativo", "about chativo", "tell me about chativo", "what does chativo do", "chativo ai"]]
];

const scopeTerms = [
  "chativo", "model", "models", "chatgpt", "claude", "perplexity", "gemini", "grok", "compare", "chat", "prompt",
  "plan", "plans", "package", "starter", "plus", "pro", "guest", "subscription", "refund", "cancel", "account",
  "history", "project", "safepay", "billing", "payment", "price", "support", "phone", "email", "mb stack", "theme", "streaming", "privacy", "terms"
];

const outOfScopePatterns = [
  /\b(weather|temperature|forecast)\b/,
  /\b(capital of|president|prime minister|head of state|election|politics|political)\b/,
  /\bwho\s+(is|was)\s+(the\s+)?pm\b/,
  /\b(recipe|cook|cooking|pasta)\b/,
  /\b(football|cricket score|basketball|sports score|match score)\b/,
  /\b(write|create) (me )?(a |an )?(poem|essay|code|email|story|website)\b/,
  /\b(solve|calculate)\s+\d/,
  /\b(stock price|crypto price|bitcoin price)\b/,
  /\b(diagnose|medical advice|legal advice)\b/,
  /\b(translate|tell me a joke|book a flight|quantum physics|recommend a laptop)\b/
];

const followupIntents = new Set(intentPatterns.map(([intent]) => intent));

export function normalize(text) {
  return String(text)
    .toLowerCase()
    .replace(/[’']/g, "'")
    .replace(/\b([a-z0-9]+)'s\b/g, "$1")
    .replace(/[^a-z0-9$+\s'-]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

const trainedIntentByQuestion = new Map(
  allTrainingQuestions.map(({ question, intent }) => [normalize(question), intent])
);

function isCloseWord(word, expected) {
  if (word === expected) return true;
  if (expected.length < 5 || Math.abs(word.length - expected.length) > 1) return false;

  if (word.length === expected.length) {
    const differences = [];
    for (let index = 0; index < word.length; index += 1) {
      if (word[index] !== expected[index]) differences.push(index);
    }

    if (differences.length === 1) return true;
    if (differences.length !== 2) return false;

    const [first, second] = differences;
    return second === first + 1
      && word[first] === expected[second]
      && word[second] === expected[first];
  }

  const shorter = word.length < expected.length ? word : expected;
  const longer = word.length < expected.length ? expected : word;
  let shortIndex = 0;
  let longIndex = 0;
  let skipped = false;

  while (shortIndex < shorter.length && longIndex < longer.length) {
    if (shorter[shortIndex] === longer[longIndex]) {
      shortIndex += 1;
      longIndex += 1;
      continue;
    }
    if (skipped) return false;
    skipped = true;
    longIndex += 1;
  }

  return true;
}

function includesTerm(text, term) {
  if (` ${text} `.includes(` ${term} `)) return true;
  if (term.includes(" ")) return false;

  return text.split(" ").some(word => isCloseWord(word, term));
}

function result(intent) {
  return {
    type: ["unknown", "refusal"].includes(intent) ? "refusal" : "answer",
    intent
  };
}

export function classifyQuestion(rawText, previousIntent = null) {
  const text = normalize(rawText);
  if (!text) return result("refusal");

  // These subjects are outside the product knowledge base even when a prompt
  // also mentions Chativo. Mixed-scope questions must not bypass the guard.
  if (outOfScopePatterns.some(pattern => pattern.test(text))) {
    return result("refusal");
  }

  const trainedIntent = trainedIntentByQuestion.get(text);
  if (trainedIntent) return result(trainedIntent);

  if (/^(hi|hello|hey|salam|assalam|good (morning|afternoon|evening))$/.test(text)) {
    return result("hello");
  }
  if (/^(thanks|thank you|thx|great|got it|okay thanks)$/.test(text)) {
    return result("thanks");
  }

  const namesExternalModel = /\b(chatgpt|claude|perplexity|gemini|grok|openai|anthropic)\b/.test(text);
  const connectsModelToChativo = /\b(chativo|mb stack|compare|comparison|versus|vs|difference|farq|better|support|supported|available|included)\b/.test(text);
  if (namesExternalModel && !connectsModelToChativo) {
    return result("refusal");
  }

  if (text.length < 60 && previousIntent && followupIntents.has(previousIntent)) {
    if (/^(what about|and|how about|tell me more|more details|why|when|where|how long)/.test(text)) {
      if (includesTerm(text, "starter")) return result("starter");
      if (includesTerm(text, "plus")) return result("plus");
      if (includesTerm(text, "pro")) return result("pro");
      return result(previousIntent);
    }
  }

  let bestIntent = null;
  let bestScore = 0;

  for (const [intent, patterns] of intentPatterns) {
    const score = patterns.reduce((total, pattern) => {
      if (!includesTerm(text, pattern)) return total;
      return total + (pattern.includes(" ") ? 3 : 1);
    }, 0);

    if (score > bestScore) {
      bestIntent = intent;
      bestScore = score;
    }
  }

  if (bestIntent) return result(bestIntent);

  const hasChativoTerm = scopeTerms.some(term => includesTerm(text, term));
  return result(hasChativoTerm ? "unknown" : "refusal");
}
