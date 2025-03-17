import React from "react";
import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectCurrentAuth } from "../redux/auth/authSlice";

interface ProtectedRouteProps {
  children: JSX.Element;
  requiredRole?: "kitchen" | "waiter";
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  requiredRole,
}) => {
  const { id, role } = useSelector(selectCurrentAuth);

  if (!id) {
    // User is not authenticated
    return <Navigate to="/login" replace />;
  }

  if (requiredRole && role !== requiredRole) {
    // User does not have the required role
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
};

export default ProtectedRoute;
