import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const Order = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const { cartItems = [], promotion = 0, note = "" } = location.state || {};

  const [deliveryAddress, setDeliveryAddress] = useState("SLIIT Campus, Malabe");
  const [dropNote, setDropNote] = useState("Near Perera and Sons in front of SLIIT");
  const [deliveryType, setDeliveryType] = useState("standard");
  const [paymentMethod, setPaymentMethod] = useState("cash");

  const deliveryFee = deliveryType === "priority" ? 129 : 99;
  const taxes = 62.07;
  const subtotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const total = subtotal - promotion + deliveryFee + taxes;

  const handlePlaceOrder = () => {
    const orderPayload = {
      userId: "user123", 
      products: cartItems.map(item => ({
        productId: item.id,
        quantity: item.quantity,
        price: item.price
      })),
      deliveryAddress,
      dropNote,
      deliveryType,
      paymentMethod,
      totalAmount: total,
      note
    };

    // Simulate POST
    console.log("Order Placed:", orderPayload);
    alert("Order placed successfully!");
  };

  return (
    <div className="max-w-6xl mx-auto px-6 py-10 flex flex-col md:flex-row gap-8">
      {/* Left: Delivery Info */}
      <div className="flex-1 space-y-6">
        <div className="bg-white rounded-xl shadow p-6">
          <h2 className="text-xl font-bold mb-4">Delivery Details</h2>
          <input
            value={deliveryAddress}
            onChange={e => setDeliveryAddress(e.target.value)}
            className="w-full p-3 border rounded mb-4"
          />
          <input
            value={dropNote}
            onChange={e => setDropNote(e.target.value)}
            className="w-full p-3 border rounded"
            placeholder="e.g. Meet outside"
          />
        </div>

        <div className="bg-white rounded-xl shadow p-6">
          <h2 className="text-xl font-bold mb-4">Delivery Options</h2>
          {[
            { label: "Priority", value: "priority", note: "10–25 min (+LKR 129)" },
            { label: "Standard", value: "standard", note: "15–30 min" },
            { label: "Schedule", value: "schedule", note: "Choose time" }
          ].map(opt => (
            <label
              key={opt.value}
              className={`block p-3 rounded-lg border mt-2 cursor-pointer ${
                deliveryType === opt.value ? "border-black" : "border-gray-300"
              }`}
            >
              <input
                type="radio"
                name="delivery"
                value={opt.value}
                checked={deliveryType === opt.value}
                onChange={e => setDeliveryType(e.target.value)}
                className="mr-2"
              />
              {opt.label} <span className="text-gray-500 ml-1">{opt.note}</span>
            </label>
          ))}
        </div>

        <div className="bg-white rounded-xl shadow p-6">
          <h2 className="text-xl font-bold mb-4">Payment Method</h2>
          <select
            value={paymentMethod}
            onChange={e => setPaymentMethod(e.target.value)}
            className="w-full p-3 border rounded"
          >
            <option value="cash">Cash on Delivery</option>
            <option value="card">Card Payment</option>
          </select>
        </div>
      </div>

      {/* Right: Summary */}
      <div className="flex-1 bg-white rounded-xl shadow p-6 space-y-4">
        <h2 className="text-xl font-bold">Order Summary</h2>
        <ul className="divide-y divide-gray-200">
          {cartItems.map(item => (
            <li key={item.id} className="flex justify-between py-2">
              <span>{item.name} × {item.quantity}</span>
              <span>LKR {(item.price * item.quantity).toFixed(2)}</span>
            </li>
          ))}
        </ul>

        <div className="pt-4 border-t space-y-2 text-sm">
          <div className="flex justify-between">
            <span>Subtotal</span><span>LKR {subtotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-green-600">
            <span>Promotion</span><span>-LKR {promotion.toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span>Delivery Fee</span><span>LKR {deliveryFee.toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span>Taxes</span><span>LKR {taxes.toFixed(2)}</span>
          </div>
          <div className="flex justify-between font-bold border-t pt-4 text-base">
            <span>Total</span><span>LKR {total.toFixed(2)}</span>
          </div>
        </div>

        <button
          onClick={handlePlaceOrder}
          className="w-full mt-6 bg-black text-white py-4 rounded-lg font-semibold text-lg hover:bg-gray-800"
        >
          Place Order
        </button>
      </div>
    </div>
  );
};

export default Order;
