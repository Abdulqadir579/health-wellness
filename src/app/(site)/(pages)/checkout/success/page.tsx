import React, { Suspense } from "react";
import PaymentSuccess from "@/components/Checkout/PaymentSuccess";

import { Metadata } from "next";
export const metadata: Metadata = {
  title: "Order Confirmation | Global Supply 600",
  description: "Your order confirmation page",
};

const CheckoutSuccessPage = () => {
  return (
    <main>
      <Suspense fallback={null}>
        <PaymentSuccess />
      </Suspense>
    </main>
  );
};

export default CheckoutSuccessPage;
