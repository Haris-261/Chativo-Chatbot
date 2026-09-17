import { useEffect, useRef, useState } from "react";

const SITE = "https://chativo.mbstack.net";

const suggestions = [
  { label: "Models", text: "Which five AI models are available?" },
  { label: "Guest access", text: "Can I try Chativo before paying?" },
  { label: "Packages", text: "What does the Plus plan include?" }
];

const topics = [
  ["01", "How it works", "Compare, choose, continue", "What is Chativo and how does it work?"],
  ["02", "Plans & pricing", "Starter, Plus, and Pro", "Compare the Starter, Plus, and Pro plans."],
  ["03", "Refunds", "Eligibility and timelines", "How do refunds work?"],
  ["04", "Support", "Email and phone details", "How can I contact Chativo support?"]
];

function BrandMark() {
  return (
    <svg viewBox="0 0 64 64" fill="none" aria-hidden="true">
      <path d="M46.5 18.2C42.2 13.4 36 10.5 29.2 10.5 17.1 10.5 7.3 20.3 7.3 32.4c0 12.1 9.8 21.9 21.9 21.9 6.8 0 13-2.9 17.3-7.7" />
      <path d="M42.2 21.2C38.8 17.5 34 15.2 28.6 15.2c-9.5 0-17.2 7.7-17.2 17.2s7.7 17.2 17.2 17.2c5.4 0 10.2-2.3 13.6-6" opacity=".7" />
      <path d="M37.4 25c-2.3-2.5-5.7-4.1-9.4-4.1-6.4 0-11.5 5.1-11.5 11.5S21.6 43.9 28 43.9c3.7 0 7.1-1.6 9.4-4.1" opacity=".42" />
      <circle cx="47.2" cy="32.4" r="3.2" fill="currentColor" stroke="none" />
    </svg>
  );
}

function AnswerBlocks({ blocks }) {
  return blocks.map((block, index) => {
    if (block.type === "list") {
      return (
        <ul key={index}>
          {block.items.map((item, itemIndex) => <li key={itemIndex}>{item}</li>)}
        </ul>
      );
    }
    return <p key={index}>{block.text}</p>;
  });
}

function Message({ message }) {
  const isUser = message.role === "user";
  return (
    <div className={`message-row ${message.role} ${message.type === "refusal" ? "refusal" : ""}`}>
      {!isUser && <span className="message-avatar" aria-hidden="true">C</span>}
      <div className="message-body">
        <div className="message-bubble">
          {isUser ? <p>{message.text}</p> : <AnswerBlocks blocks={message.blocks} />}
        </div>
        {!isUser && message.sources?.length > 0 && (
          <div className="source-row">
            {message.sources.map(source => (
              <a href={source.url} target="_blank" rel="noreferrer" key={source.url}>{source.label}</a>
            ))}
          </div>
        )}
        <div className="message-meta">{isUser ? "You" : "Chativo assistant"} · {message.time}</div>
      </div>
    </div>
  );
}

function App() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [lastIntent, setLastIntent] = useState(null);
  const scrollerRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    const scroller = scrollerRef.current;
    if (scroller) scroller.scrollTop = scroller.scrollHeight;
  }, [messages, loading]);

  useEffect(() => {
    const textBox = inputRef.current;
    if (!textBox) return;
    textBox.style.height = "auto";
    textBox.style.height = `${Math.min(textBox.scrollHeight, 144)}px`;
  }, [input]);

  const timeLabel = () => new Intl.DateTimeFormat([], { hour: "numeric", minute: "2-digit" }).format(new Date());

  async function submitQuestion(question) {
    const text = question.trim();
    if (!text || loading) return;

    setMessages(current => [...current, { role: "user", text, time: timeLabel() }]);
    setInput("");
    setLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text, lastIntent })
      });
      const payload = await response.json();
      if (!response.ok) throw new Error(payload.error || "The assistant is unavailable.");

      setMessages(current => [...current, {
        role: "assistant",
        type: payload.type,
        blocks: payload.answer.blocks,
        sources: payload.answer.sources,
        time: timeLabel()
      }]);
      if (payload.intent && !["hello", "thanks", "unknown", "refusal"].includes(payload.intent)) {
        setLastIntent(payload.intent);
      }
    } catch (error) {
      setMessages(current => [...current, {
        role: "assistant",
        type: "refusal",
        blocks: [{ type: "paragraph", text: `${error.message} Please confirm that the Express API and MongoDB are running.` }],
        sources: [],
        time: timeLabel()
      }]);
    } finally {
      setLoading(false);
      inputRef.current?.focus();
    }
  }

  function handleSubmit(event) {
    event.preventDefault();
    submitQuestion(input);
  }

  function resetChat() {
    setMessages([]);
    setLastIntent(null);
    setInput("");
    inputRef.current?.focus();
  }

  return (
    <>
      <div className="ambient ambient-one" aria-hidden="true" />
      <div className="ambient ambient-two" aria-hidden="true" />
      <main className="app-shell">
        <aside className="sidebar" aria-label="Product assistant information">
          <a className="brand" href={SITE} target="_blank" rel="noreferrer">
            <span className="brand-mark"><BrandMark /></span>
            <span><strong>Chativo</strong><small>Product assistant</small></span>
          </a>

          <section className="sidebar-intro">
            <span className="eyebrow">Official-site knowledge</span>
            <h1>Answers about Chativo. Nothing else.</h1>
            <p>Ask about features, models, packages, billing, refunds, cancellations, or support. Answers stay inside Chativo&apos;s published information.</p>
          </section>

          <nav className="topic-list" aria-label="Popular question topics">
            {topics.map(([number, title, detail, question]) => (
              <button className="topic-button" onClick={() => submitQuestion(question)} key={number} type="button">
                <span className="topic-icon">{number}</span>
                <span><strong>{title}</strong><small>{detail}</small></span>
                <span className="arrow">↗</span>
              </button>
            ))}
          </nav>

          <div className="scope-card">
            <span className="scope-dot" aria-hidden="true" />
            <div><strong>Server-enforced grounding</strong><p>Answers are loaded from MongoDB. Missing evidence produces a refusal.</p></div>
          </div>
        </aside>

        <section className="chat-panel" aria-label="Chat with the Chativo product assistant">
          <header className="chat-header">
            <div className="assistant-identity">
              <span className="assistant-avatar" aria-hidden="true">C</span>
              <span><strong>Ask Chativo</strong><small><i /> Online Assistant</small></span>
            </div>
            <div className="header-actions">
              <a className="visit-link" href={SITE} target="_blank" rel="noreferrer">Visit Chativo <span>↗</span></a>
              <button className="icon-button" onClick={resetChat} type="button" aria-label="Start a new conversation" title="New conversation">
                <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 12a8 8 0 1 0 2.34-5.66L4 8.68M4 4v4.68h4.68" /></svg>
              </button>
            </div>
          </header>

          <div className="chat-scroll" ref={scrollerRef} aria-live="polite">
            <div className="chat-content">
              {messages.length === 0 && (
                <div className="welcome-block">
                  <div className="welcome-logo" aria-hidden="true"><span className="ring ring-one" /><span className="ring ring-two" /><span className="welcome-core">C</span></div>
                  <span className="eyebrow">Chativo knowledge desk</span>
                  <h2>What would you like to know?</h2>
                  <p>I answer from Chativo&apos;s public website and policies.</p>
                  <div className="welcome-message">
                    <span className="message-avatar" aria-hidden="true">C</span>
                    <p>Hi! Ask me anything about Chativo—its models, packages, guest access, billing, policies, or support.</p>
                  </div>
                  <div className="suggestion-grid">
                    {suggestions.map(suggestion => (
                      <button onClick={() => submitQuestion(suggestion.text)} key={suggestion.label} type="button">
                        <span className="suggestion-label">{suggestion.label}</span>
                        <strong>{suggestion.text}</strong><span className="suggestion-arrow">→</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
              {messages.map((message, index) => <Message message={message} key={`${message.role}-${index}`} />)}
              {loading && (
                <div className="message-row assistant">
                  <span className="message-avatar" aria-hidden="true">C</span>
                  <div className="message-body"><div className="message-bubble"><span className="typing" aria-label="Chativo assistant is typing"><i /><i /><i /></span></div></div>
                </div>
              )}
            </div>
          </div>

          <div className="composer-wrap">
            <form className="composer" onSubmit={handleSubmit}>
              <label className="sr-only" htmlFor="message-input">Ask a question about Chativo</label>
              <textarea
                id="message-input"
                ref={inputRef}
                rows="1"
                maxLength="500"
                value={input}
                onChange={event => setInput(event.target.value)}
                onKeyDown={event => {
                  if (event.key === "Enter" && !event.shiftKey) {
                    event.preventDefault();
                    event.currentTarget.form.requestSubmit();
                  }
                }}
                placeholder="Message Ask Chativo…"
                autoComplete="off"
                aria-describedby="composer-help"
              />
              <button className="send-button" type="submit" aria-label="Send message" disabled={loading || !input.trim()}>
                <svg viewBox="0 0 24 24" aria-hidden="true"><path d="m5 12 14-7-4.8 14-2.7-5.5L5 12Z" /><path d="m11.5 13.5 3.5-3.5" /></svg>
              </button>
            </form>
            <p className="composer-note" id="composer-help">Enter to send · Shift + Enter for a new line · Answers use reviewed content from <a href={SITE} target="_blank" rel="noreferrer">chativo.mbstack.net</a>.</p>
          </div>
        </section>
      </main>
    </>
  );
}

export default App;
