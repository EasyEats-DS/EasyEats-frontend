import React, { useState, useEffect } from 'react';
import { useStripe, useElements, CardElement } from '@stripe/react-stripe-js';
import { useNavigate, useLocation } from 'react-router-dom';
import UserLayout from '../components/UserLayout';
import FoodieButton from '../components/FoodieButton';
import { paymentService } from '../lib/api/payments';

const CARD_ELEMENT_OPTIONS = {
  style: {
    base: {
      color: '#32325d',
      fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
      fontSmoothing: 'antialiased',
      fontSize: '16px',
      '::placeholder': {
        color: '#aab7c4'
      }
    },
    invalid: {
      color: '#fa755a',
      iconColor: '#fa755a'
    }
  }
};

const StripePayment = () => {
  const stripe = useStripe();
  const elements = useElements();
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const { amount, orderId } = location.state || {};
  const userId = localStorage.getItem('userId');

  useEffect(() => {
    console.log('StripePayment state:', location.state);
    if (!amount || !orderId) {
      setError('Payment information is missing. Please try placing your order again.');
      setTimeout(() => {
        navigate('/order');
      }, 3000);
    }
  }, [amount, orderId, navigate, location.state]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    
    if (!stripe || !elements || !amount || !orderId || !userId) {
      setError('Required payment information is missing. Please try again.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Create payment intent
      const { clientSecret } = await paymentService.createPaymentIntent({
        orderId,
        userId,
        amount: Math.round(amount * 100), // Convert to cents
        currency: 'LKR',
        paymentMethod: 'CARD'
      });

      // Confirm card payment
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
        return;
      }

      if (paymentIntent.status === 'succeeded') {
        // Send notification for successful payment
        try {
          await paymentService.sendOrderConfirmation({
            orderId: `#${orderId.slice(0, 8)}`,
            userId,
            customerEmail: "dushanbolonghe@gmail.com",
            customerPhone: "+94701615834",
            totalAmount: amount,
            channel: 'BOTH',
            metadata: {
              email: "dushanbolonghe@gmail.com",
              subject: "Order Confirmation - EasyEats",
              phone: "+94701615834",
              channel: "BOTH",
              paymentId: paymentIntent.id,
              paymentStatus: paymentIntent.status
            }
          });
        } catch (notifError) {
          console.error("Failed to send notification:", notifError);
        }

        navigate('/orderConfirmed', { 
          state: { 
            orderId,
            paymentId: paymentIntent.id
          }
        });
      }
    } catch (err) {
      setError(err.response?.data?.message || 'An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <UserLayout>
      <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-2xl shadow-lg">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Payment Details</h2>
        
        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 rounded-lg">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Card Details
            </label>
            <div className="p-3 border rounded-lg">
              <CardElement options={CARD_ELEMENT_OPTIONS} />
            </div>
          </div>

          <div className="mb-4">
            <p className="text-gray-600">
              Amount to pay: <span className="font-semibold">LKR {amount?.toFixed(2) || '0.00'}</span>
            </p>
          </div>

          <FoodieButton
            type="submit"
            disabled={!stripe || loading || !amount}
            className="w-full"
          >
            {loading ? 'Processing...' : 'Pay Now'}
          </FoodieButton>
        </form>

        <div className="mt-4 text-center">
          <button
            onClick={() => navigate(-1)}
            className="text-orange-500 hover:text-orange-600 text-sm"
          >
            Cancel and go back
          </button>
        </div>
      </div>
    </UserLayout>
  );
};

export default StripePayment;