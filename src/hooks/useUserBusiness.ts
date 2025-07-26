// src/hooks/useUserBusiness.ts
import { useAuth0 } from "@auth0/auth0-react";
import { useCentralizedLogout } from "./useCentralizedLogout";
import { useCallback, useEffect, useState } from "react";
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
  business: Business;
}

export const useUserWithBusiness = (enabled = true) => {
  const { user, isAuthenticated, getAccessTokenSilently } = useAuth0();
  const centralizedLogout = useCentralizedLogout();
  const [userData, setUserData] = useState<UserWithBusiness>();
  const API_URL = import.meta.env.VITE_API_URL;

  const fetchUserData = useCallback(async () => {
    const result = await retryWithLogoutFallback<UserWithBusiness>(
      async () => {
        const token = await getAccessTokenSilently();
        if (!user?.sub) throw new Error("User sub is missing");

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
      centralizedLogout
    );

    if (result) setUserData(result);
  }, [API_URL, getAccessTokenSilently, user?.sub]);

  useEffect(() => {
    if (enabled && isAuthenticated && user) {
      fetchUserData();
    }
  }, [enabled, isAuthenticated, user, fetchUserData]);

  return { userData, refetch: fetchUserData };
};
