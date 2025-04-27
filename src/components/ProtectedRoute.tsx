// src/components/ProtectedRoute.tsx
import React from "react";
import { withAuthenticationRequired } from "@auth0/auth0-react";
import Loading from "./Loading"; // tu spinner

// Este componente simplemente renderiza sus hijos,
// pero pasa por Auth0 para protegerlos.
const ProtectedRoute = withAuthenticationRequired(
  ({ children }: { children: React.ReactNode }) => <>{children}</>,
  {
    onRedirecting: () => <Loading />,
  }
);

export default ProtectedRoute;
