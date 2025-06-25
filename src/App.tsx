/** @format */

import { BrowserRouter, Routes, Route } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";
import AuthPage from "./pages/auth/AuthPage";
import Layout from "./layouts/Layout";
import Dashboard from "./pages/Dashboard";
import Products from "./pages/Products";
import ProductDetail from "./pages/ProductDetail";
import Sales from "./pages/Sales";
import Profile from "./pages/Profile";
import NotFound from "./pages/NotFoundPage";
import BusinessSettings from "./pages/Business";
import { UserProvider } from "./contexts/UserContext";
import Finances from "./pages/Finances";
import FinancesDetails from "./pages/FinancesDetails";
import SaleDetail from "./pages/SaleDetail";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Ruta pública de login/signup */}
        <Route path="/auth" element={<AuthPage />} />

        {/* Todo lo que esté dentro de este Route estará protegido */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <UserProvider>
                <Layout />
              </UserProvider>
            </ProtectedRoute>
          }
        >
          {/* Rutas hijas del layout */}
          <Route index element={<Dashboard />} />
          <Route path="products" element={<Products />} />
          <Route path="products/:id" element={<ProductDetail />} />
          <Route path="sales" element={<Sales />} />
          <Route path="profile" element={<Profile />} />
          <Route path="business" element={<BusinessSettings />} />
          <Route path="finances" element={<Finances />} />
          <Route path="finances/details" element={<FinancesDetails />} />
          <Route path="/sales/:id" element={<SaleDetail />} />
        </Route>
        <Route path="*" element={<NotFound />} />
      </Routes>
      <ToastContainer position="top-right" autoClose={3000} theme="colored" />
    </BrowserRouter>
  );
}

export default App;
