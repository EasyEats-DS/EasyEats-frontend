import React, { useState } from "react";
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Bike, 
  ShieldCheck, 
  Star, 
  Calendar, 
  Power, 
  LogOut,
  Award,
  CheckCircle2
} from "lucide-react";
import DriverLayout from "../../components/DriverLayout";
import { clearAuthSession } from "../../lib/auth";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const DriverProfile = () => {
  const navigate = useNavigate();
  const driver = JSON.parse(localStorage.getItem("driver") || "{}");

  const [isOnline, setIsOnline] = useState(() => {
    return localStorage.getItem("driverOnlineStatus") !== "offline";
  });

  const toggleStatus = () => {
    const nextStatus = !isOnline;
    setIsOnline(nextStatus);
    localStorage.setItem("driverOnlineStatus", nextStatus ? "online" : "offline");
    if (nextStatus) {
      toast.success("Online status activated!");
    } else {
      toast.info("Offline status activated.");
    }
  };

  const handleLogout = () => {
    clearAuthSession();
    toast.info("Signed out successfully.");
    navigate("/login");
  };

  return (
    <DriverLayout title="Driver Partner Profile">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Profile Header Card */}
        <div className="bg-white rounded-2xl border border-gray-100 p-6 sm:p-8 shadow-sm flex flex-col sm:flex-row items-center sm:items-start gap-6">
          <div className="w-24 h-24 rounded-2xl bg-gradient-to-tr from-orange-500 to-amber-400 text-white font-extrabold text-3xl flex items-center justify-center shadow-lg shadow-orange-500/20 shrink-0">
            {driver.firstName ? driver.firstName.charAt(0) : "D"}
          </div>

          <div className="flex-1 text-center sm:text-left">
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 mb-1">
              <h2 className="text-2xl font-extrabold text-gray-900">
                {driver.firstName} {driver.lastName || ""}
              </h2>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" /> Verified Partner
              </span>
            </div>

            <p className="text-xs text-gray-500 flex items-center justify-center sm:justify-start gap-1.5 mt-0.5">
              <span>Partner ID:</span>
              <span className="font-mono text-gray-800 font-semibold">{driver._id || "DRV-1024"}</span>
            </p>

            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4 mt-4 pt-4 border-t border-gray-100 text-xs text-gray-600">
              <span className="flex items-center gap-1.5">
                <Mail className="w-4 h-4 text-orange-500" />
                <span>{driver.email || "driver@easyeats.com"}</span>
              </span>
              <span className="flex items-center gap-1.5">
                <Phone className="w-4 h-4 text-orange-500" />
                <span>{driver.phoneNumber || "+94 77 123 4567"}</span>
              </span>
            </div>
          </div>

          <div className="flex sm:flex-col items-center gap-2 w-full sm:w-auto">
            <button
              onClick={toggleStatus}
              className={`w-full px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                isOnline
                  ? "bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              <Power className="w-3.5 h-3.5" />
              <span>{isOnline ? "Status: Online" : "Status: Offline"}</span>
            </button>
          </div>
        </div>

        {/* Vehicle & Assignment Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Vehicle Information */}
          <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-orange-50 text-orange-600 flex items-center justify-center">
                <Bike className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-gray-900 text-base">Vehicle & Equipment</h3>
                <p className="text-xs text-gray-400">Registered transport details</p>
              </div>
            </div>

            <div className="space-y-3 text-xs">
              <div className="flex justify-between py-2 border-b border-gray-50">
                <span className="text-gray-500">Vehicle Type</span>
                <span className="font-bold text-gray-800">Motorcycle / Scooter</span>
              </div>
              <div className="flex justify-between py-2 border-b border-gray-50">
                <span className="text-gray-500">License Plate</span>
                <span className="font-mono font-bold text-gray-800">WP BCD-4821</span>
              </div>
              <div className="flex justify-between py-2 border-b border-gray-50">
                <span className="text-gray-500">Delivery Bag</span>
                <span className="font-bold text-emerald-600 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Certified Thermal Bag
                </span>
              </div>
              <div className="flex justify-between py-2">
                <span className="text-gray-500">Operating Zone</span>
                <span className="font-bold text-gray-800">Colombo & Western Province</span>
              </div>
            </div>
          </div>

          {/* Performance & Badges */}
          <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-500 flex items-center justify-center">
                <Award className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-gray-900 text-base">Partner Performance</h3>
                <p className="text-xs text-gray-400">Quality and satisfaction rating</p>
              </div>
            </div>

            <div className="space-y-3 text-xs">
              <div className="flex justify-between py-2 border-b border-gray-50">
                <span className="text-gray-500">Customer Rating</span>
                <span className="font-bold text-amber-600 flex items-center gap-1">
                  <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-500" /> 4.9 / 5.0
                </span>
              </div>
              <div className="flex justify-between py-2 border-b border-gray-50">
                <span className="text-gray-500">Acceptance Rate</span>
                <span className="font-bold text-emerald-600">98% High Priority</span>
              </div>
              <div className="flex justify-between py-2 border-b border-gray-50">
                <span className="text-gray-500">On-Time Handover</span>
                <span className="font-bold text-blue-600">99.2% Flawless</span>
              </div>
              <div className="flex justify-between py-2">
                <span className="text-gray-500">Delivery Tier</span>
                <span className="font-bold text-orange-600">Gold Partner Tier</span>
              </div>
            </div>
          </div>
        </div>

        {/* Security & Sign Out Section */}
        <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <h4 className="font-bold text-sm text-gray-900">Session Security</h4>
            <p className="text-xs text-gray-500 mt-0.5">
              To secure your driver account, sign out when completing your daily deliveries.
            </p>
          </div>
          <button
            onClick={handleLogout}
            className="w-full sm:w-auto px-5 py-2.5 bg-rose-50 hover:bg-rose-100 text-rose-600 font-bold rounded-xl text-xs transition-colors flex items-center justify-center gap-2"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out of Driver Account</span>
          </button>
        </div>
      </div>
    </DriverLayout>
  );
};

export default DriverProfile;
