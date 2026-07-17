import { Cormorant_Garamond, Jost } from "next/font/google";

// Serif display font for headings — refined, heritage feel.
export const serif = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  variable: "--font-serif",
  display: "swap",
});

// Clean geometric sans for body/UI text.
export const sans = Jost({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-sans",
  display: "swap",
});
