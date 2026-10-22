// src/pages/Order.jsx
import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { getUserFromToken } from "../lib/auth";
import { createOrder } from "../lib/api/orders";
import { sendOrderConfirmation } from "../lib/api/notifications";
import UserLayout from "../components/UserLayout";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Order = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const {
    cartItems = [],
    promotion: _promotion = 0,
    note = "",
    restaurantId,
  } = location.state || {};

  const [deliveryAddress] = useState(
    "SLIIT Campus, Malabe"
  );
  const [dropNote] = useState(
    "Near Perera and Sons in front of SLIIT"
  );
  const [deliveryType, setDeliveryType] = useState("standard");
  const [paymentMethod, setPaymentMethod] = useState("card");
  const [submitting, setSubmitting] = useState(false);

  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  // Calculate values dynamically based on percentages
  const promotionAmount = subtotal * 0.05; // 5% of subtotal
  const deliveryFeePercentage = 0.05; // 5% of subtotal
  const deliveryFeeBase = subtotal * deliveryFeePercentage;
  const deliveryFee =
    deliveryType === "priority" ? deliveryFeeBase * 1.3 : deliveryFeeBase; // 30% more for priority
  const taxes = subtotal * 0.02; // 2% of subtotal

  const total = subtotal - promotionAmount + deliveryFee + taxes;

  const handlePlaceOrder = async () => {
    setSubmitting(true);
    try {
      const user = getUserFromToken();
      const userId = user?.id || "test-user";

      const orderNumber = Math.floor(100 + Math.random() * 900);
      const orderId = `ORD-${orderNumber}`;

      const userEmail = user?.email || "dushanbolonghe@gmail.com";
      const userPhone = user?.phoneNumber || user?.phone || "+94701615834";

      // Create order payload with orderId
      const orderPayload = {
        orderId,
        userId,
        restaurantId: restaurantId || "test-restaurant",
        products:
          cartItems?.map((item) => ({
            productId: item.id || item._id || "test-product",
            quantity: item.quantity || 1,
            price: item.price || 0,
          })) || [],
        deliveryAddress: deliveryAddress || "SLIIT Campus, Malabe",
        dropNote: dropNote || "",
        deliveryType: deliveryType || "standard",
        paymentMethod,
        totalAmount: total || 0,
        note: note || "",
      };

      if (paymentMethod === "cash") {
        // Create order first
        await createOrder(orderPayload);

        // Send notification through both channels
        try {
          await sendOrderConfirmation({
            orderId: orderId, // Use the ORD-123 format directly
            userId,
            customerEmail: userEmail,
            customerPhone: userPhone,
            totalAmount: total,
            metadata: {
              email: userEmail,
              subject: "Order Confirmation - EasyEats",
              phone: userPhone,
            },
          });
        } catch (notifError) {
          console.error("Failed to send notification:", notifError);
          // Continue with order process even if notification fails
        }

        toast.success("Order placed successfully!", {
          position: "top-right",
          autoClose: 3000,
        });
        localStorage.removeItem("cartItems");
        localStorage.removeItem("cartRestaurantId");
        window.dispatchEvent(new Event("cartUpdated"));
        setTimeout(() => {
          navigate("/orderConfirmed", { state: { orderId } });
        }, 1000);
      } else {
        // Show toast notification for card payment
        toast.success("Proceeding to payment...", {
          position: "top-right",
          autoClose: 2000,
        });

        // For card payment, navigate to StripePaymentInterface with orderId
        navigate("/stripe-payment-interface", {
          state: {
            amount: total || 0,
            orderId,
            orderPayload: {
              ...orderPayload,
              paymentMethod: "card"
            },
            userEmail,
            userPhone,
          },
          replace: true,
        });
      }
    } catch (err) {
      console.error("Failed to place order:", err);
      alert("Unable to place order. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <UserLayout>
      <div className="max-w-7xl mx-auto px-6 py-10 flex flex-col md:flex-row gap-10">
        {/* Left side: delivery and payment options */}
        <div className="flex-1 space-y-8">
          <div className="bg-white rounded-2xl shadow-md p-6">
            <h2 className="text-2xl font-bold mb-6">Delivery Details</h2>
            <input
              value={deliveryAddress}
              readOnly
              className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 mb-4 bg-gray-100 cursor-not-allowed"
              placeholder="Enter delivery address"
            />
            <input
              value={dropNote}
              readOnly
              className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 bg-gray-100 cursor-not-allowed"
              placeholder="Drop-off note (optional)"
            />
          </div>

          <div className="bg-white rounded-2xl shadow-md p-6">
            <h2 className="text-2xl font-bold mb-6">Delivery Options</h2>
            {[
              {
                label: "Priority",
                value: "priority",
                note: `10–25 min (+USD ${deliveryFeeBase * 1.3})`,
              },
              {
                label: "Standard",
                value: "standard",
                note: `15–30 min (+USD ${deliveryFeeBase})`,
              },
            ].map((opt) => (
              <label
                key={opt.value}
                className={`flex items-center justify-between p-4 border rounded-lg cursor-pointer transition-all duration-300 mt-3 ${
                  deliveryType === opt.value
                    ? "border-orange-500 bg-orange-50"
                    : "border-gray-300"
                }`}
              >
                <div className="flex items-center gap-3">
                  <input
                    type="radio"
                    name="delivery"
                    value={opt.value}
                    checked={deliveryType === opt.value}
                    onChange={(e) => setDeliveryType(e.target.value)}
                    className="accent-orange-500"
                  />
                  <span className="font-medium text-gray-800">{opt.label}</span>
                </div>
                <span className="text-gray-500 text-sm">{opt.note}</span>
              </label>
            ))}
          </div>

          <div className="bg-white rounded-2xl shadow-md p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-800">
                Payment Method
              </h2>
              <span className="text-xs px-2.5 py-1 bg-emerald-100 text-emerald-800 font-semibold rounded-full flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                Stripe Sandbox Active
              </span>
            </div>
            
            <div className="space-y-4">
              <label
                className={`flex flex-col p-4 border rounded-xl cursor-pointer transition-all duration-300 ${
                  paymentMethod === "card"
                    ? "border-orange-500 bg-orange-50/80 shadow-sm"
                    : "border-gray-200 hover:border-gray-300"
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <input
                      type="radio"
                      name="payment"
                      value="card"
                      checked={paymentMethod === "card"}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="accent-orange-500 w-5 h-5 cursor-pointer"
                    />
                    <div>
                      <span className="font-semibold text-gray-800 flex items-center gap-2">
                        💳 Card Payment (Stripe)
                        <span className="text-[11px] bg-orange-100 text-orange-700 px-2 py-0.5 rounded font-medium">Recommended</span>
                      </span>
                      <p className="text-xs text-gray-500 mt-0.5">Pay securely with Stripe Payment Gateway</p>
                    </div>
                  </div>
                  <span className="text-xs font-mono font-medium text-gray-400">VISA / MC</span>
                </div>
                {paymentMethod === "card" && (
                  <div className="mt-3 pt-3 border-t border-orange-200/60 text-xs text-orange-950 flex flex-wrap items-center gap-2">
                    <span className="font-semibold text-orange-800">Sandbox Test Card:</span>
                    <code className="bg-white px-2 py-0.5 rounded border border-orange-300 font-mono text-orange-700 font-bold">4242 4242 4242 4242</code>
                    <span className="text-gray-500">Exp: Any future MM/YY • CVC: 123</span>
                  </div>
                )}
              </label>

              <label
                className={`flex items-center justify-between p-4 border rounded-xl cursor-pointer transition-all duration-300 ${
                  paymentMethod === "cash"
                    ? "border-orange-500 bg-orange-50/80 shadow-sm"
                    : "border-gray-200 hover:border-gray-300"
                }`}
              >
                <div className="flex items-center gap-3">
                  <input
                    type="radio"
                    name="payment"
                    value="cash"
                    checked={paymentMethod === "cash"}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="accent-orange-500 w-5 h-5 cursor-pointer"
                  />
                  <div>
                    <span className="font-semibold text-gray-800">
                      💵 Cash on Delivery
                    </span>
                    <p className="text-xs text-gray-500 mt-0.5">Pay in cash when your food arrives</p>
                  </div>
                </div>
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
                <span>USD {(item.price * item.quantity).toFixed(2)}</span>
              </li>
            ))}
          </ul>

          <div className="space-y-2 text-gray-700 text-base border-t pt-6">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>USD {subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-green-600">
              <span>Promotion</span>
              <span>-USD {promotionAmount.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>Delivery Fee</span>
              <span>USD {deliveryFee.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>Taxes</span>
              <span>USD {taxes.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-lg font-bold border-t pt-4">
              <span>Total</span>
              <span>USD {total.toFixed(2)}</span>
            </div>
          </div>

          <button
            onClick={handlePlaceOrder}
            disabled={submitting}
            className={`w-full mt-6 ${
              submitting ? "bg-orange-300" : "bg-orange-500 hover:bg-orange-600 active:bg-orange-700 cursor-pointer"
            } text-white py-4 rounded-xl font-bold text-lg shadow-md hover:shadow-lg transition-all duration-300 flex items-center justify-center gap-2`}
          >
            {submitting ? (
              <span>Placing order…</span>
            ) : paymentMethod === "card" ? (
              <span>Proceed to Stripe Payment • USD {total.toFixed(2)}</span>
            ) : (
              <span>Place Cash Order • USD {total.toFixed(2)}</span>
            )}
          </button>
        </div>
      </div>
      <ToastContainer />
    </UserLayout>
  );
};

export default Order;
