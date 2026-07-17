import React from "react";
import ShopDetails from "@/components/ShopDetails";
import shopData from "@/components/Shop/shopData";
import { notFound } from "next/navigation";
import { Metadata } from "next";

type Params = { params: Promise<{ id: string }> };

export async function generateMetadata({
  params,
}: Params): Promise<Metadata> {
  const { id } = await params;
  const product = shopData.find((p) => String(p.id) === id);

  if (!product) {
    return { title: "Product Not Found | Global Supply 600" };
  }

  return {
    title: `${product.title} | Global Supply 600`,
    description: `${product.title} — ${
      product.category ?? "premium antique"
    } from Global Supply 600. Your trusted Partner for premium antique clothing, handicrafts, and shawls.`,
  };
}

export function generateStaticParams() {
  return shopData.map((product) => ({ id: String(product.id) }));
}

const ShopDetailsByIdPage = async ({ params }: Params) => {
  const { id } = await params;
  const product = shopData.find((p) => String(p.id) === id);

  if (!product) {
    notFound();
  }

  return (
    <main>
      <ShopDetails product={product} />
    </main>
  );
};

export default ShopDetailsByIdPage;
