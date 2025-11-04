import { useContext } from "react";
import { AppContext } from "../context/AppContext";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useContext(AppContext);
  return isAuthenticated ? children : <Navigate to="/" replace />;
};

export default ProtectedRoute;