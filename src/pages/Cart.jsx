import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  ShoppingCart,
  ShoppingBag,
  Trash2,
  Plus,
  Minus,
  ArrowRight,
  ArrowLeft,
  Store,
  Tag,
  Sparkles,
  ShieldCheck,
  Clock,
  FileText,
  CheckCircle2,
  X,
  UtensilsCrossed,
  HelpCircle,
  Percent,
} from "lucide-react";
import Swal from "sweetalert2";
import UserLayout from "../components/UserLayout";

const FREE_DELIVERY_THRESHOLD = 2500;
const STANDARD_DELIVERY_FEE = 250;

const PROMO_CODES = {
  WELCOME10: { code: "WELCOME10", discountPercent: 10, label: "10% Welcome Discount" },
  EASY5: { code: "EASY5", discountPercent: 5, label: "5% EasyEats Member Off" },
  FREEDEL: { code: "FREEDEL", freeDelivery: true, label: "Free Delivery Voucher" },
};

const Cart = ({ isDrawer = false, onClose }) => {
  const navigate = useNavigate();

  // Load cart from localStorage
  const [cartItems, setCartItems] = useState(() => {
    try {
      const stored = JSON.parse(localStorage.getItem("cartItems") || "[]");
      return Array.isArray(stored) ? stored : [];
    } catch {
      return [];
    }
  });

  const [restaurantId, setRestaurantId] = useState(() =>
    localStorage.getItem("cartRestaurantId") || ""
  );

  const [restaurantName, setRestaurantName] = useState(() =>
    localStorage.getItem("cartRestaurantName") || ""
  );

  const [orderNote, setOrderNote] = useState("");
  const [promoCodeInput, setPromoCodeInput] = useState("");
  const [appliedPromo, setAppliedPromo] = useState(null);
  const [promoError, setPromoError] = useState("");
  const [loading, setLoading] = useState(false);
  const [isNoteOpen, setIsNoteOpen] = useState(false);

  // Sync cart when localStorage changes (storage or cartUpdated event)
  useEffect(() => {
    const handleCartSync = () => {
      try {
        const stored = JSON.parse(localStorage.getItem("cartItems") || "[]");
        setCartItems(Array.isArray(stored) ? stored : []);
        setRestaurantId(localStorage.getItem("cartRestaurantId") || "");
        setRestaurantName(localStorage.getItem("cartRestaurantName") || "");
      } catch {
        setCartItems([]);
      }
    };

    window.addEventListener("cartUpdated", handleCartSync);
    window.addEventListener("storage", handleCartSync);
    return () => {
      window.removeEventListener("cartUpdated", handleCartSync);
      window.removeEventListener("storage", handleCartSync);
    };
  }, []);

  // Persist whenever cartItems changes
  const updateCart = (newItems) => {
    setCartItems(newItems);
    localStorage.setItem("cartItems", JSON.stringify(newItems));
    if (newItems.length === 0) {
      localStorage.removeItem("cartRestaurantId");
      localStorage.removeItem("cartRestaurantName");
      setRestaurantId("");
      setRestaurantName("");
    }
    window.dispatchEvent(new Event("cartUpdated"));
  };

  const increaseQty = (index) => {
    const updated = [...cartItems];
    updated[index] = { ...updated[index], quantity: (updated[index].quantity || 1) + 1 };
    updateCart(updated);
  };

  const decreaseQty = (index) => {
    const updated = [...cartItems];
    if (updated[index].quantity > 1) {
      updated[index] = { ...updated[index], quantity: updated[index].quantity - 1 };
      updateCart(updated);
    } else {
      removeItem(index);
    }
  };

  const removeItem = (index) => {
    const updated = [...cartItems];
    updated.splice(index, 1);
    updateCart(updated);
  };

  const clearEntireCart = async () => {
    const result = await Swal.fire({
      title: "Clear your cart?",
      text: "All items in your cart will be removed.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#FF7A00",
      cancelButtonColor: "#6B7280",
      confirmButtonText: "Yes, clear it",
      cancelButtonText: "Keep items",
    });

    if (result.isConfirmed) {
      updateCart([]);
      setAppliedPromo(null);
      setPromoCodeInput("");
    }
  };

  // Calculations
  const subtotal = cartItems.reduce(
    (acc, item) => acc + (Number(item.price) || 0) * (Number(item.quantity) || 1),
    0
  );

  const totalItemCount = cartItems.reduce(
    (acc, item) => acc + (Number(item.quantity) || 1),
    0
  );

  // Delivery fee calculation
  const qualifiesForFreeDelivery = subtotal >= FREE_DELIVERY_THRESHOLD;
  const isPromoFreeDelivery = appliedPromo?.freeDelivery;
  const deliveryFee =
    subtotal === 0 || qualifiesForFreeDelivery || isPromoFreeDelivery
      ? 0
      : STANDARD_DELIVERY_FEE;

  // Promotion calculation: default 5% system promo (matching Order.jsx) or custom applied promo
  let promoDiscount = 0;
  if (subtotal > 0) {
    if (appliedPromo?.discountPercent) {
      promoDiscount = (subtotal * appliedPromo.discountPercent) / 100;
    } else if (appliedPromo?.freeDelivery) {
      promoDiscount = STANDARD_DELIVERY_FEE;
    } else {
      // Default 5% automatic discount
      promoDiscount = subtotal * 0.05;
    }
  }

  // Taxes (2% of subtotal, matching Order.jsx)
  const taxes = subtotal > 0 ? subtotal * 0.02 : 0;

  // Final Total
  const grandTotal = Math.max(0, subtotal - promoDiscount + deliveryFee + taxes);

  // Free delivery progress
  const freeDeliveryProgress = Math.min(
    100,
    Math.round((subtotal / FREE_DELIVERY_THRESHOLD) * 100)
  );
  const remainingForFreeDelivery = Math.max(0, FREE_DELIVERY_THRESHOLD - subtotal);

  // Apply promo code handler
  const handleApplyPromo = (codeToApply) => {
    const code = (codeToApply || promoCodeInput).trim().toUpperCase();
    if (!code) {
      setPromoError("Please enter a voucher code.");
      return;
    }

    if (PROMO_CODES[code]) {
      setAppliedPromo(PROMO_CODES[code]);
      setPromoCodeInput("");
      setPromoError("");
    } else {
      setPromoError("Invalid code. Try WELCOME10 or EASY5");
    }
  };

  const handleRemovePromo = () => {
    setAppliedPromo(null);
    setPromoCodeInput("");
    setPromoError("");
  };

  const handleCheckout = () => {
    if (cartItems.length === 0) return;
    setLoading(true);
    setTimeout(() => {
      onClose?.();
      navigate("/order", {
        state: {
          cartItems,
          promotion: promoDiscount,
          restaurantId,
          note: orderNote,
        },
      });
    }, 700);
  };

  const handleExploreRestaurants = () => {
    onClose?.();
    navigate("/restaurant");
  };

  // ==========================================
  // RENDER: EMPTY CART STATE
  // ==========================================
  if (cartItems.length === 0) {
    const emptyContent = (
      <div className="flex flex-col items-center justify-center text-center py-12 px-6 h-full min-h-[460px]">
        {/* Animated Glow Circle */}
        <div className="relative mb-6">
          <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full bg-gradient-to-tr from-orange-100 to-amber-50 flex items-center justify-center shadow-inner">
            <ShoppingBag className="w-12 h-12 text-foodie-orange stroke-[1.5]" />
          </div>
          <div className="absolute -bottom-1 -right-1 bg-white p-2 rounded-full shadow-md border border-orange-100">
            <UtensilsCrossed className="w-5 h-5 text-foodie-orange" />
          </div>
        </div>

        <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">
          Your cart is feeling hungry
        </h2>
        <p className="text-gray-500 text-sm max-w-sm mb-6 leading-relaxed">
          Looks like you haven't added anything yet. Explore delicious dishes from top
          restaurants and fill your basket!
        </p>

        {/* Primary Action Button */}
        <button
          onClick={handleExploreRestaurants}
          className="w-full max-w-xs bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-semibold py-3 px-6 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 flex items-center justify-center gap-2 group cursor-pointer"
        >
          <span>Explore Restaurants</span>
          <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
        </button>

        {/* Popular Cravings Quick Chips */}
        <div className="mt-8 pt-6 border-t border-gray-100 w-full max-w-xs">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
            Popular Cravings
          </p>
          <div className="flex flex-wrap justify-center gap-2">
            {[
              { label: "🍕 Pizza", query: "pizza" },
              { label: "🍔 Burgers", query: "burger" },
              { label: "🍛 Biryani", query: "biryani" },
              { label: "🍜 Noodles", query: "noodles" },
              { label: "🍰 Desserts", query: "dessert" },
            ].map((chip) => (
              <button
                key={chip.label}
                onClick={() => {
                  onClose?.();
                  navigate(`/search?q=${chip.query}`);
                }}
                className="text-xs bg-gray-50 hover:bg-orange-50 hover:text-foodie-orange text-gray-700 px-3 py-1.5 rounded-full border border-gray-200 transition-colors"
              >
                {chip.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    );

    if (isDrawer) {
      return (
        <div className="flex flex-col h-full bg-white">
          <div className="flex items-center justify-between p-4 border-b border-gray-100">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-foodie-orange" />
              <h2 className="text-lg font-bold text-gray-900">Your Cart</h2>
            </div>
            {onClose && (
              <button
                onClick={onClose}
                className="p-1.5 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-full transition-colors"
                aria-label="Close cart"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>
          <div className="flex-1 overflow-y-auto">{emptyContent}</div>
        </div>
      );
    }

    return (
      <UserLayout title="EasyEats - Cart">
        <div className="max-w-2xl mx-auto py-12 px-4">{emptyContent}</div>
      </UserLayout>
    );
  }

  // ==========================================
  // SHARED SUB-COMPONENTS
  // ==========================================

  // Restaurant Context Banner
  const RestaurantHeader = () => (
    <div className="bg-gradient-to-r from-orange-50/70 to-amber-50/40 border border-orange-100/80 rounded-2xl p-3.5 sm:p-4 flex items-center justify-between gap-3">
      <div className="flex items-center gap-3 min-w-0">
        <div className="w-10 h-10 rounded-xl bg-white shadow-xs border border-orange-100 flex items-center justify-center shrink-0">
          <Store className="w-5 h-5 text-foodie-orange" />
        </div>
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-orange-600 bg-orange-100/70 px-2 py-0.5 rounded-full">
              Ordering From
            </span>
          </div>
          <h3 className="text-sm sm:text-base font-bold text-gray-900 truncate">
            {restaurantName || "EasyEats Partner"}
          </h3>
        </div>
      </div>
      <div className="flex items-center gap-1.5 text-xs font-medium text-gray-500 shrink-0 bg-white/80 px-2.5 py-1 rounded-lg border border-gray-100 shadow-2xs">
        <Clock className="w-3.5 h-3.5 text-foodie-orange" />
        <span>25-35 min</span>
      </div>
    </div>
  );

  // Free Delivery Progress Meter
  const DeliveryProgressBar = () => (
    <div className="bg-white rounded-2xl border border-gray-100 p-3.5 shadow-2xs">
      <div className="flex items-center justify-between text-xs mb-2">
        <span className="font-medium text-gray-700">
          {qualifiesForFreeDelivery || isPromoFreeDelivery ? (
            <span className="text-emerald-600 font-semibold flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              🎉 You unlocked FREE Delivery!
            </span>
          ) : (
            <span>
              Add <strong className="text-foodie-orange">LKR {remainingForFreeDelivery.toFixed(2)}</strong> more for FREE delivery!
            </span>
          )}
        </span>
        <span className="text-gray-400 font-medium">{freeDeliveryProgress}%</span>
      </div>
      <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
        <div
          className={`h-full transition-all duration-500 rounded-full ${
            qualifiesForFreeDelivery || isPromoFreeDelivery
              ? "bg-gradient-to-r from-emerald-500 to-teal-400"
              : "bg-gradient-to-r from-orange-400 to-amber-400"
          }`}
          style={{
            width: qualifiesForFreeDelivery || isPromoFreeDelivery ? "100%" : `${freeDeliveryProgress}%`,
          }}
        />
      </div>
    </div>
  );

  // Items List
  const CartItemsList = () => (
    <div className="space-y-3">
      {cartItems.map((item, index) => {
        const itemLineTotal = (Number(item.price) || 0) * (Number(item.quantity) || 1);
        return (
          <div
            key={`${item.id}-${index}`}
            className="group bg-white rounded-2xl p-3 sm:p-4 border border-gray-100 hover:border-orange-200 shadow-2xs hover:shadow-xs transition-all duration-200 flex items-center justify-between gap-3"
          >
            {/* Dish Thumbnail & Details */}
            <div className="flex items-center gap-3 sm:gap-4 min-w-0">
              <div className="relative w-16 h-16 sm:w-18 sm:h-18 rounded-xl overflow-hidden shrink-0 bg-orange-50 border border-gray-100">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  onError={(e) => {
                    e.currentTarget.onerror = null;
                    e.currentTarget.src =
                      "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=200&q=80";
                  }}
                />
              </div>
              <div className="min-w-0">
                <h4 className="font-semibold text-gray-900 text-sm sm:text-base leading-snug truncate">
                  {item.name}
                </h4>
                <p className="text-gray-500 text-xs sm:text-sm mt-0.5">
                  LKR {Number(item.price || 0).toFixed(2)}
                </p>
                <p className="text-foodie-orange font-bold text-xs sm:text-sm mt-1">
                  LKR {itemLineTotal.toFixed(2)}
                </p>
              </div>
            </div>

            {/* Stepper & Remove */}
            <div className="flex items-center gap-2 sm:gap-3 shrink-0">
              <div className="flex items-center bg-gray-50 border border-gray-200/80 rounded-xl p-0.5 sm:p-1 shadow-2xs">
                <button
                  onClick={() => decreaseQty(index)}
                  className={`w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center rounded-lg transition-colors cursor-pointer ${
                    item.quantity === 1
                      ? "text-red-500 hover:bg-red-50"
                      : "text-gray-600 hover:bg-white hover:shadow-xs"
                  }`}
                  title={item.quantity === 1 ? "Remove item" : "Decrease quantity"}
                >
                  {item.quantity === 1 ? (
                    <Trash2 className="w-3.5 h-3.5" />
                  ) : (
                    <Minus className="w-3.5 h-3.5" />
                  )}
                </button>
                <span className="w-7 sm:w-8 text-center text-xs sm:text-sm font-bold text-gray-800">
                  {item.quantity}
                </span>
                <button
                  onClick={() => increaseQty(index)}
                  className="w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center text-gray-700 hover:bg-white hover:shadow-xs rounded-lg transition-colors cursor-pointer"
                  title="Increase quantity"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>

              <button
                onClick={() => removeItem(index)}
                className="p-1.5 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                title="Remove item"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );

  // Cooking/Delivery Notes Section
  const OrderNoteSection = () => (
    <div className="bg-white rounded-2xl border border-gray-100 p-3.5 sm:p-4 shadow-2xs">
      <div
        className="flex items-center justify-between cursor-pointer select-none"
        onClick={() => setIsNoteOpen(!isNoteOpen)}
      >
        <div className="flex items-center gap-2 text-xs sm:text-sm font-semibold text-gray-800">
          <FileText className="w-4 h-4 text-foodie-orange" />
          <span>Cooking or Delivery Note</span>
          {orderNote && (
            <span className="w-2 h-2 rounded-full bg-foodie-orange inline-block" />
          )}
        </div>
        <span className="text-xs text-foodie-orange font-medium hover:underline">
          {isNoteOpen ? "Collapse" : orderNote ? "Edit Note" : "+ Add Note"}
        </span>
      </div>

      {(isNoteOpen || orderNote) && (
        <div className="mt-3 pt-3 border-t border-gray-100">
          <textarea
            value={orderNote}
            onChange={(e) => setOrderNote(e.target.value.slice(0, 150))}
            placeholder="e.g., Less spicy, no cutlery, allergy alert, please call upon arrival..."
            rows="2"
            className="w-full p-2.5 bg-gray-50/70 border border-gray-200 rounded-xl text-xs sm:text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:bg-white focus:border-foodie-orange focus:ring-2 focus:ring-orange-100 transition-all resize-none"
          />
          <div className="flex justify-between items-center mt-1 text-[11px] text-gray-400">
            <span>Special instructions for the restaurant & rider</span>
            <span>{orderNote.length}/150</span>
          </div>
        </div>
      )}
    </div>
  );

  // Promo Code Voucher Section
  const PromoCodeSection = () => (
    <div className="bg-white rounded-2xl border border-gray-100 p-3.5 sm:p-4 shadow-2xs space-y-3">
      <div className="flex items-center gap-2 text-xs sm:text-sm font-semibold text-gray-800">
        <Tag className="w-4 h-4 text-foodie-orange" />
        <span>Promotions & Vouchers</span>
      </div>

      {appliedPromo ? (
        <div className="flex items-center justify-between bg-emerald-50 border border-emerald-200/80 rounded-xl p-3">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-emerald-500 text-white flex items-center justify-center font-bold text-xs">
              ✓
            </div>
            <div>
              <p className="text-xs sm:text-sm font-bold text-emerald-800">
                {appliedPromo.code} Applied!
              </p>
              <p className="text-[11px] text-emerald-600">{appliedPromo.label}</p>
            </div>
          </div>
          <button
            onClick={handleRemovePromo}
            className="text-xs text-red-500 hover:text-red-700 font-semibold px-2 py-1 rounded hover:bg-red-50 transition-colors"
          >
            Remove
          </button>
        </div>
      ) : (
        <div className="space-y-2">
          <div className="flex gap-2">
            <input
              type="text"
              value={promoCodeInput}
              onChange={(e) => {
                setPromoCodeInput(e.target.value.toUpperCase());
                setPromoError("");
              }}
              placeholder="Enter voucher code (e.g. EASY5)"
              className="flex-1 px-3 py-2 text-xs sm:text-sm uppercase tracking-wide bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:bg-white focus:border-foodie-orange focus:ring-2 focus:ring-orange-100 transition-all"
            />
            <button
              onClick={() => handleApplyPromo()}
              className="px-4 py-2 bg-foodie-orange hover:bg-foodie-orange-dark text-white text-xs sm:text-sm font-semibold rounded-xl shadow-2xs hover:shadow-xs transition-colors shrink-0 cursor-pointer"
            >
              Apply
            </button>
          </div>

          {promoError && (
            <p className="text-xs text-red-500 font-medium">{promoError}</p>
          )}

          {/* Quick Suggestions */}
          <div className="flex flex-wrap items-center gap-1.5 pt-1">
            <span className="text-[11px] text-gray-400">Available:</span>
            {["WELCOME10", "EASY5"].map((code) => (
              <button
                key={code}
                onClick={() => handleApplyPromo(code)}
                className="text-[11px] font-medium bg-orange-50 hover:bg-orange-100 text-foodie-orange border border-orange-200/80 px-2 py-0.5 rounded-lg transition-colors cursor-pointer"
              >
                🏷️ {code}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );

  // Price Receipt Breakdown
  const BillDetails = () => (
    <div className="bg-white rounded-2xl border border-gray-100 p-4 space-y-2.5 shadow-2xs">
      <h4 className="text-xs sm:text-sm font-bold text-gray-900 border-b border-gray-100 pb-2">
        Bill Summary
      </h4>

      <div className="flex justify-between items-center text-xs sm:text-sm text-gray-600">
        <span>Items Subtotal</span>
        <span className="font-semibold text-gray-800">
          LKR {subtotal.toFixed(2)}
        </span>
      </div>

      {promoDiscount > 0 && (
        <div className="flex justify-between items-center text-xs sm:text-sm text-emerald-600">
          <span className="flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-emerald-500" />
            Promotion Savings {appliedPromo ? `(${appliedPromo.code})` : "(5% Off)"}
          </span>
          <span className="font-bold">- LKR {promoDiscount.toFixed(2)}</span>
        </div>
      )}

      <div className="flex justify-between items-center text-xs sm:text-sm text-gray-600">
        <span>Estimated Delivery Fee</span>
        <span>
          {deliveryFee === 0 ? (
            <span className="font-bold text-emerald-600 uppercase text-xs">FREE</span>
          ) : (
            `LKR ${deliveryFee.toFixed(2)}`
          )}
        </span>
      </div>

      <div className="flex justify-between items-center text-xs sm:text-sm text-gray-600">
        <span className="flex items-center gap-1">
          Government Taxes & Fees (2%)
        </span>
        <span>LKR {taxes.toFixed(2)}</span>
      </div>

      <div className="border-t border-gray-100 pt-3 flex justify-between items-baseline">
        <div>
          <span className="text-sm sm:text-base font-extrabold text-gray-900">
            To Pay
          </span>
          <p className="text-[11px] text-gray-400">Inclusive of all taxes</p>
        </div>
        <span className="text-lg sm:text-xl font-extrabold text-foodie-orange">
          LKR {grandTotal.toFixed(2)}
        </span>
      </div>
    </div>
  );

  // Savings Pill Banner
  const SavingsBanner = () => {
    if (promoDiscount <= 0) return null;
    return (
      <div className="bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-xl p-2.5 sm:p-3 text-center text-xs sm:text-sm font-semibold shadow-xs flex items-center justify-center gap-2">
        <Sparkles className="w-4 h-4 animate-spin-slow shrink-0" />
        <span>You're saving LKR {promoDiscount.toFixed(2)} on this order!</span>
      </div>
    );
  };

  // Checkout Action CTA
  const CheckoutButton = () => (
    <button
      onClick={handleCheckout}
      disabled={cartItems.length === 0 || loading}
      className={`w-full bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white py-3.5 px-5 rounded-xl font-bold text-sm sm:text-base shadow-md hover:shadow-lg transition-all duration-300 flex items-center justify-between cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed group`}
    >
      <div className="flex items-center gap-2 text-left">
        <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center text-xs font-bold">
          {totalItemCount}
        </div>
        <span>{loading ? "Processing..." : "Proceed to Checkout"}</span>
      </div>

      <div className="flex items-center gap-1.5">
        <span>LKR {grandTotal.toFixed(2)}</span>
        <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
      </div>
    </button>
  );

  // Trust Footnote
  const TrustBadges = () => (
    <div className="flex items-center justify-center gap-4 text-[11px] text-gray-400 pt-2">
      <span className="flex items-center gap-1">
        <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
        100% Secure Checkout
      </span>
      <span>•</span>
      <span className="flex items-center gap-1">
        <Clock className="w-3.5 h-3.5 text-orange-400" />
        Live GPS Tracking
      </span>
    </div>
  );

  // ==========================================
  // RENDER: DRAWER VIEW
  // ==========================================
  if (isDrawer) {
    return (
      <div className="flex flex-col h-full bg-foodie-gray-light">
        {/* Drawer Sticky Top Header */}
        <div className="bg-white px-4 py-3.5 border-b border-gray-100 flex items-center justify-between shrink-0 shadow-2xs">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-orange-50 text-foodie-orange flex items-center justify-center">
              <ShoppingCart className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-gray-900 leading-none">
                Your Cart
              </h2>
              <span className="text-xs text-gray-400">
                {totalItemCount} {totalItemCount === 1 ? "item" : "items"}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={clearEntireCart}
              className="text-xs font-medium text-gray-400 hover:text-red-500 px-2 py-1 rounded-lg hover:bg-red-50 transition-colors"
              title="Empty entire cart"
            >
              Clear
            </button>
            {onClose && (
              <button
                onClick={onClose}
                className="p-1.5 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-full transition-colors"
                aria-label="Close cart"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>

        {/* Drawer Scrollable Middle Body */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          <RestaurantHeader />
          <DeliveryProgressBar />
          <CartItemsList />
          <OrderNoteSection />
          <PromoCodeSection />
          <BillDetails />
        </div>

        {/* Drawer Sticky Bottom Footer */}
        <div className="bg-white p-4 border-t border-gray-100 shadow-[0_-4px_16px_rgba(0,0,0,0.06)] space-y-3 shrink-0">
          <SavingsBanner />
          <CheckoutButton />
          <TrustBadges />
        </div>
      </div>
    );
  }

  // ==========================================
  // RENDER: FULL PAGE VIEW (/cart)
  // ==========================================
  return (
    <UserLayout title="EasyEats - Cart">
      <div className="max-w-5xl mx-auto px-4 pt-4 pb-32 sm:pb-36 lg:pb-14">
        {/* Page Top Breadcrumb / Action Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate("/restaurant")}
              className="p-2 text-gray-500 hover:text-foodie-orange hover:bg-white rounded-xl border border-gray-200 transition-colors cursor-pointer shadow-2xs"
              title="Back to restaurants"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
                Your Food Basket
              </h1>
              <p className="text-xs sm:text-sm text-gray-500">
                Review your items and proceed to secure checkout
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <span className="bg-orange-100 text-foodie-orange text-xs sm:text-sm font-bold px-3 py-1.5 rounded-full">
              {totalItemCount} {totalItemCount === 1 ? "item" : "items"}
            </span>
            <button
              onClick={clearEntireCart}
              className="text-xs sm:text-sm font-semibold text-gray-500 hover:text-red-500 px-3 py-1.5 rounded-xl border border-gray-200 hover:bg-red-50 hover:border-red-200 transition-colors cursor-pointer"
            >
              Clear Cart
            </button>
          </div>
        </div>

        {/* 2-Column Responsive Grid on Desktop */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-start">
          {/* Left Column: Items, Notes, Delivery Progress */}
          <div className="lg:col-span-7 space-y-4 sm:space-y-5">
            <RestaurantHeader />
            <DeliveryProgressBar />
            <CartItemsList />
            <OrderNoteSection />
          </div>

          {/* Right Column: Order Summary, Promo & Checkout */}
          <div className="lg:col-span-5 space-y-4 sm:space-y-5 lg:sticky lg:top-20">
            <BillDetails />
            <SavingsBanner />
            <CheckoutButton />
            <PromoCodeSection />
            <TrustBadges />
          </div>
        </div>
      </div>
    </UserLayout>
  );
};

export default Cart;