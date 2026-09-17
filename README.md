# Ask Chativo - Gemini and Roman Urdu edition

This is an isolated copy of the Chativo MERN assistant. It adds Gemini-powered semantic classification and grounded Roman Urdu responses while keeping the fixed MongoDB knowledge base and out-of-scope refusal behavior.

The original project outside this folder is unchanged.

## Local addresses

- Frontend: `http://localhost:5174`
- Backend: `http://localhost:5100`
- Backend health: `http://localhost:5100/api/health`
- Separate Atlas database: `chativo_gemini_assistant`

The different ports and database name allow this copy and the original project to remain independent.

## Configure Gemini

Open `backend/.env` and set:

```dotenv
GEMINI_API_KEY=your_google_ai_studio_key
GEMINI_MODEL=gemini-3.6-flash
```

Keep the key in the backend only. Never place it in React source, a `VITE_` variable, Git, screenshots, or chat messages.

Create a key in [Google AI Studio](https://aistudio.google.com/app/apikey). The backend uses Google's official `@google/genai` JavaScript SDK.

## Run

```powershell
npm install
npm run seed
npm run test:gemini
npm run dev
```

## Deploy the backend to Vercel

Use `backend` as the Vercel project's Root Directory. Add these variables in the Vercel Production environment, then redeploy:

```dotenv
MONGODB_URI=your_mongodb_atlas_connection_string
MONGODB_DB_NAME=chativo_gemini_assistant
CLIENT_ORIGIN=https://your-frontend-domain.vercel.app
GEMINI_API_KEY=your_google_ai_studio_key
GEMINI_MODEL=gemini-3.6-flash
```

The Vercel-exported Express app opens a cached MongoDB connection when `/api/health` or `/api/chat` is requested. Local development continues to connect and seed through `backend/src/index.js`.

Run `npm run seed` once against the intended Atlas database before deployment. Do not seed inside every serverless request.

## How grounding works

1. The deterministic classifier checks 425 maintained English and Roman Urdu examples.
2. A repeatable sitemap sync indexes all public Chativo pages into source-linked retrieval chunks.
3. Website/blog questions retrieve the strongest matching chunks and Gemini answers only from that context.
4. Other uncertain questions use Gemini structured classification restricted to an intent allowlist.
5. The API retrieves approved fixed answers from MongoDB for normal product and policy intents.
6. Roman Urdu questions receive Latin-script Roman Urdu output without changing the grounded facts.
7. If Gemini is missing or unavailable, the deterministic classifier continues working.

Gemini is not allowed to answer from general knowledge. Unverified Chativo details use the `unknown` response and unrelated questions use `refusal`.

## Main commands

```powershell
npm run dev                     # API and frontend
npm test                        # unit and API tests
npm run test:accuracy           # all 425 English/Roman Urdu questions
npm run test:gemini             # real Gemini-key connection check
npm run test:smoke              # Atlas-backed API behavior
npm run sync:website             # refresh public sitemap data and website PDF
npm run generate:questions-pdf  # bilingual question PDF
npm run build                   # production frontend build
```

## Gemini benefits

- Understands unseen paraphrases, spelling mistakes, and informal Roman Urdu better than keyword matching alone.
- Produces natural Roman Urdu while the facts still come from the approved Chativo answer.
- Structured output restricts classification to known intents.
- Gemini 3.6 Flash supports the structured classification used by this assistant.
- The architecture can later support multilingual input and multimodal content without exposing the API key to the browser.

## Tradeoffs

- API calls add latency and can incur charges.
- Free and paid tiers have rate limits; the API may return HTTP 429 when limits are reached.
- AI output is probabilistic, so the fixed intent allowlist, confidence threshold, approved knowledge retrieval, tests, and deterministic fallback must remain enabled.
- Review Google's current pricing and data-use terms before handling sensitive customer content.

## Website knowledge refresh

Run `npm run sync:website` whenever the public Chativo site changes. It reads only same-domain URLs listed in `https://chativo.mbstack.net/sitemap.xml` and regenerates:

- `backend/src/data/generated/websiteKnowledge.json`
- `docs/Chativo-Complete-Website-Knowledge.pdf`

After syncing, run `npm run seed` to upsert the refreshed website pages into the separate Atlas database.
