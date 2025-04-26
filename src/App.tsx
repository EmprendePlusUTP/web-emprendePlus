import {
  Route,
  createBrowserRouter,
  createRoutesFromElements,
  RouterProvider,
  Outlet, //Exports the reactDom route to the layout
} from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/auth/Login";
import Layout from "./components/Layout";
import AuthLayout from "./components/AuthLayout";

function App() {
  const router = createBrowserRouter(
    createRoutesFromElements(
      <>
        <Route path="/login" element={<AuthLayout />}>
          <Route index element={<Login />} />
        </Route>
        <Route path="/" element={<Layout />}>
          <Route path="home" element={<Home />} />
        </Route>
        <Route path="/dashboard" element={<Layout />}>
          <Route path="dashboard" element={<Home />} />
        </Route>
      </>
    )
  );

  return <RouterProvider router={router} />;
}

export default App;
