import React from "react";
import { Metadata } from "next";
import StaticPage from "@/components/StaticPage";

export const metadata: Metadata = {
  title: "Privacy Policy | Global Supply 600",
  description:
    "How Global Supply 600 collects, uses, and protects your personal information.",
};

const PrivacyPolicyPage = () => {
  return (
    <main>
      <StaticPage
        title="Privacy Policy"
        updated="July 2026"
        intro="Your privacy matters to us. This policy explains what information we collect when you shop with Global Supply 600, how we use it, and the choices you have."
        sections={[
          {
            heading: "Information We Collect",
            body: (
              <p>
                We collect the details you provide at checkout — such as your
                name, email address, phone number, and shipping address — as well
                as order details. Payment card information is entered directly
                with our payment processor and is never stored on our servers.
              </p>
            ),
          },
          {
            heading: "How We Use Your Information",
            body: (
              <p>
                We use your information to process and deliver orders, send order
                confirmations and updates, provide customer support, and comply
                with legal obligations. We do not sell your personal data.
              </p>
            ),
          },
          {
            heading: "Payments",
            body: (
              <p>
                Payments are processed securely by Stripe. Your card details are
                handled by Stripe under their own security standards and privacy
                policy. We only receive confirmation of payment status, not your
                full card number.
              </p>
            ),
          },
          {
            heading: "Cookies",
            body: (
              <p>
                We use essential cookies and local storage to keep your cart and
                preferences working correctly. You can control cookies through
                your browser settings.
              </p>
            ),
          },
          {
            heading: "Data Retention & Your Rights",
            body: (
              <p>
                We retain order information as required for accounting and legal
                purposes. You may request access to, correction of, or deletion
                of your personal data by contacting us.
              </p>
            ),
          },
          {
            heading: "Contact",
            body: (
              <p>
                For any privacy question, email{" "}
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

export default PrivacyPolicyPage;
