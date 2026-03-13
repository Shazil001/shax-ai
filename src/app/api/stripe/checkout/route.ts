import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";

export async function POST(request: Request) {
  try {
    const { priceId, userId, email } = await request.json();

    const isPlaceholderKey = (key: string | undefined) => 
      !key || key.includes("your-stripe-secret") || key === "placeholder-key" || key.startsWith("sk_test_your");

    if (isPlaceholderKey(process.env.STRIPE_SECRET_KEY)) {
      console.log("SIMULATION MODE: Returning mock checkout URL");
      return NextResponse.json({ url: `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/billing?success=true` });
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode: "subscription",
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/billing?success=true`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/billing?canceled=true`,
      customer_email: email,
      metadata: {
        userId,
      },
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error("Stripe Checkout Error:", error);
    return NextResponse.json(
      { error: "Failed to create checkout session" },
      { status: 500 }
    );
  }
}
