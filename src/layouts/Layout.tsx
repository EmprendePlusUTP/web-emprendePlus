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
import { updateBusinessName } from "../services/businessServices";
import { NavItem } from "../types/navigation";
import { House, PackageSearch, HandCoins, BadgeDollarSign } from "lucide-react";
import { useUserWithBusiness } from "../hooks/useUserBusiness";
import FullPageLoader from "../components/FullPageLoader";
import Modal from "../components/Modal";
import { toast } from "react-toastify";
import { useSQLiDetection } from "../hooks/useSQLiDetection";
import axios from "axios";
import { SecurityContext } from "../contexts/SecurityContext";

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
  const [showBusinessModal, setShowBusinessModal] = useState(false);
  const [newBusinessName, setNewBusinessName] = useState("");
  const [showBanModal, setShowBanModal] = useState(false);
  const { checkAll } = useSQLiDetection(async () => {
    const userId = user?.sub ?? "anon";
    await axios.post("/api/blacklist-user", {
      user_id: userId,
      reason: "Intentos de SQLi detectados",
    });
    setShowBanModal(true);
  });
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
          () => {
          navigate("/banned", { replace: true });
        },
          () =>  logout({
              logoutParams: {
                returnTo: `${window.location.origin}/auth`,
              },
            })
        );

        setSessionReady(true);
      } catch (err) {
        console.error("❌ Error en registerSession:", err);
      }
    };

    sendSession();
  }, [isAuthenticated, user]);

  const { userData, refetch } = useUserWithBusiness(sessionReady);

const [banCountdown, setBanCountdown] = useState(10);
const countdownRef = useRef<NodeJS.Timeout | null>(null);

useEffect(() => {
  if (showBanModal) {
    setBanCountdown(10);
    countdownRef.current = setInterval(() => {
      setBanCountdown((prev) => prev - 1);
    }, 1000);
  }
  return () => {
    if (countdownRef.current) clearInterval(countdownRef.current);
  };
}, [showBanModal]);

useEffect(() => {
  if (banCountdown === 0 && showBanModal) {
    logout({
      logoutParams: {
        returnTo: `${window.location.origin}/auth`,
      },
    });
  }
}, [banCountdown, showBanModal, logout]);

const handleBanReturn = () => {
  if (countdownRef.current) clearInterval(countdownRef.current);
  logout({
    logoutParams: {
      returnTo: `${window.location.origin}/auth`,
    },
  });
};

  useEffect(() => {
    if (userData?.business_name === "Mi negocio") {
      setShowBusinessModal(true);
    }
  }, [userData]);

  const handleUpdateBusiness = async () => {
    if (!newBusinessName.trim()) return;
    try {
      const token = await getAccessTokenSilently();
      await updateBusinessName(newBusinessName, token);
      toast.success("¡Nombre del negocio actualizado!");
      await refetch();
      setShowBusinessModal(false);
    } catch (err) {
      console.error("❌ Error actualizando nombre del negocio:", err);
      toast.error("Hubo un error al actualizar el negocio.");
    }
  };

  if (!userData) return <FullPageLoader />;

  return (
    <SecurityContext.Provider value={{ checkAll }}>
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
        {showBanModal && (
          <Modal onClose={() => {}} closable={false}>
            <h2 className="text-2xl font-bold text-center text-red-600 mb-4">
              Cuenta bloqueada
            </h2>
            <p className="text-lg text-gray-700 dark:text-gray-200 text-center mb-6">
              Se han detectado múltiples intentos de inyección SQL.
              <br />
              Por motivos de seguridad, tu cuenta ha sido bloqueada.
              <br />
              Serás deslogueado automáticamente.
            </p>
            <button
              onClick={handleBanReturn}
              className={`w-full py-3 rounded-lg font-bold text-lg transition flex items-center justify-center gap-3
      ${
        banCountdown > 0
          ? "bg-blue-600 hover:bg-blue-700 text-white"
          : "bg-gray-400 text-gray-200"
      }`}
              disabled={banCountdown <= 0}
            >
              {banCountdown > 0 && (
                <span className="animate-spin inline-block w-5 h-5 border-2 border-white border-t-blue-500 rounded-full mr-2" />
              )}
              Volver al inicio ({banCountdown})
            </button>
          </Modal>
        )}

        {showBusinessModal && (
          <Modal onClose={() => {}} closable={false}>
            <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">
              Configura tu negocio
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
              Antes de continuar, por favor ingresa el nombre de tu negocio:
            </p>
            <input
              type="text"
              value={newBusinessName}
              onChange={(e) => {
                setNewBusinessName(e.target.value);
                checkAll(e.target.value);
              }}
              placeholder="Nombre del negocio"
              className="w-full border border-gray-300 dark:border-neutral-600 rounded p-2 bg-white dark:bg-neutral-700 text-gray-900 dark:text-white mb-4"
            />
            <div className="flex justify-end">
              <button
                onClick={handleUpdateBusiness}
                disabled={!newBusinessName.trim()}
                className="py-2 px-4 bg-blue-600 text-white rounded hover:bg-blue-700 transition disabled:opacity-50"
              >
                Guardar
              </button>
            </div>
          </Modal>
        )}
      </div>
    </SecurityContext.Provider>
  );
};

export default Layout;
