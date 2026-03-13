"use client";

import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Send,
  Bot,
  User,
  Sparkles,
  StickyNote,
  Youtube,
  Briefcase,
  FileText,
  Loader2,
  Copy,
  Check,
} from "lucide-react";
import { ChatMessage } from "@/types";
import { cn } from "@/lib/utils";

const TOOL_ICONS: Record<string, React.ElementType> = {
  notes: StickyNote,
  youtube: Youtube,
  jobs: Briefcase,
  resume: FileText,
};

const SUGGESTIONS = [
  "Summarize this YouTube video: https://youtube.com/watch?v=...",
  "Find remote frontend developer jobs",
  "Create a resume for a software engineer",
  "Summarize my latest notes",
  "Generate a cover letter for Google",
];

import { useAuth } from "@/context/AuthContext";
import { toast } from "react-hot-toast";

export default function AssistantPage() {
  const { user, updateCredits } = useAuth();
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "welcome",
      role: "assistant",
      content:
        "👋 Hi! I'm your AI assistant. I can help you with:\n\n• **Summarize YouTube videos** — just paste a link\n• **Search for jobs** — tell me the role and location\n• **Build resumes** — describe your experience\n• **Summarize documents** — upload or paste text\n• **Generate cover letters** — share the job description\n• **Take meeting notes** — paste the transcript\n\nWhat would you like to do?",
      timestamp: new Date().toISOString(),
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [copied, setCopied] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;
    if (!user) return;

    if (user.credits < 1) {
      toast.error("Insufficient credits");
      return;
    }

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: "user",
      content: input,
      timestamp: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const res = await fetch("/api/ai/chat", {
        method: "POST",
        body: JSON.stringify({ 
          message: userMessage.content,
          context: messages.slice(-5) // Send last 5 messages for context
        }),
      });

      const data = await res.json();

      if (res.ok) {
        const aiMessage: ChatMessage = {
          id: (Date.now() + 1).toString(),
          role: "assistant",
          content: data.response,
          tool_used: data.tool || "general",
          timestamp: new Date().toISOString(),
        };
        setMessages((prev) => [...prev, aiMessage]);
        updateCredits(user.credits - 1);
      } else {
        toast.error(data.error || "Failed to get response");
      }
    } catch (err) {
      toast.error("AI service error");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-112px)]">
      {/* Header */}
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
          <Bot className="w-5 h-5 text-white" />
        </div>
        <div>
          <h1 className="text-xl font-bold">AI Assistant</h1>
          <p className="text-sm text-[hsl(var(--muted-foreground))]">
            Your intelligent productivity companion
          </p>
        </div>
        <div className="ml-auto flex items-center gap-2 px-3 py-1 rounded-full bg-green-500/10 border border-green-500/20">
          <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
          <span className="text-xs text-green-400 font-medium">Online</span>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto pr-2 space-y-4">
        <AnimatePresence>
          {messages.map((msg) => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={cn(
                "flex gap-3",
                msg.role === "user" ? "justify-end" : "justify-start"
              )}
            >
              {msg.role === "assistant" && (
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center shrink-0 mt-1">
                  <Sparkles className="w-4 h-4 text-white" />
                </div>
              )}
              <div
                className={cn(
                  "max-w-[70%] rounded-2xl p-4 text-sm leading-relaxed relative group",
                  msg.role === "user"
                    ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white"
                    : "bg-[hsl(var(--accent))] border border-[hsl(var(--border))]"
                )}
              >
                {msg.tool_used && msg.tool_used !== "general" && (
                  <div className="flex items-center gap-1.5 mb-2 text-xs text-purple-400">
                    <Sparkles className="w-3 h-3" />
                    Tool: {msg.tool_used}
                  </div>
                )}
                <div className="whitespace-pre-wrap">{msg.content}</div>
                {msg.role === "assistant" && (
                  <button
                    onClick={() => handleCopy(msg.content, msg.id)}
                    className="absolute top-2 right-2 p-1.5 rounded-lg bg-[hsl(var(--card))] opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    {copied === msg.id ? (
                      <Check className="w-3 h-3 text-green-400" />
                    ) : (
                      <Copy className="w-3 h-3 text-[hsl(var(--muted-foreground))]" />
                    )}
                  </button>
                )}
              </div>
              {msg.role === "user" && (
                <div className="w-8 h-8 rounded-lg bg-[hsl(var(--accent))] flex items-center justify-center shrink-0 mt-1">
                  <User className="w-4 h-4" />
                </div>
              )}
            </motion.div>
          ))}
        </AnimatePresence>

        {isLoading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex gap-3"
          >
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center shrink-0">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <div className="px-4 py-3 rounded-2xl bg-[hsl(var(--accent))] border border-[hsl(var(--border))]">
              <div className="flex items-center gap-2 text-sm text-[hsl(var(--muted-foreground))]">
                <Loader2 className="w-4 h-4 animate-spin" />
                Thinking...
              </div>
            </div>
          </motion.div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Suggestions */}
      {messages.length <= 1 && (
        <div className="flex flex-wrap gap-2 mt-4 mb-2">
          {SUGGESTIONS.map((s) => (
            <button
              key={s}
              onClick={() => setInput(s)}
              className="px-3 py-1.5 text-xs rounded-lg border border-[hsl(var(--border))] hover:bg-[hsl(var(--accent))] transition-colors text-[hsl(var(--muted-foreground))]"
            >
              {s.length > 50 ? s.slice(0, 50) + "..." : s}
            </button>
          ))}
        </div>
      )}

      {/* Input */}
      <div className="mt-4 flex items-end gap-3 p-4 rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--card))]">
        <textarea
          ref={inputRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ask me anything..."
          rows={1}
          className="flex-1 resize-none bg-transparent text-sm outline-none placeholder:text-[hsl(var(--muted-foreground))] max-h-32"
        />
        <button
          onClick={handleSend}
          disabled={!input.trim() || isLoading}
          className="p-2.5 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:opacity-90 transition-opacity disabled:opacity-50"
        >
          <Send className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
