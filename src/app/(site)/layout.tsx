import "../css/euclid-circular-a-font.css";
import "../css/style.css";
import { serif, sans } from "../fonts";
import { Metadata } from "next";
import ClientLayout from "./ClientLayout";

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL || "https://globalsupply600.com";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: "Global Supply 600 | Your trusted Partner",
  description:
    "Global Supply 600 — Your trusted Partner for premium antique clothing, handicrafts, and shawls.",
  icons: {
    icon: "/images/logo/logo-gs600.png",
    apple: "/images/logo/logo-gs600.png",
  },
  openGraph: {
    type: "website",
    title: "Global Supply 600 | Your trusted Partner",
    description:
      "Premium antique clothing, handicrafts, and shawls. Your trusted Partner.",
    url: siteUrl,
    siteName: "Global Supply 600",
    images: [
      {
        url: "/images/logo/logo-gs600.png",
        width: 500,
        height: 500,
        alt: "Global Supply 600",
      },
    ],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      suppressHydrationWarning={true}
      className={`${sans.variable} ${serif.variable}`}
    >
      <body>
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  );
}
