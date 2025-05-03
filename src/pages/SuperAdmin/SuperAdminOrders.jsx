
import React, { useState } from 'react';
import { 
  Table, TableBody, TableCell, TableHead, 
  TableHeader, TableRow 
} from "../../components/ui/table";
// import { Button } from "..";
import { Search, FileText } from 'lucide-react';
import SuperAdminLayout from '../../components/SuperAdminLayout';
// import { useToast } from "@/hooks/use-toast";

const SuperAdminOrders = () => {
//   const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  // Mock data
  const orders = [
    { 
      id: "#ORD-5289",
      customer: "John Smith",
      restaurant: "Bella Italia",
      total: "$45.80",
      date: "2023-04-15 12:30",
      status: "Completed",
      items: 4
    },
    { 
      id: "#ORD-5290",
      customer: "Sarah Johnson",
      restaurant: "Sushi Express",
      total: "$32.50",
      date: "2023-04-15 13:45",
      status: "In Progress",
      items: 3
    },
    { 
      id: "#ORD-5291",
      customer: "Robert Davis",
      restaurant: "Burger Palace",
      total: "$24.99",
      date: "2023-04-15 14:20",
      status: "Completed",
      items: 2
    },
    { 
      id: "#ORD-5292",
      customer: "Lisa Chen",
      restaurant: "Green Garden",
      total: "$38.75",
      date: "2023-04-15 15:05",
      status: "Cancelled",
      items: 3
    },
    { 
      id: "#ORD-5293",
      customer: "Michael Brown",
      restaurant: "Taco Haven",
      total: "$19.99",
      date: "2023-04-15 16:30",
      status: "Completed",
      items: 2
    },
    { 
      id: "#ORD-5294",
      customer: "Emily Wilson",
      restaurant: "Pizza Planet",
      total: "$27.50",
      date: "2023-04-15 17:15",
      status: "In Progress",
      items: 1
    },
    { 
      id: "#ORD-5295",
      customer: "David Lee",
      restaurant: "Curry House",
      total: "$42.25",
      date: "2023-04-15 18:00",
      status: "Pending",
      items: 4
    }
  ];

  const filteredOrders = orders.filter(order => 
    (order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
     order.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
     order.restaurant.toLowerCase().includes(searchTerm.toLowerCase())) &&
    (statusFilter === 'all' || order.status.toLowerCase() === statusFilter.toLowerCase())
  );

//   const viewOrderDetails = (id) => {
//     toast({
//       title: "Order Details",
//       description: `Viewing details for order ${id}`,
//     });
//   };

  return (
    <SuperAdminLayout title="Manage Orders">
      <div className="bg-white rounded-lg shadow p-6">
        {/* Actions Bar */}
        <div className="flex flex-col gap-4 mb-6">
          <div className="flex flex-col gap-4 w-full">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <input
                type="text"
                placeholder="Search orders..."
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg w-full"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <select 
              className="border border-gray-300 rounded-lg py-2 px-3 w-full"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="all">All Statuses</option>
              <option value="completed">Completed</option>
              <option value="in progress">In Progress</option>
              <option value="pending">Pending</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
          {/* <Button className="w-full sm:w-auto self-end bg-purple-600 hover:bg-purple-700">
            Export Orders
          </Button> */}
        </div>
        
        {/* Table */}
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Order ID</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Restaurant</TableHead>
                <TableHead>Items</TableHead>
                <TableHead>Total</TableHead>
                <TableHead>Date & Time</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredOrders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell className="font-medium">{order.id}</TableCell>
                  <TableCell>{order.customer}</TableCell>
                  <TableCell>{order.restaurant}</TableCell>
                  <TableCell>{order.items}</TableCell>
                  <TableCell>{order.total}</TableCell>
                  <TableCell>{order.date}</TableCell>
                  <TableCell>
                    <span 
                      className={`px-2 py-1 rounded-full text-xs ${
                        order.status === 'Completed' 
                          ? 'bg-green-100 text-green-800' 
                          : order.status === 'In Progress'
                          ? 'bg-blue-100 text-blue-800'
                          : order.status === 'Pending'
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {order.status}
                    </span>
                  </TableCell>
                  {/* <TableCell className="text-right">
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => viewOrderDetails(order.id)}
                      className="text-gray-500 hover:text-blue-600"
                    >
                      <FileText className="h-4 w-4" />
                    </Button>
                  </TableCell> */}
                </TableRow>
              ))}
            </TableBody>
          </Table>
          
          {filteredOrders.length === 0 && (
            <div className="text-center py-6">
              <p className="text-gray-500">No orders found matching your search.</p>
            </div>
          )}
        </div>
        
        {/* Pagination */}
        <div className="flex justify-between items-center mt-6">
          <p className="text-sm text-gray-500">Showing {filteredOrders.length} of {orders.length} orders</p>
          {/* <div className="flex gap-2">
            <Button variant="outline" size="sm" disabled>Previous</Button>
            <Button variant="outline" size="sm">Next</Button>
          </div> */}
        </div>
      </div>
    </SuperAdminLayout>
  );
};

export default SuperAdminOrders;