import { Navigate } from "react-router-dom";
import { getCurrentUser, homeRouteForRole } from "../lib/auth";
import { canAccess } from "../lib/access";

/**
 * Gates a route on both sign-in and role.
 *
 * Without `allowedRoles` any signed-in user may enter. With it, anyone else is
 * sent to their own home rather than shown a page that isn't theirs -- a
 * delivery person has no use for the checkout, and a customer has no business
 * in the admin dashboard.
 */
const ProtectedRoute = ({ children, allowedRoles }) => {
  const token = localStorage.getItem("authToken");

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  const user = getCurrentUser();

  if (!canAccess(user?.role, allowedRoles)) {
    return <Navigate to={homeRouteForRole(user?.role)} replace />;
  }

  return children;
};

export default ProtectedRoute;
