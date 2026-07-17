import Home from "@/components/Home";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Global Supply 600 | Your trusted Partner",
  description:
    "Global Supply 600 — Your trusted Partner. Premium antique clothing, handicrafts, and shawls.",
  // other metadata
};

export default function HomePage() {
  return (
    <>
      <Home />
    </>
  );
}
