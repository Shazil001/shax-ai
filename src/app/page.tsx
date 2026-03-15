"use client";

import React, { useRef } from "react";
import Link from "next/link";
import { motion, useScroll, useTransform, Variants } from "framer-motion";
import {
  Sparkles,
  ArrowRight,
  Zap,
  Box,
  Layers,
  Cpu,
  Globe,
  Monitor,
  CheckCircle,
} from "lucide-react";

const features = [
  {
    icon: Box,
    title: "AI Ecosystem",
    description: "An interconnected suite of neural tools for extreme productivity.",
    gradient: "from-purple-500 to-indigo-500",
  },
  {
    icon: Layers,
    title: "Infinite Scale",
    description: "Built on edge infrastructure to compute resumes, jobs, and notes at lightspeed.",
    gradient: "from-pink-500 to-rose-400",
  },
  {
    icon: Cpu,
    title: "Neural Engine",
    description: "Integrated with GPT & Gemini for cognitive processing and semantic search.",
    gradient: "from-teal-400 to-emerald-500",
  },
  {
    icon: Globe,
    title: "Web Intelligence",
    description: "Real-time scraping and Youtube summarization with Firecrawl & AI.",
    gradient: "from-blue-500 to-cyan-400",
  },
  {
    icon: Monitor,
    title: "Cinematic UI",
    description: "A dark, immersive workspace inspired by Web3 architecture and 3D visual fidelity.",
    gradient: "from-orange-500 to-amber-400",
  },
  {
    icon: Zap,
    title: "Instant Automation",
    description: "Construct seamless workflows to chain AI tasks together without writing code.",
    gradient: "from-fuchsia-500 to-purple-500",
  },
];

const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 50, damping: 15 } },
};

export default function LandingPage() {
  const { scrollYProgress } = useScroll();
  const yHero = useTransform(scrollYProgress, [0, 1], [0, 400]);
  const opacityHero = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  return (
    <div className="min-h-screen bg-[hsl(var(--background))] overflow-hidden font-sans">
      {/* Cinematic Glowing Background Orbs */}
      <div className="glow-blob glow-purple w-[800px] h-[800px] -top-40 -left-64" style={{ animationDelay: '0s' }} />
      <div className="glow-blob glow-pink w-[600px] h-[600px] top-40 -right-20" style={{ animationDelay: '-5s' }} />
      <div className="glow-blob glow-blue w-[900px] h-[900px] bottom-0 left-1/4" style={{ animationDelay: '-10s' }} />

      {/* Futuristic Floating Navbar */}
      <motion.nav 
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ type: "spring", stiffness: 60, damping: 20 }}
        className="fixed top-6 inset-x-0 z-50 flex justify-center px-4"
      >
        <div className="w-full max-w-6xl glass rounded-full h-16 px-6 flex items-center justify-between border border-white/5 shadow-2xl">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center shadow-lg shadow-purple-500/20">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-xl display-font tracking-tight text-white">Shax AI</span>
          </div>
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-white/60">
            <Link href="#ecosystem" className="hover:text-white transition-colors">Ecosystem</Link>
            <Link href="#architecture" className="hover:text-white transition-colors">Architecture</Link>
            <Link href="#pricing" className="hover:text-white transition-colors">Pricing</Link>
          </div>
          <div className="flex items-center gap-4">
             <Link
              href="/login"
              className="text-sm font-medium text-white/80 hover:text-white transition-colors hidden sm:block"
            >
              Log in
            </Link>
            <Link
              href="/login"
              className="px-5 py-2 text-sm font-semibold rounded-full btn-glow"
            >
              <span className="relative z-10 flex items-center gap-2">Launch App <ArrowRight className="w-4 h-4" /></span>
            </Link>
          </div>
        </div>
      </motion.nav>

      {/* Hero Section */}
      <section className="relative min-h-[100svh] flex items-center justify-center pt-32 pb-20 px-6">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 items-center relative z-10">
          
          <motion.div 
            style={{ y: yHero, opacity: opacityHero }}
            initial="hidden"
            animate="show"
            variants={staggerContainer}
            className="text-left"
          >
            <motion.div variants={fadeUp} className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/10 bg-white/5 backdrop-blur-md mb-8">
              <span className="w-2 h-2 rounded-full bg-purple-500 animate-pulse" />
              <span className="text-sm font-medium text-white/80 uppercase tracking-widest origin-left">Nozomi Protocol Active</span>
            </motion.div>

            <motion.h1 variants={fadeUp} className="text-6xl md:text-8xl display-font font-black leading-[0.9] tracking-tighter mb-6">
              THE <br />
              <span className="gradient-text">FUTURE</span> <br />
              OF WORK.
            </motion.h1>

            <motion.p variants={fadeUp} className="text-lg md:text-xl text-white/50 max-w-lg mb-10 leading-relaxed font-light">
              Architectured for builders. An open-source intelligence platform engineered to scale your productivity in the Web3 era.
            </motion.p>

            <motion.div variants={fadeUp} className="flex flex-col sm:flex-row items-center gap-4">
              <Link
                href="/login"
                className="w-full sm:w-auto px-8 py-4 text-base font-bold rounded-2xl btn-primary-3d flex items-center justify-center gap-3"
              >
                Initialize Workspace <ArrowRight className="w-5 h-5" />
              </Link>
              <Link
                href="#ecosystem"
                className="w-full sm:w-auto px-8 py-4 text-base font-bold rounded-2xl border border-white/10 hover:bg-white/5 transition-colors flex items-center justify-center text-white/80"
              >
                Explore Modules
              </Link>
            </motion.div>
          </motion.div>

          {/* 3D Visual representation */}
          <motion.div 
             initial={{ opacity: 0, scale: 0.8, rotate: -5 }}
             animate={{ opacity: 1, scale: 1, rotate: 0 }}
             transition={{ duration: 1.5, type: "spring", bounce: 0.4 }}
             className="relative h-[500px] lg:h-[700px] w-full mt-12 lg:mt-0 flex items-center justify-center img-overlay perspective-1000"
          >
             <div className="absolute inset-0 bg-gradient-to-tr from-purple-500/20 to-pink-500/20 rounded-[3rem] blur-3xl mix-blend-screen" />
             <div className="relative w-full h-full rounded-[2.5rem] overflow-hidden border border-white/10 shadow-2xl glass transform-gpu transition-transform duration-1000 hover:rotate-y-12 hover:rotate-x-12 cursor-pointer">
                {/* Fallback image incase the generated one isn't perfectly exposed */}
                <img 
                  src="/nozomi-hero.png" 
                  alt="3D Abstract Visuals" 
                  className="w-full h-full object-cover opacity-90 transition-opacity hover:opacity-100"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = "https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?q=80&w=1974&auto=format&fit=crop";
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent opacity-80" />
             </div>
          </motion.div>
        </div>
      </section>

      {/* Grid Features */}
      <section id="ecosystem" className="py-32 px-6 relative z-10 border-t border-white/5 bg-black/20 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            className="mb-20 text-center lg:text-left"
          >
            <h2 className="text-4xl md:text-5xl display-font font-bold mb-4">
              Structural <span className="gradient-text-alt tracking-tight">Integrity.</span>
            </h2>
            <p className="text-white/50 max-w-2xl lg:mx-0 mx-auto text-lg leading-relaxed">
              We built a decentralized feeling architecture for centralized AI power. 
              Modular components ready to integrate.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, i) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ delay: i * 0.1, type: "spring" }}
                className="p-8 rounded-[2rem] border border-white/5 glass card-hover relative group overflow-hidden"
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br opacity-20 blur-2xl group-hover:opacity-40 transition-opacity duration-500 rounded-full mix-blend-screen overflow-hidden" style={{ backgroundImage: `var(--tw-gradient-stops)` }} />
                
                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${feature.gradient} p-[1px] mb-8 group-hover:scale-110 transition-transform duration-500 shadow-2xl`}>
                  <div className="w-full h-full bg-background rounded-2xl flex items-center justify-center">
                    <feature.icon className="w-6 h-6 text-white" />
                  </div>
                </div>
                
                <h3 className="text-2xl display-font font-semibold mb-3 tracking-tight">{feature.title}</h3>
                <p className="text-white/50 leading-relaxed font-light">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing / Access */}
      <section id="pricing" className="py-32 px-6 relative z-10">
        <div className="max-w-5xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-20"
          >
            <h2 className="text-5xl display-font font-bold mb-6">Access <span className="gradient-text tracking-tight">Nodes.</span></h2>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
            {/* Free Node */}
            <motion.div 
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="p-10 rounded-[2.5rem] border border-white/10 glass relative card-hover flex flex-col"
            >
              <div className="mb-8">
                <h3 className="text-2xl display-font font-semibold mb-2 text-white/80">Base Protocol</h3>
                <div className="text-5xl display-font font-black tracking-tighter">
                  $0<span className="text-xl font-normal text-white/40">/mo</span>
                </div>
              </div>
              <ul className="space-y-4 mb-10 flex-1">
                {[
                  "50 Computation Cycles/mo", 
                  "Local Storage Sync", 
                  "Standard Intelligence Model"
                ].map((f) => (
                  <li key={f} className="flex items-start gap-3 text-white/70">
                    <CheckCircle className="w-5 h-5 text-zinc-500 shrink-0 mt-0.5" />
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
              <Link
                href="/login"
                className="w-full py-4 text-center rounded-2xl border border-white/10 hover:bg-white/5 transition-colors font-semibold tracking-wide"
              >
                Initialize Base
              </Link>
            </motion.div>

            {/* Pro Node */}
            <motion.div 
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="p-10 rounded-[2.5rem] border border-purple-500/50 glass relative card-hover flex flex-col bg-purple-500/5"
            >
              <div className="absolute top-0 right-10 -translate-y-1/2 px-4 py-1.5 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full text-xs font-bold text-white tracking-widest uppercase shadow-lg shadow-purple-500/30">
                Overclocked
              </div>
              <div className="mb-8">
                <h3 className="text-2xl display-font font-semibold mb-2 text-purple-400">Quantum Protocol</h3>
                <div className="text-5xl display-font font-black tracking-tighter">
                  $10<span className="text-xl font-normal text-white/40">/mo</span>
                </div>
              </div>
              <ul className="space-y-4 mb-10 flex-1">
                {[
                  "Unlimited Computation Cycles",
                  "Global Cloud Sync",
                  "Advanced Intelligence (GPT-4o/Gemini)",
                  "Workflow Automations",
                  "Priority Network Access"
                ].map((f) => (
                  <li key={f} className="flex items-start gap-3 text-white/90">
                    <CheckCircle className="w-5 h-5 text-purple-400 shrink-0 mt-0.5" />
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
              <Link
                href="/login"
                className="w-full py-4 text-center rounded-2xl btn-primary-3d font-semibold tracking-wide"
              >
                Initialize Quantum
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Cinematic Footer */}
      <footer className="py-12 px-6 border-t border-white/5 relative z-10 bg-black/40">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3 opacity-50 hover:opacity-100 transition-opacity">
            <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold display-font tracking-widest uppercase text-sm">Shax AI System</span>
          </div>
          <div className="flex gap-6 text-sm text-white/40">
            <a href="#" className="hover:text-white transition-colors">Twitter</a>
            <a href="#" className="hover:text-white transition-colors">GitHub</a>
            <a href="#" className="hover:text-white transition-colors">Discord</a>
          </div>
          <p className="text-sm text-white/30 font-mono text-center md:text-right">
            01001110 01001111 01011010 01001111 01001101 01001001<br/>
            © 2026 Shax AI Core.
          </p>
        </div>
      </footer>
    </div>
  );
}
