import React, { useEffect } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { isAuthenticated, updateLastActiveTime } from "../lib/auth";

const ProtectedRoute = ({ children, allowedRoles }) => {
  const location = useLocation();
  const authenticated = isAuthenticated();

  useEffect(() => {
    if (authenticated) {
      updateLastActiveTime();
    }
  }, [location, authenticated]);

  if (!authenticated) {
    // If no token or session expired, redirect to login page
    return <Navigate to="/login" state={{ from: location, sessionExpired: true }} replace />;
  }

  // Role verification & automated redirection
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const userRole = user.role;

  // Prevent delivery person from viewing generic customer food ordering screens
  const customerRoutes = [
    "/",
    "/list",
    "/restaurant",
    "/cart",
    "/order",
    "/payment",
    "/stripe-payment-interface",
    "/viewOrder",
    "/search"
  ];
  if (userRole === "DELIVERY_PERSON" && customerRoutes.includes(location.pathname)) {
    return <Navigate to="/driver/dashboard" replace />;
  }

  // If specific route has allowedRoles constraint
  if (allowedRoles && allowedRoles.length > 0 && !allowedRoles.includes(userRole)) {
    if (userRole === "DELIVERY_PERSON") {
      return <Navigate to="/driver/dashboard" replace />;
    } else if (userRole === "RESTAURANT_OWNER") {
      return <Navigate to="/admin/dashboard" replace />;
    } else if (userRole === "SUPER_ADMIN") {
      return <Navigate to="/superadmin/dashboard" replace />;
    } else {
      return <Navigate to="/" replace />;
    }
  }

  // Otherwise, show the protected page
  return children;
};

export default ProtectedRoute;
