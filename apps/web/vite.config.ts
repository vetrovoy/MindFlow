import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: "autoUpdate",
      manifest: {
        name: "MindFlowApp",
        short_name: "MindFlow",
        description: "Offline-first task planning across Inbox, Lists, and Today.",
        theme_color: "#0A0A0A",
        background_color: "#0A0A0A",
        display: "standalone",
        start_url: "/inbox"
      },
      devOptions: {
        enabled: true
      }
    })
  ]
});
