import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { 
  Package, 
  MapPin, 
  TrendingUp, 
  CheckCircle2, 
  Clock, 
  DollarSign, 
  Bike, 
  Phone, 
  Navigation, 
  AlertCircle,
  RefreshCw,
  ChevronRight,
  ShieldCheck,
  Star
} from "lucide-react";
import DriverLayout from "../../components/DriverLayout";
import { useSocket } from "../../components/banuka/SocketContext";
import { toast } from "react-toastify";

const BASE_URL = import.meta.env.VITE_BASE_URL || "http://localhost:5003";

const DriverDashboard = () => {
  const navigate = useNavigate();
  const socketContext = useSocket();
  const status_update = socketContext?.status_update;

  const [deliveries, setDeliveries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);

  const driver = JSON.parse(localStorage.getItem("driver") || "{}");
  const driverName = driver.firstName || "Partner";
  const token = localStorage.getItem("authToken");

  const fetchDriverDeliveries = useCallback(async () => {
    if (!driver._id) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const res = await axios.get(`${BASE_URL}/deliveries/driver/${driver._id}`, {
        headers: { Authorization: token },
      });
      const data = Array.isArray(res.data) ? res.data : [];
      setDeliveries(data);
    } catch (err) {
      console.error("Error fetching driver deliveries:", err);
    } finally {
      setLoading(false);
    }
  }, [driver._id, token]);

  useEffect(() => {
    fetchDriverDeliveries();

    const handleOrderAccepted = () => {
      console.log("driverOrderAccepted event received in DriverDashboard, refreshing...");
      fetchDriverDeliveries();
    };

    window.addEventListener("driverOrderAccepted", handleOrderAccepted);
    return () => window.removeEventListener("driverOrderAccepted", handleOrderAccepted);
  }, [fetchDriverDeliveries]);

  // Derived metrics
  const activeDeliveries = deliveries.filter(
    (d) => d.deliveryStatus === "assigned" || d.deliveryStatus === "in_progress" || d.deliveryStatus === "picked_up"
  );
  const completedDeliveries = deliveries.filter(
    (d) => d.deliveryStatus === "completed" || d.deliveryStatus === "delivered"
  );

  // Delivery fee earnings estimation (LKR 450 base per delivery + 5% order share)
  const totalEarned = completedDeliveries.reduce((sum, d) => {
    const fee = (d.totalPrice ? d.totalPrice * 0.1 : 0) + 400;
    return sum + fee;
  }, 0);

  // Update status action
  const handleStatusChange = async (delivery, newStatus) => {
    const deliveryId = delivery._id;
    try {
      setUpdatingId(deliveryId);
      await axios.patch(
        `${BASE_URL}/deliveries/${deliveryId}/status`,
        { status: newStatus },
        { headers: { Authorization: token } }
      );

      if (status_update) {
        status_update({
          deliveryId,
          deliveryStatus: newStatus,
          driverId: driver._id,
          customerId: delivery.customerId?._id || delivery.customerId,
        });
      }

      toast.success(
        newStatus === "in_progress"
          ? "Order marked as Picked Up!"
          : "Delivery marked as Completed! Great job! 🎉",
        { position: "top-right", autoClose: 3000 }
      );

      fetchDriverDeliveries();
    } catch (err) {
      console.error("Error updating status:", err);
      toast.error("Failed to update status. Please try again.");
    } finally {
      setUpdatingId(null);
    }
  };

  const currentTask = activeDeliveries[0] || null;

  return (
    <DriverLayout title="Driver Dashboard">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Welcome Header */}
        <div className="bg-gradient-to-r from-orange-500 via-amber-500 to-orange-600 rounded-2xl p-6 sm:p-8 text-white shadow-lg shadow-orange-500/15 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-white/20 backdrop-blur-sm tracking-wider uppercase">
                Active Shift
              </span>
              <span className="text-white/80 text-xs">
                {new Date().toLocaleDateString("en-US", { weekday: "long", month: "short", day: "numeric" })}
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Hello, {driverName}! 🛵
            </h1>
            <p className="text-white/90 text-sm mt-1 max-w-xl">
              You are ready to deliver happiness today. Check your active orders and track your deliveries in real-time.
            </p>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <button
              onClick={() => navigate("/driver/map")}
              className="flex-1 sm:flex-initial flex items-center justify-center gap-2 px-5 py-2.5 bg-white text-orange-600 hover:bg-orange-50 font-bold rounded-xl shadow-md transition-all text-sm"
            >
              <Navigation className="w-4 h-4" />
              <span>Launch GPS Map</span>
            </button>
            <button
              onClick={fetchDriverDeliveries}
              className="p-2.5 bg-white/20 hover:bg-white/30 rounded-xl transition-colors text-white"
              title="Refresh"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
            </button>
          </div>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
          {/* Active Orders */}
          <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-gray-400">Active Tasks</span>
              <div className="w-10 h-10 rounded-xl bg-orange-50 text-orange-600 flex items-center justify-center">
                <Clock className="w-5 h-5" />
              </div>
            </div>
            <div className="mt-3">
              <div className="text-2xl sm:text-3xl font-extrabold text-gray-900">{activeDeliveries.length}</div>
              <p className="text-xs text-orange-600 font-semibold mt-1 flex items-center gap-1">
                {activeDeliveries.length > 0 ? "Requires delivery action" : "All caught up"}
              </p>
            </div>
          </div>

          {/* Completed Orders */}
          <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-gray-400">Completed</span>
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <CheckCircle2 className="w-5 h-5" />
              </div>
            </div>
            <div className="mt-3">
              <div className="text-2xl sm:text-3xl font-extrabold text-gray-900">{completedDeliveries.length}</div>
              <p className="text-xs text-emerald-600 font-semibold mt-1">Delivered safely</p>
            </div>
          </div>

          {/* Estimated Earnings */}
          <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-gray-400">Est. Earnings</span>
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                <DollarSign className="w-5 h-5" />
              </div>
            </div>
            <div className="mt-3">
              <div className="text-2xl sm:text-3xl font-extrabold text-gray-900">
                LKR {totalEarned.toFixed(0)}
              </div>
              <p className="text-xs text-blue-600 font-semibold mt-1">Delivery fees & bonuses</p>
            </div>
          </div>

          {/* Rating */}
          <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-gray-400">Partner Rating</span>
              <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-500 flex items-center justify-center">
                <Star className="w-5 h-5 fill-amber-400" />
              </div>
            </div>
            <div className="mt-3">
              <div className="text-2xl sm:text-3xl font-extrabold text-gray-900">4.9 ★</div>
              <p className="text-xs text-amber-600 font-semibold mt-1">99% On-time delivery</p>
            </div>
          </div>
        </div>

        {/* Current Active Delivery Spotlight */}
        {currentTask ? (
          <div className="bg-white rounded-2xl border-2 border-orange-200 shadow-lg shadow-orange-500/5 p-6 sm:p-7 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-orange-50 rounded-full -mr-12 -mt-12 pointer-events-none" />
            
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-gray-100 pb-4">
              <div className="flex items-center gap-3">
                <span className="w-3 h-3 rounded-full bg-orange-500 animate-pulse"></span>
                <span className="text-xs font-bold uppercase tracking-wider text-orange-600">
                  Active Delivery In Progress
                </span>
                <span className="text-xs bg-gray-100 text-gray-700 px-2 py-0.5 rounded-md font-mono">
                  #{currentTask.orderId || currentTask._id?.slice(-6)}
                </span>
              </div>

              <span className={`px-3 py-1 rounded-full text-xs font-bold capitalize ${
                currentTask.deliveryStatus === "in_progress" 
                  ? "bg-blue-100 text-blue-700" 
                  : "bg-orange-100 text-orange-700"
              }`}>
                {currentTask.deliveryStatus === "in_progress" ? "Picked Up & On The Way" : "Assigned (Proceed to Restaurant)"}
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-6">
              {/* Pickup Restaurant Info */}
              <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                <div className="flex items-center gap-2 text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
                  <span className="w-2 h-2 rounded-full bg-orange-500"></span> Pick-Up Restaurant
                </div>
                <h4 className="text-base font-bold text-gray-900">
                  {currentTask.restaurantId?.name || "Restaurant Partner"}
                </h4>
                <p className="text-xs text-gray-600 mt-1 flex items-start gap-1.5">
                  <MapPin className="w-4 h-4 text-orange-500 shrink-0 mt-0.5" />
                  <span>
                    {currentTask.pickupLocation?.address ||
                      (currentTask.restaurantId?.address
                        ? `${currentTask.restaurantId.address.street || ""}, ${currentTask.restaurantId.address.city || ""}`
                        : "Restaurant Location")}
                  </span>
                </p>
                {currentTask.restaurantId?.phone && (
                  <p className="text-xs text-gray-600 mt-2 flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5 text-gray-400" />
                    <span>{currentTask.restaurantId.phone}</span>
                  </p>
                )}
              </div>

              {/* Drop-off Customer Info */}
              <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                <div className="flex items-center gap-2 text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-500"></span> Drop-Off Customer
                </div>
                <h4 className="text-base font-bold text-gray-900">
                  {currentTask.customerId?.firstName
                    ? `${currentTask.customerId.firstName} ${currentTask.customerId.lastName || ""}`
                    : "Customer"}
                </h4>
                <p className="text-xs text-gray-600 mt-1 flex items-start gap-1.5">
                  <MapPin className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  <span>
                    {currentTask.dropoffLocation?.address ||
                      (currentTask.customerId?.address
                        ? `${currentTask.customerId.address.street || ""}, ${currentTask.customerId.address.city || ""}`
                        : "Customer Address")}
                  </span>
                </p>
                {currentTask.customerId?.phoneNumber && (
                  <p className="text-xs text-gray-600 mt-2 flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5 text-gray-400" />
                    <span>{currentTask.customerId.phoneNumber}</span>
                  </p>
                )}
              </div>
            </div>

            {/* Payment & Action Controls */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-gray-100">
              <div className="text-xs text-gray-600">
                Payment:{" "}
                <span className={`font-bold ${currentTask.paymentMethod === "cash" ? "text-amber-600" : "text-emerald-600"}`}>
                  {currentTask.paymentMethod === "cash"
                    ? `Cash on Delivery (Collect LKR ${currentTask.totalPrice || 0})`
                    : "Prepaid via Card"}
                </span>
              </div>

              <div className="flex items-center gap-3 w-full sm:w-auto">
                <button
                  onClick={() => navigate("/driver/map")}
                  className="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-4 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold rounded-xl text-xs transition-colors"
                >
                  <MapPin className="w-4 h-4 text-orange-500" />
                  <span>Open Route in Map</span>
                </button>

                {currentTask.deliveryStatus === "assigned" && (
                  <button
                    disabled={updatingId === currentTask._id}
                    onClick={() => handleStatusChange(currentTask, "in_progress")}
                    className="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-xs shadow-md transition-all"
                  >
                    <Package className="w-4 h-4" />
                    <span>{updatingId === currentTask._id ? "Updating..." : "Mark as Picked Up"}</span>
                  </button>
                )}

                {currentTask.deliveryStatus === "in_progress" && (
                  <button
                    disabled={updatingId === currentTask._id}
                    onClick={() => handleStatusChange(currentTask, "completed")}
                    className="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs shadow-md transition-all"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>{updatingId === currentTask._id ? "Completing..." : "Complete Delivery"}</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-gray-100 p-8 text-center shadow-sm">
            <div className="w-16 h-16 bg-emerald-50 text-emerald-500 rounded-2xl flex items-center justify-center mx-auto mb-3">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-bold text-gray-900">No Active Deliveries Right Now</h3>
            <p className="text-sm text-gray-500 max-w-md mx-auto mt-1">
              You are all caught up! Keep your status as <strong className="text-emerald-600">Online</strong> to receive new delivery orders as soon as customers place them.
            </p>
          </div>
        )}

        {/* Recent Deliveries Table */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-lg font-bold text-gray-900">Recent Deliveries</h3>
              <p className="text-xs text-gray-400">Past trips and order deliveries</p>
            </div>
            <button
              onClick={() => navigate("/driver/orders")}
              className="text-xs font-bold text-orange-600 hover:text-orange-700 flex items-center gap-1"
            >
              <span>View All</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {deliveries.length === 0 ? (
            <div className="py-8 text-center text-gray-400 text-sm">
              No deliveries recorded yet. Accepted orders will appear here.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-gray-100 text-xs uppercase font-bold text-gray-400">
                    <th className="pb-3">Order ID</th>
                    <th className="pb-3">Restaurant</th>
                    <th className="pb-3">Customer</th>
                    <th className="pb-3">Status</th>
                    <th className="pb-3">Payment</th>
                    <th className="pb-3 text-right">Amount</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {deliveries.slice(0, 5).map((d) => (
                    <tr key={d._id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="py-3 font-mono text-xs font-bold text-gray-800">
                        #{d.orderId || d._id?.slice(-6)}
                      </td>
                      <td className="py-3 text-gray-700 font-medium">
                        {d.restaurantId?.name || "Restaurant"}
                      </td>
                      <td className="py-3 text-gray-600">
                        {d.customerId?.firstName || "Customer"}
                      </td>
                      <td className="py-3">
                        <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold capitalize ${
                          d.deliveryStatus === "completed" || d.deliveryStatus === "delivered"
                            ? "bg-emerald-50 text-emerald-700"
                            : d.deliveryStatus === "in_progress"
                            ? "bg-blue-50 text-blue-700"
                            : "bg-orange-50 text-orange-700"
                        }`}>
                          {d.deliveryStatus || "assigned"}
                        </span>
                      </td>
                      <td className="py-3 text-xs uppercase text-gray-500">
                        {d.paymentMethod || "cash"}
                      </td>
                      <td className="py-3 text-right font-bold text-gray-900">
                        LKR {d.totalPrice || 0}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Safety & Delivery Guidelines Card */}
        <div className="bg-gradient-to-r from-gray-900 to-gray-800 rounded-2xl p-6 text-white flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-orange-500/20 text-orange-400 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-base">Delivery Partner Best Practices</h4>
              <p className="text-gray-300 text-xs mt-1 max-w-xl">
                Always ensure thermal delivery bag closure, handle food containers upright, verify customer name upon handover, and drive safely following local traffic rules.
              </p>
            </div>
          </div>
          <button
            onClick={() => navigate("/driver/profile")}
            className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-bold transition-colors whitespace-nowrap"
          >
            Driver Profile
          </button>
        </div>
      </div>
    </DriverLayout>
  );
};

export default DriverDashboard;
