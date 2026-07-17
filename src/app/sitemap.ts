import type { MetadataRoute } from "next";
import shopData from "@/components/Shop/shopData";

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL || "https://globalsupply600.com";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes = [
    "",
    "/shop-with-sidebar",
    "/shop-without-sidebar",
    "/about",
    "/contact",
    "/cart",
    "/wishlist",
    "/checkout",
    "/privacy-policy",
    "/terms",
    "/refund-policy",
    "/shipping-policy",
  ].map((path) => ({
    url: `${siteUrl}${path}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: path === "" ? 1 : 0.7,
  }));

  const productRoutes = shopData.map((product) => ({
    url: `${siteUrl}/shop-details/${product.id}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.6,
  }));

  return [...staticRoutes, ...productRoutes];
}
