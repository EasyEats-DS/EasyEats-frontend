import React from 'react';
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

const SuperAdminDashboard = () => {
    // Mock data
    const stats = [
      { 
        title: 'Total Restaurants', 
        value: '245', 
        change: '+12%', 
        trending: 'up',
        icon: Building
      },
      { 
        title: 'Total Users', 
        value: '15,243', 
        change: '+18%', 
        trending: 'up',
        icon: Users
      },
      { 
        title: 'Active Orders', 
        value: '1,753', 
        change: '+5%', 
        trending: 'up',
        icon: TrendingUp
      },
      { 
        title: 'Cancelled Orders', 
        value: '132', 
        change: '-3%', 
        trending: 'down',
        icon: TrendingDown
      },
    ];
  
    const recentRestaurants = [
      { id: 1, name: 'Bella Italia', location: 'New York', status: 'Active', orders: 142 },
      { id: 2, name: 'Sushi Express', location: 'Los Angeles', status: 'Active', orders: 98 },
      { id: 3, name: 'Taco Haven', location: 'Miami', status: 'Pending', orders: 0 },
      { id: 4, name: 'Burger Palace', location: 'Chicago', status: 'Active', orders: 76 },
      { id: 5, name: 'Pizza Planet', location: 'Houston', status: 'Active', orders: 112 },
    ];
  
    return (
      <SuperAdminLayout title="SuperAdmin Dashboard">
        {/* Stats Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1rem', marginBottom: '1.5rem', '@media (min-width: 768px)': { gridTemplateColumns: 'repeat(2, 1fr)' }, '@media (min-width: 1024px)': { gridTemplateColumns: 'repeat(4, 1fr)' } }}>
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
                <p style={{ fontSize: '0.75rem', color: stat.trending === 'up' ? '#10b981' : '#ef4444' }}>
                  {stat.change} from last month
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
  
        {/* Recent Restaurants */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1.5rem', marginBottom: '1.5rem' }}>
          <Card style={{ boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)' }}>
            <CardHeader>
              <CardTitle>Recently Added Restaurants</CardTitle>
              <CardDescription>
                Restaurants registered in the past 30 days
              </CardDescription>
            </CardHeader>
            <CardContent>
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
                      <TableCell style={{ fontWeight: '500' }}>{restaurant.name}</TableCell>
                      <TableCell>{restaurant.location}</TableCell>
                      <TableCell>
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
                      <TableCell style={{ textAlign: 'right' }}>{restaurant.orders}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
            <CardFooter style={{ borderTop: '1px solid #e5e7eb', padding: '1rem 1.5rem' }}>
              <button style={{ fontSize: '0.875rem', color: '#9333ea', fontWeight: '500', ':hover': { color: '#7e22ce' } }}>
                View All Restaurants →
              </button>
            </CardFooter>
          </Card>
        </div>
  
        {/* Other Dashboard Widgets */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1.5rem', '@media (min-width: 768px)': { gridTemplateColumns: 'repeat(2, 1fr)' } }}>
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
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.75rem' }}>
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
  