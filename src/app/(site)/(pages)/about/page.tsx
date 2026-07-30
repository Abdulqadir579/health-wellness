import React from "react";
import { Metadata } from "next";
import StaticPage from "@/components/StaticPage";

export const metadata: Metadata = {
  title: "About Us | Global Supply 600",
  description:
    "Learn about Global Supply 600 — a Dubai-based house specialising in premium antique clothing, handicrafts, and shawls.",
};

const AboutPage = () => {
  return (
    <main>
      <StaticPage
        title="About Us"
        intro="Global Supply 600 is a Dubai-based house curating premium antique clothing, handicrafts, and shawls. We bring together heritage craftsmanship and timeless design for customers who value authenticity and quality."
        sections={[
          {
            heading: "Our Story",
            body: (
              <p>
                Founded on a passion for heritage textiles and handmade
                craftsmanship, Global Supply 600 was built to be your trusted
                partner for pieces that carry a story. Every item in our
                collection is selected for its quality, character, and
                craftsmanship.
              </p>
            ),
          },
          {
            heading: "What We Offer",
            body: (
              <p>
                Our catalogue spans hand-finished pashmina and shawls, women’s
                dresses and abayas, curated tops and sets, swimwear, and men’s
                clothing — alongside a growing selection of artisan handicrafts.
                Each piece is quality-checked before it reaches you.
              </p>
            ),
          },
          {
            heading: "Our Promise",
            body: (
              <p>
                We stand behind authenticity, fair pricing, and attentive
                service. All prices are listed in AED and payments are processed
                securely, including card, Apple Pay, and Google Pay.
              </p>
            ),
          },
          {
            heading: "Visit or Contact Us",
            body: (
              <p>
                Burdubai, Dubai, United Arab Emirates. Reach us at{" "}
                <a
                  href="mailto:globalsupply600@gmail.com"
                  className="text-blue hover:underline"
                >
                  globalsupply600@gmail.com
                </a>{" "}
                or{" "}
                <a
                  href="tel:+971544399134"
                  className="text-blue hover:underline"
                >
                  +971 54 439 9134
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

export default AboutPage;
