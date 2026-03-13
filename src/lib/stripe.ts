import Stripe from "stripe";

const isPlaceholderKey = (key: string | undefined) => 
  !key || key.includes("your-stripe-secret") || key === "placeholder-key" || key.startsWith("sk_test_your");

export const stripe = new Stripe(isPlaceholderKey(process.env.STRIPE_SECRET_KEY) ? "placeholder_stripe_key" : process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2026-02-25.clover",
});

export const PLANS = {
  free: {
    name: "Free",
    credits: 50,
    price: 0,
    priceId: "",
    features: [
      "50 AI credits per month",
      "Basic note management",
      "YouTube summarization",
      "Basic job search",
      "1 resume template",
    ],
  },
  pro: {
    name: "Pro",
    credits: 500,
    price: 10,
    priceId: process.env.STRIPE_PRO_PRICE_ID || "",
    features: [
      "500 AI credits per month",
      "All AI tools unlocked",
      "Advanced resume templates",
      "Priority AI processing",
      "Workflow automation",
      "Document analysis",
      "Meeting notes AI",
      "Cover letter generator",
    ],
  },
} as const;
