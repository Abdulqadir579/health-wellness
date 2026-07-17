import React from "react";
import { Metadata } from "next";
import StaticPage from "@/components/StaticPage";

export const metadata: Metadata = {
  title: "Shipping Policy | Global Supply 600",
  description:
    "Processing times, delivery estimates, and shipping information for Global Supply 600 orders.",
};

const ShippingPolicyPage = () => {
  return (
    <main>
      <StaticPage
        title="Shipping Policy"
        updated="July 2026"
        intro="Here’s what to expect when it comes to processing and delivering your Global Supply 600 order."
        sections={[
          {
            heading: "Processing Time",
            body: (
              <p>
                Orders are typically processed within 1–2 business days. You’ll
                receive a confirmation email once your order is placed and another
                update when it ships.
              </p>
            ),
          },
          {
            heading: "Delivery Estimates",
            body: (
              <p>
                Within the UAE, delivery usually takes 2–4 business days.
                International delivery times vary by destination and are confirmed
                at checkout where available.
              </p>
            ),
          },
          {
            heading: "Shipping Costs",
            body: (
              <p>
                Shipping is free on orders over AED 200 within the UAE. Any
                applicable shipping fees are shown clearly at checkout before you
                pay.
              </p>
            ),
          },
          {
            heading: "Tracking",
            body: (
              <p>
                Where a tracking number is available, it will be included in your
                shipping confirmation so you can follow your order to your door.
              </p>
            ),
          },
          {
            heading: "Questions",
            body: (
              <p>
                For any shipping question, contact{" "}
                <a
                  href="mailto:info@globalsupply600.com"
                  className="text-blue hover:underline"
                >
                  info@globalsupply600.com
                </a>
                .
              </p>
            ),
          },
        ]}
      />
    </main>
  );
};

export default ShippingPolicyPage;
