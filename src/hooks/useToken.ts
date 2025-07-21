/** @format */

// src/hooks/useToken.ts
import { useAuthService } from "../services/authServices";
import { useCallback } from "react";

export const useToken = () => {
  const { getToken, logoutUser } = useAuthService();

  const getTokenWithRetry = useCallback(
    async (retries = 3, delayMs = 1000): Promise<string | null> => {
      for (let i = 0; i < retries; i++) {
        try {
          const token = await getToken();
          return token;
        } catch (err: any) {
          console.warn(`🔁 Token retry ${i + 1} failed`, err);

          // Si es un error por falta de refresh token o login_required, salir
          const errorCode = err?.error || err?.message;
          if (
            errorCode === "login_required" ||
            errorCode === "consent_required" ||
            errorCode?.includes("Missing Refresh Token")
          ) {
            logoutUser();
            return null;
          }

          if (i < retries - 1) await new Promise((res) => setTimeout(res, delayMs));
        }
      }

      logoutUser();
      return null;
    },
    [getToken, logoutUser]
  );

  return {
    getTokenWithRetry,
  };
};
