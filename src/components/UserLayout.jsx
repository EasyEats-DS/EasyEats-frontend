import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Home, Search, ShoppingCart, User, Menu, CreditCard, LogOut } from "lucide-react";
import Cart from "../pages/Cart";
import { clearAuthSession } from "../lib/auth";

const UserLayout = ({ children, title }) => {
  const navigate = useNavigate();
  const [isCartOpen, setIsCartOpen] = useState(false);

  const getCartCount = useCallback(() => {
    try {
      const items = JSON.parse(localStorage.getItem("cartItems") || "[]");
      if (!Array.isArray(items)) return 0;
      return items.reduce((total, item) => total + (Number(item.quantity) || 1), 0);
    } catch {
      return 0;
    }
  }, []);

  const [cartCount, setCartCount] = useState(getCartCount);

  useEffect(() => {
    const handleCartUpdate = () => {
      setCartCount(getCartCount());
    };

    handleCartUpdate();

    window.addEventListener("storage", handleCartUpdate);
    window.addEventListener("cartUpdated", handleCartUpdate);

    return () => {
      window.removeEventListener("storage", handleCartUpdate);
      window.removeEventListener("cartUpdated", handleCartUpdate);
    };
  }, [getCartCount, isCartOpen]);

  // Lock body scroll and close on Escape key when cart drawer is open
  useEffect(() => {
    if (isCartOpen) {
      document.body.style.overflow = "hidden";
      const handleKeyDown = (e) => {
        if (e.key === "Escape") {
          setIsCartOpen(false);
        }
      };
      window.addEventListener("keydown", handleKeyDown);
      return () => {
        document.body.style.overflow = "unset";
        window.removeEventListener("keydown", handleKeyDown);
      };
    } else {
      document.body.style.overflow = "unset";
    }
  }, [isCartOpen]);

  const userType = localStorage.getItem('userType');
  const _user = userType === 'driver' 
    ? JSON.parse(localStorage.getItem('driver'))
    : JSON.parse(localStorage.getItem('Customer'));

  const mapLink = userType? userType === 'driver'
    ? "/driver/map"
    : "/customer/map"
    : "/login";


  return (
    <div className="flex flex-col min-h-screen bg-foodie-gray-light">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-white shadow-sm">
        <div className="container max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Menu className="w-6 h-6 lg:hidden text-foodie-charcoal" />
            <h1 className="text-xl font-bold text-gradient cursor-pointer hover:opacity-85 transition-opacity" onClick={() => navigate("/")}>
              {title || "EasyEats"}
            </h1>
          </div>
          <div className="hidden lg:flex items-center space-x-6">
            <button
              onClick={() => navigate("/")}
              className="text-foodie-charcoal hover:text-foodie-orange font-medium px-2 py-1 rounded-md hover:bg-orange-50 transition-colors"
            >
              Home
            </button>
            <button
              onClick={() => navigate("/restaurant")}
              className="text-foodie-charcoal hover:text-foodie-orange font-medium px-2 py-1 rounded-md hover:bg-orange-50 transition-colors"
            >
              Restaurants
            </button>
            <button
              onClick={() => navigate("/viewOrder")}
              className="text-foodie-charcoal hover:text-foodie-orange font-medium px-2 py-1 rounded-md hover:bg-orange-50 transition-colors"
            >
              Orders
            </button>
            <button
              onClick={() => navigate("/payment")}
              className="text-foodie-charcoal hover:text-foodie-orange font-medium px-2 py-1 rounded-md hover:bg-orange-50 transition-colors"
            >
              Payments
            </button>
            <button
              onClick={() => navigate(mapLink)}
              className="text-foodie-charcoal hover:text-foodie-orange font-medium px-2 py-1 rounded-md hover:bg-orange-50 transition-colors"
            >
              Track Order
            </button>

          </div>
          <div className="flex items-center gap-1 md:gap-3">
            <button
              onClick={() => navigate("/search")}
              className="p-2 text-foodie-charcoal hover:text-foodie-orange hover:bg-orange-50 rounded-full transition-colors"
              title="Search"
            >
              <Search className="w-6 h-6" />
            </button>
            <button
              onClick={() => setIsCartOpen(true)}
              className="p-2 text-foodie-charcoal hover:text-foodie-orange hover:bg-orange-50 rounded-full transition-colors relative"
              title="Cart"
            >
              <ShoppingCart className="w-6 h-6" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-foodie-orange text-white text-xs font-bold rounded-full min-w-5 h-5 px-1 flex items-center justify-center shadow-sm">
                  {cartCount > 99 ? "99+" : cartCount}
                </span>
              )}
            </button>
            <button
              onClick={() => navigate("/profile")}
              className="p-2 text-foodie-charcoal hover:text-foodie-orange hover:bg-orange-50 rounded-full transition-colors"
              title="Profile"
            >
              <User className="w-6 h-6" />
            </button>
            <button
              onClick={() => {
                clearAuthSession();
                navigate("/login");
              }}
              className="p-2 text-foodie-charcoal hover:text-red-500 hover:bg-red-50 rounded-full transition-colors"
              title="Logout"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow container max-w-6xl mx-auto px-4 py-6 pb-28 lg:pb-8">
        {children}
      </main>

      {/* Cart Drawer Backdrop */}
      <div
        className={`fixed inset-0 bg-black/50 backdrop-blur-[2px] z-50 transition-opacity duration-300 ${
          isCartOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setIsCartOpen(false)}
        aria-hidden="true"
      />

      {/* Cart Drawer Sidebar */}
      <aside
        className={`fixed top-0 right-0 w-full sm:w-[440px] md:w-[480px] h-screen h-[100dvh] bg-white shadow-2xl z-50 transition-transform duration-300 ease-in-out flex flex-col ${
          isCartOpen ? "translate-x-0" : "translate-x-full"
        }`}
        aria-label="Shopping Cart Drawer"
      >
        <Cart isDrawer={true} onClose={() => setIsCartOpen(false)} />
      </aside>

      {/* Mobile Navigation - Only visible on mobile/tablets (< lg) */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white shadow-[0_-4px_10px_rgba(0,0,0,0.05)] z-20 lg:hidden">
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
            onClick={() => setIsCartOpen(true)}
            className="flex flex-col items-center text-foodie-gray-dark hover:text-foodie-orange transition-colors relative"
          >
            <ShoppingCart className="w-6 h-6" />
            {cartCount > 0 && (
              <span className="absolute -top-1 right-0 bg-foodie-orange text-white text-xs font-bold rounded-full min-w-5 h-5 px-1 flex items-center justify-center shadow-sm">
                {cartCount > 99 ? "99+" : cartCount}
              </span>
            )}
            <span className="text-xs mt-1">Cart</span>
          </button>
          <button
            onClick={() => navigate("/payment")}
            className="flex flex-col items-center text-foodie-gray-dark hover:text-foodie-orange transition-colors"
          >
            <CreditCard className="w-6 h-6" />
            <span className="text-xs mt-1">Payments</span>
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