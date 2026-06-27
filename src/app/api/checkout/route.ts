import { NextResponse } from "next/server";
import { stripe, CURRENCY, toMinorUnits } from "@/lib/stripe";
import shopData from "@/components/Shop/shopData";

type IncomingItem = {
  id: number;
  quantity: number;
};

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const items: IncomingItem[] = Array.isArray(body?.items) ? body.items : [];

    if (items.length === 0) {
      return NextResponse.json({ error: "Cart is empty" }, { status: 400 });
    }

    // Never trust prices from the client. Recompute the total server-side by
    // looking up each item's discountedPrice in shopData.ts using its id.
    let total = 0;
    const lineItems: { id: number; title: string; quantity: number }[] = [];

    for (const item of items) {
      const quantity = Number(item.quantity);

      if (!Number.isInteger(quantity) || quantity <= 0) {
        return NextResponse.json(
          { error: `Invalid quantity for item ${item.id}` },
          { status: 400 }
        );
      }

      const product = shopData.find((p) => p.id === Number(item.id));

      if (!product) {
        return NextResponse.json(
          { error: `Unknown product: ${item.id}` },
          { status: 400 }
        );
      }

      total += product.discountedPrice * quantity;
      lineItems.push({ id: product.id, title: product.title, quantity });
    }

    if (total <= 0) {
      return NextResponse.json(
        { error: "Order total must be greater than zero" },
        { status: 400 }
      );
    }

    const paymentIntent = await stripe.paymentIntents.create({
      amount: toMinorUnits(total),
      currency: CURRENCY,
      automatic_payment_methods: { enabled: true },
      metadata: {
        items: JSON.stringify(lineItems),
      },
    });

    return NextResponse.json({
      clientSecret: paymentIntent.client_secret,
      amount: total,
      currency: CURRENCY,
    });
  } catch (error) {
    console.error("Checkout error:", error);
    return NextResponse.json(
      { error: "Unable to create payment" },
      { status: 500 }
    );
  }
}
