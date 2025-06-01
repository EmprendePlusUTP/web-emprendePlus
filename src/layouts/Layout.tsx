// src/components/Layout.tsx
import React from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import { NavItem } from "../types/navigation";
import Header from "../components/Header";
import { House, PackageSearch, HandCoins, BadgeDollarSign } from "lucide-react";
import ChatWidget from "../components/ChatWidget";

const navItems: NavItem[] = [
  {
    label: "Inicio",
    to: "/",
    icon: (
      <div>
        <House />
      </div>
    ),
  },
  {
    label: "Productos",
    to: "/products",
    icon: (
      <div>
        <PackageSearch />
      </div>
    ),
  },
  {
    label: "Pedidos",
    to: "/orders",
    icon: (
      <div>
        <HandCoins />
      </div>
    ),
  },
  {
    label: "Finanzas",
    to: "/finances",
    icon: (
      <div>
        <BadgeDollarSign />
      </div>
    ),
  },
];

const Layout: React.FC = () => (
  <div className="min-h-max flex bg-gray-50 dark:bg-neutral-900">
    <Sidebar items={navItems} />

    <div className="flex-1 flex flex-col lg:ml-65 transition-all">
      {/* Header aquí */}
      <Header />
      <main className="flex-1 p-6 max-h-fit">
        <Outlet />
      </main>
      <div className="absolute right-0 bottom-0">
        <ChatWidget />
      </div>
    </div>
  </div>
);

export default Layout;
