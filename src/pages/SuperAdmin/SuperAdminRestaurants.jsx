
import React, { useState } from 'react';
import { 
  Table, TableBody, TableCell, TableHead, 
  TableHeader, TableRow 
} from "../../components/ui/table";
// import { Button } from "@/components/ui/button";
import { Search, Plus, Edit, Trash } from 'lucide-react';
import SuperAdminLayout from '../../components/SuperAdminLayout';
// import { useToast } from "@/hooks/use-toast";

const SuperAdminRestaurants = () => {
//   const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');

  // Mock data
  const restaurants = [
    { 
      id: 1, 
      name: 'Bella Italia', 
      owner: 'Marco Rossi',
      location: 'New York', 
      status: 'Active', 
      created: '2023-04-12',
      revenue: '$12,450'
    },
    { 
      id: 2, 
      name: 'Sushi Express', 
      owner: 'Yuki Tanaka',
      location: 'Los Angeles', 
      status: 'Active', 
      created: '2023-05-18',
      revenue: '$9,120'
    },
    { 
      id: 3, 
      name: 'Taco Haven', 
      owner: 'Carlos Mendez',
      location: 'Miami', 
      status: 'Pending', 
      created: '2023-06-01',
      revenue: '$0'
    },
    { 
      id: 4, 
      name: 'Burger Palace', 
      owner: 'John Smith',
      location: 'Chicago', 
      status: 'Active', 
      created: '2023-03-24',
      revenue: '$8,750'
    },
    { 
      id: 5, 
      name: 'Pizza Planet', 
      owner: 'Tony Pepperoni',
      location: 'Houston', 
      status: 'Active', 
      created: '2023-02-15',
      revenue: '$15,320'
    },
    { 
      id: 6, 
      name: 'Curry House', 
      owner: 'Raj Patel',
      location: 'San Francisco', 
      status: 'Suspended', 
      created: '2023-01-30',
      revenue: '$5,640'
    },
    { 
      id: 7, 
      name: 'Green Garden', 
      owner: 'Lisa Chen',
      location: 'Seattle', 
      status: 'Active', 
      created: '2023-04-05',
      revenue: '$7,820'
    },
  ];

  const filteredRestaurants = restaurants.filter(restaurant => 
    restaurant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    restaurant.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
    restaurant.owner.toLowerCase().includes(searchTerm.toLowerCase())
  );

//   const handleEdit = (id) => {
//     // Handle edit functionality
//     toast({
//       title: "Edit Restaurant",
//       description: `Editing restaurant ID: ${id}`,
//     });
//   };

//   const handleDelete = (id) => {
//     // Handle delete functionality
//     toast({
//       title: "Delete Restaurant",
//       description: `Restaurant ID: ${id} has been deleted`,
//       variant: "destructive",
//     });
//   };

  return (
    <SuperAdminLayout title="Manage Restaurants">
      <div style={{ backgroundColor: 'white', borderRadius: '0.5rem', boxShadow: '0 1px 3px 0 rgb(0 0 0 / 0.1)', padding: '1.5rem' }}>
        {/* Actions Bar */}
        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', gap: '1rem', '@media (min-width: 640px)': { flexDirection: 'row' } }}>
          <div style={{ position: 'relative', width: '100%', '@media (min-width: 640px)': { width: 'auto' } }}>
            <Search style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: '#9ca3af', height: '1rem', width: '1rem' }} />
            <input
              type="text"
              placeholder="Search restaurants..."
              style={{ paddingLeft: '2.5rem', paddingRight: '1rem', paddingTop: '0.5rem', paddingBottom: '0.5rem', border: '1px solid #d1d5db', borderRadius: '0.5rem', width: '100%', '@media (min-width: 640px)': { width: '20rem' } }}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          {/* <Button className="w-full sm:w-auto bg-purple-600 hover:bg-purple-700">
            <Plus className="mr-2 h-4 w-4" /> Add New Restaurant
          </Button> */}
        </div>
        
        {/* Table */}
        <div style={{ overflowX: 'auto' }}>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Restaurant</TableHead>
                <TableHead>Owner</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Created Date</TableHead>
                <TableHead>Total Revenue</TableHead>
                <TableHead style={{ textAlign: 'right' }}>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredRestaurants.map((restaurant) => (
                <TableRow key={restaurant.id}>
                  <TableCell style={{ fontWeight: '500' }}>{restaurant.name}</TableCell>
                  <TableCell>{restaurant.owner}</TableCell>
                  <TableCell>{restaurant.location}</TableCell>
                  <TableCell>
                    <span 
                      style={{ 
                        padding: '0.25rem 0.5rem', 
                        borderRadius: '9999px', 
                        fontSize: '0.75rem',
                        backgroundColor: restaurant.status === 'Active' 
                          ? '#dcfce7' 
                          : restaurant.status === 'Pending'
                          ? '#fef9c3'
                          : '#fee2e2',
                        color: restaurant.status === 'Active' 
                          ? '#166534' 
                          : restaurant.status === 'Pending'
                          ? '#854d0e'
                          : '#b91c1c'
                      }}
                    >
                      {restaurant.status}
                    </span>
                  </TableCell>
                  <TableCell>{restaurant.created}</TableCell>
                  <TableCell>{restaurant.revenue}</TableCell>
                  {/* <TableCell style={{ textAlign: 'right' }}>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => handleEdit(restaurant.id)}
                      style={{ color: '#4b5563' }}
                      onMouseOver={(e) => e.currentTarget.style.color = '#2563eb'}
                      onMouseOut={(e) => e.currentTarget.style.color = '#4b5563'}
                    >
                      <Edit style={{ height: '1rem', width: '1rem' }} />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => handleDelete(restaurant.id)}
                      style={{ color: '#4b5563' }}
                      onMouseOver={(e) => e.currentTarget.style.color = '#dc2626'}
                      onMouseOut={(e) => e.currentTarget.style.color = '#4b5563'}
                    >
                      <Trash style={{ height: '1rem', width: '1rem' }} />
                    </Button>
                  </TableCell> */}
                </TableRow>
              ))}
            </TableBody>
          </Table>
          
          {filteredRestaurants.length === 0 && (
            <div style={{ textAlign: 'center', padding: '1.5rem 0' }}>
              <p style={{ color: '#6b7280' }}>No restaurants found matching your search.</p>
            </div>
          )}
        </div>
        
        {/* Pagination */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1.5rem' }}>
          <p style={{ fontSize: '0.875rem', color: '#6b7280' }}>Showing {filteredRestaurants.length} of {restaurants.length} restaurants</p>
          {/* <div style={{ display: 'flex', gap: '0.5rem' }}>
            <Button variant="outline" size="sm" disabled>Previous</Button>
            <Button variant="outline" size="sm">Next</Button>
          </div> */}
        </div>
      </div>
    </SuperAdminLayout>
  );
};

export default SuperAdminRestaurants;
