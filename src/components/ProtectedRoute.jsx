import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem("authToken");

  if (!token) {
    // If no token, redirect to login page
    return <Navigate to="/login" replace />;
  }

  // Otherwise, show the page
  return children;
};

export default ProtectedRoute;
