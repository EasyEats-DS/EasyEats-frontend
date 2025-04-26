import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { TrendingUp, Users, ShoppingBag, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import AdminLayout from '../../components/AdminLayout';
import FoodieCard from '../../components/FoodieCard';

const orderData = [
  { name: 'Mon', orders: 4 },
  { name: 'Tue', orders: 6 },
  { name: 'Wed', orders: 8 },
  { name: 'Thu', orders: 7 },
  { name: 'Fri', orders: 12 },
  { name: 'Sat', orders: 15 },
  { name: 'Sun', orders: 10 },
];

const revenueData = [
  { name: 'Mon', revenue: 120 },
  { name: 'Tue', revenue: 180 },
  { name: 'Wed', revenue: 240 },
  { name: 'Thu', revenue: 210 },
  { name: 'Fri', revenue: 360 },
  { name: 'Sat', revenue: 450 },
  { name: 'Sun', revenue: 300 },
];

const recentOrders = [
  { 
    id: '#ORD-5312', 
    customer: 'John Doe', 
    items: ['Classic Cheeseburger', 'French Fries', 'Soft Drink'],
    status: 'Completed', 
    total: 18.47,
    date: '25 Apr, 2:30 PM' 
  },
  { 
    id: '#ORD-5311', 
    customer: 'Alice Smith', 
    items: ['Veggie Burger', 'Onion Rings', 'Milkshake'],
    status: 'Preparing', 
    total: 22.95,
    date: '25 Apr, 2:15 PM' 
  },
  { 
    id: '#ORD-5310', 
    customer: 'Robert Brown', 
    items: ['Bacon Deluxe', 'French Fries'],
    status: 'Delivering', 
    total: 14.98,
    date: '25 Apr, 1:45 PM' 
  },
  { 
    id: '#ORD-5309', 
    customer: 'Emily Johnson', 
    items: ['Mushroom Swiss', 'Soft Drink'],
    status: 'Completed', 
    total: 14.48,
    date: '25 Apr, 1:20 PM' 
  },
];

const AdminDashboard = () => {
  return (
    <AdminLayout title="Dashboard">
      <div className="space-y-6 animate-[fadeIn_0.3s_ease-out]">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <FoodieCard className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-all duration-300">
            <div className="flex justify-between">
              <div>
                <p className="text-gray-500 text-sm">Today's Orders</p>
                <h3 className="text-2xl font-bold mt-1">24</h3>
                <div className="mt-2 flex items-center text-green-500">
                  <ArrowUpRight className="w-4 h-4 mr-1" />
                  <span className="text-xs font-medium">+12.5% from yesterday</span>
                </div>
              </div>
              <div className="p-3 bg-[#FF7A00]/10 rounded-full h-fit">
                <ShoppingBag className="w-6 h-6 text-[#FF7A00]" />
              </div>
            </div>
          </FoodieCard>
          
          <FoodieCard className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-all duration-300">
            <div className="flex justify-between">
              <div>
                <p className="text-gray-500 text-sm">Today's Revenue</p>
                <h3 className="text-2xl font-bold mt-1">$482.56</h3>
                <div className="mt-2 flex items-center text-green-500">
                  <ArrowUpRight className="w-4 h-4 mr-1" />
                  <span className="text-xs font-medium">+8.2% from yesterday</span>
                </div>
              </div>
              <div className="p-3 bg-[#4CD964]/10 rounded-full h-fit">
                <TrendingUp className="w-6 h-6 text-[#4CD964]" />
              </div>
            </div>
          </FoodieCard>
          
          <FoodieCard className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-all duration-300">
            <div className="flex justify-between">
              <div>
                <p className="text-gray-500 text-sm">Total Customers</p>
                <h3 className="text-2xl font-bold mt-1">512</h3>
                <div className="mt-2 flex items-center text-green-500">
                  <ArrowUpRight className="w-4 h-4 mr-1" />
                  <span className="text-xs font-medium">+4.3% this week</span>
                </div>
              </div>
              <div className="p-3 bg-[#4CD964]/10 rounded-full h-fit">
                <Users className="w-6 h-6 text-[#4CD964]" />
              </div>
            </div>
          </FoodieCard>
          
          <FoodieCard className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-all duration-300">
            <div className="flex justify-between">
              <div>
                <p className="text-gray-500 text-sm">Average Order</p>
                <h3 className="text-2xl font-bold mt-1">$20.12</h3>
                <div className="mt-2 flex items-center text-red-500">
                  <ArrowDownRight className="w-4 h-4 mr-1" />
                  <span className="text-xs font-medium">-2.1% this week</span>
                </div>
              </div>
              <div className="p-3 bg-[#FF7A00]/10 rounded-full h-fit">
                <ShoppingBag className="w-6 h-6 text-[#FF7A00]" />
              </div>
            </div>
          </FoodieCard>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <FoodieCard interactive={false} className="p-6">
            <h3 className="text-lg font-bold mb-4">Orders Overview</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={orderData}
                  margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                >
                  <defs>
                    <linearGradient id="colorOrders" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#FF7A00" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#FF7A00" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip 
                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} 
                    formatter={(value) => [`${value} orders`, 'Orders']}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="orders" 
                    stroke="#FF7A00" 
                    fillOpacity={1} 
                    fill="url(#colorOrders)" 
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </FoodieCard>
          
          <FoodieCard interactive={false} className="p-6">
            <h3 className="text-lg font-bold mb-4">Revenue Overview</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={revenueData}
                  margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                >
                  <defs>
                    <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#4CD964" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#4CD964" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip 
                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} 
                    formatter={(value) => [`$${value}`, 'Revenue']}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="revenue" 
                    stroke="#4CD964" 
                    fillOpacity={1} 
                    fill="url(#colorRevenue)" 
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </FoodieCard>
        </div>
        
        <FoodieCard interactive={false} className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-bold">Recent Orders</h3>
            <button className="text-foodie-orange text-sm font-medium hover:underline">
              View All
            </button>
          </div>
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
                {recentOrders.map((order) => (
                  <tr key={order.id} className="border-b border-foodie-gray hover:bg-foodie-gray-light cursor-pointer">
                    <td className="py-4 font-medium">{order.id}</td>
                    <td className="py-4">{order.customer}</td>
                    <td className="py-4">
                      <div className="flex flex-col">
                        {order.items.map((item, idx) => (
                          <span key={idx} className="text-sm text-foodie-gray-dark">{item}</span>
                        ))}
                      </div>
                    </td>
                    <td className="py-4">
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        order.status === 'Completed' ? 'bg-green-100 text-green-800' :
                        order.status === 'Preparing' ? 'bg-blue-100 text-blue-800' :
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="py-4 font-medium">${order.total.toFixed(2)}</td>
                    <td className="py-4 text-foodie-gray-dark">{order.date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </FoodieCard>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;
