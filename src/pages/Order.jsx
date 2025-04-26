import React, { useState } from "react";
import { useLocation } from "react-router-dom";

const Order = () => {
  const location = useLocation();

  const { cartItems = [], promotion = 0, note = "" } = location.state || {};

  const [deliveryAddress, setDeliveryAddress] = useState(
    "SLIIT Campus, Malabe"
  );
  const [dropNote, setDropNote] = useState(
    "Near Perera and Sons in front of SLIIT"
  );
  const [deliveryType, setDeliveryType] = useState("standard");
  const [paymentMethod, setPaymentMethod] = useState("cash");

  const deliveryFee = deliveryType === "priority" ? 129 : 99;
  const taxes = 62.07;
  const subtotal = cartItems.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );
  const total = subtotal - promotion + deliveryFee + taxes;

  const handlePlaceOrder = () => {
    const orderPayload = {
      userId: "user123",
      products: cartItems.map((item) => ({
        productId: item.id,
        quantity: item.quantity,
        price: item.price,
      })),
      deliveryAddress,
      dropNote,
      deliveryType,
      paymentMethod,
      totalAmount: total,
      note,
    };

    console.log("Order Placed:", orderPayload);
    alert("Order placed successfully!");
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-10 flex flex-col md:flex-row gap-10">
      {/* Left: Delivery Info */}
      <div className="flex-1 space-y-8">
        <div className="bg-white rounded-2xl shadow-md p-6">
          <h2 className="text-2xl font-bold mb-6">Delivery Details</h2>
          <input
            value={deliveryAddress}
            onChange={(e) => setDeliveryAddress(e.target.value)}
            className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black mb-4"
            placeholder="Enter delivery address"
          />
          <input
            value={dropNote}
            onChange={(e) => setDropNote(e.target.value)}
            className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
            placeholder="Drop-off note (optional)"
          />
        </div>

        <div className="bg-white rounded-2xl shadow-md p-6">
          <h2 className="text-2xl font-bold mb-6">Delivery Options</h2>
          {[
            {
              label: "Priority",
              value: "priority",
              note: "10–25 min (+LKR 129)",
            },
            { label: "Standard", value: "standard", note: "15–30 min" },
            { label: "Schedule", value: "schedule", note: "Choose time" },
          ].map((opt) => (
            <label
              key={opt.value}
              className={`flex items-center justify-between p-4 rounded-lg border cursor-pointer mt-3 ${
                deliveryType === opt.value ? "border-black" : "border-gray-300"
              }`}
            >
              <div className="flex items-center gap-3">
                <input
                  type="radio"
                  name="delivery"
                  value={opt.value}
                  checked={deliveryType === opt.value}
                  onChange={(e) => setDeliveryType(e.target.value)}
                  className="accent-black"
                />
                <span className="font-medium text-gray-800">{opt.label}</span>
              </div>
              <span className="text-gray-500 text-sm">{opt.note}</span>
            </label>
          ))}
        </div>

        <div className="bg-white rounded-2xl shadow-md p-6">
  <h2 className="text-2xl font-bold mb-6 text-gray-800">Payment Method</h2>
  <div className="space-y-4">
    <label
      className={`flex items-center justify-between p-4 border rounded-lg cursor-pointer transition-all duration-300 ${
        paymentMethod === "cash" ? "border-black bg-gray-50" : "border-gray-300"
      }`}
    >
      <div className="flex items-center gap-3">
        <input
          type="radio"
          name="payment"
          value="cash"
          checked={paymentMethod === "cash"}
          onChange={(e) => setPaymentMethod(e.target.value)}
          className="accent-black w-5 h-5"
        />
        <span className="font-medium text-gray-700">Cash on Delivery</span>
      </div>
      <span className="text-sm text-gray-500">Pay in cash when food arrives</span>
    </label>

    <label
      className={`flex items-center justify-between p-4 border rounded-lg cursor-pointer transition-all duration-300 ${
        paymentMethod === "card" ? "border-black bg-gray-50" : "border-gray-300"
      }`}
    >
      <div className="flex items-center gap-3">
        <input
          type="radio"
          name="payment"
          value="card"
          checked={paymentMethod === "card"}
          onChange={(e) => setPaymentMethod(e.target.value)}
          className="accent-black w-5 h-5"
        />
        <span className="font-medium text-gray-700">Card Payment</span>
      </div>
      <span className="text-sm text-gray-500">Pay securely with your card</span>
    </label>
  </div>
</div>

      </div>

      {/* Right: Order Summary */}
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
          className="w-full mt-6 bg-black hover:bg-gray-900 text-white py-4 rounded-xl font-bold text-lg transform hover:scale-105 transition-all duration-300"
        >
          Place Order
        </button>
      </div>
    </div>
  );
};

export default Order;
