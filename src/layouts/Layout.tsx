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
  const [showBusinessModal, setShowBusinessModal] = useState(false);

  useEffect(() => {
    if (
      userData &&
      (!Array.isArray(userData.businesses) || userData.businesses.length === 0)
    ) {
      navigate("/business");
      return;
    }
    if (
      userData &&
      Array.isArray(userData.businesses) &&
      userData.businesses.length > 0 &&
      userData.businesses[0].name === "Mi Negocio"
    ) {
      setShowBusinessModal(true);
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
        {showBusinessModal && (
          <Modal onClose={() => setShowBusinessModal(false)}>
            <div className="text-center">
              <h2 className="text-xl font-bold mb-4">¡Crea tu negocio!</h2>
              <p className="mb-4">Por favor, actualiza la información de tu negocio para continuar.</p>
              {/* Aquí puedes agregar el formulario o componente para actualizar el negocio */}
              <button
                className="mt-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                onClick={() => setShowBusinessModal(false)}
              >
                Cerrar
              </button>
            </div>
          </Modal>
        )}
      </div>
    </div>
  );
};

export default Layout;
