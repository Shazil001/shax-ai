import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { headers } from "next/headers";

export async function POST(request: Request) {
  const body = await request.text();
  const headersList = await headers();
  const signature = headersList.get("stripe-signature")!;

  let event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err) {
    console.error("Webhook signature verification failed:", err);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  // Use the standard supabase client for webhook updates
  // In production, ensure this client has bypass-RLS or Service Role permissions
  const { createClient: createSupabaseClient } = await import("@supabase/supabase-js");
  const supabase = createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object as any;
      const userId = session.metadata?.userId;

      if (userId) {
        const { error } = await supabase
          .from('profiles')
          .update({ 
            plan: 'pro', 
            credits: 500,
            updated_at: new Date().toISOString()
          })
          .eq('id', userId);
        
        if (error) console.error("Webhook dB update error:", error);
        else console.log(`User ${userId} upgraded to Pro`);
      }
      break;
    }
    case "customer.subscription.deleted": {
      const subscription = event.data.object as any;
      const userId = subscription.metadata?.userId;
      
      if (userId) {
        await supabase
          .from('profiles')
          .update({ plan: 'free' })
          .eq('id', userId);
      }
      break;
    }
    case "invoice.payment_succeeded": {
      const invoice = event.data.object as any;
      const userId = invoice.metadata?.userId || invoice.subscription_details?.metadata?.userId;
      
      if (userId) {
        await supabase
          .from('profiles')
          .update({ credits: 500 })
          .eq('id', userId);
      }
      break;
    }
    default:
      console.log(`Unhandled event type: ${event.type}`);
  }

  return NextResponse.json({ received: true });
}
