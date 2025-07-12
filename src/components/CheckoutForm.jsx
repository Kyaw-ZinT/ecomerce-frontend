// frontend/src/components/CheckoutForm.jsx

import React, { useState, useEffect } from "react";
import { useStripe, useElements, PaymentElement } from "@stripe/react-stripe-js";

function CheckoutForm({ onOrderPlaced, loadingOrder }) {
  const stripe = useStripe();
  const elements = useElements();

  const [message, setMessage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!stripe) {
      return;
    }
    const clientSecret = new URLSearchParams(window.location.search).get("payment_intent_client_secret");
    if (!clientSecret) {
      return;
    }
    stripe.retrievePaymentIntent(clientSecret).then(({ paymentIntent }) => {
      switch (paymentIntent.status) {
        case "succeeded":
          setMessage("Payment succeeded!");
          break;
        case "processing":
          setMessage("Your payment is processing.");
          break;
        case "requires_payment_method":
          setMessage("Your payment was not successful, please try again.");
          break;
        default:
          setMessage("Something went wrong.");
          break;
      }
    });
  }, [stripe]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!stripe || !elements) {
      // Stripe.js hasn't yet loaded.
      // Make sure to disable form submission until Stripe.js has loaded.
      return;
    }

    setIsLoading(true);

    // Confirm Payment
    const { error: submitError } = await elements.submit();
    if (submitError) {
      setMessage(submitError.message);
      setIsLoading(false);
      return;
    }

    // Call your backend to create the order FIRST
    // The onOrderPlaced prop is expected to be a function that
    // first creates the order in your backend (addOrderItems API)
    // then proceeds to confirm the payment intent if needed.
    // For simplicity, we assume onOrderPlaced will handle order creation
    // and then we'll confirm the payment intent.

    // If you placed the order successfully with your backend,
    // then confirm the payment intent here.
    // However, for typical Stripe integration, the payment intent is usually
    // confirmed *after* the order is successfully created in your database.
    // We'll call onOrderPlaced which is expected to create the order.
    // If onOrderPlaced then calls the Stripe confirmPayment, this is the flow.

    // For now, we are directly calling confirmPaymentIntent here
    // assuming onOrderPlaced might not directly interact with Stripe's client-side confirm.
    // A more robust solution might pass the clientSecret to onOrderPlaced
    // and let it handle confirmPayment from there.

    // Calling the backend API to confirm the Payment Intent.
    // In a real application, you'd likely create the order in your backend first,
    // then confirm the payment intent from client-side if your backend doesn't handle confirmation.
    // Given the backend `createPaymentIntent` and `updateOrderToPaid` APIs,
    // we'll place the order first, then mark as paid.

    // Trigger the order creation first
    await onOrderPlaced(); // This function should create the order in your DB

    // Then confirm the payment client-side
    // This is the step where Stripe takes the payment
    const { paymentIntent, error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        // Make sure to change this to your payment completion page
        return_url: `${window.location.origin}/order/success`, // Example success URL
      },
      redirect: "if_required", // Only redirect if necessary
    });

    if (error) {
      // This point will only be reached if there is an immediate error when
      // confirming the payment. Show error to your customer (e.g., insufficient funds)
      setMessage(error.message);
    } else if (paymentIntent && paymentIntent.status === "succeeded") {
      setMessage("Payment succeeded!");
      // You would typically redirect to a success page or update UI here.
      // The return_url in confirmParams handles the redirect for success cases.
      // For demonstration, we just show a message.
      // It's crucial to also update the order status in your backend at this point.
      // This is handled in `updateOrderToPaid` API.
      // You'll need to call updateOrderToPaid from the placeOrderHandler or a dedicated step
      // after successful payment.
    } else {
      setMessage("Payment failed or was cancelled.");
    }

    setIsLoading(false);
  };

  return (
    <form id="payment-form" onSubmit={handleSubmit}>
      <PaymentElement id="payment-element" />
      <button
        disabled={isLoading || !stripe || !elements || loadingOrder}
        id="submit"
        className="w-full bg-green-600 text-white text-lg py-3 rounded-lg hover:bg-green-700 transition-colors duration-300 mt-6"
      >
        <span id="button-text">{isLoading ? <div className="spinner" id="spinner"></div> : "Pay Now"}</span>
      </button>
      {/* Show any error or success messages */}
      {message && (
        <div
          id="payment-message"
          className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mt-4"
        >
          {message}
        </div>
      )}
    </form>
  );
}

export default CheckoutForm;
