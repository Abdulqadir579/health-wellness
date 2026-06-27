"use client";
import React, {
  forwardRef,
  useImperativeHandle,
  useState,
} from "react";
import {
  PaymentElement,
  ExpressCheckoutElement,
  useElements,
  useStripe,
} from "@stripe/react-stripe-js";
import type {
  StripeExpressCheckoutElementConfirmEvent,
  StripeExpressCheckoutElementReadyEvent,
} from "@stripe/stripe-js";

export type StripePaymentHandle = {
  confirm: (email?: string) => Promise<void>;
};

type StripePaymentProps = {
  onProcessingChange?: (processing: boolean) => void;
};

// Rendered inside an <Elements> provider. The Express Checkout Element shows
// Apple Pay / Google Pay / Link buttons (Google Pay renders in Safari too),
// and the Payment Element below handles card entry.
const StripePayment = forwardRef<StripePaymentHandle, StripePaymentProps>(
  ({ onProcessingChange }, ref) => {
    const stripe = useStripe();
    const elements = useElements();
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [ready, setReady] = useState(false);
    const [expressAvailable, setExpressAvailable] = useState(false);

    const confirm = async (email?: string) => {
      if (!stripe || !elements) return;

      onProcessingChange?.(true);
      setErrorMessage(null);

      const { error } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${window.location.origin}/checkout/success`,
          // Stores the email on the PaymentIntent so the webhook can send the
          // Resend confirmation. Comes from the billing form (card path) or the
          // wallet (express path).
          ...(email ? { receipt_email: email } : {}),
        },
      });

      // No error means Stripe already redirected to return_url.
      if (error) {
        setErrorMessage(error.message ?? "Payment failed. Please try again.");
      }

      onProcessingChange?.(false);
    };

    useImperativeHandle(ref, () => ({ confirm }));

    const handleExpressConfirm = async (
      event: StripeExpressCheckoutElementConfirmEvent
    ) => {
      const email = event.billingDetails?.email ?? undefined;
      await confirm(email);
    };

    const handleExpressReady = (
      event: StripeExpressCheckoutElementReadyEvent
    ) => {
      setExpressAvailable(Boolean(event.availablePaymentMethods));
    };

    return (
      <div className="mt-5">
        {/* Apple Pay / Google Pay / Link express buttons */}
        <ExpressCheckoutElement
          options={{ emailRequired: true }}
          onReady={handleExpressReady}
          onConfirm={handleExpressConfirm}
        />

        {expressAvailable && (
          <div className="flex items-center gap-4 my-5">
            <span className="h-px flex-1 bg-gray-3" />
            <span className="text-sm text-dark-4">OR pay with card</span>
            <span className="h-px flex-1 bg-gray-3" />
          </div>
        )}

        <PaymentElement
          onReady={() => setReady(true)}
          onLoadError={(event) =>
            setErrorMessage(
              event.error?.message ??
                "Couldn't load payment options. Check your Stripe publishable key."
            )
          }
        />

        {!ready && !errorMessage && (
          <p className="text-sm text-dark-5 mt-2">Loading payment options…</p>
        )}

        {errorMessage && (
          <p className="text-red mt-3 text-sm" role="alert">
            {errorMessage}
          </p>
        )}
      </div>
    );
  }
);

StripePayment.displayName = "StripePayment";

export default StripePayment;
