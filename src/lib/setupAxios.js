import axios from "axios";
import { clearAuthSession } from "./auth";

/**
 * Configure global Axios interceptors:
 * 1. Automatically attach JWT Bearer token to outgoing requests if available.
 * 2. Intercept 401 Unauthorized or 403 Invalid/Expired token responses to wipe session and redirect to /login.
 */
export const setupAxiosInterceptors = () => {
  // Request interceptor: attach token
  axios.interceptors.request.use(
    (config) => {
      const token = localStorage.getItem("authToken");
      if (token && !config.headers.Authorization) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) => Promise.reject(error)
  );

  // Response interceptor: handle 401/403 session expiration
  axios.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error.response) {
        const { status, data } = error.response;
        const isAuthError =
          status === 401 ||
          (status === 403 &&
            (data?.message?.toLowerCase().includes("token") ||
              data?.message?.toLowerCase().includes("forbidden") ||
              data?.message?.toLowerCase().includes("unauthorized")));

        if (isAuthError && localStorage.getItem("authToken")) {
          console.warn("Backend rejected token, clearing session...");
          clearAuthSession();
          if (window.location.pathname !== "/login") {
            window.location.href = "/login";
          }
        }
      }
      return Promise.reject(error);
    }
  );
};
