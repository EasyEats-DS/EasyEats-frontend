import React, { useState, useEffect } from "react";
import axios from "axios";
import { 
  DollarSign, 
  TrendingUp, 
  CheckCircle2, 
  Calendar, 
  Wallet, 
  CreditCard, 
  Banknote, 
  ArrowUpRight,
  ShieldCheck,
  Bike
} from "lucide-react";
import DriverLayout from "../../components/DriverLayout";

const BASE_URL = import.meta.env.VITE_BASE_URL || "http://localhost:5003";

const DriverEarnings = () => {
  const [deliveries, setDeliveries] = useState([]);
  const [loading, setLoading] = useState(true);

  const driver = JSON.parse(localStorage.getItem("driver") || "{}");
  const token = localStorage.getItem("authToken");

  useEffect(() => {
    const fetchEarnings = async () => {
      if (!driver._id) return;
      try {
        setLoading(true);
        const res = await axios.get(`${BASE_URL}/deliveries/driver/${driver._id}`, {
          headers: { Authorization: token },
        });
        setDeliveries(Array.isArray(res.data) ? res.data : []);
      } catch (err) {
        console.error("Error fetching deliveries for earnings:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchEarnings();
  }, [driver._id, token]);

  const completed = deliveries.filter(
    (d) => d.deliveryStatus === "completed" || d.deliveryStatus === "delivered"
  );

  // Delivery fee payout calculation: LKR 450 per completed trip + 5% platform bonus
  const totalPayout = completed.reduce((sum, d) => sum + 450 + (d.totalPrice ? d.totalPrice * 0.05 : 0), 0);

  // Total cash collected from customers on COD orders
  const cashCollected = completed
    .filter((d) => (d.paymentMethod || "cash").toLowerCase() === "cash")
    .reduce((sum, d) => sum + (d.totalPrice || 0), 0);

  // Total online/card paid orders handled
  const cardOrdersValue = completed
    .filter((d) => (d.paymentMethod || "").toLowerCase() === "card")
    .reduce((sum, d) => sum + (d.totalPrice || 0), 0);

  return (
    <DriverLayout title="Driver Earnings & Payouts">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Earnings Banner */}
        <div className="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 rounded-2xl p-6 sm:p-8 text-white shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div>
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-white/10 text-orange-400 tracking-wider uppercase mb-2 inline-block">
              Total Partner Payout
            </span>
            <div className="text-3xl sm:text-4xl font-black mt-1">
              LKR {totalPayout.toFixed(0)}
            </div>
            <p className="text-gray-400 text-xs sm:text-sm mt-1">
              Earned across {completed.length} successfully delivered orders
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full md:w-auto">
            <div className="bg-white/5 border border-white/10 rounded-xl p-3.5 text-center min-w-[140px]">
              <span className="text-[11px] text-gray-400 font-bold uppercase">Avg. Per Trip</span>
              <div className="text-lg font-extrabold text-orange-400 mt-0.5">
                LKR {completed.length > 0 ? (totalPayout / completed.length).toFixed(0) : "450"}
              </div>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-xl p-3.5 text-center min-w-[140px]">
              <span className="text-[11px] text-gray-400 font-bold uppercase">Settlement</span>
              <div className="text-lg font-extrabold text-emerald-400 mt-0.5">Weekly Auto</div>
            </div>
          </div>
        </div>

        {/* 3 Metric Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* Total Delivery Fees */}
          <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-gray-400">Delivery Fees</span>
              <div className="w-10 h-10 rounded-xl bg-orange-50 text-orange-600 flex items-center justify-center">
                <Wallet className="w-5 h-5" />
              </div>
            </div>
            <div className="mt-3">
              <div className="text-2xl font-extrabold text-gray-900">
                LKR {(completed.length * 450).toFixed(0)}
              </div>
              <p className="text-xs text-gray-500 mt-1">LKR 450 base per completed trip</p>
            </div>
          </div>

          {/* Cash Collected on Delivery */}
          <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-gray-400">Cash Handled (COD)</span>
              <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
                <Banknote className="w-5 h-5" />
              </div>
            </div>
            <div className="mt-3">
              <div className="text-2xl font-extrabold text-amber-600">
                LKR {cashCollected.toFixed(0)}
              </div>
              <p className="text-xs text-gray-500 mt-1">Cash received from customers</p>
            </div>
          </div>

          {/* Digital Payments Value */}
          <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-gray-400">Digital / Card Handled</span>
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                <CreditCard className="w-5 h-5" />
              </div>
            </div>
            <div className="mt-3">
              <div className="text-2xl font-extrabold text-blue-600">
                LKR {cardOrdersValue.toFixed(0)}
              </div>
              <p className="text-xs text-gray-500 mt-1">Prepaid directly by customers</p>
            </div>
          </div>
        </div>

        {/* Trips & Payout History */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-lg font-bold text-gray-900">Trip Earnings Breakdown</h3>
              <p className="text-xs text-gray-400">Individual fee breakdown per completed delivery</p>
            </div>
            <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full">
              {completed.length} Completed
            </span>
          </div>

          {completed.length === 0 ? (
            <div className="py-12 text-center text-gray-400 text-sm">
              No completed trips recorded yet. Once you complete deliveries, earnings will be tabulated here.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-gray-100 text-xs uppercase font-bold text-gray-400">
                    <th className="pb-3">Order ID</th>
                    <th className="pb-3">Date & Time</th>
                    <th className="pb-3">Restaurant</th>
                    <th className="pb-3">Payment</th>
                    <th className="pb-3 text-right">Order Value</th>
                    <th className="pb-3 text-right">Your Fee</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {completed.map((d) => (
                    <tr key={d._id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="py-3 font-mono text-xs font-bold text-gray-800">
                        #{d.orderId || d._id?.slice(-6)}
                      </td>
                      <td className="py-3 text-xs text-gray-500">
                        {d.createdAt ? new Date(d.createdAt).toLocaleDateString() : "Recent"}
                      </td>
                      <td className="py-3 text-gray-700 font-medium">
                        {d.restaurantId?.name || "Restaurant"}
                      </td>
                      <td className="py-3">
                        <span className={`px-2 py-0.5 rounded text-[11px] font-bold uppercase ${
                          d.paymentMethod === "cash"
                            ? "bg-amber-50 text-amber-700"
                            : "bg-blue-50 text-blue-700"
                        }`}>
                          {d.paymentMethod || "cash"}
                        </span>
                      </td>
                      <td className="py-3 text-right font-medium text-gray-700">
                        LKR {d.totalPrice || 0}
                      </td>
                      <td className="py-3 text-right font-bold text-emerald-600">
                        + LKR {(450 + (d.totalPrice ? d.totalPrice * 0.05 : 0)).toFixed(0)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </DriverLayout>
  );
};

export default DriverEarnings;
