"use client";
import React, { useEffect, useRef, useState } from "react";
import Breadcrumb from "../Common/Breadcrumb";
import Login from "./Login";
import Shipping from "./Shipping";
import ShippingMethod from "./ShippingMethod";
import PaymentMethod from "./PaymentMethod";
import Coupon from "./Coupon";
import Billing from "./Billing";
import { StripePaymentHandle } from "./StripePayment";
import { useAppSelector } from "@/redux/store";
import { selectCartItems, selectTotalPrice } from "@/redux/features/cart-slice";

const formatAED = (value: number) =>
  `AED ${value.toLocaleString("en-AE", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;

const Checkout = () => {
  const cartItems = useAppSelector(selectCartItems);
  const totalPrice = useAppSelector(selectTotalPrice);

  const [payment, setPayment] = useState("card");
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const paymentRef = useRef<StripePaymentHandle>(null);

  // Create / refresh the PaymentIntent whenever the cart contents change.
  // We only ever send [{ id, quantity }] — the server recomputes the price.
  useEffect(() => {
    if (cartItems.length === 0) {
      setClientSecret(null);
      return;
    }

    const controller = new AbortController();

    const createIntent = async () => {
      try {
        const res = await fetch("/api/checkout", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            items: cartItems.map((item) => ({
              id: item.id,
              quantity: item.quantity,
            })),
          }),
          signal: controller.signal,
        });

        const data = await res.json();

        if (!res.ok) {
          throw new Error(data?.error ?? "Unable to start checkout");
        }

        setClientSecret(data.clientSecret);
      } catch (error) {
        if ((error as Error).name !== "AbortError") {
          setFormError((error as Error).message);
        }
      }
    };

    createIntent();

    return () => controller.abort();
  }, [cartItems]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFormError(null);

    if (cartItems.length === 0) {
      setFormError("Your cart is empty.");
      return;
    }

    const formData = new FormData(e.currentTarget);
    const email = (formData.get("email") as string | null)?.trim() ?? "";

    if (payment === "card") {
      if (!clientSecret) {
        setFormError("Payment is still being prepared. Please wait a moment.");
        return;
      }
      if (!email) {
        setFormError("Please enter your email address for the order receipt.");
        return;
      }
      await paymentRef.current?.confirm(email);
      return;
    }

    // Non-card options (bank / cash / paypal) are template placeholders and are
    // not processed here.
    setFormError(
      "Please select Card / Apple Pay / Google Pay to complete payment online."
    );
  };

  return (
    <>
      <Breadcrumb title={"Checkout"} pages={["checkout"]} />
      <section className="overflow-hidden py-20 bg-gray-2">
        <div className="max-w-[1170px] w-full mx-auto px-4 sm:px-8 xl:px-0">
          <form onSubmit={handleSubmit}>
            <div className="flex flex-col lg:flex-row gap-7.5 xl:gap-11">
              {/* <!-- checkout left --> */}
              <div className="lg:max-w-[670px] w-full">
                {/* <!-- login box --> */}
                <Login />

                {/* <!-- billing details --> */}
                <Billing />

                {/* <!-- address box two --> */}
                <Shipping />

                {/* <!-- others note box --> */}
                <div className="bg-white shadow-1 rounded-[10px] p-4 sm:p-8.5 mt-7.5">
                  <div>
                    <label htmlFor="notes" className="block mb-2.5">
                      Other Notes (optional)
                    </label>

                    <textarea
                      name="notes"
                      id="notes"
                      rows={5}
                      placeholder="Notes about your order, e.g. speacial notes for delivery."
                      className="rounded-md border border-gray-3 bg-gray-1 placeholder:text-dark-5 w-full p-5 outline-none duration-200 focus:border-transparent focus:shadow-input focus:ring-2 focus:ring-blue/20"
                    ></textarea>
                  </div>
                </div>
              </div>

              {/* // <!-- checkout right --> */}
              <div className="max-w-[455px] w-full">
                {/* <!-- order list box --> */}
                <div className="bg-white shadow-1 rounded-[10px]">
                  <div className="border-b border-gray-3 py-5 px-4 sm:px-8.5">
                    <h3 className="font-medium text-xl text-dark">
                      Your Order
                    </h3>
                  </div>

                  <div className="pt-2.5 pb-8.5 px-4 sm:px-8.5">
                    {/* <!-- title --> */}
                    <div className="flex items-center justify-between py-5 border-b border-gray-3">
                      <div>
                        <h4 className="font-medium text-dark">Product</h4>
                      </div>
                      <div>
                        <h4 className="font-medium text-dark text-right">
                          Subtotal
                        </h4>
                      </div>
                    </div>

                    {/* <!-- product items --> */}
                    {cartItems.length === 0 ? (
                      <div className="flex items-center justify-between py-5 border-b border-gray-3">
                        <p className="text-dark">Your cart is empty.</p>
                      </div>
                    ) : (
                      cartItems.map((item) => (
                        <div
                          key={item.id}
                          className="flex items-center justify-between py-5 border-b border-gray-3"
                        >
                          <div>
                            <p className="text-dark">
                              {item.title}{" "}
                              <span className="text-dark-4">
                                x{item.quantity}
                              </span>
                            </p>
                          </div>
                          <div>
                            <p className="text-dark text-right">
                              {formatAED(item.discountedPrice * item.quantity)}
                            </p>
                          </div>
                        </div>
                      ))
                    )}

                    {/* <!-- shipping fee --> */}
                    <div className="flex items-center justify-between py-5 border-b border-gray-3">
                      <div>
                        <p className="text-dark">Shipping Fee</p>
                      </div>
                      <div>
                        <p className="text-dark text-right">Free</p>
                      </div>
                    </div>

                    {/* <!-- total --> */}
                    <div className="flex items-center justify-between pt-5">
                      <div>
                        <p className="font-medium text-lg text-dark">Total</p>
                      </div>
                      <div>
                        <p className="font-medium text-lg text-dark text-right">
                          {formatAED(totalPrice)}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* <!-- coupon box --> */}
                <Coupon />

                {/* <!-- shipping box --> */}
                <ShippingMethod />

                {/* <!-- payment box --> */}
                <PaymentMethod
                  payment={payment}
                  setPayment={setPayment}
                  clientSecret={clientSecret}
                  paymentRef={paymentRef}
                  onProcessingChange={setIsProcessing}
                />

                {formError && (
                  <p className="text-red mt-4 text-sm" role="alert">
                    {formError}
                  </p>
                )}

                {/* <!-- checkout button --> */}
                <button
                  type="submit"
                  disabled={isProcessing || cartItems.length === 0}
                  className="w-full flex justify-center font-medium text-white bg-blue py-3 px-6 rounded-md ease-out duration-200 hover:bg-blue-dark mt-7.5 disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {isProcessing ? "Processing…" : "Process to Checkout"}
                </button>
              </div>
            </div>
          </form>
        </div>
      </section>
    </>
  );
};

export default Checkout;
