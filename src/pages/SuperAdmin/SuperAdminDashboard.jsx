import React, { useEffect, useMemo, useState } from 'react';
import {
  Card, CardContent, CardDescription, CardFooter,
  CardHeader, CardTitle
} from "../../components/ui/card";
import {
  Table, TableBody, TableCell, TableHead,
  TableHeader, TableRow
} from "../../components/ui/table";
import { TrendingUp, TrendingDown, Users, Building } from 'lucide-react';
import SuperAdminLayout from '../../components/SuperAdminLayout';
import { fetchAllOrdersNoPagination } from '../../lib/api/orders';
import { restaurantService } from '../../lib/api/resturants';
import { userService } from '../../lib/api/users';
import { ACTIVE_ORDER_STATUSES } from '../../lib/dashboardStats';

const SuperAdminDashboard = () => {
    const [restaurants, setRestaurants] = useState([]);
    const [orders, setOrders] = useState([]);
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
      let cancelled = false;

      const load = async () => {
        try {
          const [allRestaurants, allOrders, allUsers] = await Promise.all([
            restaurantService.getAllRestaurants(),
            fetchAllOrdersNoPagination(),
            userService.getAllUsers(),
          ]);
          if (cancelled) return;
          setRestaurants(allRestaurants || []);
          setOrders(allOrders || []);
          setUsers(allUsers || []);
        } catch (err) {
          console.error('Failed to load platform stats:', err);
          if (!cancelled) setError('Failed to load platform data.');
        } finally {
          if (!cancelled) setLoading(false);
        }
      };

      load();
      return () => { cancelled = true; };
    }, []);

    const stats = useMemo(() => {
      const activeOrders = orders.filter((o) =>
        ACTIVE_ORDER_STATUSES.includes(String(o.status ?? '').toLowerCase())
      ).length;
      const cancelledOrders = orders.filter(
        (o) => String(o.status ?? '').toLowerCase() === 'cancelled'
      ).length;

      return [
        { title: 'Total Restaurants', value: restaurants.length, note: 'Registered on the platform', trending: 'up', icon: Building },
        { title: 'Total Users', value: users.length, note: 'Registered accounts', trending: 'up', icon: Users },
        { title: 'Active Orders', value: activeOrders, note: 'Pending, processing or shipped', trending: 'up', icon: TrendingUp },
        { title: 'Cancelled Orders', value: cancelledOrders, note: 'All time', trending: 'down', icon: TrendingDown },
      ];
    }, [restaurants, orders, users]);

    // Order counts per restaurant, so the table shows real volume.
    const ordersByRestaurant = useMemo(() => {
      const counts = {};
      for (const order of orders) {
        if (!order.restaurantId) continue;
        counts[order.restaurantId] = (counts[order.restaurantId] || 0) + 1;
      }
      return counts;
    }, [orders]);

    const recentRestaurants = useMemo(
      () =>
        [...restaurants]
          .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
          .slice(0, 5)
          .map((r) => ({
            id: r._id,
            name: r.name,
            location: r.address?.city || r.address?.country || 'Unknown',
            status: r.isActive === false ? 'Inactive' : 'Active',
            orders: ordersByRestaurant[r._id] || 0,
          })),
      [restaurants, ordersByRestaurant]
    );

    if (loading) {
      return (
        <SuperAdminLayout title="SuperAdmin Dashboard">
          <p style={{ color: '#6b7280' }}>Loading platform data...</p>
        </SuperAdminLayout>
      );
    }

    if (error) {
      return (
        <SuperAdminLayout title="SuperAdmin Dashboard">
          <div style={{ backgroundColor: '#fef2f2', color: '#b91c1c', padding: '1rem', borderRadius: '0.5rem' }}>
            {error}
          </div>
        </SuperAdminLayout>
      );
    }

    return (
      <SuperAdminLayout title="SuperAdmin Dashboard">
        {/* Stats Cards */}
        <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat, i) => (
            <Card key={i} style={{ boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)', ':hover': { boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)' }, transition: 'box-shadow 150ms' }}>
              <CardHeader style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingBottom: '0.5rem' }}>
                <CardTitle style={{ fontSize: '0.875rem', fontWeight: '500', color: '#6b7280' }}>
                  {stat.title}
                </CardTitle>
                <stat.icon style={{ height: '1.25rem', width: '1.25rem', color: stat.trending === 'up' ? '#10b981' : '#ef4444' }} />
              </CardHeader>
              <CardContent>
                <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{stat.value}</div>
                <p style={{ fontSize: '0.75rem', color: '#9ca3af' }}>
                  {stat.note}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Recent Restaurants */}
        <div className="mb-6 grid grid-cols-1 gap-6">
          <Card style={{ boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)' }}>
            <CardHeader>
              <CardTitle>Recently Added Restaurants</CardTitle>
              <CardDescription>
                The most recently registered restaurants
              </CardDescription>
            </CardHeader>
            <CardContent>
              {recentRestaurants.length === 0 ? (
                <p style={{ color: '#6b7280', fontSize: '0.875rem', padding: '1.5rem 0', textAlign: 'center' }}>
                  No restaurants registered yet.
                </p>
              ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Restaurant</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead style={{ textAlign: 'right' }}>Total Orders</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {recentRestaurants.map((restaurant) => (
                    <TableRow key={restaurant.id}>
                      <TableCell label="Restaurant" style={{ fontWeight: '500' }}>{restaurant.name}</TableCell>
                      <TableCell label="Location">{restaurant.location}</TableCell>
                      <TableCell label="Status">
                        <span
                          style={{
                            padding: '0.25rem 0.5rem',
                            borderRadius: '9999px',
                            fontSize: '0.75rem',
                            backgroundColor: restaurant.status === 'Active' ? '#dcfce7' : '#fef9c3',
                            color: restaurant.status === 'Active' ? '#166534' : '#854d0e'
                          }}
                        >
                          {restaurant.status}
                        </span>
                      </TableCell>
                      <TableCell label="Total Orders" style={{ textAlign: 'right' }}>{restaurant.orders}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              )}
            </CardContent>
            <CardFooter style={{ borderTop: '1px solid #e5e7eb', padding: '1rem 1.5rem' }}>
              <button style={{ fontSize: '0.875rem', color: '#9333ea', fontWeight: '500', ':hover': { color: '#7e22ce' } }}>
                View All Restaurants →
              </button>
            </CardFooter>
          </Card>
        </div>

        {/* Other Dashboard Widgets */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {/* System Health */}
          <Card style={{ boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)' }}>
            <CardHeader>
              <CardTitle>System Health</CardTitle>
              <CardDescription>
                Current status of system components
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {['API Services', 'Database', 'Payment Gateway', 'Notification System'].map((service) => (
                  <div key={service} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span>{service}</span>
                    <span style={{ padding: '0.25rem 0.5rem', borderRadius: '9999px', fontSize: '0.75rem', backgroundColor: '#dcfce7', color: '#166534' }}>
                      Operational
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card style={{ boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)' }}>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>
                Frequently used admin operations
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                {[
                  'Add Restaurant',
                  'Manage Users',
                  'View Reports',
                  'System Settings',
                  'Security Audit',
                  'Database Backup'
                ].map((action) => (
                  <button
                    key={action}
                    style={{
                      padding: '0.75rem 1rem',
                      backgroundColor: '#f3f4f6',
                      ':hover': { backgroundColor: '#e5e7eb' },
                      borderRadius: '0.5rem',
                      fontSize: '0.875rem',
                      fontWeight: '500',
                      transition: 'background-color 150ms'
                    }}
                  >
                    {action}
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </SuperAdminLayout>
    );
  };

  export default SuperAdminDashboard;
