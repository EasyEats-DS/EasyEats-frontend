import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { 
  Package, 
  MapPin, 
  Clock, 
  CheckCircle2, 
  Phone, 
  Search, 
  Filter, 
  Navigation, 
  DollarSign, 
  RefreshCw,
  ShoppingBag,
  AlertCircle
} from "lucide-react";
import DriverLayout from "../../components/DriverLayout";
import { useSocket } from "../../components/banuka/SocketContext";
import { toast } from "react-toastify";

const BASE_URL = import.meta.env.VITE_BASE_URL || "http://localhost:5003";

const DriverOrders = () => {
  const navigate = useNavigate();
  const socketContext = useSocket();
  const status_update = socketContext?.status_update;

  const [deliveries, setDeliveries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("all"); // 'all' | 'active' | 'in_progress' | 'completed'
  const [searchQuery, setSearchQuery] = useState("");
  const [updatingId, setUpdatingId] = useState(null);

  const driver = JSON.parse(localStorage.getItem("driver") || "{}");
  const token = localStorage.getItem("authToken");

  const fetchDeliveries = useCallback(async () => {
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
      toast.error("Unable to load deliveries.");
    } finally {
      setLoading(false);
    }
  }, [driver._id, token]);

  useEffect(() => {
    fetchDeliveries();

    const handleOrderAccepted = () => {
      console.log("driverOrderAccepted event received in DriverOrders, refreshing...");
      fetchDeliveries();
    };

    window.addEventListener("driverOrderAccepted", handleOrderAccepted);
    return () => window.removeEventListener("driverOrderAccepted", handleOrderAccepted);
  }, [fetchDeliveries]);

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
          ? "Status updated: Order Picked Up!"
          : "Status updated: Delivery Completed! 🎉",
        { position: "top-right", autoClose: 3000 }
      );

      fetchDeliveries();
    } catch (err) {
      console.error("Error updating status:", err);
      toast.error("Failed to update status.");
    } finally {
      setUpdatingId(null);
    }
  };

  // Filter deliveries
  const filteredDeliveries = deliveries.filter((d) => {
    // Tab filter
    if (activeTab === "active") {
      if (d.deliveryStatus !== "assigned") return false;
    } else if (activeTab === "in_progress") {
      if (d.deliveryStatus !== "in_progress" && d.deliveryStatus !== "picked_up") return false;
    } else if (activeTab === "completed") {
      if (d.deliveryStatus !== "completed" && d.deliveryStatus !== "delivered") return false;
    }

    // Search query filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const orderId = (d.orderId || d._id || "").toLowerCase();
      const restName = (d.restaurantId?.name || "").toLowerCase();
      const custName = (
        (d.customerId?.firstName || "") + " " + (d.customerId?.lastName || "")
      ).toLowerCase();
      return orderId.includes(q) || restName.includes(q) || custName.includes(q);
    }

    return true;
  });

  const countActive = deliveries.filter((d) => d.deliveryStatus === "assigned").length;
  const countInProgress = deliveries.filter(
    (d) => d.deliveryStatus === "in_progress" || d.deliveryStatus === "picked_up"
  ).length;
  const countCompleted = deliveries.filter(
    (d) => d.deliveryStatus === "completed" || d.deliveryStatus === "delivered"
  ).length;

  return (
    <DriverLayout title="My Deliveries & Orders">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Top Filter and Search Bar */}
        <div className="bg-white rounded-2xl border border-gray-100 p-4 sm:p-5 shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
            {/* Search Input */}
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search by Order ID, restaurant, customer..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-orange-500 focus:bg-white transition-all"
              />
            </div>

            {/* Refresh Button */}
            <button
              onClick={fetchDeliveries}
              className="flex items-center justify-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl text-xs font-bold transition-colors"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
              <span>Refresh Orders</span>
            </button>
          </div>

          {/* Filter Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
            <button
              onClick={() => setActiveTab("all")}
              className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                activeTab === "all"
                  ? "bg-gray-900 text-white shadow-sm"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              All Deliveries ({deliveries.length})
            </button>
            <button
              onClick={() => setActiveTab("active")}
              className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1.5 ${
                activeTab === "active"
                  ? "bg-orange-500 text-white shadow-md shadow-orange-500/20"
                  : "bg-orange-50 text-orange-700 hover:bg-orange-100"
              }`}
            >
              <span>Assigned</span>
              <span className={`px-1.5 py-0.2 rounded-full text-[10px] ${activeTab === "active" ? "bg-white text-orange-600" : "bg-orange-200 text-orange-800"}`}>
                {countActive}
              </span>
            </button>
            <button
              onClick={() => setActiveTab("in_progress")}
              className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1.5 ${
                activeTab === "in_progress"
                  ? "bg-blue-600 text-white shadow-md shadow-blue-600/20"
                  : "bg-blue-50 text-blue-700 hover:bg-blue-100"
              }`}
            >
              <span>In Progress</span>
              <span className={`px-1.5 py-0.2 rounded-full text-[10px] ${activeTab === "in_progress" ? "bg-white text-blue-600" : "bg-blue-200 text-blue-800"}`}>
                {countInProgress}
              </span>
            </button>
            <button
              onClick={() => setActiveTab("completed")}
              className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1.5 ${
                activeTab === "completed"
                  ? "bg-emerald-600 text-white shadow-md shadow-emerald-600/20"
                  : "bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
              }`}
            >
              <span>Delivered</span>
              <span className={`px-1.5 py-0.2 rounded-full text-[10px] ${activeTab === "completed" ? "bg-white text-emerald-600" : "bg-emerald-200 text-emerald-800"}`}>
                {countCompleted}
              </span>
            </button>
          </div>
        </div>

        {/* Deliveries List */}
        {loading ? (
          <div className="py-16 text-center">
            <div className="w-10 h-10 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
            <p className="text-gray-500 text-sm">Loading your deliveries...</p>
          </div>
        ) : filteredDeliveries.length === 0 ? (
          <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center shadow-sm">
            <div className="w-16 h-16 bg-gray-100 text-gray-400 rounded-2xl flex items-center justify-center mx-auto mb-3">
              <Package className="w-8 h-8" />
            </div>
            <h3 className="text-base font-bold text-gray-900">No deliveries found</h3>
            <p className="text-xs text-gray-500 mt-1 max-w-sm mx-auto">
              {searchQuery
                ? `No orders matching "${searchQuery}". Try a different keyword.`
                : "No deliveries recorded in this category yet."}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-5">
            {filteredDeliveries.map((delivery) => {
              const isAssigned = delivery.deliveryStatus === "assigned";
              const isInProgress = delivery.deliveryStatus === "in_progress" || delivery.deliveryStatus === "picked_up";
              const isCompleted = delivery.deliveryStatus === "completed" || delivery.deliveryStatus === "delivered";

              return (
                <div
                  key={delivery._id}
                  className={`bg-white rounded-2xl border p-5 sm:p-6 transition-all hover:shadow-md ${
                    isAssigned
                      ? "border-orange-300 shadow-sm"
                      : isInProgress
                      ? "border-blue-300 shadow-sm"
                      : "border-gray-200"
                  }`}
                >
                  {/* Card Header */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-gray-100">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm ${
                        isCompleted
                          ? "bg-emerald-100 text-emerald-700"
                          : isInProgress
                          ? "bg-blue-100 text-blue-700"
                          : "bg-orange-100 text-orange-700"
                      }`}>
                        <Package className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-bold text-sm text-gray-900">
                            #{delivery.orderId || delivery._id?.slice(-6)}
                          </span>
                          <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider ${
                            isCompleted
                              ? "bg-emerald-100 text-emerald-700"
                              : isInProgress
                              ? "bg-blue-100 text-blue-700"
                              : "bg-orange-100 text-orange-700"
                          }`}>
                            {delivery.deliveryStatus || "assigned"}
                          </span>
                        </div>
                        <p className="text-[11px] text-gray-400 mt-0.5">
                          {delivery.createdAt ? new Date(delivery.createdAt).toLocaleString() : "Recent"}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="text-xs text-gray-500">
                        Payment: <strong className="uppercase text-gray-800">{delivery.paymentMethod || "cash"}</strong>
                      </span>
                      <span className="text-base font-extrabold text-gray-900">
                        LKR {delivery.totalPrice || 0}
                      </span>
                    </div>
                  </div>

                  {/* Pickup & Dropoff Routing Info */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-4">
                    {/* Pickup Restaurant */}
                    <div className="bg-gray-50/70 p-3.5 rounded-xl border border-gray-100">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-orange-600 block mb-1">
                        🏬 Pickup From:
                      </span>
                      <h4 className="font-bold text-sm text-gray-900">
                        {delivery.restaurantId?.name || "Restaurant"}
                      </h4>
                      <p className="text-xs text-gray-600 mt-0.5 flex items-start gap-1">
                        <MapPin className="w-3.5 h-3.5 text-orange-500 shrink-0 mt-0.5" />
                        <span>
                          {delivery.pickupLocation?.address ||
                            (delivery.restaurantId?.address
                              ? `${delivery.restaurantId.address.street || ""}, ${delivery.restaurantId.address.city || ""}`
                              : "Restaurant Address")}
                        </span>
                      </p>
                    </div>

                    {/* Dropoff Customer */}
                    <div className="bg-gray-50/70 p-3.5 rounded-xl border border-gray-100">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600 block mb-1">
                        🏠 Deliver To:
                      </span>
                      <h4 className="font-bold text-sm text-gray-900">
                        {delivery.customerId?.firstName
                          ? `${delivery.customerId.firstName} ${delivery.customerId.lastName || ""}`
                          : "Customer"}
                      </h4>
                      <p className="text-xs text-gray-600 mt-0.5 flex items-start gap-1">
                        <MapPin className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                        <span>
                          {delivery.dropoffLocation?.address ||
                            (delivery.customerId?.address
                              ? `${delivery.customerId.address.street || ""}, ${delivery.customerId.address.city || ""}`
                              : "Customer Address")}
                        </span>
                      </p>
                      {delivery.customerId?.phoneNumber && (
                        <p className="text-xs text-gray-600 mt-1 flex items-center gap-1">
                          <Phone className="w-3.5 h-3.5 text-gray-400" />
                          <span>{delivery.customerId.phoneNumber}</span>
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Order Products Preview */}
                  {delivery.products && delivery.products.length > 0 && (
                    <div className="bg-gray-50/50 p-3 rounded-xl border border-gray-100 mb-4">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 block mb-1.5 flex items-center gap-1">
                        <ShoppingBag className="w-3.5 h-3.5" /> Order Items ({delivery.products.length})
                      </span>
                      <div className="flex flex-wrap gap-2">
                        {delivery.products.map((item, idx) => (
                          <span
                            key={idx}
                            className="text-xs bg-white border border-gray-200 px-2.5 py-1 rounded-lg text-gray-700 font-medium"
                          >
                            {item.quantity}x Dish (#{item.productId?.slice(-4) || item.productId})
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Card Actions */}
                  <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-gray-100">
                    <button
                      onClick={() => navigate("/driver/map")}
                      className="flex items-center gap-1.5 text-xs font-bold text-orange-600 hover:text-orange-700 transition-colors"
                    >
                      <Navigation className="w-3.5 h-3.5" />
                      <span>Open in Navigation Map</span>
                    </button>

                    <div className="flex items-center gap-2">
                      {isAssigned && (
                        <button
                          disabled={updatingId === delivery._id}
                          onClick={() => handleStatusChange(delivery, "in_progress")}
                          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-sm transition-all flex items-center gap-1.5"
                        >
                          <Package className="w-3.5 h-3.5" />
                          <span>{updatingId === delivery._id ? "Updating..." : "Mark as Picked Up"}</span>
                        </button>
                      )}

                      {isInProgress && (
                        <button
                          disabled={updatingId === delivery._id}
                          onClick={() => handleStatusChange(delivery, "completed")}
                          className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-sm transition-all flex items-center gap-1.5"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>{updatingId === delivery._id ? "Completing..." : "Complete Delivery"}</span>
                        </button>
                      )}

                      {isCompleted && (
                        <span className="text-xs font-bold text-emerald-600 flex items-center gap-1">
                          <CheckCircle2 className="w-4 h-4" /> Delivered & Closed
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </DriverLayout>
  );
};

export default DriverOrders;
