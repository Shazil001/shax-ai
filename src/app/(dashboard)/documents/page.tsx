"use client";

import React, { useState, useRef } from "react";
import { motion } from "framer-motion";
import {
  FileSearch,
  Upload,
  Sparkles,
  FileText,
  Copy,
  Check,
  Loader2,
  X,
  ListChecks,
  Quote,
  BookOpen,
} from "lucide-react";

import { useAuth } from "@/context/AuthContext";
import { toast } from "react-hot-toast";

export default function DocumentsPage() {
  const { user, updateCredits } = useAuth();
  const [file, setFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [result, setResult] = useState<{
    summary: string;
    keyPoints: string[];
    quotes: string[];
    studyNotes: string;
  } | null>(null);
  const [copied, setCopied] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f) setFile(f);
  };

  const handleProcess = async () => {
    if (!file) return;
    if (!user) return;

    if (user.credits < 3) {
      toast.error("Insufficient credits (Need 3)");
      return;
    }

    setIsProcessing(true);

    try {
      // In a production environment, you would use a library like pdf-parse on the server.
      // For this demo, we'll read the file as text on the client.
      const content = await file.text();
      
      const res = await fetch("/api/ai/documents/analyze", {
        method: "POST",
        body: JSON.stringify({ fileName: file.name, content }),
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
      toast.error("File processing error");
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
          <FileSearch className="w-6 h-6 text-teal-400" />
          Document Summariser
        </h1>
        <p className="text-sm text-[hsl(var(--muted-foreground))] mt-1">
          Upload PDFs, DOCX files, or research papers for AI analysis
        </p>
      </div>

      {/* Upload Area */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="p-8 rounded-2xl border-2 border-dashed border-[hsl(var(--border))] bg-[hsl(var(--card))] text-center hover:border-purple-500/30 transition-colors cursor-pointer"
        onClick={() => fileRef.current?.click()}
      >
        <input
          ref={fileRef}
          type="file"
          accept=".pdf,.docx,.doc,.txt"
          onChange={handleUpload}
          className="hidden"
        />
        <Upload className="w-10 h-10 text-[hsl(var(--muted-foreground))] mx-auto mb-3" />
        <p className="text-sm font-medium mb-1">
          {file ? file.name : "Drop your document here or click to browse"}
        </p>
        <p className="text-xs text-[hsl(var(--muted-foreground))]">
          Supports PDF, DOCX, TXT • Max 10MB
        </p>
      </motion.div>

      {file && !result && (
        <div className="flex items-center gap-3">
          <div className="flex-1 flex items-center gap-3 px-4 py-3 rounded-xl bg-[hsl(var(--accent))] border border-[hsl(var(--border))]">
            <FileText className="w-5 h-5 text-teal-400" />
            <span className="text-sm">{file.name}</span>
            <span className="text-xs text-[hsl(var(--muted-foreground))]">
              ({(file.size / 1024).toFixed(1)} KB)
            </span>
            <button onClick={() => setFile(null)} className="ml-auto">
              <X className="w-4 h-4 text-[hsl(var(--muted-foreground))]" />
            </button>
          </div>
          <button
            onClick={handleProcess}
            disabled={isProcessing}
            className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-teal-500 to-cyan-500 text-white text-sm font-medium hover:opacity-90 transition-opacity disabled:opacity-50"
          >
            {isProcessing ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Sparkles className="w-4 h-4" />
            )}
            Analyze (3 credits)
          </button>
        </div>
      )}

      {/* Results */}
      {result && (
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Summary */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-6 rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--card))]"
          >
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-lg font-semibold flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-purple-400" />
                Summary
              </h2>
              <button onClick={() => handleCopy(result.summary)}>
                {copied ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4 text-[hsl(var(--muted-foreground))]" />}
              </button>
            </div>
            <p className="text-sm text-[hsl(var(--muted-foreground))] leading-relaxed">{result.summary}</p>
          </motion.div>

          {/* Key Points */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="p-6 rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--card))]"
          >
            <h2 className="text-lg font-semibold mb-3 flex items-center gap-2">
              <ListChecks className="w-5 h-5 text-green-400" />
              Key Points
            </h2>
            <ul className="space-y-2">
              {result.keyPoints.map((point, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-[hsl(var(--muted-foreground))]">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-400 mt-2 shrink-0" />
                  {point}
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Quotes */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="p-6 rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--card))]"
          >
            <h2 className="text-lg font-semibold mb-3 flex items-center gap-2">
              <Quote className="w-5 h-5 text-yellow-400" />
              Important Quotes
            </h2>
            <div className="space-y-3">
              {result.quotes.map((quote, i) => (
                <div key={i} className="p-3 rounded-xl bg-[hsl(var(--accent))] border-l-2 border-purple-500">
                  <p className="text-sm italic text-[hsl(var(--muted-foreground))]">{quote}</p>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Study Notes */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="p-6 rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--card))]"
          >
            <h2 className="text-lg font-semibold mb-3 flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-blue-400" />
              Study Notes
            </h2>
            <div className="text-sm text-[hsl(var(--muted-foreground))] leading-relaxed whitespace-pre-wrap">
              {result.studyNotes}
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
