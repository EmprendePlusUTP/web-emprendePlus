/** @format */

// src/contexts/UserContext.tsx
import React, { createContext, useContext } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import Loading from "../components/Loading";

export type UserContextType = {
  userId: string;
  userName: string;
  businessName: string;
  currency: string;
  salesHistory: { date: string; revenue: number }[];
  topProduct: {
    id: string;
    name: string;
    monthlySales: number;
    profitMargin: number;
    supplier: string;
    stock: number;
  };
  productList: {
    id: string;
    name: string;
    monthlySales: number;
    supplier: string;
    stock: number;
  }[];
};

const UserContext = createContext<UserContextType | null>(null);

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { user, isLoading, isAuthenticated } = useAuth0();

  // Mientras Auth0 está cargando o no está autenticado, mostramos Loading
  if (isLoading || !isAuthenticated || !user) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loading />
      </div>
    );
  }

  // Construimos el contexto con datos reales de Auth0 y mocks adicionales
  const ctx: UserContextType = {
    userId: user.sub || "",
    userName: user.name || "",
    businessName: "EmprendePlus",
    currency: "USD",

    salesHistory: [],
    topProduct: {
      id: "",
      name: "",
      monthlySales: 0,
      profitMargin: 0,
      supplier: "",
      stock: 0,
    },
    productList: [],
  };

  return <UserContext.Provider value={ctx}>{children}</UserContext.Provider>;
};

export function useUserContext(): UserContextType {
  const ctx = useContext(UserContext);
  if (!ctx) {
    throw new Error("useUserContext debe usarse dentro de UserProvider");
  }
  return ctx;
}
