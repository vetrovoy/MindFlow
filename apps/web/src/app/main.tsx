import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";

import { AppStoreProvider } from "@/shared/model/app-store-provider";
import { AuthProvider } from "@/app/providers/auth-provider";
import { ThemeProvider } from "@/app/providers/theme-provider";
import { ThemeVariables } from "@/app/providers/theme-variables";
import { LanguageProvider } from "@/app/providers/language-provider";
import "./styles/global.css";
import { App } from "@/app/App";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter>
      <ThemeProvider>
        <ThemeVariables />
        <LanguageProvider>
          <AuthProvider>
            <AppStoreProvider>
              <App />
            </AppStoreProvider>
          </AuthProvider>
        </LanguageProvider>
      </ThemeProvider>
    </BrowserRouter>
  </React.StrictMode>
);
