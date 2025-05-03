
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, Settings, UserCog, Building, 
  Users, Database, Server, Shield, X, LogOut,FileText 
} from 'lucide-react';

const SuperAdminLayout = ({ children, title }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();


  const handleLogout = () => {
    // Remove auth data
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    sessionStorage.clear();

    // Redirect to login page
    navigate("/login");
  };

  const menuItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/superadmin/dashboard' },
    { icon: Building, label: 'Restaurants', path: '/superadmin/restaurants' },
    { icon: Users, label: 'Users', path: '/superadmin/users' },
    { icon: UserCog, label: 'orders', path: '/superadmin/orders' },
    { icon: FileText, label: 'Payments', path: '/superadmin/payments' },

    // { icon: Database, label: 'Database', path: '/superadmin/database' },
    // { icon: Server, label: 'System', path: '/superadmin/system' },
    // { icon: Shield, label: 'Security', path: '/superadmin/security' },
    // { icon: Settings, label: 'Settings', path: '/superadmin/settings' },
    // { icon: UserCog, label: 'Profile', path: '/superadmin/profile' },
  ];

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar for desktop */}
      <aside className="hidden md:flex md:w-64 flex-col fixed inset-y-0 bg-white shadow-lg">
        <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-purple-600 to-indigo-600">
          <h1 className="text-xl font-bold text-white">EasyEats SuperAdmin</h1>
        </div>
        
        <nav className="flex-1 overflow-y-auto py-4">
          {menuItems.map((item, index) => (
            <button
              key={index}
              onClick={() => navigate(item.path)}
              className="flex items-center px-6 py-3 w-full text-left hover:bg-gray-100 transition-colors"
            >
              <item.icon className="w-5 h-5 mr-3 text-purple-600" />
              <span>{item.label}</span>
            </button>
          ))}
        </nav>
        
        <div className="p-4 border-t border-gray-200">
          <button className="flex items-center px-6 py-3 w-full text-left text-red-600 hover:bg-gray-100 transition-colors" onClick={handleLogout}
          >
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
        <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-purple-600 to-indigo-600 flex justify-between items-center">
          <h1 className="text-xl font-bold text-white">FoodieVibe SuperAdmin</h1>
          <button onClick={() => setSidebarOpen(false)}>
            <X className="w-6 h-6 text-white" />
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
              className="flex items-center px-6 py-3 w-full text-left hover:bg-gray-100 transition-colors"
            >
              <item.icon className="w-5 h-5 mr-3 text-purple-600" />
              <span>{item.label}</span>
            </button>
          ))}
        </nav>
        
        <div className="p-4 border-t border-gray-200">
          <button className="flex items-center px-6 py-3 w-full text-left text-red-600 hover:bg-gray-100 transition-colors">
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
                className="md:hidden p-2 mr-2 rounded-md text-gray-700 hover:bg-gray-100"
              >
                <LayoutDashboard className="w-6 h-6" />
              </button>
              <h1 className="text-xl font-medium text-gray-800">{title}</h1>
            </div>
            <div className="flex items-center gap-2">
              <button className="p-2 rounded-full hover:bg-gray-100">
                <UserCog className="w-6 h-6 text-gray-700" />
              </button>
              <div className="hidden md:block">
                <p className="text-sm font-medium">Super Admin</p>
                <p className="text-xs text-gray-500">System Administrator</p>
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

export default SuperAdminLayout;
