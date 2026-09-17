export const questionCategories = [
  {
    intent: "hello",
    title: "Greetings",
    description: "Starts a Chativo support conversation.",
    questions: [
      "Hi",
      "Hello",
      "Hey",
      "Salam",
      "Assalam o Alaikum",
      "Good morning",
      "Good afternoon",
      "Good evening"
    ]
  },
  {
    intent: "overview",
    title: "Chativo overview",
    description: "Asks what Chativo is and what the product does.",
    questions: [
      "What is Chativo?",
      "Tell me about Chativo",
      "What does Chativo do?",
      "Explain Chativo to me",
      "What kind of product is Chativo?",
      "What is the purpose of Chativo?",
      "Give me an overview of Chativo",
      "Why would I use Chativo?",
      "Is Chativo an AI platform?",
      "What problem does Chativo solve?"
    ]
  },
  {
    intent: "how",
    title: "How Chativo works",
    description: "Asks about the compare, choose, and continue workflow.",
    questions: [
      "How does Chativo work?",
      "How do I use Chativo?",
      "What is the Chativo workflow?",
      "Explain how Chativo works",
      "What happens after I enter a prompt?",
      "How do I compare answers in Chativo?",
      "How do I choose a model response?",
      "Can I continue with one model after comparing?",
      "What are the steps for using Chativo?",
      "How does compare and continue work?"
    ]
  },
  {
    intent: "models",
    title: "Supported AI models",
    description: "Asks which models can be compared through Chativo.",
    questions: [
      "Which AI models does Chativo support?",
      "What models are available in Chativo?",
      "Does Chativo include ChatGPT?",
      "Can I use Claude in Chativo?",
      "Is Gemini available?",
      "Does Chativo support Grok?",
      "Can I compare Perplexity responses?",
      "How many AI models are included?",
      "Can I compare ChatGPT and Claude?",
      "List all models supported by Chativo"
    ]
  },
  {
    intent: "pricing",
    title: "Plans and pricing",
    description: "Asks for available packages, prices, or plan comparisons.",
    questions: [
      "What are the Chativo plans?",
      "Tell me about Chativo plans",
      "How much does Chativo cost?",
      "Show me all available packages",
      "What is Chativo pricing?",
      "Compare the Chativo plans",
      "What subscriptions do you offer?",
      "What are the monthly prices?",
      "Which Chativo package should I choose?",
      "List the Starter, Plus, and Pro prices",
      "Do you have monthly memberships?",
      "What paid plans are available?"
    ]
  },
  {
    intent: "starter",
    title: "Starter plan",
    description: "Asks specifically about the Starter package.",
    questions: [
      "What is the Starter plan?",
      "How much is Starter?",
      "What does the Starter package include?",
      "Tell me about the Starter plan",
      "Is Starter suitable for light use?",
      "Does Starter include all five models?",
      "Does Starter include chat history?",
      "What support comes with Starter?",
      "Can I get projects on Starter?",
      "What are the Starter plan features?"
    ]
  },
  {
    intent: "plus",
    title: "Plus plan",
    description: "Asks specifically about the Plus package.",
    questions: [
      "What is the Plus plan?",
      "How much is Plus?",
      "What does the Plus package include?",
      "Tell me about the Plus plan",
      "Does Plus include projects?",
      "Is priority streaming included with Plus?",
      "What support comes with Plus?",
      "Is Plus good for daily work?",
      "What are the Plus plan features?",
      "What is the difference between Starter and Plus?"
    ]
  },
  {
    intent: "pro",
    title: "Pro plan",
    description: "Asks specifically about the Pro package.",
    questions: [
      "What is the Pro plan?",
      "How much is Pro?",
      "What does the Pro package include?",
      "Tell me about the Pro plan",
      "Does Pro have the highest usage allowance?",
      "Does Pro include early feature access?",
      "What support comes with Pro?",
      "Is Pro intended for power users?",
      "What are the Pro plan features?",
      "What is the difference between Plus and Pro?"
    ]
  },
  {
    intent: "free",
    title: "Guest and free access",
    description: "Asks whether Chativo can be tried without paying or registering.",
    questions: [
      "Can I use Chativo for free?",
      "Is there a free trial?",
      "Can I try Chativo before paying?",
      "Can I use guest chat?",
      "Do I need an account to try Chativo?",
      "Can I compare models without a subscription?",
      "Is a credit card required for guest access?",
      "What can a guest user do?",
      "Is guest use unlimited?",
      "Can I start without paying?"
    ]
  },
  {
    intent: "account",
    title: "Accounts and registration",
    description: "Asks how accounts work or how to register.",
    questions: [
      "How do I create a Chativo account?",
      "Where can I register?",
      "Tell me about Chativo accounts",
      "Do I need an account?",
      "Why should I create an account?",
      "What information is needed to register?",
      "Can I use Chativo without registering?",
      "How do I sign up for Chativo?",
      "Does an account save my chats?",
      "Am I responsible for keeping my credentials secure?"
    ]
  },
  {
    intent: "login",
    title: "Login and access",
    description: "Asks where or how to sign in.",
    questions: [
      "How do I log in to Chativo?",
      "Where is the Chativo login page?",
      "How can I sign in?",
      "I cannot find the login page",
      "Do I sign in before subscribing?",
      "Can I open guest chat instead of logging in?",
      "Where do existing users access their account?",
      "I forgot my Chativo password",
      "How do I access my registered account?",
      "Can you give me the Chativo sign-in link?"
    ]
  },
  {
    intent: "history",
    title: "Chat history",
    description: "Asks whether conversations are saved and synchronized.",
    questions: [
      "Does Chativo save chat history?",
      "Can I sync my chats?",
      "Are my conversations saved?",
      "Can I return to an old chat?",
      "Do guest chats persist?",
      "Which plans include chat history?",
      "Will creating an account save my conversations?",
      "How can I keep my Chativo threads?",
      "Is chat history linked to my account?",
      "Can registered users access saved chats later?"
    ]
  },
  {
    intent: "projects",
    title: "Projects and organization",
    description: "Asks how conversations can be organized into projects.",
    questions: [
      "Does Chativo have projects?",
      "Which plans include projects?",
      "Can I organize chats into projects?",
      "Are projects available on Starter?",
      "Does Plus include organization tools?",
      "Can Pro users create projects?",
      "How can I organize ongoing chat work?",
      "Are projects included in both Plus and Pro?",
      "Can I group related conversations?",
      "What is the projects feature?"
    ]
  },
  {
    intent: "streaming",
    title: "Response streaming and speed",
    description: "Asks how responses appear and which plans get priority streaming.",
    questions: [
      "Does Chativo stream responses?",
      "What is priority streaming?",
      "Can I read an answer while it is being generated?",
      "Which plans include priority streaming?",
      "Does Plus get faster response streaming?",
      "Is streaming available for all models?",
      "Do I have to wait for every model to finish?",
      "How are model replies displayed while generating?",
      "Does Pro include priority streaming?",
      "Tell me about Chativo response speed"
    ]
  },
  {
    intent: "themes",
    title: "Appearance and themes",
    description: "Asks about light and dark display themes.",
    questions: [
      "Does Chativo have dark mode?",
      "Can I use a light theme?",
      "How do I change the Chativo theme?",
      "Are light and dark themes supported?",
      "Can I change the app appearance?",
      "Is Chativo comfortable to use at night?",
      "Does the interface support dark mode?",
      "What theme options are available?",
      "Can users switch between themes?",
      "Tell me about Chativo appearance settings"
    ]
  },
  {
    intent: "payment",
    title: "Payments and billing",
    description: "Asks about checkout, billing currency, payment provider, or taxes.",
    questions: [
      "How can I pay for Chativo?",
      "Does Chativo use Safepay?",
      "What currency are plans shown in?",
      "How does Chativo billing work?",
      "Are subscriptions billed in advance?",
      "Do I need an account before subscribing?",
      "Can taxes be added to my payment?",
      "Where do I purchase a plan?",
      "Is checkout available in Pakistan?",
      "What payment method appears at checkout?"
    ]
  },
  {
    intent: "refund",
    title: "Refunds and billing disputes",
    description: "Asks about refund eligibility, timing, duplicate charges, or requests.",
    questions: [
      "What is the Chativo refund policy?",
      "How do I request a refund?",
      "Can I get my money back?",
      "I was charged twice, what should I do?",
      "How many days do I have to ask for a refund?",
      "How long does an approved refund take?",
      "Where do I send a billing dispute?",
      "What information is needed for a refund request?",
      "Can I get a refund after using most of my quota?",
      "What if a Chativo technical problem blocked my access?"
    ]
  },
  {
    intent: "cancel",
    title: "Cancellation and renewal",
    description: "Asks how to stop renewal and what happens after cancellation.",
    questions: [
      "How do I cancel my Chativo subscription?",
      "How can I stop renewal?",
      "Where is the subscription cancellation option?",
      "Can I cancel by email?",
      "What happens after I cancel?",
      "Will cancellation delete my account?",
      "Can I use Chativo until my billing period ends?",
      "Does cancellation create a refund?",
      "What subject should I use in a cancellation email?",
      "How do I unsubscribe from a paid plan?"
    ]
  },
  {
    intent: "contact",
    title: "Contact and customer support",
    description: "Asks how to contact Chativo or MB Stack support.",
    questions: [
      "How do I contact Chativo support?",
      "What is the Chativo support email?",
      "Give me the customer service phone number",
      "How can I reach MB Stack?",
      "Where do I send general inquiries?",
      "Who do I contact about a billing dispute?",
      "Is there an email for product support?",
      "What are the support contact details?",
      "Can I call Chativo support?",
      "How do I contact the company?"
    ]
  },
  {
    intent: "company",
    title: "Company and ownership",
    description: "Asks who owns Chativo or which law governs the service.",
    questions: [
      "Who owns Chativo?",
      "Who built Chativo?",
      "Is Chativo made by MB Stack?",
      "What company operates Chativo?",
      "Is MB Stack a registered company?",
      "Which country's laws govern Chativo?",
      "Which courts are named in the Chativo terms?",
      "Where is the company behind Chativo based?",
      "What is the legal company name?",
      "Tell me about the company behind Chativo"
    ]
  },
  {
    intent: "limitations",
    title: "Accuracy and limitations",
    description: "Asks what Chativo cannot guarantee or replace.",
    questions: [
      "Is Chativo always accurate?",
      "Can Chativo answers be wrong?",
      "Can the AI models hallucinate?",
      "Should I verify important answers?",
      "Does agreement between five models guarantee the truth?",
      "Can Chativo replace an image generation tool?",
      "Is Chativo an IDE coding agent?",
      "Can Chativo search my private company drive?",
      "Is Chativo the official app for every model provider?",
      "What are Chativo's limitations?"
    ]
  },
  {
    intent: "usecases",
    title: "Customer types and use cases",
    description: "Asks who benefits from Chativo and how they might use it.",
    questions: [
      "Who is Chativo for?",
      "Is Chativo useful for developers?",
      "Can freelancers use Chativo?",
      "How can writers use Chativo?",
      "Is Chativo suitable for students?",
      "Can researchers compare answers with Chativo?",
      "Is Chativo useful for a small team?",
      "How can businesses use Chativo?",
      "Can I compare coding solutions?",
      "What are common Chativo use cases?"
    ]
  },
  {
    intent: "terms",
    title: "Terms and acceptable use",
    description: "Asks what usage is allowed, prohibited, or owned by the user.",
    questions: [
      "What are the Chativo terms?",
      "What use is prohibited?",
      "Can I bypass Chativo usage limits?",
      "Is unauthorized resale allowed?",
      "Can I use Chativo for fraudulent activity?",
      "Who owns my prompts?",
      "Who owns the AI output?",
      "Can I upload content that violates someone else's rights?",
      "What is the acceptable use policy?",
      "Does Chativo allow reverse engineering?"
    ]
  },
  {
    intent: "data",
    title: "Data and privacy",
    description: "Asks about prompts, outputs, retention, confidentiality, or security details.",
    questions: [
      "How does Chativo use my data?",
      "Does Chativo have a privacy policy?",
      "Who keeps the rights to my prompts?",
      "Who keeps the rights to my outputs?",
      "Why does Chativo need a license to process content?",
      "Does Chativo publish a data retention period?",
      "Are my prompts confidential?",
      "What security details does Chativo publish?",
      "Does Chativo train models on my prompts?",
      "Where can I ask about privacy details?"
    ]
  },
  {
    intent: "thanks",
    title: "Acknowledgements",
    description: "Closes or acknowledges a helpful Chativo answer.",
    questions: [
      "Thanks",
      "Thank you",
      "Thx",
      "Great",
      "Got it",
      "Okay thanks",
      "That answers my question",
      "Thank you for the Chativo information"
    ]
  },
  {
    intent: "unknown",
    title: "Undocumented Chativo details",
    description: "Refuses to guess when a Chativo-specific detail is not documented.",
    questions: [
      "Does Chativo use end-to-end encryption?",
      "Does Chativo have an Android app?",
      "Does Chativo have an iPhone app?",
      "Where are Chativo's servers located?",
      "Does Chativo have an annual plan?",
      "Does Chativo offer a lifetime subscription?",
      "Can I pay for Chativo with cryptocurrency?",
      "Does Chativo provide an API?",
      "Can I upload PDF files to Chativo?",
      "Does Chativo support team workspaces?",
      "Is single sign-on available?",
      "What is Chativo's exact daily message limit?",
      "Does Chativo meet SOC 2 requirements?",
      "Can I delete all stored account data automatically?"
    ]
  },
  {
    intent: "refusal",
    title: "Irrelevant and out-of-scope requests",
    description: "Politely refuses questions that are not about Chativo.",
    questions: [
      "What is the weather tomorrow?",
      "What is the capital of France?",
      "Who is the president of the United States?",
      "Write me a poem",
      "Write a job application email",
      "Give me a chicken recipe",
      "What was the cricket score?",
      "What is the Bitcoin price?",
      "What is the stock price of Apple?",
      "Solve 25 plus 17",
      "Diagnose my headache",
      "Give me legal advice",
      "Translate this paragraph into Urdu",
      "Tell me a joke",
      "Recommend a laptop",
      "Book a flight for me",
      "Explain quantum physics",
      "Create a React website",
      "Who won the football match?",
      "How do I cook pasta?"
    ]
  }
];

export const trainingQuestions = questionCategories.flatMap(category =>
  category.questions.map(question => ({
    question,
    intent: category.intent,
    category: category.title
  }))
);

