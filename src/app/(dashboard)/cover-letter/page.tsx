"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Mail, Sparkles, Download, Save, Copy, Check, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

const TONES = ["Professional", "Friendly", "Enthusiastic", "Formal", "Conversational"];

import { useAuth } from "@/context/AuthContext";
import { toast } from "react-hot-toast";

export default function CoverLetterPage() {
  const { user, updateCredits } = useAuth();
  const [jobDescription, setJobDescription] = useState("");
  const [tone, setTone] = useState("Professional");
  const [coverLetter, setCoverLetter] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleGenerate = async () => {
    if (!jobDescription.trim()) return;
    if (!user) return;

    if (user.credits < 3) {
      toast.error("Insufficient credits (Need 3)");
      return;
    }

    setIsGenerating(true);
    try {
      const res = await fetch("/api/ai/cover-letter/generate", {
        method: "POST",
        body: JSON.stringify({ jobDescription, tone }),
      });
      
      const data = await res.json();
      
      if (res.ok) {
        setCoverLetter(data.coverLetter);
        updateCredits(user.credits - 3);
        toast.success("Cover letter generated! (-3 credits)");
      } else {
        toast.error(data.error || "Generation failed");
      }
    } catch (err) {
      toast.error("AI service error");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(coverLetter);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <Mail className="w-6 h-6 text-indigo-400" />
          AI Cover Letter Generator
        </h1>
        <p className="text-sm text-[hsl(var(--muted-foreground))] mt-1">
          Generate personalized cover letters based on job descriptions
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Input */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-4"
        >
          <div className="p-6 rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--card))]">
            <h2 className="text-lg font-semibold mb-4">Job Description</h2>
            <textarea
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              placeholder="Paste the job description here..."
              rows={10}
              className="w-full px-4 py-3 rounded-xl bg-[hsl(var(--accent))] border border-[hsl(var(--border))] text-sm outline-none resize-none focus:ring-2 focus:ring-purple-500/50"
            />
          </div>

          <div className="p-6 rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--card))]">
            <h2 className="text-lg font-semibold mb-4">Tone</h2>
            <div className="flex flex-wrap gap-2">
              {TONES.map((t) => (
                <button
                  key={t}
                  onClick={() => setTone(t)}
                  className={cn(
                    "px-4 py-2 rounded-xl text-sm transition-all",
                    tone === t
                      ? "bg-gradient-to-r from-purple-500/20 to-pink-500/10 text-purple-400 border border-purple-500/30"
                      : "border border-[hsl(var(--border))] text-[hsl(var(--muted-foreground))] hover:bg-[hsl(var(--accent))]"
                  )}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={handleGenerate}
            disabled={!jobDescription.trim() || isGenerating}
            className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 text-white font-medium hover:opacity-90 transition-opacity disabled:opacity-50"
          >
            {isGenerating ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <Sparkles className="w-5 h-5" />
            )}
            Generate Cover Letter (3 credits)
          </button>
        </motion.div>

        {/* Output */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="p-6 rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--card))]"
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Generated Cover Letter</h2>
            {coverLetter && (
              <div className="flex items-center gap-2">
                <button
                  onClick={handleCopy}
                  className="p-2 rounded-lg hover:bg-[hsl(var(--accent))] transition-colors"
                >
                  {copied ? (
                    <Check className="w-4 h-4 text-green-400" />
                  ) : (
                    <Copy className="w-4 h-4 text-[hsl(var(--muted-foreground))]" />
                  )}
                </button>
                <button className="p-2 rounded-lg hover:bg-[hsl(var(--accent))] transition-colors">
                  <Download className="w-4 h-4 text-[hsl(var(--muted-foreground))]" />
                </button>
                <button className="p-2 rounded-lg hover:bg-[hsl(var(--accent))] transition-colors">
                  <Save className="w-4 h-4 text-[hsl(var(--muted-foreground))]" />
                </button>
              </div>
            )}
          </div>
          {coverLetter ? (
            <div className="whitespace-pre-wrap text-sm leading-relaxed text-[hsl(var(--foreground))]">
              {coverLetter}
            </div>
          ) : (
            <div className="text-center py-16">
              <Mail className="w-12 h-12 text-[hsl(var(--muted-foreground))] mx-auto mb-4 opacity-50" />
              <p className="text-[hsl(var(--muted-foreground))]">
                Paste a job description and generate your cover letter
              </p>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
