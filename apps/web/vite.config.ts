import fs from "node:fs";
import { fileURLToPath, URL } from "node:url";

import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";

const devKeyUrl = new URL("./.cert/dev-key.pem", import.meta.url);
const devCertUrl = new URL("./.cert/dev-cert.pem", import.meta.url);

const hasLocalHttpsCerts =
  fs.existsSync(devKeyUrl) && fs.existsSync(devCertUrl);

export default defineConfig({
  server: {
    host: "0.0.0.0",
    port: 4174,
    https: hasLocalHttpsCerts
      ? {
          key: fs.readFileSync(devKeyUrl),
          cert: fs.readFileSync(devCertUrl)
        }
      : undefined
  },
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url))
    },
    extensions: [".ts", ".tsx", ".js", ".jsx", ".json"]
  },
  optimizeDeps: {
    exclude: ["react-native", "@op-engineering/op-sqlite"]
  },
  plugins: [
    react(),
    VitePWA({
      registerType: "autoUpdate",
      manifest: {
        name: "Task Planner",
        short_name: "Planner",
        description:
          "Offline-first task planning across Inbox, Lists, and Today.",
        theme_color: "#0A0A0A",
        background_color: "#0A0A0A",
        display: "standalone",
        start_url: "/"
      },
      devOptions: {
        enabled: true
      }
    })
  ]
});
