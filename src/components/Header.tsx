/** @format */

// src/components/Header/Header.tsx
import React, { useEffect } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { useNavigate, useLocation } from "react-router-dom";
import UserDropdown from "./UserDropdown";

type HeaderProps = {
  userData: {
    business_name: string | null;
  } | null;
};

const Header: React.FC<HeaderProps> = ({ userData }) => {
  const { user, isAuthenticated, logout, isLoading } = useAuth0();
  const navigate = useNavigate();
  const location = useLocation();

  const businessName = userData?.business_name || "EmprendePlus";

  useEffect(() => {
    if (!isLoading && !isAuthenticated && location.pathname !== "/auth") {
      navigate("/auth");
    }
  }, [isLoading, isAuthenticated, location.pathname, navigate]);

  return (
    <header className="sticky top-0 z-48 w-full bg-white border-b border-gray-200 dark:bg-neutral-800 dark:border-neutral-700">
      <nav className="flex items-center justify-between px-4 py-2.5">
        <div className="flex items-center gap-2" />
        <div className="flex items-center gap-2">
          {isAuthenticated && user && (
            <UserDropdown
              userName={user.name || "Usuario"}
              businessName={businessName}
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
          )}
        </div>
      </nav>
    </header>
  );
};

export default Header;
