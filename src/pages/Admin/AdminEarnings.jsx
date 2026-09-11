import React, { useMemo } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { TrendingUp, Users, ShoppingBag, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import AdminLayout from '../../components/AdminLayout';
import FoodieCard from '../../components/FoodieCard';
import { computeStats, computeWeeklySeries } from '../../lib/dashboardStats';
import { useOwnerOrders } from '../../lib/useOwnerOrders';

const currency = (value) => `$${Number(value || 0).toFixed(2)}`;

/** Renders a real percentage change, or a note when there is no baseline. */
const Delta = ({ value, label }) => {
  if (value === null || value === undefined) {
    return <span className="text-xs font-medium text-gray-400">No {label} data to compare</span>;
  }
  const positive = value >= 0;
  const Icon = positive ? ArrowUpRight : ArrowDownRight;
  return (
    <div className={`mt-2 flex items-center ${positive ? 'text-green-500' : 'text-red-500'}`}>
      <Icon className="w-4 h-4 mr-1" />
      <span className="text-xs font-medium">
        {positive ? '+' : ''}
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

const AdminEarnings = () => {
  const { orders, loading, error } = useOwnerOrders();

  const stats = useMemo(() => computeStats(orders), [orders]);
  const weekly = useMemo(() => computeWeeklySeries(orders), [orders]);

  if (loading) {
    return (
      <AdminLayout title="Earnings">
        <p className="text-gray-500">Loading your earnings...</p>
      </AdminLayout>
    );
  }

  if (error) {
    return (
      <AdminLayout title="Earnings">
        <div className="bg-red-50 text-red-700 p-4 rounded-lg">{error}</div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title="Earnings">
      <div className="space-y-6 animate-[fadeIn_0.3s_ease-out]">
        {orders.length === 0 && (
          <div className="bg-[#FF7A00]/10 text-[#8a4400] p-4 rounded-lg text-sm">
            No orders yet. Your earnings stay at zero until your first order comes in.
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
                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                    formatter={(value) => [`${value} orders`, 'Orders']}
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
                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                    formatter={(value) => [currency(value), 'Revenue']}
                  />
                  <Area type="monotone" dataKey="revenue" stroke="#4CD964" fillOpacity={1} fill="url(#colorRevenue)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </FoodieCard>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminEarnings;
