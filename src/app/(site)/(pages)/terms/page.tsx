import React from "react";
import { Metadata } from "next";
import StaticPage from "@/components/StaticPage";

export const metadata: Metadata = {
  title: "Terms of Use | Global Supply 600",
  description:
    "The terms and conditions that govern your use of the Global Supply 600 website and purchases.",
};

const TermsPage = () => {
  return (
    <main>
      <StaticPage
        title="Terms of Use"
        updated="July 2026"
        intro="By accessing this website and placing an order with Global Supply 600, you agree to the following terms and conditions."
        sections={[
          {
            heading: "Products & Pricing",
            body: (
              <p>
                All prices are listed in UAE Dirhams (AED) and are inclusive of
                applicable taxes unless stated otherwise. We make every effort to
                display products and prices accurately, but errors may occur and
                we reserve the right to correct them.
              </p>
            ),
          },
          {
            heading: "Orders",
            body: (
              <p>
                An order is confirmed once payment is successfully processed and
                you receive an order confirmation. We reserve the right to refuse
                or cancel any order, for example where an item is unavailable or a
                pricing error has occurred.
              </p>
            ),
          },
          {
            heading: "Payment",
            body: (
              <p>
                Payments are processed securely via Stripe, including card, Apple
                Pay, and Google Pay. By submitting payment you confirm you are
                authorised to use the chosen payment method.
              </p>
            ),
          },
          {
            heading: "Intellectual Property",
            body: (
              <p>
                All content on this site — including text, images, and the Global
                Supply 600 name and logo — is our property or used with
                permission and may not be reproduced without consent.
              </p>
            ),
          },
          {
            heading: "Limitation of Liability",
            body: (
              <p>
                To the extent permitted by law, Global Supply 600 is not liable
                for indirect or consequential losses arising from the use of this
                website or products purchased through it.
              </p>
            ),
          },
          {
            heading: "Governing Law",
            body: (
              <p>
                These terms are governed by the laws of the United Arab Emirates.
                For any question, contact{" "}
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

export default TermsPage;
