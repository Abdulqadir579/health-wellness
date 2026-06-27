"use client";
import React, { useEffect } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useDispatch } from "react-redux";
import { removeAllItemsFromCart } from "@/redux/features/cart-slice";

const PaymentSuccess = () => {
  const dispatch = useDispatch();
  const searchParams = useSearchParams();
  const redirectStatus = searchParams.get("redirect_status");
  const succeeded = redirectStatus === "succeeded";

  useEffect(() => {
    if (succeeded) {
      dispatch(removeAllItemsFromCart());
    }
  }, [succeeded, dispatch]);

  return (
    <section className="overflow-hidden py-20 bg-gray-2">
      <div className="max-w-[600px] w-full mx-auto px-4 sm:px-8 xl:px-0">
        <div className="bg-white shadow-1 rounded-[10px] px-4 py-10 sm:py-15 text-center">
          <h2 className="font-bold text-dark text-2xl sm:text-3xl mb-3">
            {succeeded ? "Thank you for your order!" : "Payment status"}
          </h2>

          <p className="text-dark-4 mb-7.5">
            {succeeded
              ? "Your payment was successful and your order is confirmed. A receipt will be sent to your email."
              : "We couldn't confirm your payment. If you were charged, please contact support."}
          </p>

          <Link
            href="/"
            className="inline-flex font-medium text-white bg-blue py-3 px-9 rounded-md ease-out duration-200 hover:bg-blue-dark"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    </section>
  );
};

export default PaymentSuccess;
