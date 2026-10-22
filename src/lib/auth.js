import { jwtDecode } from "jwt-decode";

// Inactivity timeout: 30 minutes of idle time
export const INACTIVITY_TIMEOUT_MS = 30 * 60 * 1000;

/**
 * Clears all user session and authentication keys from browser storage
 */
export const clearAuthSession = () => {
  localStorage.removeItem("authToken");
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  localStorage.removeItem("userId");
  localStorage.removeItem("userType");
  localStorage.removeItem("driver");
  localStorage.removeItem("Customer");
  localStorage.removeItem("lastActiveTime");
  sessionStorage.clear();
  window.dispatchEvent(new Event("authChanged"));
};

/**
 * Updates the last active timestamp if an active auth token exists
 */
export const updateLastActiveTime = () => {
  if (localStorage.getItem("authToken")) {
    localStorage.setItem("lastActiveTime", Date.now().toString());
  }
};

/**
 * Checks whether the current session has expired either via JWT expiration or inactivity
 */
export const isSessionExpired = () => {
  const token = localStorage.getItem("authToken");
  if (!token) return true;

  try {
    const decoded = jwtDecode(token);

    // 1. Check JWT expiration timestamp from the token payload
    if (decoded?.exp && decoded.exp * 1000 <= Date.now()) {
      console.warn("Session expired: JWT token expiration reached.");
      return true;
    }

    // 2. Check user inactivity / idle timeout
    const lastActive = localStorage.getItem("lastActiveTime");
    if (lastActive) {
      const elapsed = Date.now() - parseInt(lastActive, 10);
      if (elapsed > INACTIVITY_TIMEOUT_MS) {
        console.warn(`Session expired: User inactive for ${(elapsed / 60000).toFixed(1)} minutes.`);
        return true;
      }
    }

    return false;
  } catch (error) {
    console.error("Invalid token format:", error);
    return true;
  }
};

/**
 * Retrieves decoded user payload from token if valid and not expired
 */
export const getUserFromToken = () => {
  const token = localStorage.getItem("authToken");
  if (!token) return null;

  if (isSessionExpired()) {
    clearAuthSession();
    return null;
  }

  try {
    const decoded = jwtDecode(token);
    return decoded;
  } catch (error) {
    console.error("Invalid token format:", error);
    clearAuthSession();
    return null;
  }
};

/**
 * Checks if the user is authenticated with a valid, active session
 */
export const isAuthenticated = () => {
  const token = localStorage.getItem("authToken");
  if (!token) return false;

  if (isSessionExpired()) {
    clearAuthSession();
    return false;
  }

  return true;
};
