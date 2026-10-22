import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getUserFromToken } from '../lib/auth';
import { fetchOrdersByUserId } from '../lib/api/orders';
import UserLayout from '../components/UserLayout';
import { ShoppingBag, ArrowRight } from 'lucide-react';

function ViewOrders() {
  const navigate = useNavigate();
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
        const errorMessage = err.response?.data?.message || err.message || "";
        // If the error response is 404 or specifically says no orders found, treat as empty list
        if (
          err.response?.status === 404 ||
          errorMessage.toLowerCase().includes("no orders")
        ) {
          setOrders([]);
          setError(null);
        } else {
          setError(errorMessage || "Failed to load your orders.");
        }
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
          <div className="bg-red-50 border border-red-200 text-red-600 rounded-2xl p-6 text-center max-w-lg mx-auto">
            <p className="font-semibold mb-2">Error</p>
            <p className="text-sm">{error}</p>
          </div>
        ) : orders.length === 0 ? (
          <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-10 sm:p-12 text-center max-w-lg mx-auto flex flex-col items-center">
            <div className="w-20 h-20 bg-orange-50 rounded-full flex items-center justify-center mb-5 text-orange-500 shadow-inner">
              <ShoppingBag className="w-10 h-10" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">No Orders Found</h2>
            <p className="text-gray-500 mb-6 text-sm max-w-sm">
              You haven't placed any orders yet. Discover delicious dishes from our top restaurants and order your favorite meal!
            </p>
            <button
              onClick={() => navigate('/restaurant')}
              className="inline-flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white font-medium px-6 py-3 rounded-xl shadow-md hover:shadow-lg transition-all duration-200 transform hover:-translate-y-0.5"
            >
              <span>Explore Restaurants</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
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
