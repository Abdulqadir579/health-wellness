import { supabaseAdmin } from "./supabase";

export type OrderItemRecord = {
  id: number;
  title: string;
  quantity: number;
  unitPrice: number;
  lineTotal: number;
};

export type SaveOrderParams = {
  paymentIntent: string;
  email: string | null;
  customerName?: string | null;
  customerPhone?: string | null;
  shippingAddress?: Record<string, unknown> | null;
  items: OrderItemRecord[];
  amountTotal: number;
  currency: string;
  status: "paid" | "failed";
};

// Persists an order to Supabase. Upserts on payment_intent so Stripe webhook
// retries don't create duplicate rows. Never throws — order persistence must
// never break the payment/webhook flow.
export async function saveOrder(params: SaveOrderParams): Promise<void> {
  if (!supabaseAdmin) {
    console.warn(
      "Supabase not configured (SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY) — skipping order persistence"
    );
    return;
  }

  try {
    const { error } = await supabaseAdmin.from("orders").upsert(
      {
        payment_intent: params.paymentIntent,
        email: params.email,
        customer_name: params.customerName ?? null,
        customer_phone: params.customerPhone ?? null,
        shipping_address: params.shippingAddress ?? null,
        items: params.items,
        amount_total: params.amountTotal,
        currency: params.currency,
        status: params.status,
      },
      { onConflict: "payment_intent" }
    );

    if (error) {
      console.error("Failed to save order to Supabase:", error.message);
    }
  } catch (err) {
    console.error("Failed to save order to Supabase:", err);
  }
}
