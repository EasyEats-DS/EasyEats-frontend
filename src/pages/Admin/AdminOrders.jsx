import React, { useState, useEffect } from 'react';
import { Search, Filter, Clock } from 'lucide-react';
import AdminLayout from '../../components/AdminLayout';
import FoodieCard from '../../components/FoodieCard';
import FoodieButton from '../../components/FoodieButton';
import FoodieInput from '../../components/FoodieInput';
import { fetchAllOrdersNoPagination, updateOrderStatus, deleteOrder } from '../../lib/api/orders';
import Swal from 'sweetalert2'
import { getUserFromToken } from '../../lib/auth';
import {restaurantService} from '../../lib/api/resturants';
import {userService} from '../../lib/api/users';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [userRestaurants, setUserRestaurants] = useState([]);
  const [userDetails, setUserDetails] = useState({});  // Store user details by userId

  useEffect(() => {
    const loadOrders = async () => {
      try {
        const fetched = await fetchAllOrdersNoPagination();
        const usersId = getUserFromToken();
        const restaurants = await restaurantService.getRestaurantsByOwnerId(usersId.id);
        setUserRestaurants(restaurants);
        
        // Filter orders to only show those from user's restaurants
        if (restaurants && restaurants.length > 0) {
          const restaurantIds = restaurants.map(restaurant => restaurant._id);
          const filteredOrders = fetched.filter(order => 
            order.restaurantId && restaurantIds.includes(order.restaurantId)
          );
          setOrders(filteredOrders);
          
          // Fetch user details for each order
          const userIds = [...new Set(filteredOrders.map(order => order.userId))];
          const usersData = {};
          
          // Fetch user details in parallel
          await Promise.all(
            userIds.map(async (userId) => {
              try {
                const userData = await userService.getUserById(userId);
                console.log(`User data for ${userId}:`, userData);
                usersData[userId] = userData;
              } catch (error) {
                console.error(`Failed to fetch user details for ID ${userId}:`, error);
                usersData[userId] = { firstName: 'Unknown', phoneNumber: 'N/A' };
              }
            })
          );
          
          setUserDetails(usersData);
        } else {
          setOrders([]);
        }
      } catch (err) {
        console.error(err);
        setError("Failed to fetch orders.");
      } finally {
        setLoading(false);
      }
    };
    loadOrders();
  }, []);

  const filteredOrders = orders
    .filter(order =>
      order._id.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .filter(order => statusFilter === 'all' || order.status === statusFilter);

  const handleOrderClick = (order) => {
    setSelectedOrder(order);
  };

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await updateOrderStatus(orderId, newStatus);
      setOrders(prev =>
        prev.map(o => o._id === orderId ? { ...o, status: newStatus } : o)
      );
      if (selectedOrder?._id === orderId) {
        setSelectedOrder(prev => ({ ...prev, status: newStatus }));
      }
      
      // Toast notification for success
      toast.success(`Order status updated to ${newStatus} successfully!`, {
        position: "top-right",
        autoClose: 3000,
      });
    } catch (err) {
      console.error("Failed to update order status:", err);
      
      // Toast notification for error
      toast.error(`Failed to update order status: ${err.response?.data?.message || "Please try again."}`, {
        position: "top-right",
        autoClose: 3000,
      });
    }
  };

  const handleDelete = async (orderId) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!"
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await deleteOrder(orderId);
          setOrders(prev => prev.filter(o => o._id !== orderId));
          setSelectedOrder(null);
          Swal.fire({
            title: "Deleted!",
            text: "Order has been deleted successfully.",
            icon: "success"
          });
        } catch (err) {
          console.error("Delete failed:", err);
          Swal.fire({
            title: "Error",
            text: "Failed to delete order. Please try again.",
            icon: "error"
          });
        }
      }
    });
  };

  const getStatusBadge = (status) => {
    const map = {
      pending:  ["Pending", "bg-yellow-100 text-yellow-800"],
      processing: ["Processing","bg-blue-100 text-blue-800"],
      shipped:   ["Shipped",   "bg-purple-100 text-purple-800"],
      delivered: ["Delivered","bg-green-100 text-green-800"],
      cancelled: ["Cancelled","bg-red-100 text-red-800"],
    };
    const [label, cls] = map[status] || [];
    return label
      ? <span className={`px-3 py-1 rounded-full text-xs font-medium ${cls}`}>{label}</span>
      : null;
  };

  // Helper function to get user details by ID
  const getUserInfo = (userId, field) => {
    if (!userDetails[userId]) return 'Loading...';
    
    // Handle nested user object in the API response
    const userData = userDetails[userId].user || userDetails[userId];
    return userData[field] || 'Unknown';
  };

  return (
    <AdminLayout title="Order Management">
      <div className="animate-fade-in">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Orders List */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6">
                <FoodieInput
                  placeholder="Search orders..."
                  icon={<Search className="w-5 h-5" />}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full sm:w-64"
                />
                <div className="relative min-w-[150px]">
                  <select
                    value={statusFilter}
                    onChange={e => setStatusFilter(e.target.value)}
                    className="w-full bg-foodie-gray-light rounded-lg px-4 py-3 appearance-none border border-foodie-gray focus:outline-none focus:border-foodie-orange"
                  >
                    <option value="all">All Orders</option>
                    <option value="pending">Pending</option>
                    <option value="processing">Processing</option>
                    <option value="shipped">Shipped</option>
                    <option value="delivered">Delivered</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                  <Filter className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-foodie-gray-dark pointer-events-none" />
                </div>
              </div>

              {loading ? (
                <div className="text-center py-12">
                  <p className="text-foodie-gray-dark">Loading orders...</p>
                </div>
              ) : error ? (
                <div className="text-center py-12">
                  <p className="text-red-500">{error}</p>
                </div>
              ) : filteredOrders.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-foodie-gray-dark">No orders found</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredOrders.map(order => (
                    <FoodieCard
                      key={order._id}
                      className={`cursor-pointer transition-all ${
                        selectedOrder?._id === order._id ? 'border-2 border-foodie-orange' : ''
                      }`}
                      onClick={() => handleOrderClick(order)}
                    >
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h3 className="font-bold">Order #{order._id.slice(0, 6)}…</h3>
                          <p className="text-foodie-gray-dark text-sm">
                            {getUserInfo(order.userId, 'firstName') || 'Customer'} • {getUserInfo(order.userId, 'phoneNumber')}
                          </p>
                          <p className="text-foodie-gray-dark text-xs">ID: {order.userId.slice(0, 8)}...</p>
                        </div>
                        {getStatusBadge(order.status)}
                      </div>
                      <div className="flex justify-between items-center border-t border-foodie-gray pt-3">
                        <div className="flex items-center text-sm text-foodie-gray-dark">
                          <Clock className="w-4 h-4 mr-1" />
                          <span>
                            {new Date(order.createdAt).toLocaleTimeString([], {
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </span>
                        </div>
                        <p className="font-bold">$ {order.totalAmount.toFixed(2)}</p>
                      </div>
                    </FoodieCard>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Selected Order Details */}
          <div>
            {selectedOrder ? (
              <FoodieCard interactive={false} className="sticky top-24 space-y-6">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="font-bold text-lg">Order #{selectedOrder._id.slice(0,6)}…</h3>
                  {getStatusBadge(selectedOrder.status)}
                </div>

                <div>
                  <h4 className="font-medium text-foodie-gray-dark mb-2">Order Info</h4>
                  <p>Customer: {getUserInfo(selectedOrder.userId, 'firstName')} {getUserInfo(selectedOrder.userId, 'lastName')}</p>
                  <p>User ID: {selectedOrder.userId}</p>
                  <p>Phone: {getUserInfo(selectedOrder.userId, 'phoneNumber')}</p>
                  <p>Email: {getUserInfo(selectedOrder.userId, 'email')}</p>
                  <p>Total Amount: $ {selectedOrder.totalAmount.toFixed(2)}</p>
                  <p>Created At: {new Date(selectedOrder.createdAt).toLocaleString()}</p>
                </div>

                <div>
                  <h4 className="font-medium text-foodie-gray-dark mb-2">Update Status</h4>
                  <select
                    value={selectedOrder.status}
                    onChange={e => handleStatusChange(selectedOrder._id, e.target.value)}
                    className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                  >
                    <option value="pending">Pending</option>
                    <option value="processing">Processing</option>
                    <option value="shipped">Shipped</option>
                    <option value="delivered">Delivered</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>

                {/* Delete button */}
                <div className="mt-3">
                  <FoodieButton variant="outline" className="w-full py-2 text-sm border-foodie-red text-foodie-red hover:bg-foodie-red/10 transition-colors duration-200"
                  onClick={() => handleDelete(selectedOrder._id)}
                >
                  Delete Order
                  </FoodieButton>
                </div>
              </FoodieCard>
            ) : (
              <FoodieCard className="flex flex-col items-center justify-center py-12">
                <div className="w-16 h-16 rounded-full bg-foodie-gray-light flex items-center justify-center mb-4">
                  <Clock className="w-8 h-8 text-foodie-gray-dark" />
                </div>
                <h3 className="text-lg font-medium mb-2">No order selected</h3>
                <p className="text-foodie-gray-dark text-center">
                  Select an order from the list to view details
                </p>
              </FoodieCard>
            )}
          </div>
        </div>
      </div>
      <ToastContainer />
    </AdminLayout>
  );
};

export default AdminOrders;