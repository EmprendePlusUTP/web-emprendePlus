/** @format */

import { useEffect, useState } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { useNavigate, useLocation } from "react-router-dom";
import UserDropdown from "./UserDropdown";
import {
  getCachedAvatar,
  saveAvatarToCache,
  clearCachedAvatar,
} from "../utils/avatarCache";
import { useUserContext } from "../contexts/UserContext";

const Header = () => {
  const { user, isAuthenticated, logout, isLoading } = useAuth0();
  const navigate = useNavigate();
  const location = useLocation();

  const { businessName } = useUserContext();
  const [avatarUrl, setAvatarUrl] = useState<string | undefined>(undefined);

  // 1. Al cargar, busca la imagen cacheada
  useEffect(() => {
    const cached = getCachedAvatar();
    if (cached) {
      setAvatarUrl(cached);
    }
  }, []);

  // 2. Cuando se detecta un nuevo usuario logueado, guarda la imagen si no estaba guardada
  useEffect(() => {
    if (user?.picture && avatarUrl !== user.picture) {
      saveAvatarToCache(user.picture);
      setAvatarUrl(user.picture);
    }
  }, [user?.picture]);

  useEffect(() => {
    if (!isLoading && !isAuthenticated && location.pathname !== "/auth") {
      clearCachedAvatar();
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
              avatarUrl={avatarUrl}
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
