
import React, { useState } from 'react';
import { 
  Table, TableBody, TableCell, TableHead, 
  TableHeader, TableRow 
} from "../../components/ui/table";
// import { Button } from "@/components/ui/button";
import { Search, Download, Eye } from 'lucide-react';
import SuperAdminLayout from '../../components/SuperAdminLayout';
// import { useToast } from "@/hooks/use-toast";

const SuperAdminPayments = () => {
//   const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [dateFilter, setDateFilter] = useState('all');

  // Mock data
  const payments = [
    { 
      id: "PAY-8901",
      orderId: "#ORD-5289",
      customer: "John Smith",
      restaurant: "Bella Italia",
      amount: "$45.80",
      date: "2023-04-15",
      method: "Credit Card",
      status: "Successful"
    },
    { 
      id: "PAY-8902",
      orderId: "#ORD-5290",
      customer: "Sarah Johnson",
      restaurant: "Sushi Express",
      amount: "$32.50",
      date: "2023-04-15",
      method: "PayPal",
      status: "Successful"
    },
    { 
      id: "PAY-8903",
      orderId: "#ORD-5291",
      customer: "Robert Davis",
      restaurant: "Burger Palace",
      amount: "$24.99",
      date: "2023-04-15",
      method: "Credit Card",
      status: "Successful"
    },
    { 
      id: "PAY-8904",
      orderId: "#ORD-5292",
      customer: "Lisa Chen",
      restaurant: "Green Garden",
      amount: "$38.75",
      date: "2023-04-15",
      method: "Debit Card",
      status: "Refunded"
    },
    { 
      id: "PAY-8905",
      orderId: "#ORD-5293",
      customer: "Michael Brown",
      restaurant: "Taco Haven",
      amount: "$19.99",
      date: "2023-04-15",
      method: "Credit Card",
      status: "Successful"
    },
    { 
      id: "PAY-8906",
      orderId: "#ORD-5294",
      customer: "Emily Wilson",
      restaurant: "Pizza Planet",
      amount: "$27.50",
      date: "2023-04-15",
      method: "Apple Pay",
      status: "Pending"
    },
    { 
      id: "PAY-8907",
      orderId: "#ORD-5295",
      customer: "David Lee",
      restaurant: "Curry House",
      amount: "$42.25",
      date: "2023-04-15",
      method: "Google Pay",
      status: "Successful"
    }
  ];

  const filteredPayments = payments.filter(payment => 
    (payment.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
     payment.orderId.toLowerCase().includes(searchTerm.toLowerCase()) ||
     payment.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
     payment.restaurant.toLowerCase().includes(searchTerm.toLowerCase())) &&
    (dateFilter === 'all' || payment.date === dateFilter)
  );

//   const viewPaymentDetails = (id) => {
//     toast({
//       title: "Payment Details",
//       description: `Viewing details for payment ${id}`,
//     });
//   };

//   const downloadReceipt = (id) => {
//     toast({
//       title: "Download Receipt",
//       description: `Downloading receipt for payment ${id}`,
//     });
//   };

  return (
    <SuperAdminLayout title="Manage Payments">
      <div className="bg-white rounded-lg shadow p-6">
        {/* Actions Bar */}
        <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
          <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
            <div className="relative w-full sm:w-auto">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <input
                type="text"
                placeholder="Search payments..."
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg w-full sm:w-64"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <select 
              className="border border-gray-300 rounded-lg py-2 px-3 w-full sm:w-auto"
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
            >
              <option value="all">All Dates</option>
              <option value="2023-04-15">April 15, 2023</option>
              <option value="2023-04-14">April 14, 2023</option>
              <option value="2023-04-13">April 13, 2023</option>
            </select>
          </div>
          {/* <Button className="w-full sm:w-auto bg-purple-600 hover:bg-purple-700">
            Export Payment Report
          </Button> */}
        </div>
        
        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-purple-50 p-4 rounded-lg border border-purple-100">
            <p className="text-sm text-purple-700">Total Revenue</p>
            <p className="text-2xl font-bold">$231.79</p>
          </div>
          <div className="bg-green-50 p-4 rounded-lg border border-green-100">
            <p className="text-sm text-green-700">Successful Payments</p>
            <p className="text-2xl font-bold">5</p>
          </div>
          <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-100">
            <p className="text-sm text-yellow-700">Pending Payments</p>
            <p className="text-2xl font-bold">1</p>
          </div>
          <div className="bg-red-50 p-4 rounded-lg border border-red-100">
            <p className="text-sm text-red-700">Refunded Payments</p>
            <p className="text-2xl font-bold">1</p>
          </div>
        </div>
        
        {/* Table */}
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Payment ID</TableHead>
                <TableHead>Order ID</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Restaurant</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Method</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredPayments.map((payment) => (
                <TableRow key={payment.id}>
                  <TableCell className="font-medium">{payment.id}</TableCell>
                  <TableCell>{payment.orderId}</TableCell>
                  <TableCell>{payment.customer}</TableCell>
                  <TableCell>{payment.restaurant}</TableCell>
                  <TableCell>{payment.amount}</TableCell>
                  <TableCell>{payment.method}</TableCell>
                  <TableCell>{payment.date}</TableCell>
                  <TableCell>
                    <span 
                      className={`px-2 py-1 rounded-full text-xs ${
                        payment.status === 'Successful' 
                          ? 'bg-green-100 text-green-800' 
                          : payment.status === 'Pending'
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {payment.status}
                    </span>
                  </TableCell>
                  {/* <TableCell className="text-right">
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => viewPaymentDetails(payment.id)}
                      className="text-gray-500 hover:text-blue-600 mr-1"
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => downloadReceipt(payment.id)}
                      className="text-gray-500 hover:text-green-600"
                    >
                      <Download className="h-4 w-4" />
                    </Button>
                  </TableCell> */}
                </TableRow>
              ))}
            </TableBody>
          </Table>
          
          {filteredPayments.length === 0 && (
            <div className="text-center py-6">
              <p className="text-gray-500">No payments found matching your search.</p>
            </div>
          )}
        </div>
        
        {/* Pagination */}
        <div className="flex justify-between items-center mt-6">
          <p className="text-sm text-gray-500">Showing {filteredPayments.length} of {payments.length} payments</p>
          {/* <div className="flex gap-2">
            <Button variant="outline" size="sm" disabled>Previous</Button>
            <Button variant="outline" size="sm">Next</Button>
          </div> */}
        </div>
      </div>
    </SuperAdminLayout>
  );
};

export default SuperAdminPayments;