/** @format */

// src/components/ProtectedRoute.tsx
import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";
import FullPageLoader from "./FullPageLoader";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth0();

  // Mientras esté chequeando la sesión, mostramos loader
  if (isLoading) {
    return <FullPageLoader />;
  }

  // Si NO está autenticado, vamos a /auth (oágina de login interno)
  if (!isAuthenticated) {
    return <Navigate to="/auth" replace />;
  }

  // Si está autenticado, renderizamos el resto de la app
  return <>{children}</>;
};

export default ProtectedRoute;
