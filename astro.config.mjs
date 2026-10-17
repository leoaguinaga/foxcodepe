// @ts-check
import { defineConfig } from "astro/config";
import tailwindcss from "@tailwindcss/vite";
import react from "@astrojs/react";
import vercel from "@astrojs/vercel";

// https://astro.build/config
export default defineConfig({
  output: "server",
  // /productos se integró en /proyectos (los productos propios tienen su filtro).
  redirects: {
    "/productos": { status: 301, destination: "/proyectos?f=producto" },
  },
  adapter: vercel({
    webAnalytics: {
      enabled: true,
    },
  }),
  integrations: [react()],
  vite: {
    plugins: [
      tailwindcss(),
    ],
  },
});
