import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { createTheme } from "@mui/material/styles";
import DashboardIcon from "@mui/icons-material/Dashboard";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import { AppProvider, type Navigation } from "@toolpad/core/AppProvider";
import { DashboardLayout } from "@toolpad/core/DashboardLayout";
import { useDemoRouter } from "@toolpad/core/internal";
import EmprendePlusLogo from "./Logos/EmprendePlusLogo";
import { WelcomeMessage } from "./WelcomeMessage";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const NAVIGATION: Navigation = [
  {
    segment: "dashboard",
    title: "Dashboard",
    icon: <DashboardIcon />,
    action: () => handleNavigation("dashboard"),
  },
  {
    segment: "orders",
    title: "Orders",
    icon: <ShoppingCartIcon />,
    action: () => handleNavigation("orders"),
  },
];

const demoTheme = createTheme({
  cssVariables: {
    colorSchemeSelector: "data-toolpad-color-scheme",
  },
  colorSchemes: { light: true, dark: true },
  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 600,
      lg: 1200,
      xl: 1536,
    },
  },
});

function DemoPageContent({ pathname }: { pathname: string }) {
  const renderContent = () => {
    switch (pathname) {
      case "/dashboard":
        return <Typography>Bienvenido al Dashboard</Typography>;
      case "/orders":
        return <Typography>Gestión de Órdenes</Typography>;
      default:
        return <Typography>Página no encontrada</Typography>;
    }
  };

  return (
    <Box
      sx={{
        py: 4,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        textAlign: "center",
      }}
    >
      {renderContent()}
      <WelcomeMessage />
    </Box>
  );
}

export default function DashboardLayoutBranding() {
  const router = useDemoRouter("/dashboard");
  const navigate = useNavigate();
  const [currentPath, setCurrentPath] = useState(router.pathname);

  const handleNavigation = (segment: string) => {
    const newPath = `/${segment}`;
    setCurrentPath(newPath);
    navigate(newPath);
  };

  const renderLayout = () => {
    switch (currentPath) {
      case "/dashboard":
        return (
          <DashboardLayout>
            {" "}
            <DemoPageContent pathname={currentPath} />{" "}
          </DashboardLayout>
        );
      case "/orders":
        return (
          <Box>
            {" "}
            <DemoPageContent pathname={currentPath} />{" "}
          </Box>
        );
      default:
        return <Typography>Página no encontrada</Typography>;
    }
  };

  return (
    <AppProvider
      navigation={NAVIGATION.map((navItem) => ({
      ...navItem,
      onClick: navItem.onClick,
      }))}
      branding={{
      logo: <EmprendePlusLogo />,
      title: "Emprende+",
      homeUrl: "/",
      }}
      router={router}
      theme={demoTheme}
    >
      {renderLayout()}
    </AppProvider>
  );
}
