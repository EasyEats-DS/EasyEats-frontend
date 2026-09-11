import { jwtDecode } from "jwt-decode";
import axios from "axios";

/**
 * The application has exactly one set of roles, defined by the User model in
 * authentication-service. "Driver" is older vocabulary for DELIVERY_PERSON --
 * the same person, not a separate account type.
 */
export const ROLES = {
  RESTAURANT_OWNER: "RESTAURANT_OWNER",
  DELIVERY_PERSON: "DELIVERY_PERSON",
  CUSTOMER: "CUSTOMER",
  SUPER_ADMIN: "SUPER_ADMIN",
};

const HOME_ROUTE_BY_ROLE = {
  [ROLES.RESTAURANT_OWNER]: "/admin/dashboard",
  [ROLES.DELIVERY_PERSON]: "/driver/map",
  [ROLES.SUPER_ADMIN]: "/superadmin/dashboard",
  [ROLES.CUSTOMER]: "/",
};

/** Where a given role lands after signing in. Unknown roles get the storefront. */
export const homeRouteForRole = (role) => HOME_ROUTE_BY_ROLE[role] ?? "/";

/** True when this user delivers orders. */
export const isDriver = (user) => user?.role === ROLES.DELIVERY_PERSON;

/** JSON.parse that tolerates every empty/corrupt shape localStorage can hold. */
export const parseStoredUser = (raw) => {
  if (!raw || raw === "undefined" || raw === "null") return null;
  try {
    return JSON.parse(raw);
  } catch (error) {
    console.error("Stored user is not valid JSON:", error);
    return null;
  }
};

export const getUserFromToken = () => {
  const token = localStorage.getItem("authToken");
  if (!token) return null;

  try {
    return jwtDecode(token);
  } catch (error) {
    console.error("Invalid token format:", error);
    return null;
  }
};

/**
 * The signed-in user, from the single "user" entry written at login.
 *
 * Falls back to the JWT payload so a session stored by an older build (which
 * only wrote the token) still resolves.
 */
export const getCurrentUser = () => {
  const stored = parseStoredUser(localStorage.getItem("user"));
  if (stored) return stored;

  const fromToken = getUserFromToken();
  if (!fromToken) return null;
  return { ...fromToken, _id: fromToken._id ?? fromToken.id };
};

/** Auth entries, including keys written by earlier builds. */
const AUTH_KEYS = ["authToken", "user", "driver", "Customer", "userType"];

/**
 * Not auth, but still the previous user's data: left behind, the next person to
 * sign in on this browser inherits a stranger's basket.
 */
const SESSION_DATA_KEYS = ["cartItems", "cartRestaurantId"];

/** Clears every auth entry, including keys written by earlier builds. */
export const clearAuth = () => {
  AUTH_KEYS.forEach((key) => localStorage.removeItem(key));
};

/**
 * Ends the session for real.
 *
 * Revokes the token at the gateway so it stops being accepted immediately --
 * a JWT is otherwise valid for its full lifetime no matter what the browser
 * forgets -- and only then drops every local trace of the user.
 *
 * The local half runs even when the revoke call fails. A logout that refuses
 * to sign you out because the network is down is the bug this replaces; the
 * token expires on its own regardless.
 */
export const logout = async () => {
  const token = localStorage.getItem("authToken");

  if (token) {
    try {
      await axios.post(
        `${import.meta.env.VITE_BASE_URL}/auth/logout`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
    } catch (error) {
      console.error("Server-side logout failed; clearing session anyway:", error);
    }
  }

  clearAuth();
  SESSION_DATA_KEYS.forEach((key) => localStorage.removeItem(key));
  sessionStorage.clear();
};
