import { useEffect, useState } from "react";
import { fetchAllOrdersNoPagination } from "./api/orders";
import { restaurantService } from "./api/resturants";
import { userService } from "./api/users";
import { getUserFromToken } from "./auth";

/**
 * Loads the orders belonging to the signed-in owner's restaurants, along with
 * the customer record behind each order.
 *
 * Shared by the admin dashboard and earnings pages so the "fetch everything,
 * then filter to my restaurants" logic lives in one place.
 */
export function useOwnerOrders() {
  const [orders, setOrders] = useState([]);
  const [restaurants, setRestaurants] = useState([]);
  const [customers, setCustomers] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      try {
        const user = getUserFromToken();
        if (!user?.id) throw new Error("Not authenticated");

        const [allOrders, ownedRestaurants] = await Promise.all([
          fetchAllOrdersNoPagination(),
          restaurantService.getRestaurantsByOwnerId(user.id),
        ]);

        const restaurantIds = (ownedRestaurants || []).map((r) => r._id);
        const mine = (allOrders || []).filter(
          (order) => order.restaurantId && restaurantIds.includes(order.restaurantId)
        );

        // Resolve customer names for the recent-orders table.
        const userIds = [...new Set(mine.map((order) => order.userId).filter(Boolean))];
        const resolved = {};
        await Promise.all(
          userIds.map(async (userId) => {
            try {
              resolved[userId] = await userService.getUserById(userId);
            } catch {
              resolved[userId] = { firstName: "Unknown", lastName: "" };
            }
          })
        );

        if (cancelled) return;
        setRestaurants(ownedRestaurants || []);
        setOrders(mine);
        setCustomers(resolved);
      } catch (err) {
        console.error("Failed to load owner orders:", err);
        if (!cancelled) setError("Failed to load dashboard data.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    load();
    return () => {
      cancelled = true;
    };
  }, []);

  return { orders, restaurants, customers, loading, error };
}

/** "John Doe" for an order, falling back to the raw id when unresolved. */
export function customerName(customers, userId) {
  const user = customers?.[userId];
  if (!user) return userId ? `Customer ${String(userId).slice(-6)}` : "Unknown";
  const name = [user.firstName, user.lastName].filter(Boolean).join(" ").trim();
  return name || `Customer ${String(userId).slice(-6)}`;
}
