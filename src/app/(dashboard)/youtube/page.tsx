"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  Youtube,
  Link2,
  Sparkles,
  Copy,
  Check,
  Bookmark,
  Clock,
  Loader2,
  ChevronDown,
  ChevronUp,
  ListChecks,
  Lightbulb,
  Timer,
} from "lucide-react";

interface Summary {
  id: string;
  videoUrl: string;
  videoTitle: string;
  summary: string;
  bulletPoints: string[];
  keyInsights: string[];
  timestamps: { time: string; description: string }[];
  saved: boolean;
}

import { useAuth } from "@/context/AuthContext";
import { toast } from "react-hot-toast";

export default function YoutubePage() {
  const { user, updateCredits } = useAuth();
  const [url, setUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [summaries, setSummaries] = useState<Summary[]>([]);
  const [copied, setCopied] = useState(false);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const handleSummarize = async () => {
    if (!url.trim()) return;
    if (!user) return;
    
    if (user.credits < 3) {
      toast.error("Insufficient credits (Need 3)");
      return;
    }

    setIsLoading(true);

    try {
      // In a real production app, you'd use a package like 'youtube-transcript' 
      // or an API to get the text. For now, we'll simulate the transcript extraction
      // and send it to our AI route.
      const mockTranscript = `This is a transcript of the video at ${url}. It discusses building SaaS applications with Next.js 14, Supabase, and Stripe. The video covers server components, API routes, and deployment strategies.`;
      
      const res = await fetch("/api/ai/youtube", {
        method: "POST",
        body: JSON.stringify({ transcript: mockTranscript }),
      });
      
      const data = await res.json();
      
      if (res.ok) {
        // The API returns { result: { summary: "...", bulletPoints: [...], ... } }
        const result = JSON.parse(data.result);
        const newSummary: Summary = {
          id: Date.now().toString(),
          videoUrl: url,
          videoTitle: "AI Generated Summary", // Could be enhanced with a YouTube API call
          ...result,
          saved: false,
        };
        
        setSummaries([newSummary, ...summaries]);
        setExpandedId(newSummary.id);
        setUrl("");
        updateCredits(user.credits - 3);
        toast.success("Summary generated! (-3 credits)");
      } else {
        toast.error(data.error || "Failed to summarize");
      }
    } catch (err) {
      toast.error("AI service is currently unavailable");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const toggleSave = (id: string) => {
    setSummaries(summaries.map((s) => (s.id === id ? { ...s, saved: !s.saved } : s)));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <Youtube className="w-6 h-6 text-red-500" />
          YouTube Summariser
        </h1>
        <p className="text-sm text-[hsl(var(--muted-foreground))] mt-1">
          Paste a YouTube link and get AI-generated summaries with key insights
        </p>
      </div>

      {/* URL Input */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="p-6 rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--card))]"
      >
        <div className="flex gap-3">
          <div className="flex-1 flex items-center gap-3 px-4 py-3 rounded-xl bg-[hsl(var(--accent))] border border-[hsl(var(--border))]">
            <Link2 className="w-4 h-4 text-[hsl(var(--muted-foreground))] shrink-0" />
            <input
              type="text"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="Paste YouTube video URL..."
              className="flex-1 bg-transparent text-sm outline-none"
              onKeyDown={(e) => e.key === "Enter" && handleSummarize()}
            />
          </div>
          <button
            onClick={handleSummarize}
            disabled={!url.trim() || isLoading}
            className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-red-500 to-pink-500 text-white text-sm font-medium hover:opacity-90 transition-opacity disabled:opacity-50"
          >
            {isLoading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Sparkles className="w-4 h-4" />
            )}
            Summarize
          </button>
        </div>
        <p className="text-xs text-[hsl(var(--muted-foreground))] mt-2">
          💡 Cost: 3 credits per summary
        </p>
      </motion.div>

      {/* Summaries */}
      <div className="space-y-4">
        {summaries.map((summary, i) => (
          <motion.div
            key={summary.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] overflow-hidden"
          >
            {/* Summary Header */}
            <div
              className="p-5 cursor-pointer hover:bg-[hsl(var(--accent))/0.5] transition-colors"
              onClick={() => setExpandedId(expandedId === summary.id ? null : summary.id)}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="font-semibold text-sm mb-1">{summary.videoTitle}</h3>
                  <p className="text-xs text-[hsl(var(--muted-foreground))] flex items-center gap-1">
                    <Link2 className="w-3 h-3" />
                    {summary.videoUrl}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleSave(summary.id);
                    }}
                    className="p-2 rounded-lg hover:bg-[hsl(var(--accent))] transition-colors"
                  >
                    <Bookmark
                      className={`w-4 h-4 ${
                        summary.saved ? "fill-yellow-400 text-yellow-400" : "text-[hsl(var(--muted-foreground))]"
                      }`}
                    />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleCopy(summary.summary);
                    }}
                    className="p-2 rounded-lg hover:bg-[hsl(var(--accent))] transition-colors"
                  >
                    {copied ? (
                      <Check className="w-4 h-4 text-green-400" />
                    ) : (
                      <Copy className="w-4 h-4 text-[hsl(var(--muted-foreground))]" />
                    )}
                  </button>
                  {expandedId === summary.id ? (
                    <ChevronUp className="w-4 h-4 text-[hsl(var(--muted-foreground))]" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-[hsl(var(--muted-foreground))]" />
                  )}
                </div>
              </div>
            </div>

            {/* Expanded Content */}
            {expandedId === summary.id && (
              <motion.div
                initial={{ height: 0 }}
                animate={{ height: "auto" }}
                className="px-5 pb-5 space-y-5 border-t border-[hsl(var(--border))]"
              >
                {/* Summary */}
                <div className="pt-4">
                  <h4 className="text-sm font-semibold mb-2 flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-purple-400" />
                    Summary
                  </h4>
                  <p className="text-sm text-[hsl(var(--muted-foreground))] leading-relaxed">
                    {summary.summary}
                  </p>
                </div>

                {/* Bullet Points */}
                <div>
                  <h4 className="text-sm font-semibold mb-2 flex items-center gap-2">
                    <ListChecks className="w-4 h-4 text-green-400" />
                    Key Points
                  </h4>
                  <ul className="space-y-2">
                    {summary.bulletPoints.map((point, j) => (
                      <li key={j} className="flex items-start gap-2 text-sm text-[hsl(var(--muted-foreground))]">
                        <span className="w-1.5 h-1.5 rounded-full bg-green-400 mt-2 shrink-0" />
                        {point}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Key Insights */}
                <div>
                  <h4 className="text-sm font-semibold mb-2 flex items-center gap-2">
                    <Lightbulb className="w-4 h-4 text-yellow-400" />
                    Key Insights
                  </h4>
                  <div className="grid md:grid-cols-2 gap-2">
                    {summary.keyInsights.map((insight, j) => (
                      <div
                        key={j}
                        className="p-3 rounded-xl bg-[hsl(var(--accent))] text-sm"
                      >
                        {insight}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Timestamps */}
                <div>
                  <h4 className="text-sm font-semibold mb-2 flex items-center gap-2">
                    <Timer className="w-4 h-4 text-blue-400" />
                    Timestamps
                  </h4>
                  <div className="space-y-1.5">
                    {summary.timestamps.map((ts, j) => (
                      <div
                        key={j}
                        className="flex items-center gap-3 p-2 rounded-lg hover:bg-[hsl(var(--accent))] transition-colors cursor-pointer"
                      >
                        <span className="text-xs font-mono text-purple-400 w-14">{ts.time}</span>
                        <span className="text-sm text-[hsl(var(--muted-foreground))]">
                          {ts.description}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
          </motion.div>
        ))}
      </div>

      {summaries.length === 0 && !isLoading && (
        <div className="text-center py-16">
          <Youtube className="w-12 h-12 text-[hsl(var(--muted-foreground))] mx-auto mb-4 opacity-50" />
          <p className="text-[hsl(var(--muted-foreground))]">
            Paste a YouTube URL above to get started
          </p>
        </div>
      )}
    </div>
  );
}
