"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  Users,
  Sparkles,
  Loader2,
  Copy,
  Check,
  ListChecks,
  CheckSquare,
  AlertCircle,
  ClipboardList,
} from "lucide-react";

import { useAuth } from "@/context/AuthContext";
import { toast } from "react-hot-toast";

export default function MeetingsPage() {
  const { user, updateCredits } = useAuth();
  const [transcript, setTranscript] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [copied, setCopied] = useState(false);
  const [result, setResult] = useState<{
    summary: string;
    decisions: string[];
    actionItems: { task: string; assignee: string; deadline: string }[];
    followUps: string[];
  } | null>(null);

  const handleProcess = async () => {
    if (!transcript.trim()) return;
    if (!user) return;

    if (user.credits < 3) {
      toast.error("Insufficient credits (Need 3)");
      return;
    }

    setIsProcessing(true);
    try {
      const res = await fetch("/api/ai/meetings/analyze", {
        method: "POST",
        body: JSON.stringify({ transcript }),
      });
      
      const data = await res.json();
      
      if (res.ok) {
        setResult(data);
        updateCredits(user.credits - 3);
        toast.success("Analysis complete! (-3 credits)");
      } else {
        toast.error(data.error || "Analysis failed");
      }
    } catch (err) {
      toast.error("AI service error");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <Users className="w-6 h-6 text-violet-400" />
          AI Meeting Notes
        </h1>
        <p className="text-sm text-[hsl(var(--muted-foreground))] mt-1">
          Paste meeting transcripts and get AI-generated summaries, decisions, and action items
        </p>
      </div>

      {/* Input */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="p-6 rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--card))]"
      >
        <h2 className="text-lg font-semibold mb-3">Meeting Transcript</h2>
        <textarea
          value={transcript}
          onChange={(e) => setTranscript(e.target.value)}
          placeholder="Paste your meeting transcript or discussion notes here..."
          rows={8}
          className="w-full px-4 py-3 rounded-xl bg-[hsl(var(--accent))] border border-[hsl(var(--border))] text-sm outline-none resize-none focus:ring-2 focus:ring-purple-500/50"
        />
        <button
          onClick={handleProcess}
          disabled={!transcript.trim() || isProcessing}
          className="mt-4 w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-gradient-to-r from-violet-500 to-purple-500 text-white font-medium hover:opacity-90 transition-opacity disabled:opacity-50"
        >
          {isProcessing ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <Sparkles className="w-5 h-5" />
          )}
          Generate Meeting Notes (3 credits)
        </button>
      </motion.div>

      {/* Results */}
      {result && (
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Summary */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-6 rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] lg:col-span-2"
          >
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-lg font-semibold flex items-center gap-2">
                <ClipboardList className="w-5 h-5 text-purple-400" />
                Meeting Summary
              </h2>
              <button onClick={() => handleCopy(result.summary)}>
                {copied ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4 text-[hsl(var(--muted-foreground))]" />}
              </button>
            </div>
            <p className="text-sm text-[hsl(var(--muted-foreground))] leading-relaxed">{result.summary}</p>
          </motion.div>

          {/* Decisions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="p-6 rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--card))]"
          >
            <h2 className="text-lg font-semibold mb-3 flex items-center gap-2">
              <CheckSquare className="w-5 h-5 text-green-400" />
              Key Decisions
            </h2>
            <ul className="space-y-2">
              {result.decisions.map((d, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-[hsl(var(--muted-foreground))]">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-400 mt-2 shrink-0" />
                  {d}
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Action Items */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="p-6 rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--card))]"
          >
            <h2 className="text-lg font-semibold mb-3 flex items-center gap-2">
              <ListChecks className="w-5 h-5 text-orange-400" />
              Action Items
            </h2>
            <div className="space-y-2">
              {result.actionItems.map((item, i) => (
                <div key={i} className="p-3 rounded-xl bg-[hsl(var(--accent))] flex items-start justify-between gap-3">
                  <div>
                    <p className="text-sm font-medium">{item.task}</p>
                    <p className="text-xs text-[hsl(var(--muted-foreground))] mt-0.5">
                      Assigned to: <span className="text-purple-400">{item.assignee}</span>
                    </p>
                  </div>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-orange-500/10 text-orange-400 whitespace-nowrap">
                    Due: {item.deadline}
                  </span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Follow-ups */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="p-6 rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] lg:col-span-2"
          >
            <h2 className="text-lg font-semibold mb-3 flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-blue-400" />
              Follow-ups
            </h2>
            <div className="grid md:grid-cols-2 gap-2">
              {result.followUps.map((f, i) => (
                <div key={i} className="flex items-center gap-2 p-3 rounded-xl bg-[hsl(var(--accent))]">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-400 shrink-0" />
                  <span className="text-sm text-[hsl(var(--muted-foreground))]">{f}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
