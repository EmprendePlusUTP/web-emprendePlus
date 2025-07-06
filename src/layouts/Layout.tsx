/** @format */

// src/components/Layout.tsx
import React, { useEffect, useRef, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import ChatWidget from "../components/ChatWidget";
import ScrollToTop from "../components/ScrollTop";
import { useAuth0 } from "@auth0/auth0-react";
import { registerUserSession } from "../services/userProfileServices";
import { NavItem } from "../types/navigation";
import { House, PackageSearch, HandCoins, BadgeDollarSign } from "lucide-react";
import { useUserWithBusiness } from "../hooks/useUserBusiness";
import FullPageLoader from "../components/FullPageLoader";
import Modal from "../components/Modal";

const navItems: NavItem[] = [
  { label: "Inicio", to: "/", icon: <House /> },
  { label: "Productos", to: "/products", icon: <PackageSearch /> },
  { label: "Ventas", to: "/sales", icon: <HandCoins /> },
  { label: "Finanzas", to: "/finances", icon: <BadgeDollarSign /> },
];

const Layout: React.FC = () => {
  const { user, isAuthenticated, getAccessTokenSilently, logout } = useAuth0();
  const hasSentSession = useRef(false);
  const [sessionReady, setSessionReady] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const sendSession = async () => {
      if (!isAuthenticated || !user || hasSentSession.current) return;
      if (!user.sub || !user.email || !user.name) return;

      hasSentSession.current = true;
      try {
        const token = await getAccessTokenSilently();

        await registerUserSession(
          {
            sub: user.sub,
            email: user.email,
            name: user.name,
          },
          token,
          () => logout({ logoutParams: { returnTo: window.location.origin } })
        );

        setSessionReady(true);
      } catch (err) {
        console.error("❌ Error en registerSession:", err);
      }
    };

    sendSession();
  }, [isAuthenticated, user]);
  const { userData } = useUserWithBusiness(sessionReady);

  // Redirección según el estado de negocios del usuario
  useEffect(() => {
    if (!userData || !userData.id) return;

    // Usar un flag único por usuario
    const userKey = `newUserRedirected_${userData.id || userData.sub || ''}`;

    const hasValidBusiness = Array.isArray(userData.businesses) && userData.businesses.some(
      (b) => b && b.id && b.name && b.name.trim() !== ""
    );

    // Si el usuario NO tiene negocios, lo llevamos a /business SOLO la primera vez
    if (!hasValidBusiness) {
      const alreadyRedirected = sessionStorage.getItem(userKey);
      if (!alreadyRedirected) {
        sessionStorage.setItem(userKey, "true");
        if (window.location.pathname !== "/business") {
          navigate("/business", { replace: true });
        }
      }
      return;
    }

    // Si el usuario YA tiene negocio, siempre lo llevamos al inicio
    if (sessionStorage.getItem(userKey)) {
      sessionStorage.removeItem(userKey);
    }
    if (window.location.pathname !== "/") {
      navigate("/", { replace: true });
    }
  }, [userData, navigate]);

  if (!userData) {
    return <FullPageLoader />;
  }
  return (
    <div className="min-h-screen flex bg-neutral-900 dark:bg-neutral-900">
      <Sidebar items={navItems} />
      <div className="flex-1 flex flex-col lg:ml-65 transition-all">
        <Header userData={userData} />
        <main className="flex-1 p-6 pb-20 min-h-[calc(100vh-64px)]">
          <ScrollToTop />
          <Outlet />
        </main>
        <div className="absolute right-4 bottom-4 z-50">
          <ChatWidget />
        </div>
      </div>
    </div>
  );
};

export default Layout;
