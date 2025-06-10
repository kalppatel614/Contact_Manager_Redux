import React from "react";
import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

function ProtectedRoute({ children }) {
  const authStatus = useSelector((state) => state.auth.status);
  const authLoading = useSelector((state) => state.auth.loading);

  if (authLoading) {
    return null;
  }

  if (!authStatus) {
    return <Navigate to="/login" replace />;
  }
  return children;
}

export default ProtectedRoute;
