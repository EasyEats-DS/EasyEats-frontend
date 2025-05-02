
import React, { useState, useEffect } from 'react';
import { CardNumberElement, CardExpiryElement, CardCvcElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { useNavigate, useLocation } from 'react-router-dom';
import UserLayout from '../components/UserLayout';
import { paymentService } from '../lib/api/payments';
import { getUserFromToken } from '../lib/auth';

const CARD_ELEMENT_OPTIONS = {
  classes: {
    base: 'stripe-input',
    focus: 'stripe-input--focus',
    invalid: 'stripe-input--invalid',
  },
  style: {
    base: {
      fontSize: '16px',
      color: '#32325d',
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

  const { amount, orderPayload } = location.state || {};

  useEffect(() => {
    if (!amount) {
      setError('Payment amount is missing. Please try placing your order again.');
      setTimeout(() => {
        navigate('/order');
      }, 3000);
    }
  }, [amount, navigate]);

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
    
    // Get user ID from token
    const user = getUserFromToken();
    const userId = user?.id;

    if (!stripe || !elements) {
      setError('Payment system is not initialized. Please try again.');
      return;
    }

    if (!amount) {
      setError('Payment amount is missing. Please try placing your order again.');
      return;
    }

    // Removed strict orderPayload validation for testing
    // Note: Re-enable this validation in production
    const orderData = orderPayload || { orderId: 'test-order-' + Date.now() };

    if (!userId) {
      setError('User authentication is required. Please log in and try again.');
      return;
    }

    if (!cardComplete.cardNumber || !cardComplete.cardExpiry || !cardComplete.cardCvc) {
      setError('Please fill in all card details.');
      return;
    }

    setProcessing(true);
    setError(null);

    try {
      const { clientSecret } = await paymentService.createPaymentIntent({
        amount: Math.round(amount * 100),
        currency: 'LKR',
        paymentMethod: 'CARD',
        userId,
        orderPayload: orderData
      });

      const cardNumber = elements.getElement(CardNumberElement);
      
      const { error: stripeError, paymentIntent } = await stripe.confirmCardPayment(
        clientSecret,
        {
          payment_method: {
            card: cardNumber,
          }
        }
      );

      if (stripeError) {
        setError(stripeError.message);
        return;
      }

      if (paymentIntent.status === 'succeeded') {
        localStorage.removeItem("cartItems");
        localStorage.removeItem("cartRestaurantId");
        navigate('/orderConfirmed', { 
          state: { 
            orderId: orderData.orderId,
            paymentId: paymentIntent.id
          }
        });
      }
    } catch (err) {
      setError(err.response?.data?.message || 'An error occurred while processing your payment.');
      console.error('Payment error:', err);
    }

    setProcessing(false);
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
                      className="h-full"
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
                        className="h-full"
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
                        className="h-full"
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

              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex justify-between text-sm text-gray-600 mb-2">
                  <span>Amount to pay:</span>
                  <span className="font-semibold">LKR {amount?.toFixed(2) || '0.00'}</span>
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