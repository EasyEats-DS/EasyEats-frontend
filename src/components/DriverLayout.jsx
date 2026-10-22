import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { 
  LayoutDashboard, 
  MapPin, 
  Package, 
  DollarSign, 
  User, 
  LogOut, 
  Menu as MenuIcon, 
  X, 
  Bike,
  Power,
  Bell,
  ShieldCheck
} from "lucide-react";
import { clearAuthSession } from "../lib/auth";
import { toast } from "react-toastify";

const DriverLayout = ({ children, title = "Driver Portal" }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isOnline, setIsOnline] = useState(() => {
    return localStorage.getItem("driverOnlineStatus") !== "offline";
  });
  const navigate = useNavigate();
  const location = useLocation();

  const driverData = JSON.parse(localStorage.getItem("driver") || "{}");
  const driverName = driverData.firstName 
    ? `${driverData.firstName} ${driverData.lastName || ""}` 
    : "Delivery Partner";

  const toggleOnlineStatus = () => {
    const nextStatus = !isOnline;
    setIsOnline(nextStatus);
    localStorage.setItem("driverOnlineStatus", nextStatus ? "online" : "offline");
    if (nextStatus) {
      toast.success("You are now ONLINE. You will receive new delivery requests!", {
        position: "top-right",
        autoClose: 2500,
      });
    } else {
      toast.info("You are now OFFLINE. New delivery requests paused.", {
        position: "top-right",
        autoClose: 2500,
      });
    }
  };

  const handleLogout = () => {
    clearAuthSession();
    toast.info("Logged out successfully.", { autoClose: 2000 });
    navigate("/login");
  };

  const navItems = [
    { label: "Dashboard", path: "/driver/dashboard", icon: LayoutDashboard },
    { label: "My Deliveries", path: "/driver/orders", icon: Package },
    { label: "Live Map & GPS", path: "/driver/map", icon: MapPin },
    { label: "My Earnings", path: "/driver/earnings", icon: DollarSign },
    { label: "Driver Profile", path: "/driver/profile", icon: User },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <div className="flex h-screen bg-gray-50 font-sans text-gray-800 antialiased overflow-hidden">
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex flex-col w-64 bg-white border-r border-gray-200 z-20 shadow-sm">
        {/* Brand Header */}
        <div className="p-5 border-b border-gray-100 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-orange-500 to-amber-400 flex items-center justify-center text-white shadow-md shadow-orange-500/20">
              <Bike className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-lg font-bold bg-gradient-to-r from-orange-600 to-amber-500 bg-clip-text text-transparent leading-none">
                EasyEats
              </h1>
              <span className="text-[11px] font-semibold text-gray-400 tracking-wider uppercase">
                Driver Partner
              </span>
            </div>
          </div>
        </div>

        {/* Driver Quick Status Card */}
        <div className="p-4 mx-3 my-3 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl border border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className={`relative flex h-3 w-3`}>
                {isOnline && (
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                )}
                <span className={`relative inline-flex rounded-full h-3 w-3 ${isOnline ? "bg-emerald-500" : "bg-gray-400"}`}></span>
              </span>
              <span className="text-xs font-bold text-gray-700">
                {isOnline ? "Online & Ready" : "Offline / On Break"}
              </span>
            </div>
            <button
              onClick={toggleOnlineStatus}
              className={`p-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 transition-all ${
                isOnline 
                  ? "bg-emerald-100 text-emerald-700 hover:bg-emerald-200" 
                  : "bg-gray-200 text-gray-600 hover:bg-gray-300"
              }`}
              title="Toggle Online Status"
            >
              <Power className="w-3.5 h-3.5" />
            </button>
          </div>
          <p className="text-[11px] text-gray-500 mt-1.5">
            {isOnline ? "Receiving new delivery alerts" : "Orders paused"}
          </p>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 px-3 py-2 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const active = isActive(item.path);
            const Icon = item.icon;
            return (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  active
                    ? "bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-md shadow-orange-500/20 font-semibold"
                    : "text-gray-600 hover:text-orange-600 hover:bg-orange-50"
                }`}
              >
                <Icon className={`w-5 h-5 ${active ? "text-white" : "text-gray-400 group-hover:text-orange-500"}`} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Driver Profile & Logout Footer */}
        <div className="p-4 border-t border-gray-100 bg-white">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2.5 overflow-hidden">
              <div className="w-9 h-9 rounded-full bg-orange-100 text-orange-600 font-bold flex items-center justify-center text-sm shrink-0">
                {driverName.charAt(0)}
              </div>
              <div className="truncate">
                <p className="text-xs font-bold text-gray-800 truncate">{driverName}</p>
                <span className="text-[11px] text-emerald-600 font-medium flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3" /> Verified Driver
                </span>
              </div>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 px-3 py-2 text-xs font-semibold text-rose-600 bg-rose-50 hover:bg-rose-100 rounded-lg transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Mobile Drawer Backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40 md:hidden backdrop-blur-sm"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Mobile Drawer */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-72 bg-white shadow-2xl transform transition-transform duration-300 ease-in-out md:hidden flex flex-col ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="p-4 border-b border-gray-100 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-lg bg-orange-500 text-white flex items-center justify-center">
              <Bike className="w-5 h-5" />
            </div>
            <h1 className="text-base font-bold text-gray-900">EasyEats Driver</h1>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="p-1.5 rounded-lg text-gray-400 hover:bg-gray-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const active = isActive(item.path);
            const Icon = item.icon;
            return (
              <button
                key={item.path}
                onClick={() => {
                  navigate(item.path);
                  setSidebarOpen(false);
                }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium ${
                  active
                    ? "bg-orange-500 text-white font-semibold shadow-md"
                    : "text-gray-600 hover:bg-orange-50 hover:text-orange-600"
                }`}
              >
                <Icon className="w-5 h-5" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        <div className="p-4 border-t border-gray-100">
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 py-2.5 text-sm font-semibold text-rose-600 bg-rose-50 rounded-xl"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        {/* Top Navbar */}
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-4 sm:px-6 shrink-0 z-10">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="md:hidden p-2 rounded-lg text-gray-600 hover:bg-gray-100"
            >
              <MenuIcon className="w-5 h-5" />
            </button>
            <h2 className="text-lg font-bold text-gray-900 truncate">{title}</h2>
          </div>

          <div className="flex items-center gap-3">
            {/* Quick Online Status Badge */}
            <button
              onClick={toggleOnlineStatus}
              className={`hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold border transition-all ${
                isOnline
                  ? "bg-emerald-50 border-emerald-300 text-emerald-700"
                  : "bg-gray-100 border-gray-300 text-gray-600"
              }`}
            >
              <span className={`w-2 h-2 rounded-full ${isOnline ? "bg-emerald-500" : "bg-gray-400"}`}></span>
              <span>{isOnline ? "Online" : "Offline"}</span>
            </button>

            {/* Quick Map Link */}
            <button
              onClick={() => navigate("/driver/map")}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-orange-50 hover:bg-orange-100 text-orange-600 rounded-lg text-xs font-bold transition-colors"
            >
              <MapPin className="w-4 h-4" />
              <span className="hidden sm:inline">Live Map</span>
            </button>

            {/* Profile Avatar */}
            <button
              onClick={() => navigate("/driver/profile")}
              className="w-9 h-9 rounded-full bg-gradient-to-tr from-orange-400 to-amber-500 text-white font-bold text-sm flex items-center justify-center shadow-sm"
              title="View Profile"
            >
              {driverName.charAt(0)}
            </button>
          </div>
        </header>

        {/* Scrollable Page Body */}
        <main className="flex-1 overflow-y-auto bg-gray-50/70 p-4 sm:p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
};

export default DriverLayout;
