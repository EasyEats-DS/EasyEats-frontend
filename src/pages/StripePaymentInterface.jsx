import React, { useState } from 'react';
//import { loadStripe } from '@stripe/stripe-js';
//import { CardElement, Elements, useStripe, useElements } from '@stripe/react-stripe-js';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

// Initialize Stripe with your publishable key
//const stripePromise = loadStripe(process.env.VITE_STRIPE_PUBLISHABLE_KEY);

const PaymentForm = ({ amount }) => {
  const stripe = useStripe();
  const elements = useElements();
  const navigate = useNavigate();
  const [error, setError] = useState(null);
  const [processing, setProcessing] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!stripe || !elements) return;

    setProcessing(true);
    setError(null);

    try {
      // Create payment intent on the server
      const { data: { clientSecret } } = await axios.post(
        `${process.env.VITE_API_URL}/api/create-payment-intent`,
        { amount },
        {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json'
          }
        }
      );

      // Confirm the payment with Stripe
      const { error: stripeError, paymentIntent } = await stripe.confirmCardPayment(
        clientSecret,
        {
          payment_method: {
            card: elements.getElement(CardElement),
          },
        }
      );

      if (stripeError) {
        setError(stripeError.message);
      } else if (paymentIntent.status === 'succeeded') {
        // Payment successful - record the payment in your backend
        await axios.post(
          `${process.env.VITE_API_URL}/api/payments/record`,
          { 
            paymentIntentId: paymentIntent.id,
            amount: paymentIntent.amount,
            status: 'completed'
          },
          {
            headers: {
              'Authorization': `Bearer ${localStorage.getItem('token')}`,
              'Content-Type': 'application/json'
            }
          }
        );
        
        // Redirect to success page or order confirmation
        navigate('/payment-success');
      }
    } catch (err) {
      setError(err.message || 'An error occurred while processing your payment.');
    }

    setProcessing(false);
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto p-6">
      <div className="mb-6">
        <label className="block text-gray-700 text-sm font-bold mb-2">
          Card Details
        </label>
        <div className="border rounded-md p-3 bg-white">
          <CardElement
            options={{
              style: {
                base: {
                  fontSize: '16px',
                  color: '#424770',
                  '::placeholder': {
                    color: '#aab7c4',
                  },
                },
                invalid: {
                  color: '#9e2146',
                },
              },
            }}
          />
        </div>
      </div>

      {error && (
        <div className="mb-4 text-red-500 text-sm">
          {error}
        </div>
      )}

      <button
        type="submit"
        disabled={!stripe || processing}
        className={`w-full bg-[#FF7A00] text-white py-2 px-4 rounded-md font-medium
          ${processing ? 'opacity-50 cursor-not-allowed' : 'hover:bg-[#FF9E00]'}`}
      >
        {processing ? 'Processing...' : `Pay $${(amount / 100).toFixed(2)}`}
      </button>
    </form>
  );
};

const StripePaymentInterface = ({ amount = 1000 }) => {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-lg mx-auto bg-white rounded-xl shadow-md overflow-hidden">
        <div className="bg-[#FF7A00] px-6 py-4">
          <h1 className="text-white text-xl font-bold">Complete Your Payment</h1>
        </div>
        <div className="p-6">
          {/* <Elements stripe={stripePromise}>
            <PaymentForm amount={amount} />
          </Elements> */}
        </div>
      </div>
    </div>
  );
};

export default StripePaymentInterface;