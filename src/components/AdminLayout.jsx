import React, { useState,useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Home, Settings, ShoppingCart, Menu as MenuIcon, 
  User, X, CreditCard, Package, LogOut
} from 'lucide-react';
import { getUserFromToken } from '../lib/auth';
import {restaurantService} from '../lib/api/resturants';

const AdminLayout = ({ children, title }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [restaurantName, setRestaurantName] = useState('');
  const navigate = useNavigate();


    useEffect(() => {
      const fetchMenuData = async () => {
        try {
          const user = getUserFromToken();
          if (!user || !user.id) {
            throw new Error('No valid user token found');
          }
          const ownerId = user.id;
          const restaurants = await restaurantService.getRestaurantsByOwnerId(ownerId);
          console.log('restaurants:', restaurants);
          setRestaurantName(restaurants[0]?.name || '');
          console.log('restaurantName:', restaurantName);
          
        }
        catch (error) {
          console.error('Error fetching restaurant data:', error);
        }
      };
      fetchMenuData();
    }, []);

  const menuItems = [
    { icon: Home, label: 'Dashboard', path: '/admin/dashboard' },
    { icon: MenuIcon, label: 'Menu Management', path: '/admin/menu' },
    { icon: Package, label: 'Orders', path: '/admin/orders' },
    { icon: CreditCard, label: 'Earnings', path: '/admin/earnings' },
    { icon: Settings, label: 'Restaurant Settings', path: '/admin/settings' },
    // {icon: ShoppingCart, label: 'Inventory', path: '/admin/inventory' },
    { icon: User, label: 'Profile', path: '/admin/profile' },
    // { icon: X, label: 'Restaurant Creation', path: '/admin/restaurant-creation' },
  ];

  const handleLogout = () => {
    // Remove auth data
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    sessionStorage.clear();

    // Redirect to login page
    navigate("/login");
  };

  return (
    <div className="flex h-screen bg-foodie-gray-light">
      {/* Sidebar for desktop */}
      <aside className="hidden md:flex md:w-64 flex-col fixed inset-y-0 bg-white shadow-lg">
        <div className="p-6 border-b border-foodie-gray">
          <h1 className="text-xl font-bold text-gradient">EasyEats Admin</h1>
        </div>
        
        <nav className="flex-1 overflow-y-auto py-4">
          {menuItems.map((item, index) => (
            <button
              key={index}
              onClick={() => navigate(item.path)}
              className="flex items-center px-6 py-3 w-full text-left hover:bg-foodie-gray-light transition-colors"
            >
              <item.icon className="w-5 h-5 mr-3 text-foodie-orange" />
              <span>{item.label}</span>
            </button>
          ))}
        </nav>
        
        <div className="p-4 border-t border-foodie-gray">
          <button className="flex items-center px-6 py-3 w-full text-left text-foodie-red hover:bg-foodie-gray-light transition-colors" onClick={handleLogout}>
            <LogOut className="w-5 h-5 mr-3" />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Mobile sidebar */}
      <div 
        className={`fixed inset-0 bg-black bg-opacity-50 z-20 transition-opacity md:hidden ${
          sidebarOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={() => setSidebarOpen(false)}
      />
      
      <aside 
        className={`fixed inset-y-0 left-0 z-30 w-64 bg-white shadow-lg transform transition-transform md:hidden ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="p-6 border-b border-foodie-gray flex justify-between items-center">
          <h1 className="text-xl font-bold text-gradient">FoodieVibe</h1>
          <button onClick={() => setSidebarOpen(false)}>
            <X className="w-6 h-6 text-foodie-charcoal" />
          </button>
        </div>
        
        <nav className="flex-1 overflow-y-auto py-4">
          {menuItems.map((item, index) => (
            <button
              key={index}
              onClick={() => {
                navigate(item.path);
                setSidebarOpen(false);
              }}
              className="flex items-center px-6 py-3 w-full text-left hover:bg-foodie-gray-light transition-colors"
            >
              <item.icon className="w-5 h-5 mr-3 text-foodie-orange" />
              <span>{item.label}</span>
            </button>
          ))}
        </nav>
        
        <div className="p-4 border-t border-foodie-gray">
          <button className="flex items-center px-6 py-3 w-full text-left text-foodie-red hover:bg-foodie-gray-light transition-colors">
            <LogOut className="w-5 h-5 mr-3" />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 md:ml-64 flex flex-col">
        <header className="bg-white shadow-sm sticky top-0 z-10">
          <div className="px-4 py-4 flex justify-between items-center">
            <div className="flex items-center">
              <button 
                onClick={() => setSidebarOpen(true)} 
                className="md:hidden p-2 mr-2 rounded-md text-foodie-charcoal hover:bg-foodie-gray-light"
              >
                <MenuIcon className="w-6 h-6" />
              </button>
              <h1 className="text-xl font-medium text-foodie-charcoal">{title}</h1>
            </div>
            <div className="flex items-center gap-2">
              <button className="p-2 rounded-full hover:bg-foodie-gray-light">
                <User className="w-6 h-6 text-foodie-charcoal" />
              </button>
              <div className="hidden md:block">
              <p className="text-sm font-medium">{restaurantName || 'Loading...'}</p>
              <p className="text-xs text-foodie-gray-dark">Admin</p>
              </div>
            </div>
          </div>
        </header>

        <main className="flex-1 p-6 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
