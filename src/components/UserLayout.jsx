import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Home, Search, ShoppingCart, User, Menu } from 'lucide-react';

const UserLayout = ({ children, title }) => {
  const navigate = useNavigate();
  
  return (
    <div className="flex flex-col min-h-screen bg-foodie-gray-light">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-white shadow-sm">
        <div className="container max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Menu className="w-6 h-6 lg:hidden text-foodie-charcoal" />
            <h1 className="text-xl font-bold text-gradient">{title || "EasyEats"}</h1>
          </div>
          <div className="hidden lg:flex items-center space-x-6">
            <button onClick={() => navigate("/")} className="text-foodie-charcoal hover:text-foodie-orange transition-colors">Home</button>
            <button onClick={() => navigate("/restaurant")} className="text-foodie-charcoal hover:text-foodie-orange transition-colors">Restaurants</button>
            <button onClick={() => navigate("/orders")} className="text-foodie-charcoal hover:text-foodie-orange transition-colors">Orders</button>
          </div>
          <div className="flex items-center gap-1 md:gap-3">
            <button 
              onClick={() => navigate("/search")}
              className="p-2 text-foodie-charcoal hover:bg-foodie-gray-light rounded-full transition-colors"
            >
              <Search className="w-6 h-6" />
            </button>
            <button 
              onClick={() => navigate("/cart")}
              className="p-2 text-foodie-charcoal hover:bg-foodie-gray-light rounded-full transition-colors relative"
            >
              <ShoppingCart className="w-6 h-6" />
              <span className="absolute -top-1 -right-1 bg-foodie-orange text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">3</span>
            </button>
            <button 
              onClick={() => navigate("/profile")}
              className="p-2 text-foodie-charcoal hover:bg-foodie-gray-light rounded-full transition-colors"
            >
              <User className="w-6 h-6" />
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow container max-w-6xl mx-auto px-4 py-6">
        {children}
      </main>

      {/* Mobile Navigation */}
      <nav className=" fixed bottom-0 left-0 right-0 bg-white shadow-[0_-4px_10px_rgba(0,0,0,0.05)] z-10">
        <div className="flex justify-around py-3">
          <button 
            onClick={() => navigate("/")}
            className="flex flex-col items-center text-foodie-gray-dark hover:text-foodie-orange transition-colors"
          >
            <Home className="w-6 h-6" />
            <span className="text-xs mt-1">Home</span>
          </button>
          <button 
            onClick={() => navigate("/search")}
            className="flex flex-col items-center text-foodie-gray-dark hover:text-foodie-orange transition-colors"
          >
            <Search className="w-6 h-6" />
            <span className="text-xs mt-1">Search</span>
          </button>
          <button 
            onClick={() => navigate("/cart")}
            className="flex flex-col items-center text-foodie-gray-dark hover:text-foodie-orange transition-colors relative"
          >
            <ShoppingCart className="w-6 h-6" />
            <span className="absolute -top-1 right-0 bg-foodie-orange text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">3</span>
            <span className="text-xs mt-1">Cart</span>
          </button>
          <button 
            onClick={() => navigate("/profile")}
            className="flex flex-col items-center text-foodie-gray-dark hover:text-foodie-orange transition-colors"
          >
            <User className="w-6 h-6" />
            <span className="text-xs mt-1">Profile</span>
          </button>
        </div>
      </nav>
    </div>
  );
};

export default UserLayout;