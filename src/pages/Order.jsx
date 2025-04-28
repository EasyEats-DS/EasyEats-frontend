// src/pages/Order.jsx
import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { getUserFromToken } from "../lib/auth";
import { createOrder } from "../lib/api/orders";

const Order = () => {
  const { cartItems = [], promotion = 0, note = "", restaurantId } =
    useLocation().state || {};
  const navigate = useNavigate();

  const [deliveryAddress, setDeliveryAddress] = useState(
    "SLIIT Campus, Malabe"
  );
  const [dropNote, setDropNote] = useState(
    "Near Perera and Sons in front of SLIIT"
  );
  const [deliveryType, setDeliveryType] = useState("standard");
  const [paymentMethod, setPaymentMethod] = useState("cash");
  const [submitting, setSubmitting] = useState(false);

  const deliveryFee = deliveryType === "priority" ? 129 : 99;
  const taxes = 62.07;
  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const total = subtotal - promotion + deliveryFee + taxes;

  const handlePlaceOrder = async () => {
    setSubmitting(true);
    try {
      const user = getUserFromToken();
      const userId = user?.id;
      const payload = {
        userId,
        restaurantId,
        products: cartItems.map((i) => ({
          productId: i.id,
          quantity: i.quantity,
          price: i.price,
        })),
        paymentMethod,
        totalAmount: total,
        // (optional) you could also send:
        // deliveryAddress, dropNote, deliveryType, note
      };

      if (paymentMethod === "cash") {
        await createOrder(payload);
        localStorage.removeItem("cartItems");
        localStorage.removeItem("cartRestaurantId");
        navigate("/orderConfirmed");
      } else {
        navigate("/payment", { state: { orderPayload: payload } });
      }
    } catch (err) {
      console.error("Failed to place order:", err);
      alert("Unable to place order. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-10 flex flex-col md:flex-row gap-10">
      {/* Left side: payment method selector */}
      <div className="flex-1 space-y-8">
        <div className="bg-white rounded-2xl shadow-md p-6">
          <h2 className="text-2xl font-bold mb-6 text-gray-800">
            Payment Method
          </h2>
          <div className="space-y-4">
            <label
              className={`flex items-center justify-between p-4 border rounded-lg cursor-pointer transition-all duration-300 ${
                paymentMethod === "cash"
                  ? "border-orange-500 bg-orange-50"
                  : "border-gray-300"
              }`}
            >
              <div className="flex items-center gap-3">
                <input
                  type="radio"
                  name="payment"
                  value="cash"
                  checked={paymentMethod === "cash"}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="accent-orange-500 w-5 h-5"
                />
                <span className="font-medium text-gray-700">
                  Cash on Delivery
                </span>
              </div>
              <span className="text-sm text-gray-500">
                Pay in cash when food arrives
              </span>
            </label>

            <label
              className={`flex items-center justify-between p-4 border rounded-lg cursor-pointer transition-all duration-300 ${
                paymentMethod === "card"
                  ? "border-orange-500 bg-orange-50"
                  : "border-gray-300"
              }`}
            >
              <div className="flex items-center gap-3">
                <input
                  type="radio"
                  name="payment"
                  value="card"
                  checked={paymentMethod === "card"}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="accent-orange-500 w-5 h-5"
                />
                <span className="font-medium text-gray-700">Card Payment</span>
              </div>
              <span className="text-sm text-gray-500">
                Pay securely with your card
              </span>
            </label>
          </div>
        </div>
      </div>

      {/* Right side: order summary */}
      <div className="flex-1 bg-white rounded-2xl shadow-md p-6 space-y-6">
        <h2 className="text-2xl font-bold">Order Summary</h2>

        <ul className="divide-y divide-gray-200">
          {cartItems.map((item) => (
            <li
              key={item.id}
              className="flex justify-between py-3 text-gray-700"
            >
              <span>
                {item.name} × {item.quantity}
              </span>
              <span>LKR {(item.price * item.quantity).toFixed(2)}</span>
            </li>
          ))}
        </ul>

        <div className="space-y-2 text-gray-700 text-base border-t pt-6">
          <div className="flex justify-between">
            <span>Subtotal</span>
            <span>LKR {subtotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-green-600">
            <span>Promotion</span>
            <span>-LKR {promotion.toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span>Delivery Fee</span>
            <span>LKR {deliveryFee.toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span>Taxes</span>
            <span>LKR {taxes.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-lg font-bold border-t pt-4">
            <span>Total</span>
            <span>LKR {total.toFixed(2)}</span>
          </div>
        </div>

        <button
          onClick={handlePlaceOrder}
          disabled={submitting}
          className={`w-full mt-6 ${
            submitting ? "bg-orange-300" : "bg-orange-500 hover:bg-orange-400"
          } text-white py-4 rounded-xl font-bold text-lg transform hover:scale-105 transition-all duration-300`}
        >
          {submitting ? "Placing order…" : "Place Order"}
        </button>
      </div>
    </div>
  );
};

export default Order;