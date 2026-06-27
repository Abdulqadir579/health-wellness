import { NextResponse } from "next/server";
import Stripe from "stripe";
import { stripe } from "@/lib/stripe";
import { sendOrderConfirmationEmail, OrderEmailItem } from "@/lib/resend";
import shopData from "@/components/Shop/shopData";

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

type StoredItem = { id: number; title: string; quantity: number };

// Rebuild the order line items from shopData (source of truth) using the ids
// and quantities we stored in the PaymentIntent metadata at checkout time.
function buildEmailItems(metadataItems: string | undefined): OrderEmailItem[] {
  if (!metadataItems) return [];

  try {
    const parsed: StoredItem[] = JSON.parse(metadataItems);
    return parsed.map((item) => {
      const product = shopData.find((p) => p.id === Number(item.id));
      const unitPrice = product?.discountedPrice ?? 0;
      return {
        title: product?.title ?? item.title ?? `Item ${item.id}`,
        quantity: item.quantity,
        lineTotal: unitPrice * item.quantity,
      };
    });
  } catch {
    return [];
  }
}

export async function POST(req: Request) {
  if (!webhookSecret) {
    console.error("Missing STRIPE_WEBHOOK_SECRET environment variable");
    return NextResponse.json(
      { error: "Webhook not configured" },
      { status: 500 }
    );
  }

  const signature = req.headers.get("stripe-signature");

  if (!signature) {
    return NextResponse.json({ error: "Missing signature" }, { status: 400 });
  }

  // Stripe signature verification requires the raw, unparsed request body.
  // Never use req.json() here — it would alter the bytes and break verification.
  const rawBody = await req.text();

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(rawBody, signature, webhookSecret);
  } catch (error) {
    console.error("Webhook signature verification failed:", error);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  switch (event.type) {
    case "payment_intent.succeeded": {
      const paymentIntent = event.data.object as Stripe.PaymentIntent;
      console.log(`Payment succeeded: ${paymentIntent.id}`);

      const to = paymentIntent.receipt_email;

      if (to) {
        await sendOrderConfirmationEmail({
          to,
          orderId: paymentIntent.id,
          items: buildEmailItems(paymentIntent.metadata?.items),
          // paymentIntent.amount is in the smallest currency unit (fils).
          amountTotal: paymentIntent.amount / 100,
          currency: paymentIntent.currency,
        });
      } else {
        console.warn(
          `No receipt_email on ${paymentIntent.id} — skipping confirmation email`
        );
      }
      break;
    }
    case "payment_intent.payment_failed": {
      const paymentIntent = event.data.object as Stripe.PaymentIntent;
      console.warn(`Payment failed: ${paymentIntent.id}`);
      break;
    }
    default:
      break;
  }

  return NextResponse.json({ received: true });
}
