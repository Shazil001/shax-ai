"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Sparkles,
  ArrowRight,
  Zap,
  FileText,
  Youtube,
  Briefcase,
  MessageSquare,
  Shield,
  CheckCircle,
} from "lucide-react";

const features = [
  {
    icon: MessageSquare,
    title: "AI Assistant",
    description: "Chat with an intelligent assistant that understands your tasks and calls the right tools automatically.",
    gradient: "from-blue-500 to-cyan-400",
  },
  {
    icon: FileText,
    title: "Smart Notes",
    description: "Create, organize, and AI-summarize your notes with tags and instant search.",
    gradient: "from-green-500 to-emerald-400",
  },
  {
    icon: Youtube,
    title: "YouTube Summariser",
    description: "Paste a video link and get AI-generated summaries, key insights, and timestamps.",
    gradient: "from-red-500 to-pink-400",
  },
  {
    icon: Briefcase,
    title: "Job Search AI",
    description: "AI-powered job search with intelligent matching and structured results from top platforms.",
    gradient: "from-purple-500 to-violet-400",
  },
  {
    icon: FileText,
    title: "Resume Builder",
    description: "Generate ATS-optimized resumes with AI-enhanced bullet points and multiple templates.",
    gradient: "from-orange-500 to-amber-400",
  },
  {
    icon: Shield,
    title: "Document Analysis",
    description: "Upload PDFs and documents — get summaries, key points, and study notes instantly.",
    gradient: "from-teal-500 to-cyan-400",
  },
];

const stats = [
  { value: "10K+", label: "Active Users" },
  { value: "1M+", label: "AI Generations" },
  { value: "50K+", label: "Resumes Created" },
  { value: "99.9%", label: "Uptime" },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[hsl(var(--background))]">
      {/* Navbar */}
      <nav className="fixed top-0 inset-x-0 z-50 h-16 border-b border-[hsl(var(--border))/0.5] bg-[hsl(var(--background))/0.8] backdrop-blur-xl">
        <div className="max-w-7xl mx-auto h-full flex items-center justify-between px-6">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-xl gradient-text">Shax AI</span>
          </div>
          <div className="flex items-center gap-4">
            <Link
              href="/login"
              className="text-sm text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))] transition-colors"
            >
              Sign In
            </Link>
            <Link
              href="/login"
              className="px-4 py-2 text-sm font-medium rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:opacity-90 transition-opacity"
            >
              Get Started Free
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-32 pb-20 px-6 relative overflow-hidden">
        {/* Background Effects */}
        <div className="absolute top-20 left-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-[128px]" />
        <div className="absolute top-40 right-1/4 w-96 h-96 bg-pink-500/20 rounded-full blur-[128px]" />

        <div className="max-w-5xl mx-auto text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400 text-sm mb-8">
              <Zap className="w-4 h-4" />
              Powered by GPT-4o
            </div>

            <h1 className="text-5xl md:text-7xl font-bold leading-tight mb-6">
              Your AI-Powered
              <br />
              <span className="gradient-text">Productivity Suite</span>
            </h1>

            <p className="text-xl text-[hsl(var(--muted-foreground))] max-w-2xl mx-auto mb-10">
              Notes, summaries, job search, resume builder, document analysis, and workflow automation
              — all powered by AI in one beautiful dashboard.
            </p>

            <div className="flex items-center justify-center gap-4">
              <Link
                href="/login"
                className="px-8 py-3.5 text-base font-semibold rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:opacity-90 transition-all hover:shadow-lg hover:shadow-purple-500/25 flex items-center gap-2"
              >
                Start Free <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="#features"
                className="px-8 py-3.5 text-base font-semibold rounded-xl border border-[hsl(var(--border))] hover:bg-[hsl(var(--accent))] transition-colors"
              >
                See Features
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-12 px-6 border-y border-[hsl(var(--border))]">
        <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="text-center"
            >
              <div className="text-3xl font-bold gradient-text">{stat.value}</div>
              <div className="text-sm text-[hsl(var(--muted-foreground))] mt-1">{stat.label}</div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Everything You Need, <span className="gradient-text">AI-Powered</span>
            </h2>
            <p className="text-[hsl(var(--muted-foreground))] max-w-2xl mx-auto">
              8+ AI tools in one platform. Stop switching between apps — get everything done from your Shax AI dashboard.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, i) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="p-6 rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] card-hover group"
              >
                <div
                  className={`w-12 h-12 rounded-xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}
                >
                  <feature.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                <p className="text-sm text-[hsl(var(--muted-foreground))] leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="py-24 px-6 bg-gradient-to-b from-transparent to-purple-500/5">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Simple, <span className="gradient-text">Transparent</span> Pricing
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Free Plan */}
            <div className="p-8 rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--card))]">
              <h3 className="text-xl font-bold mb-2">Free</h3>
              <div className="text-4xl font-bold mb-6">
                $0<span className="text-lg font-normal text-[hsl(var(--muted-foreground))]">/mo</span>
              </div>
              <ul className="space-y-3 mb-8">
                {["50 AI credits/month", "Basic note management", "YouTube summarization", "Basic job search", "1 resume template"].map(
                  (f) => (
                    <li key={f} className="flex items-center gap-2 text-sm">
                      <CheckCircle className="w-4 h-4 text-green-400" />
                      {f}
                    </li>
                  )
                )}
              </ul>
              <Link
                href="/login"
                className="block w-full py-3 text-center rounded-xl border border-[hsl(var(--border))] hover:bg-[hsl(var(--accent))] transition-colors font-medium"
              >
                Get Started
              </Link>
            </div>

            {/* Pro Plan */}
            <div className="p-8 rounded-2xl border-2 border-purple-500 bg-[hsl(var(--card))] relative">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full text-xs font-bold text-white">
                MOST POPULAR
              </div>
              <h3 className="text-xl font-bold mb-2">Pro</h3>
              <div className="text-4xl font-bold mb-6">
                $10<span className="text-lg font-normal text-[hsl(var(--muted-foreground))]">/mo</span>
              </div>
              <ul className="space-y-3 mb-8">
                {[
                  "500 AI credits/month",
                  "All AI tools unlocked",
                  "Advanced resume templates",
                  "Priority AI processing",
                  "Workflow automation",
                  "Document analysis",
                  "Meeting notes AI",
                  "Cover letter generator",
                ].map((f) => (
                  <li key={f} className="flex items-center gap-2 text-sm">
                    <CheckCircle className="w-4 h-4 text-purple-400" />
                    {f}
                  </li>
                ))}
              </ul>
              <Link
                href="/login"
                className="block w-full py-3 text-center rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:opacity-90 transition-opacity font-medium"
              >
                Upgrade to Pro
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 border-t border-[hsl(var(--border))]">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold gradient-text">Shax AI</span>
          </div>
          <p className="text-sm text-[hsl(var(--muted-foreground))]">
            © 2025 Shax AI. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
