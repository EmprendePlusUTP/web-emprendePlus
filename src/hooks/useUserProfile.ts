/** @format */

import { useEffect, useRef, useState } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import {
  getUserProfile,
  registerUserSession,
} from "../services/userProfileServices";

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
  const { user, isAuthenticated, getAccessTokenSilently, logout } = useAuth0();
  const [data, setData] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const hasRegistered = useRef(false);

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
        const token = await getAccessTokenSilently();

        await registerUserSession(
          {
            sub: user.sub,
            email: user.email,
            name: user.name,
          },
          token,
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
  }, [isAuthenticated, user, getAccessTokenSilently]);

  return { data, loading };
}

export async function retryWithAuthFail<T>(
  fetchFn: () => Promise<T>,
  retries: number = 3,
  delayMs: number = 2000
): Promise<T | null> {
  const { logout } = useAuth0();
  for (let i = 0; i < retries; i++) {
    try {
      return await fetchFn();
    } catch (err) {
      console.warn(`Intento ${i + 1} fallido:`, err);
      if (i < retries - 1) await new Promise((r) => setTimeout(r, delayMs));
    }
  }

  // Si falla después de todos los intentos
  logout({
    logoutParams: { returnTo: window.location.origin },
  });
  return null;
}
