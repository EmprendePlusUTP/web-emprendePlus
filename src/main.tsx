// src/main.tsx
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "preline/dist/preline.js";
import "./styles.css";
import { Auth0Provider } from "@auth0/auth0-react";

// Lee las vars de entorno (con Vite deben ir prefijadas con VITE_)
const domain = import.meta.env.VITE_AUTH0_DOMAIN as string;
const clientId = import.meta.env.VITE_AUTH0_CLIENT_ID as string;
const redirectUri = import.meta.env.VITE_AUTH0_REDIRECT_URI as string;

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Auth0Provider
      domain={domain}
      clientId={clientId}
      authorizationParams={{
        redirect_uri: redirectUri,
      }}
      useRefreshTokens={true}
      cacheLocation="localstorage"
    >
      <App />
    </Auth0Provider>
  </React.StrictMode>
);
