import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Home, Search, ShoppingCart, User, CreditCard, Store, Map as MapIcon, Package, Truck } from "lucide-react";
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

/**
 * The shell every customer and driver page sits in.
 *
 * Navigation exists twice on purpose: a horizontal bar in the header from `lg`
 * up, and a fixed bottom bar below it. Only one is ever visible -- showing both
 * was why desktop had a stray mobile tab bar pinned to the bottom of the window.
 */
const UserLayout = ({ children, title }) => {
  const navigate = useNavigate();
  const [isCartOpen, setIsCartOpen] = useState(false);

  const user = getCurrentUser();
  const role = user?.role;
  const navItems = navItemsForRole(role);
  const canShop = showsCart(role);
  const homeLink = homeRouteForRole(role);

  // A drawer that covers the screen on a phone has to be dismissable without
  // hunting for the close button.
  useEffect(() => {
    if (!isCartOpen) return undefined;

    const onKeyDown = (event) => {
      if (event.key === "Escape") setIsCartOpen(false);
    };

    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [isCartOpen]);

  return (
    <div className="flex min-h-screen flex-col bg-gray-50">
      {/* Header */}
      <header className="sticky top-0 z-20 bg-white shadow-sm">
        <div className="container mx-auto grid max-w-6xl grid-cols-[1fr_auto] items-center gap-3 px-4 py-3 sm:py-4 lg:grid-cols-[1fr_auto_1fr]">
          <div className="flex min-w-0 items-center gap-2">
            <h1
              className="cursor-pointer truncate text-lg font-bold text-gradient sm:text-xl"
              onClick={() => navigate(homeLink)}
            >
              {title || "EasyEats"}
            </h1>
          </div>

          <div className="hidden items-center justify-center gap-6 lg:flex">
            {navItems.map((item) => (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className="whitespace-nowrap text-foodie-charcoal transition-colors hover:text-foodie-orange"
              >
                {item.label}
              </button>
            ))}
          </div>

          <div className="flex items-center justify-end gap-1 sm:gap-2">
            {canShop && (
              <>
                <button
                  aria-label="Search"
                  onClick={() => navigate("/search")}
                  className="rounded-full p-2 text-foodie-charcoal transition-colors hover:bg-gray-100"
                >
                  <Search className="h-6 w-6" />
                </button>
                <button
                  aria-label="Cart"
                  onClick={() => setIsCartOpen(true)}
                  className="relative rounded-full p-2 text-foodie-charcoal transition-colors hover:bg-gray-100"
                >
                  <ShoppingCart className="h-6 w-6" />
                </button>
              </>
            )}
            <button
              aria-label="Profile"
              onClick={() => navigate("/profile")}
              className="rounded-full p-2 text-foodie-charcoal transition-colors hover:bg-gray-100"
            >
              <User className="h-6 w-6" />
            </button>
          </div>
        </div>
      </header>

      {/* Main content. The extra bottom padding keeps the last element clear of
          the fixed mobile tab bar, which would otherwise sit on top of it. */}
      <main className="container mx-auto w-full max-w-6xl flex-grow px-4 py-6 pb-28 lg:pb-6">
        {children}
      </main>

      {canShop && (
        <>
          <div
            aria-hidden="true"
            onClick={() => setIsCartOpen(false)}
            className={`fixed inset-0 z-40 bg-black/50 transition-opacity ${
              isCartOpen ? "opacity-100" : "pointer-events-none opacity-0"
            }`}
          />
          <div
            className={`fixed top-0 right-0 z-50 flex h-full w-full max-w-sm transform flex-col bg-white shadow-lg transition-transform duration-300 ${
              isCartOpen ? "translate-x-0" : "translate-x-full"
            }`}
          >
            <div className="flex justify-end p-4">
              <button
                aria-label="Close cart"
                onClick={() => setIsCartOpen(false)}
                className="text-2xl text-gray-600 hover:text-gray-900"
              >
                ×
              </button>
            </div>
            <div className="flex-1 overflow-y-auto">
              <Cart />
            </div>
          </div>
        </>
      )}

      {/* Mobile navigation: the header's own nav takes over from `lg` up. */}
      <nav className="fixed bottom-0 left-0 right-0 z-20 bg-white shadow-[0_-4px_10px_rgba(0,0,0,0.05)] lg:hidden">
        <div className="flex justify-around overflow-x-auto py-2">
          {navItems.map((item) => {
            const Icon = NAV_ICONS[item.icon] ?? Home;
            return (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className="flex min-w-[4rem] flex-col items-center px-1 py-1 text-foodie-gray-dark transition-colors hover:text-foodie-orange"
              >
                <Icon className="h-6 w-6" />
                <span className="mt-1 text-[11px] leading-tight sm:text-xs">{item.label}</span>
              </button>
            );
          })}
          {canShop && (
            <button
              onClick={() => setIsCartOpen(true)}
              className="flex min-w-[4rem] flex-col items-center px-1 py-1 text-foodie-gray-dark transition-colors hover:text-foodie-orange"
            >
              <ShoppingCart className="h-6 w-6" />
              <span className="mt-1 text-[11px] leading-tight sm:text-xs">Cart</span>
            </button>
          )}
          <button
            onClick={() => navigate("/profile")}
            className="flex min-w-[4rem] flex-col items-center px-1 py-1 text-foodie-gray-dark transition-colors hover:text-foodie-orange"
          >
            <User className="h-6 w-6" />
            <span className="mt-1 text-[11px] leading-tight sm:text-xs">Profile</span>
          </button>
        </div>
      </nav>
    </div>
  );
};

export default UserLayout;
