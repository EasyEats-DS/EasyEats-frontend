import React from "react";
import { Link } from "react-router-dom";

const OrderConfirmed = () => {
  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gray-50 px-6 py-12">
      {/* Success Icon */}
      <div className="bg-orange-100 rounded-full p-6 mb-6">
        <svg
          className="w-16 h-16 text-orange-500"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M5 13l4 4L19 7"
          />
        </svg>
      </div>

      {/* Message */}
      <h1 className="text-3xl font-bold text-gray-800 mb-4">Order Placed Successfully!</h1>
      <p className="text-gray-600 text-center mb-8">
        Thank you for your order. We are preparing your delicious food! 🍔🚚
      </p>

      {/* Buttons */}
      <div className="flex flex-col md:flex-row gap-4">
        <Link
          to="/orders"
          className="bg-orange-500 text-white px-8 py-3 rounded-lg font-semibold text-lg hover:bg-orange-400 transition-all"
        >
          View My Orders
        </Link>
        <Link
          to="/"
          className="bg-white border border-orange-500 text-orange-500 px-8 py-3 rounded-lg font-semibold text-lg hover:bg-orange-100 transition-all"
        >
          Back to Home
        </Link>
      </div>
    </div>
  );
};

export default OrderConfirmed;
