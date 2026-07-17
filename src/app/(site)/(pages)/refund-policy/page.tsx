import React from "react";
import { Metadata } from "next";
import StaticPage from "@/components/StaticPage";

export const metadata: Metadata = {
  title: "Refund & Returns Policy | Global Supply 600",
  description:
    "Our returns, exchanges, and refund policy for orders placed with Global Supply 600.",
};

const RefundPolicyPage = () => {
  return (
    <main>
      <StaticPage
        title="Refund Policy"
        updated="July 2026"
        intro="We want you to love your purchase. If something isn’t right, here’s how returns, exchanges, and refunds work at Global Supply 600."
        sections={[
          {
            heading: "Returns Window",
            body: (
              <p>
                You may request a return within 7 days of receiving your order.
                Items must be unused, unworn, and in their original condition with
                any tags and packaging intact.
              </p>
            ),
          },
          {
            heading: "Non-Returnable Items",
            body: (
              <p>
                For hygiene reasons, swimwear and intimate items are only eligible
                for return if unworn with hygiene seals intact. Custom or
                clearance items may not be eligible for return.
              </p>
            ),
          },
          {
            heading: "How to Request a Return",
            body: (
              <p>
                Email{" "}
                <a
                  href="mailto:info@globalsupply600.com"
                  className="text-blue hover:underline"
                >
                  info@globalsupply600.com
                </a>{" "}
                with your order number and the item(s) you’d like to return. We’ll
                share the return instructions and address.
              </p>
            ),
          },
          {
            heading: "Refunds",
            body: (
              <p>
                Once we receive and inspect your return, approved refunds are
                issued to your original payment method. Please allow 5–10 business
                days for the amount to appear, depending on your bank or card
                provider.
              </p>
            ),
          },
          {
            heading: "Exchanges",
            body: (
              <p>
                Prefer a different size or piece? Let us know and, subject to
                availability, we’ll arrange an exchange once the original item is
                returned.
              </p>
            ),
          },
        ]}
      />
    </main>
  );
};

export default RefundPolicyPage;
