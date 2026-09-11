// src/pages/Order.jsx
import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { getCurrentUser, getUserFromToken } from "../lib/auth";
import { createOrder } from "../lib/api/orders";
import { sendOrderConfirmation } from "../lib/api/notifications";
import UserLayout from "../components/UserLayout";
import LocationPicker from "../components/LocationPicker";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Order = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const {
    cartItems = [],
    promotion = 0,
    note = "",
    restaurantId,
  } = location.state || {};

  // The address used to be a hardcoded read-only string, so every order was
  // delivered to wherever the customer's browser last reported being. It is now
  // whatever they pin on the map.
  const [dropoff, setDropoff] = useState({ coordinates: null, address: "" });
  const [dropNote, setDropNote] = useState("");
  const [deliveryType, setDeliveryType] = useState("standard");
  const [paymentMethod, setPaymentMethod] = useState("cash");
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
    const user = getUserFromToken();
    const userId = user?.id;

    // Refuse an order that cannot be fulfilled instead of sending placeholder
    // ids downstream. "test-restaurant" and "test-user" reached the gateway as
    // real values and came back as a confusing 404 several services later.
    const problem =
      (!userId && "Please sign in again before placing your order.") ||
      (!restaurantId && "This order is not linked to a restaurant. Please rebuild your cart.") ||
      (cartItems.length === 0 && "Your cart is empty.") ||
      (cartItems.some((item) => !item.id) && "One of your items is missing a product id.") ||
      (!dropoff.coordinates && "Please choose your delivery location on the map.") ||
      null;

    if (problem) {
      toast.error(problem, { position: "top-right", autoClose: 4000 });
      return;
    }

    setSubmitting(true);
    try {

      // Confirmations used to go to one hardcoded address and phone number, so
      // every customer's order details were sent to the same third party and
      // the actual customer was never told anything. They go to whoever placed
      // the order now.
      const account = getCurrentUser();
      const customerEmail = account?.email || user?.email || "";
      const customerPhone = account?.phoneNumber || account?.phone || "";

      const orderNumber = Math.floor(100 + Math.random() * 900);
      const orderId = `ORD-${orderNumber}`;

      // Create order payload with orderId
      const orderPayload = {
        orderId,
        userId,
        restaurantId,
        products:
          cartItems?.map((item) => ({
            productId: item.id,
            quantity: item.quantity || 1,
            price: item.price || 0,
          })) || [],
        deliveryAddress: [dropoff.address, dropNote].filter(Boolean).join(" — "),
        ...(dropoff.coordinates && {
          deliveryLocation: { type: "Point", coordinates: dropoff.coordinates },
        }),
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
            customerEmail,
            customerPhone,
            totalAmount: total,
            metadata: {
              email: customerEmail,
              subject: "Order Confirmation - EasyEats",
              phone: customerPhone,
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
        setTimeout(() => {
          navigate("/orderConfirmed");
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
            orderPayload,
            userEmail: customerEmail,
            userPhone: customerPhone,
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
      <div className="mx-auto flex max-w-7xl flex-col gap-8 py-4 sm:py-8 lg:flex-row lg:gap-10">
        {/* Left side: delivery and payment options */}
        <div className="flex-1 space-y-8">
          <div className="bg-white rounded-2xl shadow-md p-6">
            <h2 className="mb-6 text-xl font-bold sm:text-2xl">Delivery Details</h2>
            <LocationPicker
              value={dropoff}
              onChange={setDropoff}
              addressNote={dropNote}
              onAddressNoteChange={setDropNote}
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
                  <span className="font-medium text-gray-700">
                    Card Payment
                  </span>
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
              submitting ? "bg-orange-300" : "bg-orange-500 hover:bg-orange-400"
            } text-white py-4 rounded-xl font-bold text-lg transform hover:scale-105 transition-all duration-300`}
          >
            {submitting ? "Placing order…" : "Place Order"}
          </button>
        </div>
      </div>
      <ToastContainer />
    </UserLayout>
  );
};

export default Order;
