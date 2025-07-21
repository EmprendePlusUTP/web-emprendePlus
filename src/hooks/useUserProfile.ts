/** @format */

import { useEffect, useRef, useState } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import {
  getUserProfile,
  registerUserSession,
} from "../services/userProfileServices";
import { useNavigate } from "react-router-dom";
import { useToken } from "./useToken";

type UserProfile = {
  user: {
    name: string;
    email: string;
  };
  business: {
    business_name: string;
  };
};

export function useUserProfile() {
  const { user, isAuthenticated, logout } = useAuth0();
  const [data, setData] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const hasRegistered = useRef(false);
  const navigate = useNavigate();
  const { getTokenWithRetry } = useToken(); // ⬅️ Uso del hook

  useEffect(() => {
    const fetchData = async () => {
      if (
        !isAuthenticated ||
        !user ||
        !user.sub ||
        !user.email ||
        !user.name ||
        hasRegistered.current
      )
        return;

      hasRegistered.current = true;

      try {
        const token = await getTokenWithRetry();
        if (!token) return;

        await registerUserSession(
          {
            sub: user.sub,
            email: user.email,
            name: user.name,
          },
          token,
          () => navigate("/banned", { replace: true }),
          () =>
            logout({
              logoutParams: {
                returnTo: `${window.location.origin}/auth`,
              },
            })
        );

        const profile = await getUserProfile(token);
        setData(profile);
      } catch (err) {
        console.error("❌ Error en useUserProfile:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [isAuthenticated, user, getTokenWithRetry]);

  return { data, loading };
}
