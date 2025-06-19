// src/hooks/useUserBusiness.ts
import { useAuth0 } from "@auth0/auth0-react";
import { useEffect, useState } from "react";

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

export const useUserWithBusiness = () => {
  const { user, isAuthenticated, getAccessTokenSilently } = useAuth0();
  const [userData, setUserData] = useState<UserWithBusiness | null>(null);
  const API_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    const fetchUserData = async () => {
      if (!user || !isAuthenticated) return;
      try {
        const token = await getAccessTokenSilently();
        if (!user?.sub) return;
        const response = await fetch(`${API_URL}/api/users/${encodeURIComponent(user.sub)}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await response.json();
        setUserData(data);
      } catch (error) {
        console.error("Error fetching user with business:", error);
      }
    };

    fetchUserData();
  }, [user, isAuthenticated, getAccessTokenSilently]);

  return { userData };
};
