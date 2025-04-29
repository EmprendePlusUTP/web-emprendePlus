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
    // Claim personalizado en Auth0 para el nombre de negocio, o fallback
    // (user as any)["https://tu-app.com/businessName"] || "EmprendePlus",
    businessName: "EmprendePlus", // Mock para el nombre de negocio
    // Para más adelante, podrías fetchear la moneda y demás desde tu API
    currency: "USD",

    // Estos arrays pueden venir de tu API; por ahora, mock:
    salesHistory: [
      { date: "2025-01-01", revenue: 1200 },
      { date: "2025-02-01", revenue: 1500 },
      { date: "2025-03-01", revenue: 1800 },
    ],
    topProduct: {
      id: "p001",
      name: "Camiseta Premium",
      monthlySales: 500,
      profitMargin: 0.25,
      supplier: "Proveedor A",
      stock: 120,
    },
    productList: [
      {
        id: "p001",
        name: "Camiseta Premium",
        monthlySales: 500,
        supplier: "Proveedor A",
        stock: 120,
      },
      {
        id: "p002",
        name: "Gorra Trendy",
        monthlySales: 320,
        supplier: "Proveedor B",
        stock: 80,
      },
      // …
    ],
  };

  return (
    <UserContext.Provider value={ctx}>
      {children}
    </UserContext.Provider>
  );
};

export function useUserContext(): UserContextType {
  const ctx = useContext(UserContext);
  if (!ctx) {
    throw new Error("useUserContext debe usarse dentro de UserProvider");
  }
  return ctx;
}
