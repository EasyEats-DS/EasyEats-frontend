import React, { useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import { isSessionExpired, clearAuthSession, updateLastActiveTime } from "../lib/auth";

/**
 * Global Session Manager:
 * 1. Checks on mount and route changes if session is expired
 * 2. Periodically verifies token expiry and inactivity timeout (every 15s)
 * 3. Listens to user interactions and throttles activity updates (every 10s)
 * 4. Checks when browser tab becomes active again (visibilitychange)
 */
export const SessionManager = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const lastActivityUpdateRef = useRef(Date.now());

  const evaluateSession = () => {
    const hasToken = !!localStorage.getItem("authToken");
    if (!hasToken) return;

    if (isSessionExpired()) {
      clearAuthSession();
      toast.warn("Your session has expired. Please log in again.", {
        position: "top-right",
        autoClose: 4000,
      });
      navigate("/login", { replace: true, state: { sessionExpired: true } });
    }
  };

  useEffect(() => {
    // 1. Initial check on mount / route transition
    evaluateSession();

    // 2. Periodic heartbeat check every 15 seconds
    const intervalId = setInterval(() => {
      evaluateSession();
    }, 15000);

    // 3. User interaction listener (throttled to update lastActiveTime every 10 seconds)
    const handleUserActivity = () => {
      const now = Date.now();
      if (now - lastActivityUpdateRef.current > 10000) {
        lastActivityUpdateRef.current = now;
        updateLastActiveTime();
      }
    };

    const activityEvents = ["mousedown", "keydown", "scroll", "touchstart", "click"];
    activityEvents.forEach((evt) => {
      window.addEventListener(evt, handleUserActivity, { passive: true });
    });

    // 4. Tab visibility change (e.g. user opens browser tab after leaving machine)
    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        evaluateSession();
      }
    };
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      clearInterval(intervalId);
      activityEvents.forEach((evt) => {
        window.removeEventListener(evt, handleUserActivity);
      });
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [location.pathname, navigate]);

  return null;
};

export default SessionManager;
