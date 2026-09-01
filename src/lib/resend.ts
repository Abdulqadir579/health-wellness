import { Resend } from "resend";

const apiKey = process.env.RESEND_API_KEY;

export const resend = apiKey ? new Resend(apiKey) : null;

const FROM = process.env.RESEND_FROM || "Wellness Shop <onboarding@resend.dev>";

// Merchant inbox that receives a copy of every order for record-keeping.
const ADMIN_EMAIL = process.env.ORDER_NOTIFICATION_EMAIL;

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || "https://globalsupply600.com";

export type OrderEmailItem = {
  title: string;
  quantity: number;
  lineTotal: number;
};

type OrderConfirmationParams = {
  to: string | null;
  orderId: string;
  items: OrderEmailItem[];
  amountTotal: number;
  currency: string;
  customerName?: string | null;
  customerPhone?: string | null;
};

const formatMoney = (value: number, currency: string) =>
  `${currency.toUpperCase()} ${value.toLocaleString("en-AE", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;

function buildConsentBlock(): string {
  return `
    <div style="margin-top:24px;border-top:1px solid #eee;padding-top:16px;">
      <p style="color:#1c274c;font-size:13px;font-weight:bold;margin:0 0 8px;">
        Order consent &amp; policy acknowledgement
      </p>
      <p style="color:#8d93a5;font-size:12px;line-height:1.7;margin:0;">
        By completing this purchase, the customer confirmed they read and agreed to:
      </p>
      <ul style="color:#8d93a5;font-size:12px;line-height:1.7;margin:8px 0 0;padding-left:18px;">
        <li><strong>Sale &amp; purchase</strong> — the order terms in our
          <a href="${SITE_URL}/terms" style="color:#7A2E35;">Terms of Use</a>.</li>
        <li><strong>Refund</strong> — that <strong>all sales are final</strong> under our
          <a href="${SITE_URL}/refund-policy" style="color:#7A2E35;">Refund Policy</a>.</li>
        <li><strong>Shipment</strong> — delivery timelines and terms in our
          <a href="${SITE_URL}/shipping-policy" style="color:#7A2E35;">Shipping Policy</a>.</li>
      </ul>
    </div>`;
}

function buildRows(items: OrderEmailItem[], currency: string): string {
  return items
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
}

function buildHtml({
  orderId,
  items,
  amountTotal,
  currency,
}: Omit<OrderConfirmationParams, "to">): string {
  const rows = buildRows(items, currency);

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

    ${buildConsentBlock()}

    <p style="color:#8d93a5;font-size:12px;margin-top:16px;">
      Order reference: ${orderId}
    </p>
  </div>`;
}

function buildAdminHtml({
  orderId,
  items,
  amountTotal,
  currency,
  to,
  customerName,
  customerPhone,
}: OrderConfirmationParams): string {
  const rows = buildRows(items, currency);

  return `
  <div style="font-family:Arial,Helvetica,sans-serif;max-width:560px;margin:0 auto;padding:24px;">
    <h1 style="color:#1c274c;font-size:22px;margin:0 0 8px;">New order received</h1>
    <p style="color:#8d93a5;font-size:14px;margin:0 0 24px;">
      A payment was completed successfully. Details below for your records.
    </p>

    <table style="width:100%;border-collapse:collapse;font-size:14px;margin-bottom:24px;">
      <tbody>
        <tr>
          <td style="padding:4px 0;color:#8d93a5;">Customer email</td>
          <td style="padding:4px 0;text-align:right;color:#1c274c;">${to ?? "—"}</td>
        </tr>
        <tr>
          <td style="padding:4px 0;color:#8d93a5;">Customer name</td>
          <td style="padding:4px 0;text-align:right;color:#1c274c;">${customerName ?? "—"}</td>
        </tr>
        <tr>
          <td style="padding:4px 0;color:#8d93a5;">Customer phone</td>
          <td style="padding:4px 0;text-align:right;color:#1c274c;">${customerPhone ?? "—"}</td>
        </tr>
      </tbody>
    </table>

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

    ${buildConsentBlock()}

    <p style="color:#8d93a5;font-size:12px;margin-top:16px;">
      Order reference: ${orderId}
    </p>
  </div>`;
}

export async function sendOrderConfirmationEmail(params: OrderConfirmationParams) {
  const { to, orderId, items, amountTotal, currency } = params;

  if (!resend) {
    console.warn("RESEND_API_KEY not set — skipping confirmation email");
    return;
  }

  // Customer confirmation.
  if (to) {
    try {
      await resend.emails.send({
        from: FROM,
        to,
        subject: "Your order is confirmed",
        html: buildHtml({ orderId, items, amountTotal, currency }),
      });
    } catch (error) {
      // Never let email failures break the payment flow.
      console.error("Failed to send customer confirmation email:", error);
    }
  }

  // Merchant copy for record-keeping.
  if (ADMIN_EMAIL) {
    try {
      await resend.emails.send({
        from: FROM,
        to: ADMIN_EMAIL,
        subject: `New order — ${formatMoney(amountTotal, currency)} (${orderId})`,
        html: buildAdminHtml(params),
      });
    } catch (error) {
      console.error("Failed to send merchant order notification:", error);
    }
  } else {
    console.warn(
      "ORDER_NOTIFICATION_EMAIL not set — skipping merchant order copy"
    );
  }
}
