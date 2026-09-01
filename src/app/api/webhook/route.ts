import { NextResponse } from "next/server";
import Stripe from "stripe";
import { stripe } from "@/lib/stripe";
import { sendOrderConfirmationEmail, OrderEmailItem } from "@/lib/resend";
import { saveOrder, OrderItemRecord } from "@/lib/orders";
import shopData from "@/components/Shop/shopData";

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

type StoredItem = { id: number; title: string; quantity: number };

// Rebuild the order line items from shopData (source of truth) using the ids
// and quantities we stored in the PaymentIntent metadata at checkout time.
function buildOrderItems(metadataItems: string | undefined): OrderItemRecord[] {
  if (!metadataItems) return [];

  try {
    const parsed: StoredItem[] = JSON.parse(metadataItems);
    return parsed.map((item) => {
      const product = shopData.find((p) => p.id === Number(item.id));
      const unitPrice = product?.discountedPrice ?? 0;
      return {
        id: Number(item.id),
        title: product?.title ?? item.title ?? `Item ${item.id}`,
        quantity: item.quantity,
        unitPrice,
        lineTotal: unitPrice * item.quantity,
      };
    });
  } catch {
    return [];
  }
}

const toEmailItems = (items: OrderItemRecord[]): OrderEmailItem[] =>
  items.map(({ title, quantity, lineTotal }) => ({
    title,
    quantity,
    lineTotal,
  }));

// Pull buyer name / phone / shipping address from the charge attached to the
// PaymentIntent (Stripe collects these in the Payment Element).
async function getBillingDetails(paymentIntentId: string) {
  try {
    const full = await stripe.paymentIntents.retrieve(paymentIntentId, {
      expand: ["latest_charge"],
    });
    const charge = full.latest_charge as Stripe.Charge | null;
    const billing = charge?.billing_details;
    return {
      name: billing?.name ?? null,
      email: billing?.email ?? null,
      phone: billing?.phone ?? null,
      address: (charge?.shipping?.address ??
        billing?.address ??
        null) as unknown as Record<string, unknown> | null,
    };
  } catch {
    return { name: null, email: null, phone: null, address: null };
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

      const orderItems = buildOrderItems(paymentIntent.metadata?.items);
      const amountTotal = paymentIntent.amount / 100; // fils → AED
      const billing = await getBillingDetails(paymentIntent.id);
      const to = paymentIntent.receipt_email ?? billing.email;

      // Persist the order first so we have a record even if the email fails.
      await saveOrder({
        paymentIntent: paymentIntent.id,
        email: to,
        customerName: billing.name,
        customerPhone: billing.phone,
        shippingAddress: billing.address,
        items: orderItems,
        amountTotal,
        currency: paymentIntent.currency,
        status: "paid",
      });

      // Sends the customer their confirmation (if we have their email) and a
      // copy to the merchant inbox (ORDER_NOTIFICATION_EMAIL) for records.
      await sendOrderConfirmationEmail({
        to,
        orderId: paymentIntent.id,
        items: toEmailItems(orderItems),
        amountTotal,
        currency: paymentIntent.currency,
        customerName: billing.name,
        customerPhone: billing.phone,
      });
      break;
    }
    case "payment_intent.payment_failed": {
      const paymentIntent = event.data.object as Stripe.PaymentIntent;
      console.warn(`Payment failed: ${paymentIntent.id}`);

      await saveOrder({
        paymentIntent: paymentIntent.id,
        email: paymentIntent.receipt_email,
        items: buildOrderItems(paymentIntent.metadata?.items),
        amountTotal: paymentIntent.amount / 100,
        currency: paymentIntent.currency,
        status: "failed",
      });
      break;
    }
    default:
      break;
  }

  return NextResponse.json({ received: true });
}
