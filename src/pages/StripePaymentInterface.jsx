import React, { useState, useEffect } from 'react';
import { CardNumberElement, CardExpiryElement, CardCvcElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { useNavigate, useLocation } from 'react-router-dom';
import UserLayout from '../components/UserLayout';
import { paymentService } from '../lib/api/payments';
import { getUserFromToken } from '../lib/auth';
import { sendOrderConfirmation } from "../lib/api/notifications";
import { createOrder } from "../lib/api/orders";

const CARD_ELEMENT_OPTIONS = {
  style: {
    base: {
      fontSize: '16px',
      color: '#32325d',
      fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
      fontSmoothing: 'antialiased',
      '::placeholder': {
        color: '#aab7c4',
      },
      padding: '16px',
    },
    invalid: {
      color: '#fa755a',
      iconColor: '#fa755a',
    },
  },
};

const inputWrapperStyle = "w-full min-h-[42px] border border-gray-300 rounded-md shadow-sm hover:border-orange-300 focus-within:ring-1 focus-within:ring-orange-500 focus-within:border-orange-500 bg-white transition-all duration-200";

const stripeInputStyles = `
  .stripe-input {
    display: block;
    width: 100%;
    padding: 10px 14px;
    font-size: 1rem;
    line-height: 1.5;
    background-color: white;
  }
  .stripe-input--focus {
    outline: none;
  }
  .stripe-input--invalid {
    border-color: #fa755a;
  }
`;

const StripePaymentInterface = () => {

  const stripe = useStripe();
  const elements = useElements();
  const navigate = useNavigate();
  const location = useLocation();
  const [error, setError] = useState(null);
  const [processing, setProcessing] = useState(false);
  const [cardComplete, setCardComplete] = useState({
    cardNumber: false,
    cardExpiry: false,
    cardCvc: false
  });

  const { amount, orderId, orderPayload, userEmail: _userEmail, userPhone: _userPhone } = location.state || {};
  const user = getUserFromToken();
  const userId = user?.id;

  useEffect(() => {
    if (!amount || !orderId || !userId) {
      setError('Required payment information is missing. Please try again.');
      setTimeout(() => {
        navigate('/order');
      }, 3000);
      return;
    }
  }, [amount, orderId, userId, navigate]);

  useEffect(() => {
    const styleElement = document.createElement('style');
    styleElement.textContent = stripeInputStyles;
    document.head.appendChild(styleElement);

    return () => {
      document.head.removeChild(styleElement);
    };
  }, []);

  const handleCardChange = (event, type) => {
    setCardComplete(prev => ({
      ...prev,
      [type]: event.complete
    }));
    if (event.error) {
      setError(event.error.message);
    } else {
      setError(null);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    
    if (!stripe || !elements || !amount || !orderId || !userId) {
      setError('Required payment information is missing. Please try again.');
      return;
    }

    setProcessing(true);
    setError(null);

    try {
      // First handle the Stripe payment
      const { clientSecret } = await paymentService.createPaymentIntent({
        amount: Number(amount),
        orderId,
        userId,
        currency: 'usd',
        paymentMethod: 'CARD'
      });

      const cardNumber = elements.getElement(CardNumberElement);
      
      const result = await stripe.confirmCardPayment(
        clientSecret,
        {
          payment_method: {
            card: cardNumber,
          }
        }
      );

      if (result.error) {
        setError(result.error.message);
        return;
      }

      if (result.paymentIntent && (result.paymentIntent.status === 'succeeded' || result.paymentIntent.status === 'processing')) {
        // Create order in DB and trigger delivery Kafka event after payment succeeds
        try {
          if (orderPayload) {
            await createOrder({
              ...orderPayload,
              paymentMethod: 'card',
              orderId,
            });
          }
        } catch (orderErr) {
          console.error("Failed to persist order after payment:", orderErr);
        }
        try {
          // Send notification after successful payment
          const userEmail = _userEmail || user?.email || "customer@example.com";
          const userPhone = _userPhone || user?.phoneNumber || user?.phone || "+94701615834";
          await sendOrderConfirmation({
            orderId: orderId,
            userId,
            customerEmail: userEmail,
            customerPhone: userPhone,
            totalAmount: amount,
            metadata: {
              email: userEmail,
              subject: "Order Confirmation - EasyEats",
              phone: userPhone,
              paymentId: result.paymentIntent.id,
              paymentStatus: "SUCCESS"
            }
          });
        } catch (notifError) {
          console.error("Failed to send notification:", notifError);
        }

        localStorage.removeItem("cartItems");
        localStorage.removeItem("cartRestaurantId");
        window.dispatchEvent(new Event("cartUpdated"));
        
        navigate('/orderConfirmed', { 
          state: { 
            orderId: orderId,
            paymentId: result.paymentIntent.id,
            paymentStatus: "SUCCESS"
          }
        });
      } else {
        setError('Payment failed. Please try again.');
        return;
      }
    } catch (err) {
      setError(err.response?.data?.message || 'An error occurred while processing your payment.');
      console.error('Payment error:', err);
    } finally {
      setProcessing(false);
    }
  };

  return (
    <UserLayout>
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-lg mx-auto bg-white rounded-xl shadow-md overflow-hidden">
          <div className="bg-[#FF7A00] px-6 py-4">
            <h1 className="text-white text-xl font-bold">Complete Your Payment</h1>
            <p className="text-white/80 text-sm mt-1">Enter your card details below</p>
          </div>
          <div className="p-6">
            {/* Sandbox Helper Banner */}
            <div className="mb-6 p-4 bg-emerald-50 border border-emerald-200 rounded-xl">
              <div className="flex items-center gap-2 mb-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
                <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider">Stripe Sandbox (Test Mode)</span>
              </div>
              <p className="text-xs text-emerald-900 font-medium">Use Stripe test card credentials to simulate payment:</p>
              <div className="mt-2.5 grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
                <div className="bg-white p-2.5 rounded-lg border border-emerald-200 shadow-xs">
                  <span className="text-gray-500 block text-[10px] font-medium">CARD NUMBER</span>
                  <span className="font-mono font-bold text-emerald-700">4242 •••• •••• 4242</span>
                </div>
                <div className="bg-white p-2.5 rounded-lg border border-emerald-200 shadow-xs">
                  <span className="text-gray-500 block text-[10px] font-medium">EXPIRY</span>
                  <span className="font-mono font-bold text-emerald-700">Any future MM/YY</span>
                </div>
                <div className="bg-white p-2.5 rounded-lg border border-emerald-200 shadow-xs">
                  <span className="text-gray-500 block text-[10px] font-medium">CVC</span>
                  <span className="font-mono font-bold text-emerald-700">Any 3 digits (123)</span>
                </div>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Card Number
                  </label>
                  <div className={inputWrapperStyle}>
                    <CardNumberElement
                      options={CARD_ELEMENT_OPTIONS}
                      onChange={(e) => handleCardChange(e, 'cardNumber')}
                      className="py-3 px-4"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Expiry Date
                    </label>
                    <div className={inputWrapperStyle}>
                      <CardExpiryElement
                        options={CARD_ELEMENT_OPTIONS}
                        onChange={(e) => handleCardChange(e, 'cardExpiry')}
                        className="py-3 px-4"
                      />
                    </div>
                  </div>


                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      CVC
                    </label>
                    <div className={inputWrapperStyle}>
                      <CardCvcElement
                        options={CARD_ELEMENT_OPTIONS}
                        onChange={(e) => handleCardChange(e, 'cardCvc')}
                        className="py-3 px-4"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 text-red-600 rounded-lg p-3 text-sm">
                  {error}
                </div>
              )}

              <div className="bg-orange-50/70 border border-orange-100 rounded-xl p-4">
                <div className="flex justify-between items-center text-sm text-gray-700">
                  <span className="font-medium">Amount to pay (USD):</span>
                  <span className="font-bold text-lg text-gray-900">USD {Number(amount || 0).toFixed(2)}</span>
                </div>
              </div>

              <button
                type="submit"
                disabled={!stripe || processing || !cardComplete.cardNumber || !cardComplete.cardExpiry || !cardComplete.cardCvc}
                className={`w-full bg-[#FF7A00] text-white py-3 px-4 rounded-lg font-medium
                  ${(processing || !cardComplete.cardNumber || !cardComplete.cardExpiry || !cardComplete.cardCvc) 
                    ? 'opacity-50 cursor-not-allowed' 
                    : 'hover:bg-[#FF9E00] transition-colors'}
                `}
              >
                {processing ? 'Processing...' : 'Pay Now'}
              </button>

              <button
                type="button"
                onClick={() => navigate(-1)}
                disabled={processing}
                className="w-full text-[#FF7A00] text-sm hover:underline"
              >
                Cancel and go back
              </button>
            </form>
          </div>

        </div>
      </div>
    </UserLayout>
  );
};

export default StripePaymentInterface;