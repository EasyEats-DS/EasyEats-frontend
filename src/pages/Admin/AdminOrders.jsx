
import React, { useState } from 'react';
import { Search, Filter, ChevronDown, Clock, CheckCircle, XCircle, MapPin } from 'lucide-react';
import AdminLayout from '../../components/AdminLayout';
import FoodieCard from '../../components/FoodieCard';
import FoodieButton from '../../components/FoodieButton';
import FoodieInput from '../../components/FoodieInput';

// Sample orders data
const ordersData = [
  {
    id: 'ORD-5312',
    customer: {
      name: 'John Doe',
      address: '123 Main St, Apt 4B, New York, NY 10001',
      phone: '(123) 456-7890',
    },
    items: [
      { name: 'Classic Cheeseburger', quantity: 1, price: 8.99 },
      { name: 'French Fries', quantity: 1, price: 3.99 },
      { name: 'Soft Drink', quantity: 1, price: 2.49 },
    ],
    subtotal: 15.47,
    tax: 1.35,
    deliveryFee: 1.99,
    total: 18.81,
    paymentMethod: 'Credit Card',
    status: 'preparing',
    createdAt: '2023-04-25T14:30:00Z',
    estimatedDelivery: '2023-04-25T15:10:00Z',
  },
  {
    id: 'ORD-5311',
    customer: {
      name: 'Alice Smith',
      address: '456 Park Ave, New York, NY 10022',
      phone: '(234) 567-8901',
    },
    items: [
      { name: 'Veggie Burger', quantity: 1, price: 9.99 },
      { name: 'Onion Rings', quantity: 1, price: 4.99 },
      { name: 'Milkshake', quantity: 1, price: 4.99 },
    ],
    subtotal: 19.97,
    tax: 1.74,
    deliveryFee: 1.99,
    total: 23.70,
    paymentMethod: 'PayPal',
    status: 'new',
    createdAt: '2023-04-25T14:15:00Z',
    estimatedDelivery: '2023-04-25T15:00:00Z',
  },
  {
    id: 'ORD-5310',
    customer: {
      name: 'Robert Brown',
      address: '789 Broadway, New York, NY 10003',
      phone: '(345) 678-9012',
    },
    items: [
      { name: 'Bacon Deluxe', quantity: 1, price: 10.99 },
      { name: 'French Fries', quantity: 1, price: 3.99 },
    ],
    subtotal: 14.98,
    tax: 1.30,
    deliveryFee: 1.99,
    total: 18.27,
    paymentMethod: 'Cash',
    status: 'delivering',
    createdAt: '2023-04-25T13:45:00Z',
    estimatedDelivery: '2023-04-25T14:30:00Z',
  },
  {
    id: 'ORD-5309',
    customer: {
      name: 'Emily Johnson',
      address: '321 Pine St, San Francisco, CA 94111',
      phone: '(456) 789-0123',
    },
    items: [
      { name: 'Mushroom Swiss', quantity: 1, price: 11.99 },
      { name: 'Soft Drink', quantity: 1, price: 2.49 },
    ],
    subtotal: 14.48,
    tax: 1.26,
    deliveryFee: 1.99,
    total: 17.73,
    paymentMethod: 'Credit Card',
    status: 'completed',
    createdAt: '2023-04-25T13:20:00Z',
    estimatedDelivery: '2023-04-25T14:00:00Z',
  },
  {
    id: 'ORD-5308',
    customer: {
      name: 'Michael Wilson',
      address: '654 Oak Ave, Chicago, IL 60601',
      phone: '(567) 890-1234',
    },
    items: [
      { name: 'Double Cheeseburger', quantity: 1, price: 12.99 },
      { name: 'Onion Rings', quantity: 1, price: 4.99 },
      { name: 'Milkshake', quantity: 1, price: 4.99 },
    ],
    subtotal: 22.97,
    tax: 2.00,
    deliveryFee: 1.99,
    total: 26.96,
    paymentMethod: 'Credit Card',
    status: 'completed',
    createdAt: '2023-04-25T12:50:00Z',
    estimatedDelivery: '2023-04-25T13:30:00Z',
  },
];

const AdminOrders = () => {
  const [orders, setOrders] = useState(ordersData);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedOrder, setSelectedOrder] = useState(null);
  
  const filteredOrders = orders
    .filter((order) => 
      order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.customer.name.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .filter((order) => statusFilter === 'all' || order.status === statusFilter);
  
  const handleOrderClick = (order) => {
    setSelectedOrder(order);
  };
  
  const handleStatusChange = (orderId, newStatus) => {
    setOrders((prev) =>
      prev.map((order) =>
        order.id === orderId ? { ...order, status: newStatus } : order
      )
    );
    
    if (selectedOrder && selectedOrder.id === orderId) {
      setSelectedOrder({
        ...selectedOrder,
        status: newStatus,
      });
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'new':
        return (
          <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
            New
          </span>
        );
      case 'preparing':
        return (
          <span className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs font-medium">
            Preparing
          </span>
        );
      case 'delivering':
        return (
          <span className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-xs font-medium">
            Delivering
          </span>
        );
      case 'completed':
        return (
          <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">
            Completed
          </span>
        );
      case 'cancelled':
        return (
          <span className="px-3 py-1 bg-red-100 text-red-800 rounded-full text-xs font-medium">
            Cancelled
          </span>
        );
      default:
        return null;
    }
  };
  
  const getStatusActions = (order) => {
    switch (order.status) {
      case 'new':
        return (
          <div className="flex gap-2 mt-4">
            <FoodieButton
              onClick={() => handleStatusChange(order.id, 'preparing')}
              className="flex-1"
            >
              Accept Order
            </FoodieButton>
            <FoodieButton
              variant="outline"
              onClick={() => handleStatusChange(order.id, 'cancelled')}
              className="flex-1 border-foodie-red text-foodie-red hover:bg-foodie-red/5"
            >
              Decline
            </FoodieButton>
          </div>
        );
      case 'preparing':
        return (
          <FoodieButton
            onClick={() => handleStatusChange(order.id, 'delivering')}
            className="w-full mt-4"
          >
            Mark Ready for Delivery
          </FoodieButton>
        );
      case 'delivering':
        return (
          <FoodieButton
            onClick={() => handleStatusChange(order.id, 'completed')}
            className="w-full mt-4"
          >
            Confirm Delivery
          </FoodieButton>
        );
      default:
        return null;
    }
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
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="w-full bg-foodie-gray-light rounded-lg px-4 py-3 appearance-none border border-foodie-gray focus:outline-none focus:border-foodie-orange"
                  >
                    <option value="all">All Orders</option>
                    <option value="new">New</option>
                    <option value="preparing">Preparing</option>
                    <option value="delivering">Delivering</option>
                    <option value="completed">Completed</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                  <Filter className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-foodie-gray-dark pointer-events-none" />
                </div>
              </div>
              
              {filteredOrders.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-foodie-gray-dark">No orders found</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredOrders.map((order) => (
                    <FoodieCard
                      key={order.id}
                      className={`cursor-pointer transition-all ${
                        selectedOrder && selectedOrder.id === order.id
                          ? 'border-2 border-foodie-orange'
                          : ''
                      }`}
                      onClick={() => handleOrderClick(order)}
                    >
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h3 className="font-bold">Order #{order.id}</h3>
                          <p className="text-foodie-gray-dark text-sm">{order.customer.name}</p>
                        </div>
                        {getStatusBadge(order.status)}
                      </div>
                      
                      <div className="space-y-1 mb-3">
                        {order.items.slice(0, 2).map((item, index) => (
                          <div key={index} className="flex justify-between text-sm">
                            <span>{item.quantity}x {item.name}</span>
                            <span>${item.price.toFixed(2)}</span>
                          </div>
                        ))}
                        {order.items.length > 2 && (
                          <div className="text-sm text-foodie-gray-dark">
                            +{order.items.length - 2} more items
                          </div>
                        )}
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
                        <p className="font-bold">${order.total.toFixed(2)}</p>
                      </div>
                    </FoodieCard>
                  ))}
                </div>
              )}
            </div>
          </div>
          
          {/* Order Details */}
          <div>
            {selectedOrder ? (
              <FoodieCard interactive={false} className="sticky top-24">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="font-bold text-lg">Order #{selectedOrder.id}</h3>
                  {getStatusBadge(selectedOrder.status)}
                </div>
                
                <div className="space-y-6">
                  <div>
                    <h4 className="font-medium text-foodie-gray-dark mb-2">Customer</h4>
                    <p className="font-medium">{selectedOrder.customer.name}</p>
                    <p className="text-sm">{selectedOrder.customer.phone}</p>
                  </div>
                  
                  <div>
                    <h4 className="font-medium text-foodie-gray-dark mb-2">Delivery Address</h4>
                    <div className="flex items-start">
                      <MapPin className="w-5 h-5 mr-2 text-foodie-orange flex-shrink-0 mt-0.5" />
                      <p className="text-sm">{selectedOrder.customer.address}</p>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-medium text-foodie-gray-dark mb-2">Order Details</h4>
                    <div className="space-y-2 mb-4">
                      {selectedOrder.items.map((item, index) => (
                        <div key={index} className="flex justify-between">
                          <span>{item.quantity}x {item.name}</span>
                          <span>${(item.quantity * item.price).toFixed(2)}</span>
                        </div>
                      ))}
                    </div>
                    
                    <div className="border-t border-foodie-gray pt-3 space-y-2">
                      <div className="flex justify-between text-foodie-gray-dark">
                        <span>Subtotal</span>
                        <span>${selectedOrder.subtotal.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between text-foodie-gray-dark">
                        <span>Tax</span>
                        <span>${selectedOrder.tax.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between text-foodie-gray-dark">
                        <span>Delivery Fee</span>
                        <span>${selectedOrder.deliveryFee.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between font-bold text-lg pt-2 border-t border-foodie-gray">
                        <span>Total</span>
                        <span>${selectedOrder.total.toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-medium text-foodie-gray-dark mb-2">Payment</h4>
                    <p>{selectedOrder.paymentMethod}</p>
                  </div>
                  
                  <div className="flex items-center justify-between border-t border-foodie-gray pt-3">
                    <div>
                      <p className="text-sm text-foodie-gray-dark">Order Time</p>
                      <p>
                        {new Date(selectedOrder.createdAt).toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-foodie-gray-dark">Est. Delivery</p>
                      <p>
                        {new Date(selectedOrder.estimatedDelivery).toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </p>
                    </div>
                  </div>
                  
                  {getStatusActions(selectedOrder)}
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