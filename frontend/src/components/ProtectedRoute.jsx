import React from "react";
import { Navigate } from "react-router-dom";
import { getToken, getRole } from "../services/api";

export default function ProtectedRoute({ role, children }) {
  const token = getToken();
  const currentRole = getRole();

  if (!token) return <Navigate to="/login" replace />;
  if (role && currentRole !== role) return <Navigate to="/login" replace />;

  return children;
}
