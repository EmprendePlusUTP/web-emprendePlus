/** @format */

// src/services/authService.ts
import { Auth0ContextInterface, useAuth0 } from "@auth0/auth0-react";

const audience = import.meta.env.VITE_AUTH0_AUDIENCE;

export const useAuthService = () => {
  const {
    loginWithRedirect,
    logout,
    getAccessTokenSilently,
    isAuthenticated,
    user,
  }: Auth0ContextInterface = useAuth0();

const login = async (loginHint?: string, screenHint?: "signup" | "login") => {
  await loginWithRedirect({
    authorizationParams: {
      audience,
      scope: "openid profile email offline_access",
      ...(loginHint ? { login_hint: loginHint } : {}),
      ...(screenHint === "signup"
        ? { screen_hint: "signup", prompt: "consent" }
        : {}),
    },
  });
};

  const loginWithSocial = async (connection: "google-oauth2" | "windowslive") => {
    await loginWithRedirect({
      authorizationParams: {
        connection,
        audience,
        scope: "openid profile email offline_access"
      },
    });
  };

  const getToken = async () => {
    try {
      const token = await getAccessTokenSilently();
      return token;
    } catch (err) {
      console.error("❌ Error getting token:", err);
      throw err;
    }
  };

  const logoutUser = () => {
    logout({
      logoutParams: {
        returnTo: `${window.location.origin}/auth`,
      },
    });
  };

  return {
    isAuthenticated,
    user,
    login,
    loginWithSocial,
    getToken,
    logoutUser,
  };
};
