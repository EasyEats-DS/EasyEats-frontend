import React, { useEffect, useState } from 'react';
import { 
  Table, TableBody, TableCell, TableHead, 
  TableHeader, TableRow 
} from "../../components/ui/table";
import { Search, Plus, Edit, Trash } from 'lucide-react';
import SuperAdminLayout from '../../components/SuperAdminLayout';
import { restaurantService } from '../../lib/api/resturants';

const SuperAdminRestaurants = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRestaurants = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await restaurantService.getAllRestaurants();
        console.log('API Response:', response); // Debug: Log the full response
        const data = response.data || response; // Handle if data is directly on response
        if (!Array.isArray(data)) {
          throw new Error('Invalid data format from API');
        }
        const mappedData = data.map(restaurant => {
          if (!restaurant.address || !restaurant.createdAt) {
            console.warn('Missing data for restaurant:', restaurant);
            return null;
          }
          return {
            id: restaurant._id,
            name: restaurant.name,
            owner: restaurant.ownerId || "Unknown",
            location: `${restaurant.address.city}, ${restaurant.address.state}`,
            status: restaurant.isActive ? "Active" : "Inactive",
            created: new Date(restaurant.createdAt).toISOString().split('T')[0],
            revenue: "$0"
          };
        }).filter(item => item !== null); // Filter out null entries
        setRestaurants(mappedData);
      } catch (error) {
        console.error('Error fetching restaurants:', error); // Debug: Log the error
        setError('Failed to fetch restaurants. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchRestaurants();
  }, []);

  const filteredRestaurants = restaurants.filter(restaurant => 
    restaurant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    restaurant.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
    restaurant.owner.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
        </div>
        
        {/* Loading/Error States */}
        {loading && (
          <div style={{ textAlign: 'center', padding: '1.5rem 0' }}>
            <p style={{ color: '#6b7280' }}>Loading restaurants...</p>
          </div>
        )}
        {error && (
          <div style={{ textAlign: 'center', padding: '1.5rem 0' }}>
            <p style={{ color: '#dc2626' }}>{error}</p>
          </div>
        )}
        
        {/* Table */}
        {!loading && !error && (
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
        )}
        
        {/* Pagination */}
        {!loading && !error && (
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1.5rem' }}>
            <p style={{ fontSize: '0.875rem', color: '#6b7280' }}>Showing {filteredRestaurants.length} of {restaurants.length} restaurants</p>
          </div>
        )}
      </div>
    </SuperAdminLayout>
  );
};

export default SuperAdminRestaurants;