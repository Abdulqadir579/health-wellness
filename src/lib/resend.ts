import { Resend } from "resend";

const apiKey = process.env.RESEND_API_KEY;

export const resend = apiKey ? new Resend(apiKey) : null;

const FROM = process.env.RESEND_FROM || "Wellness Shop <onboarding@resend.dev>";

export type OrderEmailItem = {
  title: string;
  quantity: number;
  lineTotal: number;
};

type OrderConfirmationParams = {
  to: string;
  orderId: string;
  items: OrderEmailItem[];
  amountTotal: number;
  currency: string;
};

const formatMoney = (value: number, currency: string) =>
  `${currency.toUpperCase()} ${value.toLocaleString("en-AE", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;

function buildHtml({
  orderId,
  items,
  amountTotal,
  currency,
}: Omit<OrderConfirmationParams, "to">): string {
  const rows = items
    .map(
      (item) => `
        <tr>
          <td style="padding:8px 0;border-bottom:1px solid #eee;color:#1c274c;">
            ${item.title} <span style="color:#8d93a5;">x${item.quantity}</span>
          </td>
          <td style="padding:8px 0;border-bottom:1px solid #eee;text-align:right;color:#1c274c;">
            ${formatMoney(item.lineTotal, currency)}
          </td>
        </tr>`
    )
    .join("");

  return `
  <div style="font-family:Arial,Helvetica,sans-serif;max-width:560px;margin:0 auto;padding:24px;">
    <h1 style="color:#1c274c;font-size:22px;margin:0 0 8px;">Thank you for your order!</h1>
    <p style="color:#8d93a5;font-size:14px;margin:0 0 24px;">
      Your payment was successful and your order is confirmed.
    </p>

    <table style="width:100%;border-collapse:collapse;font-size:14px;">
      <thead>
        <tr>
          <th style="text-align:left;padding:8px 0;border-bottom:2px solid #1c274c;color:#1c274c;">Product</th>
          <th style="text-align:right;padding:8px 0;border-bottom:2px solid #1c274c;color:#1c274c;">Subtotal</th>
        </tr>
      </thead>
      <tbody>
        ${rows}
        <tr>
          <td style="padding:12px 0;font-weight:bold;color:#1c274c;">Total</td>
          <td style="padding:12px 0;text-align:right;font-weight:bold;color:#1c274c;">
            ${formatMoney(amountTotal, currency)}
          </td>
        </tr>
      </tbody>
    </table>

    <p style="color:#8d93a5;font-size:12px;margin-top:24px;">
      Order reference: ${orderId}
    </p>
  </div>`;
}

export async function sendOrderConfirmationEmail({
  to,
  orderId,
  items,
  amountTotal,
  currency,
}: OrderConfirmationParams) {
  if (!resend) {
    console.warn("RESEND_API_KEY not set — skipping confirmation email");
    return;
  }

  try {
    await resend.emails.send({
      from: FROM,
      to,
      subject: "Your order is confirmed",
      html: buildHtml({ orderId, items, amountTotal, currency }),
    });
  } catch (error) {
    // Never let email failures break the payment flow.
    console.error("Failed to send confirmation email:", error);
  }
}
