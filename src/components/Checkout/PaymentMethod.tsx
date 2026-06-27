"use client";
import React, { useMemo } from "react";
import Image from "next/image";
import { Elements } from "@stripe/react-stripe-js";
import { StripeElementsOptions } from "@stripe/stripe-js";
import getStripe from "@/lib/getStripe";
import StripePayment, { StripePaymentHandle } from "./StripePayment";

type PaymentMethodProps = {
  payment: string;
  setPayment: (value: string) => void;
  clientSecret: string | null;
  paymentRef: React.Ref<StripePaymentHandle>;
  onProcessingChange: (processing: boolean) => void;
};

const stripePromise = getStripe();

const PaymentMethod = ({
  payment,
  setPayment,
  clientSecret,
  paymentRef,
  onProcessingChange,
}: PaymentMethodProps) => {
  const options: StripeElementsOptions | undefined = useMemo(
    () =>
      clientSecret
        ? {
            clientSecret,
            appearance: { theme: "stripe" },
          }
        : undefined,
    [clientSecret]
  );

  return (
    <div className="bg-white shadow-1 rounded-[10px] mt-7.5">
      <div className="border-b border-gray-3 py-5 px-4 sm:px-8.5">
        <h3 className="font-medium text-xl text-dark">Payment Method</h3>
      </div>

      <div className="p-4 sm:p-8.5">
        <div className="flex flex-col gap-3">
          {/* <!-- card / wallets (Stripe) --> */}
          <label
            htmlFor="card"
            className="flex cursor-pointer select-none items-center gap-4"
          >
            <div className="relative">
              <input
                type="checkbox"
                name="card"
                id="card"
                className="sr-only"
                onChange={() => setPayment("card")}
              />
              <div
                className={`flex h-4 w-4 items-center justify-center rounded-full ${
                  payment === "card"
                    ? "border-4 border-blue"
                    : "border border-gray-4"
                }`}
              ></div>
            </div>

            <div
              className={`rounded-md border-[0.5px] py-3.5 px-5 ease-out duration-200 hover:bg-gray-2 hover:border-transparent hover:shadow-none min-w-[240px] ${
                payment === "card"
                  ? "border-transparent bg-gray-2"
                  : " border-gray-4 shadow-1"
              }`}
            >
              <p>Card / Apple Pay / Google Pay</p>
            </div>
          </label>

          {/* <!-- Stripe Payment Element renders here when card is selected --> */}
          {payment === "card" && (
            <div className="pl-8">
              {clientSecret && options ? (
                <Elements stripe={stripePromise} options={options}>
                  <StripePayment
                    ref={paymentRef}
                    onProcessingChange={onProcessingChange}
                  />
                </Elements>
              ) : (
                <p className="text-sm text-dark-5 mt-2">
                  Preparing secure payment…
                </p>
              )}
            </div>
          )}

          <label
            htmlFor="bank"
            className="flex cursor-pointer select-none items-center gap-4"
          >
            <div className="relative">
              <input
                type="checkbox"
                name="bank"
                id="bank"
                className="sr-only"
                onChange={() => setPayment("bank")}
              />
              <div
                className={`flex h-4 w-4 items-center justify-center rounded-full ${
                  payment === "bank"
                    ? "border-4 border-blue"
                    : "border border-gray-4"
                }`}
              ></div>
            </div>

            <div
              className={`rounded-md border-[0.5px] py-3.5 px-5 ease-out duration-200 hover:bg-gray-2 hover:border-transparent hover:shadow-none ${
                payment === "bank"
                  ? "border-transparent bg-gray-2"
                  : " border-gray-4 shadow-1"
              }`}
            >
              <div className="flex items-center">
                <div className="pr-2.5">
                  <Image src="/images/checkout/bank.svg" alt="bank" width={29} height={12}/>
                </div>

                <div className="border-l border-gray-4 pl-2.5">
                  <p>Direct bank transfer</p>
                </div>
              </div>
            </div>
          </label>

          <label
            htmlFor="cash"
            className="flex cursor-pointer select-none items-center gap-4"
          >
            <div className="relative">
              <input
                type="checkbox"
                name="cash"
                id="cash"
                className="sr-only"
                onChange={() => setPayment("cash")}
              />
              <div
                className={`flex h-4 w-4 items-center justify-center rounded-full ${
                  payment === "cash"
                    ? "border-4 border-blue"
                    : "border border-gray-4"
                }`}
              ></div>
            </div>

            <div
              className={`rounded-md border-[0.5px] py-3.5 px-5 ease-out duration-200 hover:bg-gray-2 hover:border-transparent hover:shadow-none min-w-[240px] ${
                payment === "cash"
                  ? "border-transparent bg-gray-2"
                  : " border-gray-4 shadow-1"
              }`}
            >
              <div className="flex items-center">
                <div className="pr-2.5">
                  <Image src="/images/checkout/cash.svg" alt="cash" width={21} height={21} />
                </div>

                <div className="border-l border-gray-4 pl-2.5">
                  <p>Cash on delivery</p>
                </div>
              </div>
            </div>
          </label>

          <label
            htmlFor="paypal"
            className="flex cursor-pointer select-none items-center gap-4"
          >
            <div className="relative">
              <input
                type="checkbox"
                name="paypal"
                id="paypal"
                className="sr-only"
                onChange={() => setPayment("paypal")}
              />
              <div
                className={`flex h-4 w-4 items-center justify-center rounded-full ${
                  payment === "paypal"
                    ? "border-4 border-blue"
                    : "border border-gray-4"
                }`}
              ></div>
            </div>
            <div
              className={`rounded-md border-[0.5px] py-3.5 px-5 ease-out duration-200 hover:bg-gray-2 hover:border-transparent hover:shadow-none min-w-[240px] ${
                payment === "paypal"
                  ? "border-transparent bg-gray-2"
                  : " border-gray-4 shadow-1"
              }`}
            >
              <div className="flex items-center">
                <div className="pr-2.5">
                  <Image src="/images/checkout/paypal.svg" alt="paypal" width={75} height={20}/>
                </div>

                <div className="border-l border-gray-4 pl-2.5">
                  <p>Paypal</p>
                </div>
              </div>
            </div>
          </label>
        </div>
      </div>
    </div>
  );
};

export default PaymentMethod;
