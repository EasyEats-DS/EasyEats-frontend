import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import foodImage from "../assets/food_5.png";
import resturantImage from "../assets/resturant.jpeg";

const Cart = () => {
  const navigate = useNavigate();

  const [cartItems, setCartItems] = useState([
    {
      id: "food001",
      name: "Chicken Lasagna",
      price: 205.93,
      quantity: 1,
      image: foodImage,
    },
  ]);

  const promotion = 133.85;
  const subtotal = cartItems.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );

  const handleCheckout = () => {
    navigate("/order", {
      state: {
        cartItems,
        promotion,
      },
    });
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
    <div className="max-w-3xl mx-auto px-6 py-10">
      {/* Restaurant Info */}
      <div className="flex items-center mb-8">
        <img
          src={resturantImage}
          alt="Restaurant"
          className="w-16 h-16 rounded-full object-cover mr-4 border-2 border-gray-300"
        />
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Caravan Fresh</h1>
          <p className="text-gray-500 text-sm">
            No. 314B, Kaduwela Road, Koswatta
          </p>
        </div>
      </div>

      {/* Cart Items */}
      <div className="bg-white shadow rounded-2xl p-6 space-y-6">
        {cartItems.length > 0 ? (
          cartItems.map((item, index) => (
            <div
              key={item.id}
              className="flex justify-between items-center border-b pb-4 last:border-b-0 last:pb-0"
            >
              <div className="flex items-center gap-4">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-20 h-20 object-cover rounded-lg"
                />
                <div>
                  <h2 className="font-semibold text-gray-800">{item.name}</h2>
                  <p className="text-gray-500 text-sm">
                    LKR {item.price.toFixed(2)}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => decreaseQty(index)}
                  className="w-8 h-8 flex items-center justify-center bg-gray-200 rounded hover:bg-gray-300 text-xl"
                >
                  −
                </button>
                <span className="min-w-[20px] text-center">
                  {item.quantity}
                </span>
                <button
                  onClick={() => increaseQty(index)}
                  className="w-8 h-8 flex items-center justify-center bg-gray-200 rounded hover:bg-gray-300 text-xl"
                >
                  +
                </button>
                <button
                  onClick={() => removeItem(index)}
                  className="ml-4 text-red-500 text-xs hover:underline"
                >
                  Remove
                </button>
              </div>
            </div>
          ))
        ) : (
          <p className="text-gray-500 text-center">Your cart is empty.</p>
        )}
      </div>

      {/* Order Note */}
      <div className="mt-8">
        <textarea
          placeholder="Add an order note..."
          className="w-full p-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          rows="3"
        />
      </div>

      {/* Subtotal */}
      <div className="flex justify-between items-center mt-6 text-lg font-medium text-gray-800">
        <span>Subtotal</span>
        <span>LKR {subtotal.toFixed(2)}</span>
      </div>

      {/* Promotion Banner */}
      <div className="mt-4 p-4 bg-red-500 text-white text-center rounded-lg text-sm font-semibold">
        You saved LKR {promotion.toFixed(2)} with promotions!
      </div>

      {/* Checkout Button */}
      <button
        onClick={handleCheckout}
        className="w-full mt-8 bg-black text-white py-4 rounded-xl text-lg font-semibold transform hover:scale-105 hover:shadow-lg transition-all duration-300 hover:bg-gray-800"
        disabled={cartItems.length === 0}
      >
        Go to Checkout
      </button>
    </div>
  );
};

export default Cart;
