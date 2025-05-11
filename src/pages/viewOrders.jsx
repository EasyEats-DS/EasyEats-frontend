import React, { useState, useEffect } from 'react';
import { getUserFromToken } from '../lib/auth';
import { fetchOrdersByUserId } from '../lib/api/orders';
import UserLayout from '../components/UserLayout';

function ViewOrders() {
  const user = getUserFromToken();
  const userId = user?.id;

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadUserOrders = async () => {
      if (!userId) {
        setError("User not found. Please log in again.");
        setLoading(false);
        return;
      }

      try {
        const fetchedOrders = await fetchOrdersByUserId(userId);
        setOrders(fetchedOrders || []);
      } catch (err) {
        console.error("Failed to fetch user orders:", err);
        setError("Failed to load your orders.");
      } finally {
        setLoading(false);
      }
    };

    loadUserOrders();
  }, [userId]);

  return (
    <UserLayout>
      <div className="max-w-5xl mx-auto px-6 py-10">
        <h1 className="text-3xl font-extrabold mb-8 text-gray-800">My Orders</h1>

        {loading ? (
          <div className="flex justify-center items-center min-h-[200px]">
            <p className="text-gray-500 animate-pulse">Loading your orders...</p>
          </div>
        ) : error ? (
          <div className="text-center text-red-500 font-semibold">{error}</div>
        ) : orders.length === 0 ? (
          <div className="text-center text-gray-500">You have no orders yet.</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {orders.map((order) => (
              <div
                key={order._id}
                className="bg-white rounded-2xl shadow-md p-6 flex flex-col justify-between hover:shadow-lg transition-shadow duration-300"
              >
                <div className="mb-4">
                  <h2 className="text-xl font-semibold text-gray-800 mb-2">
                    Order #{order._id.slice(0, 8)}
                  </h2>
                  <p className="text-sm text-gray-500">
                    Status: <span className={`font-semibold capitalize ${
                      order.status === 'shipped' ? 'text-green-600' : 'text-orange-500'
                    }`}>{order.status}</span>
                  </p>
                  <p className="text-sm text-gray-500 mt-1">
                    Ordered on: {new Date(order.createdAt).toLocaleDateString()} at {new Date(order.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                  </p>
                  
                  {/* Ordered Items Section */}
                  <div className="mt-4 border-t border-gray-100 pt-3">
                    <h3 className="text-sm font-medium text-gray-700 mb-2">Items Ordered:</h3>
                    <div className="space-y-2">
                      {order.products && order.products.map((product, index) => (
                        <div key={product._id} className="flex justify-between text-sm bg-gray-50 p-3 rounded">
                          <div className="flex items-start">
                            <div className="h-5 w-5 rounded-full bg-orange-100 flex items-center justify-center text-xs text-orange-600 font-medium mr-2">
                              {product.quantity}
                            </div>
                            <div>
                              <p className="font-medium text-gray-800">Product {index + 1}</p>
                              <p className="text-xs text-gray-500">ID: {product.productId.slice(-6)}</p>
                            </div>
                          </div>
                          <p className="font-medium text-gray-700">
                            USD {(product.price * product.quantity).toFixed(2)}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="flex justify-between items-center border-t border-gray-200 pt-4">
                  <div>
                    <p className="text-xs text-gray-500">Payment Method</p>
                    <p className="text-sm font-medium text-gray-700 capitalize">{order.paymentMethod}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-gray-500">Total Payable Amount</p>
                    <p className="text-lg font-bold text-orange-500">USD {order.totalAmount.toFixed(2)}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </UserLayout>
  );
}

export default ViewOrders;
