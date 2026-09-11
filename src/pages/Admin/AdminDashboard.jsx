import React, { useMemo, useState, useEffect } from "react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { TrendingUp, Users, ShoppingBag, ArrowUpRight, ArrowDownRight, Bell } from "lucide-react";
import { useNavigate } from "react-router-dom";
import AdminLayout from "../../components/AdminLayout";
import FoodieCard from "../../components/FoodieCard";
import { toast } from "react-toastify";
import { computeStats, computeWeeklySeries } from "../../lib/dashboardStats";
import { useOwnerOrders, customerName } from "../../lib/useOwnerOrders";
import { updateOrderStatus } from "../../lib/api/orders";
import { sendDeliveryUpdate } from "../../lib/api/notifications";

const currency = (value) => `$${Number(value || 0).toFixed(2)}`;

const STATUS_STYLES = {
  pending: "bg-yellow-100 text-yellow-700",
  processing: "bg-blue-100 text-blue-700",
  shipped: "bg-purple-100 text-purple-700",
  delivered: "bg-green-100 text-green-700",
  cancelled: "bg-red-100 text-red-700",
};

const formatDate = (value) => {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "-";
  return date.toLocaleString(undefined, {
    day: "numeric",
    month: "short",
    hour: "numeric",
    minute: "2-digit",
  });
};

/** Renders a real percentage change, or a note when there is no baseline. */
const Delta = ({ value, label }) => {
  if (value === null || value === undefined) {
    return <span className="text-xs font-medium text-gray-400">No {label} data to compare</span>;
  }
  const positive = value >= 0;
  const Icon = positive ? ArrowUpRight : ArrowDownRight;
  return (
    <div className={`mt-2 flex items-center ${positive ? "text-green-500" : "text-red-500"}`}>
      <Icon className="w-4 h-4 mr-1" />
      <span className="text-xs font-medium">
        {positive ? "+" : ""}
        {value}% from {label}
      </span>
    </div>
  );
};

const StatCard = ({ label, value, children, icon, iconBg }) => (
  <FoodieCard className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-all duration-300">
    <div className="flex justify-between">
      <div>
        <p className="text-gray-500 text-sm">{label}</p>
        <h3 className="text-2xl font-bold mt-1">{value}</h3>
        {children}
      </div>
      <div className={`p-3 ${iconBg} rounded-full h-fit`}>
        {icon}
      </div>
    </div>
  </FoodieCard>
);

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { orders, customers, loading, error } = useOwnerOrders();
  const [localOrders, setLocalOrders] = useState([]);
  const [notifying, setNotifying] = useState(null);

  useEffect(() => setLocalOrders(orders), [orders]);

  const stats = useMemo(() => computeStats(localOrders), [localOrders]);
  const weekly = useMemo(() => computeWeeklySeries(localOrders), [localOrders]);

  const recentOrders = useMemo(
    () =>
      [...localOrders]
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .slice(0, 5),
    [localOrders]
  );

  const handleNotifyCustomer = async (order) => {
    const customer = customers[order.userId] || {};
    setNotifying(order._id);
    try {
      await sendDeliveryUpdate({
        orderId: order._id,
        userId: order.userId,
        customerEmail: customer.email,
        customerPhone: customer.phoneNumber,
        status: "OUT_FOR_DELIVERY",
        estimatedArrival: "15 minutes",
      });
      await updateOrderStatus(order._id, "shipped");
      setLocalOrders((prev) =>
        prev.map((o) => (o._id === order._id ? { ...o, status: "shipped" } : o))
      );
      toast.success("Customer notified about order " + String(order._id).slice(-6));
    } catch (err) {
      console.error("Failed to send notification:", err);
      toast.error("Failed to send notification");
    } finally {
      setNotifying(null);
    }
  };

  if (loading) {
    return (
      <AdminLayout title="Dashboard">
        <p className="text-gray-500">Loading your dashboard...</p>
      </AdminLayout>
    );
  }

  if (error) {
    return (
      <AdminLayout title="Dashboard">
        <div className="bg-red-50 text-red-700 p-4 rounded-lg">{error}</div>
      </AdminLayout>
    );
  }

  const hasOrders = localOrders.length > 0;

  return (
    <AdminLayout title="Dashboard">
      <div className="space-y-6 animate-[fadeIn_0.3s_ease-out]">
        {!hasOrders && (
          <div className="bg-[#FF7A00]/10 text-[#8a4400] p-4 rounded-lg text-sm">
            No orders yet. The figures below stay at zero until your first order comes in.
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            label="Today's Orders"
            value={stats.todayOrders}
            icon={<ShoppingBag className="w-6 h-6 text-[#FF7A00]" />}
            iconBg="bg-[#FF7A00]/10"
          >
            <Delta value={stats.ordersDelta} label="yesterday" />
          </StatCard>

          <StatCard
            label="Today's Revenue"
            value={currency(stats.todayRevenue)}
            icon={<TrendingUp className="w-6 h-6 text-[#4CD964]" />}
            iconBg="bg-[#4CD964]/10"
          >
            <Delta value={stats.revenueDelta} label="yesterday" />
          </StatCard>

          <StatCard
            label="Total Customers"
            value={stats.totalCustomers}
            icon={<Users className="w-6 h-6 text-[#4CD964]" />}
            iconBg="bg-[#4CD964]/10"
          >
            <span className="text-xs font-medium text-gray-400">Unique customers all time</span>
          </StatCard>

          <StatCard
            label="Average Order"
            value={currency(stats.averageOrder)}
            icon={<ShoppingBag className="w-6 h-6 text-[#FF7A00]" />}
            iconBg="bg-[#FF7A00]/10"
          >
            <span className="text-xs font-medium text-gray-400">Across all orders</span>
          </StatCard>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <FoodieCard interactive={false} className="p-6">
            <h3 className="text-lg font-bold mb-4">Orders Overview</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={weekly} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorOrders" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#FF7A00" stopOpacity={0.8} />
                      <stop offset="95%" stopColor="#FF7A00" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="name" />
                  <YAxis allowDecimals={false} />
                  <Tooltip
                    contentStyle={{ borderRadius: "8px", border: "none", boxShadow: "0 4px 12px rgba(0,0,0,0.1)" }}
                    formatter={(value) => [`${value} orders`, "Orders"]}
                  />
                  <Area type="monotone" dataKey="orders" stroke="#FF7A00" fillOpacity={1} fill="url(#colorOrders)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </FoodieCard>

          <FoodieCard interactive={false} className="p-6">
            <h3 className="text-lg font-bold mb-4">Revenue Overview</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={weekly} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#4CD964" stopOpacity={0.8} />
                      <stop offset="95%" stopColor="#4CD964" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip
                    contentStyle={{ borderRadius: "8px", border: "none", boxShadow: "0 4px 12px rgba(0,0,0,0.1)" }}
                    formatter={(value) => [currency(value), "Revenue"]}
                  />
                  <Area type="monotone" dataKey="revenue" stroke="#4CD964" fillOpacity={1} fill="url(#colorRevenue)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </FoodieCard>
        </div>

        <FoodieCard interactive={false} className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-bold">Recent Orders</h3>
            <button
              onClick={() => navigate("/admin/orders")}
              className="text-foodie-orange text-sm font-medium hover:underline"
            >
              View All
            </button>
          </div>

          {recentOrders.length === 0 ? (
            <p className="text-gray-500 text-sm py-6 text-center">
              No orders yet - once customers start ordering they will appear here.
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="text-left border-b border-foodie-gray">
                    <th className="pb-3 font-medium text-foodie-gray-dark">Order ID</th>
                    <th className="pb-3 font-medium text-foodie-gray-dark">Customer</th>
                    <th className="pb-3 font-medium text-foodie-gray-dark">Items</th>
                    <th className="pb-3 font-medium text-foodie-gray-dark">Status</th>
                    <th className="pb-3 font-medium text-foodie-gray-dark">Total</th>
                    <th className="pb-3 font-medium text-foodie-gray-dark">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {recentOrders.map((order) => {
                    const itemCount = (order.products || []).length;
                    return (
                      <tr key={order._id} className="border-b border-foodie-gray hover:bg-foodie-gray-light">
                        <td className="py-4 font-medium">#{String(order._id).slice(-6).toUpperCase()}</td>
                        <td className="py-4">{customerName(customers, order.userId)}</td>
                        <td className="py-4 text-sm text-gray-600">
                          {itemCount} {itemCount === 1 ? "item" : "items"}
                        </td>
                        <td className="py-4">
                          <div className="flex items-center gap-2">
                            <span
                              className={`px-2 py-1 rounded-full text-xs ${
                                STATUS_STYLES[order.status] || "bg-gray-100 text-gray-700"
                              }`}
                            >
                              {order.status}
                            </span>
                            {["pending", "processing"].includes(order.status) && (
                              <button
                                onClick={() => handleNotifyCustomer(order)}
                                disabled={notifying === order._id}
                                className="flex items-center gap-1 bg-[#FF7A00] text-white text-xs px-2 py-1 rounded-full disabled:opacity-50"
                              >
                                <Bell className="w-3 h-3" />
                                {notifying === order._id ? "Sending..." : "Notify Customer"}
                              </button>
                            )}
                          </div>
                        </td>
                        <td className="py-4">{currency(order.totalAmount)}</td>
                        <td className="py-4 text-sm text-gray-600">{formatDate(order.createdAt)}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </FoodieCard>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;
