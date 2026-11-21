
import React, { useState, useEffect, useRef } from "react";

function AIChat({
  onClose,
  onSendMessage,
  messages = [],
  loading = false,
  partner,
}) {
  const [message, setMessage] = useState("");
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "end",
    });
  }, [messages, loading]);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const sendMessage = (text) => {
    const trimmed = text.trim();

    if (!trimmed || loading || !onSendMessage) return;

    onSendMessage(trimmed);
    setMessage("");
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    sendMessage(message);
  };

  const clearChat = () => {
    if (typeof onClose === "function") {
      onClose();
    }
  };

  const firstName =
    partner?.name?.trim()?.split(" ")[0] || "Partner";

  const suggestions = [
    {
      icon: "💳",
      title: "Analyze transactions",
      description: "Review transaction activity and status",
      prompt: "Give me an overview of my recent transactions.",
      color: "blue",
    },
    {
      icon: "⚠️",
      title: "Failed payments",
      description: "Investigate failed transactions",
      prompt: "Analyze my failed transactions and explain possible reasons.",
      color: "rose",
    },
    {
      icon: "📊",
      title: "Financial summary",
      description: "Understand your business performance",
      prompt: "Give me a financial summary of my transaction performance.",
      color: "emerald",
    },
    {
      icon: "🎫",
      title: "Support tickets",
      description: "Review pending support requests",
      prompt: "Show me an overview of my support tickets.",
      color: "violet",
    },
  ];

  const colorStyles = {
    blue: "border-blue-100 hover:border-blue-300 hover:bg-blue-50",
    rose: "border-rose-100 hover:border-rose-300 hover:bg-rose-50",
    emerald: "border-emerald-100 hover:border-emerald-300 hover:bg-emerald-50",
    violet: "border-violet-100 hover:border-violet-300 hover:bg-violet-50",
  };

  return (
    <div className="flex min-h-[calc(100vh-0px)] flex-1 flex-col bg-slate-50">

      {/* HEADER */}
      <header className="sticky top-0 z-20 flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 bg-white px-5 py-4 sm:px-8">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 text-xl shadow-md shadow-blue-200">
            🤖
          </div>

          <div>
            <h1 className="text-base font-bold text-slate-900">
              AI Support Worker
            </h1>
            <p className="text-xs text-slate-500">
              Intelligent Partner Assistance
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 rounded-full border border-emerald-100 bg-emerald-50 px-3 py-1.5">
            <span className="h-2 w-2 rounded-full bg-emerald-500" />
            <span className="text-xs font-medium text-emerald-700">
              Assistant Ready
            </span>
          </div>

          {messages.length > 0 && (
            <button
              onClick={clearChat}
              type="button"
              className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-600 transition hover:bg-slate-100"
            >
              ↺ New Conversation
            </button>
          )}
        </div>
      </header>

      {/* MAIN CONTENT */}
      <main className="mx-auto flex w-full max-w-5xl flex-1 flex-col px-4 py-8 sm:px-8">

        {/* WELCOME */}
        {messages.length === 0 && !loading && (
          <div className="flex flex-1 flex-col items-center justify-center py-6">

            {/* AI ICON */}
            <div className="relative mb-6">
              <div className="flex h-20 w-20 items-center justify-center rounded-[28px] bg-gradient-to-br from-blue-600 to-indigo-600 text-4xl shadow-xl shadow-blue-200">
                🤖
              </div>

              <span className="absolute -bottom-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full border-4 border-slate-50 bg-emerald-500">
                <span className="h-2 w-2 rounded-full bg-white" />
              </span>
            </div>

            {/* GREETING */}
            <div className="text-center">
              <p className="mb-2 text-sm font-semibold text-blue-600">
                EKO PARTNER INTELLIGENCE
              </p>

              <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
                Hello, {firstName} 👋
              </h2>

              <p className="mt-3 text-lg font-medium text-slate-600">
                How can I help you today?
              </p>

              <p className="mx-auto mt-2 max-w-xl text-sm leading-6 text-slate-500">
                Your intelligent support assistant for transactions, financial
                insights, failed payments, and partner support operations.
              </p>
            </div>

            {/* PROMPT CARDS */}
            <div className="mt-9 grid w-full grid-cols-1 gap-4 sm:grid-cols-2">
              {suggestions.map((item) => (
                <button
                  key={item.title}
                  type="button"
                  disabled={loading}
                  onClick={() => sendMessage(item.prompt)}
                  className={`group flex gap-4 rounded-2xl border bg-white p-5 text-left transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md disabled:opacity-50 ${colorStyles[item.color]}`}
                >
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-2xl transition group-hover:scale-105">
                    {item.icon}
                  </div>

                  <div className="min-w-0 flex-1">
                    <h3 className="text-sm font-bold text-slate-800">
                      {item.title}
                    </h3>

                    <p className="mt-1 text-xs leading-5 text-slate-500">
                      {item.description}
                    </p>
                  </div>

                  <span className="self-center text-lg text-slate-300 transition group-hover:translate-x-1 group-hover:text-slate-500">
                    →
                  </span>
                </button>
              ))}
            </div>

            {/* EXAMPLE PROMPTS */}
            <div className="mt-8 flex flex-wrap justify-center gap-2">
              {[
                "What is my transaction success rate?",
                "Find pending transactions",
                "Explain a failed transaction",
              ].map((prompt) => (
                <button
                  key={prompt}
                  type="button"
                  onClick={() => sendMessage(prompt)}
                  className="rounded-full border border-slate-200 bg-white px-4 py-2 text-xs text-slate-600 transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700"
                >
                  {prompt}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* CONVERSATION */}
        {(messages.length > 0 || loading) && (
          <div className="mx-auto w-full max-w-3xl flex-1 py-4">
            {messages.map((msg, index) => {
              const isUser =
                msg.sender === "user" || msg.role === "user";

              const text = msg.text || msg.content || "";

              return (
                <div
                  key={msg._id || index}
                  className={`mb-6 flex gap-3 ${
                    isUser ? "justify-end" : "justify-start"
                  }`}
                >
                  {!isUser && (
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 text-sm text-white shadow-sm">
                      🤖
                    </div>
                  )}

                  <div
                    className={`max-w-[85%] rounded-2xl px-4 py-3 sm:max-w-[75%] ${
                      isUser
                        ? "rounded-br-md bg-blue-600 text-white shadow-sm"
                        : "rounded-bl-md border border-slate-200 bg-white text-slate-800 shadow-sm"
                    }`}
                  >
                    <p className="whitespace-pre-wrap break-words text-sm leading-7">
                      {text}
                    </p>
                  </div>

                  {isUser && (
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-slate-200 text-sm">
                      👤
                    </div>
                  )}
                </div>
              );
            })}

            {/* TYPING */}
            {loading && (
              <div className="mb-6 flex items-end gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 text-sm text-white">
                  🤖
                </div>

                <div className="rounded-2xl rounded-bl-md border border-slate-200 bg-white px-4 py-4 shadow-sm">
                  <div className="flex gap-1.5">
                    <span className="h-2 w-2 animate-bounce rounded-full bg-blue-400 [animation-delay:-0.3s]" />
                    <span className="h-2 w-2 animate-bounce rounded-full bg-blue-400 [animation-delay:-0.15s]" />
                    <span className="h-2 w-2 animate-bounce rounded-full bg-blue-400" />
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>
        )}

        {/* INPUT */}
        <div className="sticky bottom-0 mt-auto w-full pt-6">
          <form
            onSubmit={handleSubmit}
            className="rounded-2xl border border-slate-200 bg-white p-2 shadow-lg shadow-slate-200/50 transition focus-within:border-blue-300 focus-within:ring-4 focus-within:ring-blue-50"
          >
            <div className="flex items-end gap-2">
              <textarea
                ref={inputRef}
                rows={1}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    sendMessage(message);
                  }
                }}
                placeholder="Ask about transactions, payments, analytics or support..."
                disabled={loading}
                className="max-h-32 min-h-[48px] flex-1 resize-none bg-transparent px-4 py-3 text-sm text-slate-800 outline-none placeholder:text-slate-400 disabled:opacity-60"
              />

              <button
                type="submit"
                disabled={loading || !message.trim()}
                className="mb-1 flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-600 text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-slate-300"
                title="Send message"
              >
                <span className="text-lg">➤</span>
              </button>
            </div>
          </form>

          <p className="py-3 text-center text-[10px] text-slate-400">
            Eko AI may make mistakes. Verify important financial information.
          </p>
        </div>
      </main>
    </div>
  );
}

export default AIChat;
  