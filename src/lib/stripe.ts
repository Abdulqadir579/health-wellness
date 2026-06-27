import Stripe from "stripe";

const secretKey = process.env.STRIPE_SECRET_KEY;

if (!secretKey) {
  throw new Error("Missing STRIPE_SECRET_KEY environment variable");
}

export const stripe = new Stripe(secretKey);

export const CURRENCY = "aed";

// Stripe expects the smallest currency unit. AED's minor unit is the fils (1/100).
export function toMinorUnits(amount: number): number {
  return Math.round(amount * 100);
}
