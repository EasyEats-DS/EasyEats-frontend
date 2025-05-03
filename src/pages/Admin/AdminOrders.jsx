import React, { useState, useEffect } from 'react';
import { Search, Filter, Clock } from 'lucide-react';
import AdminLayout from '../../components/AdminLayout';
import FoodieCard from '../../components/FoodieCard';
import FoodieButton from '../../components/FoodieButton';
import FoodieInput from '../../components/FoodieInput';
import { fetchAllOrdersNoPagination, updateOrderStatus, deleteOrder } from '../../lib/api/orders';

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedOrder, setSelectedOrder] = useState(null);

  useEffect(() => {
    const loadOrders = async () => {
      try {
        const fetched = await fetchAllOrdersNoPagination();
        setOrders(fetched);
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
      alert("Order status updated successfully!");
    } catch (err) {
      console.error("Failed to update order status:", err);
      alert("Failed to update order status. Please try again.");
    }
  };

  const handleDelete = async (orderId) => {
    if (!window.confirm("Are you sure you want to delete this order?")) return;
    try {
      await deleteOrder(orderId);
      setOrders(prev => prev.filter(o => o._id !== orderId));
      setSelectedOrder(null);
      alert("Order deleted successfully!");
    } catch (err) {
      console.error("Delete failed:", err);
      alert("Failed to delete order. Please try again.");
    }
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
                          <p className="text-foodie-gray-dark text-sm">User: {order.userId}</p>
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
                  <p>User ID: {selectedOrder.userId}</p>
                  <p>Total Amount: LKR {selectedOrder.totalAmount.toFixed(2)}</p>
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
    </AdminLayout>
  );
};

export default AdminOrders;