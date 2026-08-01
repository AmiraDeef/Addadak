import React, { useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import {
  Elements,
  PaymentElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import { X } from "lucide-react";

// Initialize Stripe outside the render tree using environment variables
const stripePromise = loadStripe(
  "pk_test_51TuUv1ABQ9aIjWR8Vyf4w8Vb60hWdBjwfZFCxbbEhJS9o9wDr3M3H5EZbOOAuxBESxn4DGr3yYbVW3vS4BaYaaMB00qUDzwPnY"
);
console.log(stripePromise);
interface CheckoutFormProps {
  onClose: () => void;
  onSuccess?: () => void;
}

const CheckoutForm: React.FC<CheckoutFormProps> = ({ onClose, onSuccess }) => {
  const stripe = useStripe();
  const elements = useElements();

  console.log(stripe);
console.log(elements);
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) return;

    setIsProcessing(true);
    setErrorMessage(null);

    const { error, paymentIntent } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/dashboard/credit`,
      },
      redirect: "if_required",
    });

    if (error) {
      setErrorMessage(error.message || "Something went wrong with the payment.");
      setIsProcessing(false);
    } else if (paymentIntent && paymentIntent.status === "succeeded") {
      onClose();
      if (onSuccess) {
        onSuccess();
      } else {
        window.location.reload();
      }
    } else {
      setIsProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Stripe Payment Input Field */}
      <PaymentElement />

      {errorMessage && (
        <p className="text-red-500 text-xs font-semibold">{errorMessage}</p>
      )}

      <button
        type="submit"
        disabled={!stripe || isProcessing}
        className="w-full py-3 bg-[var(--color-secondary-purple,#8B5CF6)] text-white text-sm font-bold rounded-xl hover:opacity-90 transition-all disabled:opacity-50 mt-4 shadow-md"
      >
        {isProcessing ? "Processing..." : "Pay Now"}
      </button>
    </form>
  );
};

interface StripeModalProps {
  clientSecret: string;
  onClose: () => void;
  onSuccess?: () => void;
}

export const StripeModal: React.FC<StripeModalProps> = ({
  clientSecret,
  onClose,
  onSuccess,
}) => {
  const options = {
    clientSecret,
    appearance: {
      theme: "stripe" as const,
      variables: {
        colorPrimary: "#8B5CF6",
      },
    },
  };

  return (
    <div
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      className="fixed inset-0 z-[99999] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
    >
      <div className="bg-white rounded-2xl p-6 w-full max-w-lg shadow-2xl relative max-h-[90vh] overflow-y-auto custom-scrollbar">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 mb-4 border-b border-gray-100">
          <h3 className="text-base font-bold text-gray-800">Complete Payment</h3>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body Context */}
        <Elements stripe={stripePromise} options={options}>
          <CheckoutForm onClose={onClose} onSuccess={onSuccess} />
        </Elements>
      </div>
    </div>
  );
};