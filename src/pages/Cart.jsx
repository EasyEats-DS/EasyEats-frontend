import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Cart = () => {
  const navigate = useNavigate();

  // load initial cart from localStorage
  const [cartItems, setCartItems] = useState(() =>
    JSON.parse(localStorage.getItem("cartItems") || "[]")
  );

  // load restaurantId that we stored when user first added to cart
  const [restaurantId] = useState(() =>
    localStorage.getItem("cartRestaurantId")
 );

  const [loading, setLoading] = useState(false);

  // persist whenever cartItems changes
  useEffect(() => {
    localStorage.setItem("cartItems", JSON.stringify(cartItems));
    if (cartItems.length === 0) {
      localStorage.removeItem("cartRestaurantId");
    }
  }, [cartItems]);

  const promotion = 15;
  const subtotal = cartItems.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );

  const handleCheckout = () => {
    setLoading(true);
    setTimeout(() => {
      navigate("/order", {
        state: {
          cartItems,
          promotion,
          restaurantId,
        },
      });
    }, 1000);
  };

  const increaseQty = (index) => {
    const updated = [...cartItems];
    updated[index].quantity += 1;
    setCartItems(updated);
  };

  const decreaseQty = (index) => {
    const updated = [...cartItems];
    if (updated[index].quantity > 1) {
      updated[index].quantity -= 1;
      setCartItems(updated);
    }
  };

  const removeItem = (index) => {
    const updated = [...cartItems];
    updated.splice(index, 1);
    setCartItems(updated);
  };

  return (
    <div className="px-4 py-6 space-y-6 h-[calc(100vh-60px)] overflow-y-auto">
      {/* Restaurant Info */}
      <div className="flex items-center mb-6">
        <h1 className="text-lg font-bold text-gray-900">Your Cart</h1>
      </div>

      {/* Cart Items */}
      <div className="bg-white shadow rounded-xl p-4 space-y-4">
        {cartItems.length > 0 ? (
          cartItems.map((item, index) => (
            <div
              key={`${item.id}-${index}`}
              className="flex justify-between items-center border-b pb-3 last:border-b-0 last:pb-0"
            >
              <div className="flex items-center gap-3">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-14 h-14 object-cover rounded-lg"
                />
                <div>
                  <h2 className="font-semibold text-gray-800 text-sm">
                    {item.name}
                  </h2>
                  <p className="text-gray-500 text-xs">
                    LKR {item.price.toFixed(2)}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => decreaseQty(index)}
                  className="w-6 h-6 flex items-center justify-center bg-gray-200 rounded hover:bg-gray-300 text-sm"
                >
                  −
                </button>
                <span className="text-center text-sm">{item.quantity}</span>
                <button
                  onClick={() => increaseQty(index)}
                  className="w-6 h-6 flex items-center justify-center bg-gray-200 rounded hover:bg-gray-300 text-sm"
                >
                  +
                </button>
                <button
                  onClick={() => removeItem(index)}
                  className="ml-2 text-red-500 text-xs hover:underline"
                >
                  Remove
                </button>
              </div>
            </div>
          ))
        ) : (
          <p className="text-gray-500 text-center text-sm">
            Your cart is empty.
          </p>
        )}
      </div>

      {/* Order Note */}
      <div className="mt-6">
        <textarea
          placeholder="Add an order note..."
          className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm"
          rows="3"
        />
      </div>

      {/* Subtotal */}
      <div className="flex justify-between items-center mt-6 text-base font-medium text-gray-800">
        <span>Subtotal</span>
        <span>LKR {subtotal.toFixed(2)}</span>
      </div>

      {/* Promotion Banner */}
      <div className="mt-4 p-3 bg-red-600 text-white text-center rounded-md text-xs font-semibold">
        You saved LKR {promotion.toFixed(2)} with promotions!
      </div>

      {/* Checkout Button */}
      <button
        onClick={handleCheckout}
        className={`w-full mt-1.5 ${
          loading ? "bg-orange-400" : "bg-orange-500"
        } text-white py-3 rounded-lg font-semibold text-base transform hover:scale-105 hover:shadow-lg transition-all duration-300`}
        disabled={cartItems.length === 0 || loading}
      >
        {loading ? "Processing..." : "Go to Checkout"}
      </button>
    </div>
  );
};

export default Cart;