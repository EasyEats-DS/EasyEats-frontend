import { jwtDecode } from "jwt-decode";

export const getUserFromToken = () => {
  const token = localStorage.getItem("authToken");
  if (!token) return null;

  try {
    const decoded = jwtDecode(token);
    
    return decoded;
  } catch (error) {
    console.error("Invalid token format:", error);
    return null;
  }
};
