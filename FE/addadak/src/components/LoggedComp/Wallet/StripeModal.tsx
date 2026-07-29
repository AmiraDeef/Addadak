import { loadStripe } from "@stripe/stripe-js";
import {
  Elements,
  PaymentElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import { useState } from "react";
import { X } from "lucide-react";

const stripePromise = loadStripe("pk_test_51TuUv1ABQ9aIjWR8Vyf4w8Vb60hWdBjwfZFCxbbEhJS9o9wDr3M3H5EZbOOAuxBESxn4DGr3yYbVW3vS4BaYaaMB00qUDzwPnY"); 

const CheckoutForm = ({ onClose }: { onClose: () => void }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    setIsProcessing(true);
    setErrorMessage(null);

    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/dashboard/credit`,
      },
      redirect: "if_required",
    });


    if (error) {
      setErrorMessage(error.message || "Something went wrong.");
      setIsProcessing(false);
    } else {
      alert("Payment Successful!");
      onClose();
      window.location.reload();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Stripe Payment Element */}
      <PaymentElement />
      
      {errorMessage && (
        <p className="text-red-500 text-xs font-semibold">{errorMessage}</p>
      )}

      <button
        type="submit"
        disabled={!stripe || isProcessing}
        className="w-full py-3 bg-[var(--color-secondary-purple)] text-white text-sm font-bold rounded-xl hover:opacity-90 transition-all disabled:opacity-50 mt-4 shadow-md"
      >
        {isProcessing ? "Processing..." : "Pay Now"}
      </button>
    </form>
  );
};

interface StripeModalProps {
  clientSecret: string;
  onClose: () => void;
}

export const StripeModal = ({ clientSecret, onClose }: StripeModalProps) => {
  return (

    <div className="fixed inset-0 z-[99999] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
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

        {/* Form Body */}
        <Elements stripe={stripePromise} options={{ clientSecret }}>
          <CheckoutForm onClose={onClose} />
        </Elements>
      </div>
    </div>
  );
};