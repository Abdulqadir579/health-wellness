"use client";
import React, {
  forwardRef,
  useImperativeHandle,
  useState,
} from "react";
import { PaymentElement, useElements, useStripe } from "@stripe/react-stripe-js";

export type StripePaymentHandle = {
  confirm: (email?: string) => Promise<void>;
};

type StripePaymentProps = {
  onProcessingChange?: (processing: boolean) => void;
};

// Rendered inside an <Elements> provider. The Payment Element automatically
// shows card fields plus Apple Pay / Google Pay (wallets only appear on
// HTTPS + supported browsers, never on localhost).
const StripePayment = forwardRef<StripePaymentHandle, StripePaymentProps>(
  ({ onProcessingChange }, ref) => {
    const stripe = useStripe();
    const elements = useElements();
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [ready, setReady] = useState(false);

    useImperativeHandle(ref, () => ({
      async confirm(email?: string) {
        if (!stripe || !elements) return;

        onProcessingChange?.(true);
        setErrorMessage(null);

        const { error } = await stripe.confirmPayment({
          elements,
          confirmParams: {
            return_url: `${window.location.origin}/checkout/success`,
            // Captured from the billing form. Stripe stores it on the
            // PaymentIntent so the webhook can send the Resend confirmation.
            ...(email ? { receipt_email: email } : {}),
          },
        });

        // If there's no error here, Stripe has already redirected to the
        // return_url. We only reach this point when something went wrong.
        if (error) {
          setErrorMessage(error.message ?? "Payment failed. Please try again.");
        }

        onProcessingChange?.(false);
      },
    }));

    return (
      <div className="mt-5">
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
