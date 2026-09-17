const SITE = "https://chativo.mbstack.net";

const source = {
  home: { label: "Chativo home", url: `${SITE}/` },
  about: { label: "About Chativo", url: `${SITE}/about` },
  pricing: { label: "Packages", url: `${SITE}/pricing` },
  review: { label: "Chativo review", url: `${SITE}/blog/chativo-review` },
  free: { label: "Guest chat guide", url: `${SITE}/blog/free-ai-chat-with-multiple-models` },
  terms: { label: "Terms & Conditions", url: `${SITE}/terms` },
  refunds: { label: "Refund Policy", url: `${SITE}/refund-policy` },
  cancellation: { label: "Cancellation Policy", url: `${SITE}/cancellation-policy` },
  contact: { label: "Contact Chativo", url: `${SITE}/contact` },
  chat: { label: "Try guest chat", url: `${SITE}/chat` },
  register: { label: "Create an account", url: `${SITE}/register` },
  login: { label: "Sign in", url: `${SITE}/login` }
};

const p = text => ({ type: "paragraph", text });
const list = (...items) => ({ type: "list", items });
const reviewedAt = new Date("2026-09-17T00:00:00.000Z");

export const knowledgeItems = [
  {
    key: "overview",
    title: "What Chativo is",
    blocks: [
      p("Chativo is a compare-then-continue AI workspace by MB Stack Company. You send one prompt and receive parallel replies from five models. After reviewing them side by side, you choose one response and continue the conversation with that model."),
      p("It is designed to replace repeated copy-pasting across separate chatbot tabs, not to replace every specialized AI tool.")
    ],
    sources: [source.home, source.about]
  },
  {
    key: "how",
    title: "How Chativo works",
    blocks: [
      p("Chativo works in three steps:"),
      list(
        "Compare: send one prompt to all five supported models together.",
        "Choose: review the streamed responses side by side and select the answer you trust.",
        "Continue: follow-up messages stay with the model you selected, keeping the thread consistent."
      ),
      p("If you want another five-way comparison, start a new compare session.")
    ],
    sources: [source.home, source.review]
  },
  {
    key: "models",
    title: "Supported models",
    blocks: [
      p("Chativo compares replies from ChatGPT, Claude, Perplexity, Gemini, and Grok. The first prompt is sent across all five; after that, you continue with the one you choose."),
      p("Chativo does not claim that every provider is always available, and it is not the official app for any of these model providers.")
    ],
    sources: [source.about, source.review]
  },
  {
    key: "pricing",
    title: "Packages and pricing",
    blocks: [
      p("Chativo publishes three monthly paid packages:"),
      list(
        "Starter — $5/month: full five-model compare, chat history sync, and email support.",
        "Plus — $10/month: everything in Starter, plus projects and organization, priority streaming, and priority support.",
        "Pro — $20/month: everything in Plus, the highest usage allowance, early feature access, and a dedicated support lane."
      ),
      p("Package prices are shown in USD. Check the live Packages page before purchasing because features and limits may change.")
    ],
    sources: [source.review, source.pricing]
  },
  {
    key: "starter",
    title: "Starter plan",
    blocks: [p("Starter costs $5 per month and is positioned for light compare sessions. It includes full five-model comparison, chat history sync, and email support.")],
    sources: [source.review, source.pricing]
  },
  {
    key: "plus",
    title: "Plus plan",
    blocks: [p("Plus costs $10 per month and is positioned for daily work. It includes everything in Starter, plus projects and organization, priority streaming, and priority support.")],
    sources: [source.review, source.pricing]
  },
  {
    key: "pro",
    title: "Pro plan",
    blocks: [p("Pro costs $20 per month and is intended for power users. It includes everything in Plus, the highest usage allowance, early feature access, and a dedicated support lane.")],
    sources: [source.review, source.pricing]
  },
  {
    key: "free",
    title: "Guest access",
    blocks: [
      p("Yes. Chativo offers limited guest chat without requiring payment first. A guest can try the five-model compare flow and continue with a selected answer."),
      p("Guest usage is not unlimited. Create an account when you want persistent chat history; paid plans provide higher usage allowances.")
    ],
    sources: [source.free, source.chat]
  },
  {
    key: "account",
    title: "Accounts",
    blocks: [
      p("You can start in guest mode without an account. Registering links chats to your account and lets your history persist, while Plus and Pro also provide projects for organizing work."),
      p("Chativo's Terms say registration details must be accurate and you are responsible for keeping your credentials secure.")
    ],
    sources: [source.about, source.terms, source.register]
  },
  {
    key: "login",
    title: "Sign in",
    blocks: [p("You can sign in through Chativo's login page. If you do not have an account yet, create one first; guest chat is also available if you only want to try the compare workflow.")],
    sources: [source.login, source.register, source.chat]
  },
  {
    key: "history",
    title: "Chat history",
    blocks: [p("Registered users can keep and sync chat history. Guest sessions are intended for trying the workflow, while an account is the documented way to return to saved threads. Plus and Pro add projects for organizing those conversations.")],
    sources: [source.review, source.free]
  },
  {
    key: "projects",
    title: "Projects",
    blocks: [p("Projects are included with Plus and Pro. They help organize serious or ongoing chat work instead of keeping every thread in one flat list. Starter does not list projects among its published features.")],
    sources: [source.review, source.about]
  },
  {
    key: "streaming",
    title: "Streaming",
    blocks: [p("Chativo streams model responses as they generate, so you can begin reading without waiting for every model to finish. Plus publishes priority streaming as part of its package.")],
    sources: [source.home, source.review]
  },
  {
    key: "themes",
    title: "Themes",
    blocks: [p("Chativo publishes support for both light and dark themes, so you can change the appearance to suit your workspace or time of day.")],
    sources: [source.home]
  },
  {
    key: "payment",
    title: "Payments",
    blocks: [
      p("Paid packages are billed in advance through the payment method displayed at checkout. Chativo documents Safepay checkout in Pakistan, while package labels are shown in US dollars."),
      p("Create an account before subscribing, and confirm the current checkout details on the live Packages page. Taxes may apply where required by law.")
    ],
    sources: [source.review, source.terms, source.pricing]
  },
  {
    key: "refund",
    title: "Refunds",
    blocks: [
      p("You may request a refund when all relevant conditions are met:"),
      list(
        "Contact Chativo within 7 calendar days of the original purchase.",
        "You have not substantially consumed the paid quota.",
        "The charge was duplicated, unauthorized, or a verified Chativo-side technical failure prevented access."
      ),
      p("Email m.bilaluog1@gmail.com or chativo@mbstack.net with your account details, transaction reference, purchase date, plan, and reason. Chativo aims to reply within 3–5 business days; approved refunds typically take 5–14 business days to return, subject to Safepay and bank timelines.")
    ],
    sources: [source.refunds]
  },
  {
    key: "cancel",
    title: "Cancellation",
    blocks: [
      p("To stop renewal, sign in and use Account → Subscription when that option is available, or email chativo@mbstack.net from your registered address with the subject “Cancel subscription.”"),
      p("Cancellation stops future charges but does not delete your account. You retain paid access until the end of the current billing period, after which the account moves to the available free or limited tier.")
    ],
    sources: [source.cancellation]
  },
  {
    key: "contact",
    title: "Contact and support",
    blocks: [
      p("You can contact Chativo / MB Stack through:"),
      list(
        "Product support: chativo@mbstack.net",
        "General inquiries: mbstackpremium@gmail.com",
        "Phone: +92 316 1465299 or +92 347 9516266"
      ),
      p("For billing disputes or refund requests, the published address is m.bilaluog1@gmail.com.")
    ],
    sources: [source.contact, source.refunds]
  },
  {
    key: "company",
    title: "Company",
    blocks: [p("Chativo is a product of MB STACK (SMC-PRIVATE) LIMITED, also presented as MB Stack Company. The service is governed by the laws of Pakistan, with the courts of Islamabad named in its Terms.")],
    sources: [source.about, source.terms]
  },
  {
    key: "limitations",
    title: "Limitations",
    blocks: [
      p("Chativo is a comparison workspace, not a truth machine. Five models can still agree on something incorrect, so important facts should be verified independently."),
      p("It also does not claim to replace specialized image tools, IDE-native agents, vendor-only plugins and file interfaces, or an enterprise search system trained on your company drive.")
    ],
    sources: [source.review, source.terms]
  },
  {
    key: "usecases",
    title: "Who Chativo is for",
    blocks: [
      p("Chativo is positioned for people who deliberately compare AI answers: writers reviewing tone, freelancers drafting proposals, developers comparing implementations, students seeking a second opinion, researchers checking how answers differ, and small teams that do not want to manage five separate chat tabs."),
      p("For important work, compare the replies and still verify key claims independently.")
    ],
    sources: [source.review]
  },
  {
    key: "terms",
    title: "Terms and acceptable use",
    blocks: [
      p("Chativo's Terms prohibit unlawful, harmful, or fraudulent use; bypassing usage limits, security, or billing; unauthorized reverse engineering or resale; and uploading content that infringes rights or violates applicable law."),
      p("Users keep rights to their prompts and outputs subject to third-party model providers' terms. Chativo states that AI output may be inaccurate or incomplete and should be independently verified for important decisions.")
    ],
    sources: [source.terms]
  },
  {
    key: "data",
    title: "Data and privacy",
    blocks: [
      p("The reviewed public pages say users retain rights to their prompts and outputs, subject to third-party model providers' terms, and grant Chativo a limited license to process content to operate the service."),
      p("The site pages reviewed for this assistant do not publish a dedicated privacy policy or detailed retention and security specifications. Contact Chativo support for those details rather than relying on an assumption.")
    ],
    sources: [source.terms, source.contact]
  },
  {
    key: "hello",
    title: "Greeting",
    blocks: [p("Hello! I can help with Chativo's features, supported models, guest access, packages, billing, refunds, cancellations, account questions, or support contacts. What would you like to know?")],
    sources: []
  },
  {
    key: "thanks",
    title: "Thanks",
    blocks: [p("You're welcome. If you need anything else, ask me about Chativo's models, plans, account features, billing, or policies.")],
    sources: []
  },
  {
    key: "unknown",
    title: "Unverified detail",
    blocks: [
      p("I couldn't verify that detail in Chativo's reviewed public pages, so I won't guess."),
      p("You can ask about the documented features, five supported models, guest access, packages, payments, refunds, cancellations, or support—or contact Chativo directly for this specific detail.")
    ],
    sources: [source.contact]
  },
  {
    key: "refusal",
    title: "Outside Chativo scope",
    blocks: [
      p("I can only answer questions about Chativo. I can't help with that topic."),
      p("Try asking about Chativo's models, compare-and-continue workflow, packages, guest access, billing, refunds, cancellations, or support.")
    ],
    sources: []
  }
].map(item => ({ ...item, reviewedAt }));
