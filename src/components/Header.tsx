// src/components/Header/Header.tsx
import React, { useEffect } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { useNavigate, useLocation } from "react-router-dom";
import UserDropdown from "./UserDropdown";

const Header: React.FC = () => {
  const { user, isAuthenticated, logout, isLoading } = useAuth0();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Si ya cargó Auth0, NO estás autenticado y NO estás ya en /auth
    if (!isLoading && !isAuthenticated && location.pathname !== "/auth") {
      navigate("/auth");
    }
  }, [isLoading, isAuthenticated, location.pathname, navigate]);

  return (
    <header className="sticky top-0 z-48 w-full bg-white border-b border-gray-200 dark:bg-neutral-800 dark:border-neutral-700">
      <nav className="flex items-center justify-between px-4 py-2.5">
        <div className="flex items-center gap-2">
          {/* Aquí puedes agregar otros elementos del menú */}
        </div>

        <div className="flex items-center gap-2">
          {isAuthenticated && user ? (
            <UserDropdown
              userName={user.name || "Usuario"}
              businessName={
                // claim personalizado
                (user as any)["https://tu-app.com/businessName"] ||
                "EmprendePlus"
              }
              email={user.email || ""}
              avatarUrl={user.picture || undefined}
              onLogout={() =>
                logout({
                  logoutParams: {
                    returnTo: `${window.location.origin}/auth`,
                  },
                })
              }
            />
          ) : null}
        </div>
      </nav>
    </header>
  );
};

export default Header;
