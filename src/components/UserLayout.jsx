import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Home, Search, ShoppingCart, User, Menu, CreditCard, Store, Map as MapIcon, Package, Truck } from "lucide-react";
import Cart from "../pages/Cart";
import { getCurrentUser, homeRouteForRole } from '../lib/auth';
import { navItemsForRole, showsCart } from '../lib/access';

const NAV_ICONS = {
  home: Home,
  store: Store,
  orders: Package,
  payments: CreditCard,
  map: MapIcon,
  deliveries: Truck,
  profile: User,
};

const UserLayout = ({ children, title }) => {
  const navigate = useNavigate();
  const [isCartOpen, setIsCartOpen] = useState(false);

  const user = getCurrentUser();
  const role = user?.role;
  const navItems = navItemsForRole(role);
  const canShop = showsCart(role);
  const homeLink = homeRouteForRole(role);


  return (
    <div className="flex flex-col min-h-screen bg-foodie-gray-light">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-white shadow-sm">
        <div className="container max-w-6xl mx-auto px-4 py-4 grid grid-cols-[1fr_auto_1fr] items-center gap-4">
          <div className="flex items-center gap-2 min-w-0">
            <Menu className="w-6 h-6 lg:hidden text-foodie-charcoal" />
            <h1
              className="text-xl font-bold text-gradient truncate cursor-pointer"
              onClick={() => navigate(homeLink)}
            >
              {title || "EasyEats"}
            </h1>
          </div>
          <div className="hidden lg:flex items-center justify-center space-x-6">
            {navItems.map((item) => (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className="text-foodie-charcoal hover:text-foodie-orange transition-colors"
              >
                {item.label}
              </button>
            ))}
          </div>
          <div className="flex items-center justify-end gap-1 md:gap-3">
            {canShop && (
              <>
                <button
                  onClick={() => navigate("/search")}
                  className="p-2 text-foodie-charcoal hover:bg-foodie-gray-light rounded-full transition-colors"
                >
                  <Search className="w-6 h-6" />
                </button>
                <button
                  onClick={() => setIsCartOpen(true)}
                  className="p-2 text-foodie-charcoal hover:bg-foodie-gray-light rounded-full transition-colors relative"
                >
                  <ShoppingCart className="w-6 h-6" />
                </button>
              </>
            )}
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

      {canShop && (
        <div
          className={`fixed top-0 right-0 w-100 h-full bg-white shadow-lg z-50 overflow-y-auto transition-transform duration-300 transform ${
            isCartOpen ? "translate-x-0" : "translate-x-full"
          }`}
        >
          <div className="flex justify-end p-4">
            <button
              onClick={() => setIsCartOpen(false)}
              className="text-gray-600 hover:text-gray-900 text-2xl"
            >
              ×
            </button>
          </div>
          <Cart />
        </div>
      )}

      {/* Mobile Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white shadow-[0_-4px_10px_rgba(0,0,0,0.05)] z-10">
        <div className="flex justify-around py-3">
          {navItems.map((item) => {
            const Icon = NAV_ICONS[item.icon] ?? Home;
            return (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className="flex flex-col items-center text-foodie-gray-dark hover:text-foodie-orange transition-colors"
              >
                <Icon className="w-6 h-6" />
                <span className="text-xs mt-1">{item.label}</span>
              </button>
            );
          })}
          {canShop && (
            <button
              onClick={() => setIsCartOpen(true)}
              className="flex flex-col items-center text-foodie-gray-dark hover:text-foodie-orange transition-colors relative"
            >
              <ShoppingCart className="w-6 h-6" />
              <span className="text-xs mt-1">Cart</span>
            </button>
          )}
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