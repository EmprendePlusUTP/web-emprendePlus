/** @format */

// src/hooks/useUserBusiness.ts
import { useAuth0 } from "@auth0/auth0-react";
import { useEffect, useState } from "react";
import { retryWithLogoutFallback } from "../utils/retryWithLogout";

interface Business {
  id: string;
  name: string;
  description: string;
}

interface UserWithBusiness {
  id: string;
  name: string;
  business_name: string | null;
  businesses: Business[];
}

export const useUserWithBusiness = (enabled = true) => {
  const { user, isAuthenticated, getAccessTokenSilently, logout } = useAuth0();
  const [userData, setUserData] = useState<UserWithBusiness | null>(null);
  const API_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    if (!enabled || !user || !isAuthenticated) return;

    const tryFetchUser = async () => {
      const result = await retryWithLogoutFallback<UserWithBusiness>(
        async () => {
          const token = await getAccessTokenSilently();
          if (!user.sub) throw new Error("User sub is missing");

          const response = await fetch(
            `${API_URL}/api/users/${encodeURIComponent(user.sub)}`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );

          if (!response.ok) throw new Error("Failed to fetch user profile");
          return await response.json();
        },
        () =>
          logout({
            logoutParams: {
              returnTo: `${window.location.origin}/auth`,
            },
          })
      );

      if (result) setUserData(result);
    };

    tryFetchUser();
  }, [enabled, user, isAuthenticated, getAccessTokenSilently]);

  return { userData };
};
