
import React, { useState } from 'react';
import { 
  Table, TableBody, TableCell, TableHead, 
  TableHeader, TableRow 
} from "../../components/ui/table";
// import { Button } from "@/components/ui/button";
import { Search, Plus, Edit, Trash } from 'lucide-react';
import SuperAdminLayout from '../../components/SuperAdminLayout';
// import { useToast } from "@/hooks/use-toast";

const SuperAdminUsers = () => {
  // const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all');

  // Mock data
  const users = [
    { 
      id: 1, 
      name: 'John Smith', 
      email: 'john.smith@example.com',
      role: 'Customer',
      status: 'Active', 
      joinDate: '2023-03-15',
      orders: 24
    },
    { 
      id: 2, 
      name: 'Sarah Johnson', 
      email: 'sarah.j@example.com',
      role: 'Customer',
      status: 'Active', 
      joinDate: '2023-04-22',
      orders: 8
    },
    { 
      id: 3, 
      name: 'Marco Rossi', 
      email: 'marco@bellaitalia.com',
      role: 'Restaurant Owner',
      status: 'Active', 
      joinDate: '2023-02-10',
      orders: 0
    },
    { 
      id: 4, 
      name: 'Admin User', 
      email: 'admin@foodievibe.com',
      role: 'Admin',
      status: 'Active', 
      joinDate: '2022-12-01',
      orders: 0
    },
    { 
      id: 5, 
      name: 'Lisa Chen', 
      email: 'lisa@greengarden.com',
      role: 'Restaurant Owner',
      status: 'Active', 
      joinDate: '2023-01-18',
      orders: 0
    },
    { 
      id: 6, 
      name: 'Robert Davis', 
      email: 'robert.davis@example.com',
      role: 'Customer',
      status: 'Blocked', 
      joinDate: '2023-05-05',
      orders: 3
    },
    { 
      id: 7, 
      name: 'Super Admin', 
      email: 'superadmin@foodievibe.com',
      role: 'Super Admin',
      status: 'Active', 
      joinDate: '2022-01-01',
      orders: 0
    },
  ];

  const filteredUsers = users
    .filter(user => 
      (user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase())) &&
      (filter === 'all' || user.role.toLowerCase() === filter.toLowerCase())
    );

  // const handleEdit = (id) => {
  //   // Handle edit functionality
  //   toast({
  //     title: "Edit User",
  //     description: `Editing user ID: ${id}`,
  //   });
  // };

  // const handleDelete = (id) => {
  //   // Handle delete functionality
  //   toast({
  //     title: "User Deleted",
  //     description: `User ID: ${id} has been deleted`,
  //     variant: "destructive",
  //   });
  // };

  return (
    <SuperAdminLayout title="Manage Users">
      <div className="bg-white rounded-lg shadow p-6">
        {/* Actions Bar */}
        <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
          <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
            <div className="relative w-full sm:w-auto">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <input
                type="text"
                placeholder="Search users..."
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg w-full sm:w-64"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <select 
              className="border border-gray-300 rounded-lg py-2 px-3 w-full sm:w-auto"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
            >
              <option value="all">All Roles</option>
              <option value="customer">Customers</option>
              <option value="restaurant owner">Restaurant Owners</option>
              <option value="admin">Admins</option>
              <option value="super admin">Super Admins</option>
            </select>
          </div>
          {/* <Button className="w-full sm:w-auto bg-purple-600 hover:bg-purple-700">
            <Plus className="mr-2 h-4 w-4" /> Add New User
          </Button> */}
        </div>
        
        {/* Table */}
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Join Date</TableHead>
                <TableHead>Orders</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsers.map((user) => (
                <TableRow key={user.id}>
                  <TableCell className="font-medium">{user.name}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>
                    <span 
                      className={`px-2 py-1 rounded-full text-xs ${
                        user.role === 'Super Admin'
                          ? 'bg-purple-100 text-purple-800'
                          : user.role === 'Admin'
                          ? 'bg-blue-100 text-blue-800'
                          : user.role === 'Restaurant Owner'
                          ? 'bg-orange-100 text-orange-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      {user.role}
                    </span>
                  </TableCell>
                  <TableCell>
                    <span 
                      className={`px-2 py-1 rounded-full text-xs ${
                        user.status === 'Active' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {user.status}
                    </span>
                  </TableCell>
                  <TableCell>{user.joinDate}</TableCell>
                  <TableCell>{user.orders}</TableCell>
                  {/* <TableCell className="text-right">
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => handleEdit(user.id)}
                      className="text-gray-500 hover:text-blue-600"
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => handleDelete(user.id)}
                      className="text-gray-500 hover:text-red-600"
                      disabled={user.role === 'Super Admin'}
                    >
                      <Trash className="h-4 w-4" />
                    </Button>
                  </TableCell> */}
                </TableRow>
              ))}
            </TableBody>
          </Table>
          
          {filteredUsers.length === 0 && (
            <div className="text-center py-6">
              <p className="text-gray-500">No users found matching your search.</p>
            </div>
          )}
        </div>
        
        {/* Pagination */}
        <div className="flex justify-between items-center mt-6">
          <p className="text-sm text-gray-500">Showing {filteredUsers.length} of {users.length} users</p>
          {/* <div className="flex gap-2">
            <Button variant="outline" size="sm" disabled>Previous</Button>
            <Button variant="outline" size="sm">Next</Button>
          </div> */}
        </div>
      </div>
    </SuperAdminLayout>
  );
};

export default SuperAdminUsers;