import React, { useContext, useEffect } from "react";
import { UserContext } from "./UserProvide";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

const isTokenExpired = (token) => {
  try {
    const decoded = jwtDecode(token);
    return decoded.exp * 1000 < Date.now(); // Compare expiry time with current time
  } catch (e) {
    return true; // Treat as expired if there's an error
  }
};

const ProtectedRoute = ({ children }) => {
  const navigate = useNavigate();
  const { user, setUser } = useContext(UserContext);
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!user || !token || isTokenExpired(token)) {
      localStorage.removeItem("token"); // Remove expired token
      setUser(null); // Clear user context
      navigate("/login"); // Redirect to login
    }
  }, [user, token, navigate, setUser]);

  return user ? children : null;
};
export default ProtectedRoute;
