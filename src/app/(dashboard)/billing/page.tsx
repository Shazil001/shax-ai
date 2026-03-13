"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  CreditCard,
  CheckCircle,
  Zap,
  Crown,
  ArrowRight,
  Receipt,
  Calendar,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { cn } from "@/lib/utils";

const PLANS = [
  {
    name: "Free",
    price: 0,
    credits: 50,
    features: [
      "50 AI credits per month",
      "Basic note management",
      "YouTube summarization",
      "Basic job search",
      "1 resume template",
    ],
    current: false,
  },
  {
    name: "Pro",
    price: 10,
    credits: 500,
    popular: true,
    features: [
      "500 AI credits per month",
      "All AI tools unlocked",
      "Advanced resume templates",
      "Priority AI processing",
      "Workflow automation",
      "Document analysis",
      "Meeting notes AI",
      "Cover letter generator",
      "Priority support",
    ],
    current: true,
  },
];

const INVOICES = [
  { id: "INV-001", date: "Jan 1, 2024", amount: "$10.00", status: "Paid" },
  { id: "INV-002", date: "Dec 1, 2023", amount: "$10.00", status: "Paid" },
  { id: "INV-003", date: "Nov 1, 2023", amount: "$10.00", status: "Paid" },
];

export default function BillingPage() {
  const { user } = useAuth();
  const [billingCycle, setBillingCycle] = useState<"monthly" | "yearly">("monthly");
  const [isLoading, setIsLoading] = useState<string | null>(null);

  const handleUpgrade = async (plan: string) => {
    if (!user) return;
    setIsLoading(plan);

    try {
      const res = await fetch("/api/stripe/checkout", {
        method: "POST",
        body: JSON.stringify({
          priceId: process.env.NEXT_PUBLIC_STRIPE_PRO_PRICE_ID,
          userId: user.id,
          email: user.email,
        }),
      });

      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      }
    } catch (err) {
      console.error("Billing error:", err);
    } finally {
      setIsLoading(null);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <CreditCard className="w-6 h-6 text-emerald-400" />
          Billing & Plans
        </h1>
        <p className="text-sm text-[hsl(var(--muted-foreground))] mt-1">
          Manage your subscription and view billing history
        </p>
      </div>

      {/* Current Plan Banner */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="p-6 rounded-2xl bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/20"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
              <Crown className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-semibold">
                {user?.plan === "pro" ? "Pro Plan" : "Free Plan"}
              </h2>
              <p className="text-sm text-[hsl(var(--muted-foreground))]">
                {user?.credits} credits remaining this month
              </p>
            </div>
          </div>
          <div className="text-right">
            <span className="text-sm text-[hsl(var(--muted-foreground))]">Next billing date</span>
            <p className="text-sm font-semibold flex items-center gap-1">
              <Calendar className="w-4 h-4" />
              Feb 1, 2024
            </p>
          </div>
        </div>
        <div className="mt-4 w-full h-2 bg-[hsl(var(--muted))] rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${((user?.credits || 0) / (user?.plan === "pro" ? 500 : 50)) * 100}%` }}
            transition={{ duration: 1 }}
            className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"
          />
        </div>
      </motion.div>

      {/* Billing Toggle */}
      <div className="flex justify-center">
        <div className="flex items-center gap-2 p-1 rounded-xl bg-[hsl(var(--accent))] border border-[hsl(var(--border))]">
          <button
            onClick={() => setBillingCycle("monthly")}
            className={cn(
              "px-4 py-2 rounded-lg text-sm font-medium transition-all",
              billingCycle === "monthly" ? "bg-[hsl(var(--card))] shadow" : "text-[hsl(var(--muted-foreground))]"
            )}
          >
            Monthly
          </button>
          <button
            onClick={() => setBillingCycle("yearly")}
            className={cn(
              "px-4 py-2 rounded-lg text-sm font-medium transition-all",
              billingCycle === "yearly" ? "bg-[hsl(var(--card))] shadow" : "text-[hsl(var(--muted-foreground))]"
            )}
          >
            Yearly <span className="text-green-400 text-xs">Save 20%</span>
          </button>
        </div>
      </div>

      {/* Plans */}
      <div className="grid md:grid-cols-2 gap-6 max-w-3xl mx-auto">
        {PLANS.map((plan, i) => (
          <motion.div
            key={plan.name}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className={cn(
              "p-6 rounded-2xl border bg-[hsl(var(--card))]",
              plan.popular ? "border-2 border-purple-500 relative" : "border-[hsl(var(--border))]"
            )}
          >
            {plan.popular && (
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full text-xs font-bold text-white">
                CURRENT PLAN
              </div>
            )}
            <h3 className="text-xl font-bold mb-1">{plan.name}</h3>
            <div className="text-3xl font-bold mb-4">
              ${billingCycle === "yearly" ? (plan.price * 0.8 * 12).toFixed(0) : plan.price}
              <span className="text-sm font-normal text-[hsl(var(--muted-foreground))]">
                /{billingCycle === "yearly" ? "year" : "mo"}
              </span>
            </div>
            <div className="flex items-center gap-2 mb-4 px-3 py-2 rounded-lg bg-[hsl(var(--accent))]">
              <Zap className="w-4 h-4 text-yellow-400" />
              <span className="text-sm font-medium">{plan.credits} credits/month</span>
            </div>
            <ul className="space-y-2.5 mb-6">
              {plan.features.map((f) => (
                <li key={f} className="flex items-center gap-2 text-sm">
                  <CheckCircle className={cn("w-4 h-4", plan.popular ? "text-purple-400" : "text-green-400")} />
                  {f}
                </li>
              ))}
            </ul>
            <button
              onClick={() => handleUpgrade(plan.name)}
              className={cn(
                "w-full py-3 rounded-xl text-sm font-medium transition-all flex items-center justify-center gap-2",
                plan.popular && user?.plan === "pro"
                  ? "bg-[hsl(var(--accent))] text-[hsl(var(--muted-foreground))] cursor-default"
                  : "bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:opacity-90"
              )}
              disabled={(plan.popular && user?.plan === "pro") || isLoading === plan.name}
            >
              {plan.popular && user?.plan === "pro" ? (
                "Current Plan"
              ) : isLoading === plan.name ? (
                <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  Upgrade <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </motion.div>
        ))}
      </div>

      {/* Invoice History */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="p-6 rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--card))]"
      >
        <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Receipt className="w-5 h-5 text-[hsl(var(--muted-foreground))]" />
          Invoice History
        </h2>
        <div className="space-y-2">
          {INVOICES.map((inv) => (
            <div key={inv.id} className="flex items-center justify-between p-3 rounded-xl hover:bg-[hsl(var(--accent))] transition-colors">
              <div className="flex items-center gap-3">
                <Receipt className="w-4 h-4 text-[hsl(var(--muted-foreground))]" />
                <span className="text-sm font-medium">{inv.id}</span>
              </div>
              <span className="text-sm text-[hsl(var(--muted-foreground))]">{inv.date}</span>
              <span className="text-sm font-medium">{inv.amount}</span>
              <span className="text-xs px-2 py-0.5 rounded-full bg-green-500/10 text-green-400">{inv.status}</span>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
