import type { UserConfig } from "vite";
import react from "@vitejs/plugin-react";

import tailwindcss from "@tailwindcss/vite";

export default {
  plugins: [react(), tailwindcss()],
  server: {
    proxy: {
      // redirige cualquier /advisor a http://localhost:8000/advisor
      "/advisor": {
        target: "http://localhost:8000",
        changeOrigin: true,
        secure: false,
      },
      // si mañana tienes más endpoints, puedes hacer:
      // "^/api/.*": "http://localhost:8000"
    },}
  // ...
} satisfies UserConfig;
