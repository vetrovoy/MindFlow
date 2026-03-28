import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";

import { MindFlowProvider } from "@/shared/model/mindflow-provider";
import { ThemeVariables } from "@/app/providers/theme-variables";
import { LanguageProvider } from "@/app/providers/language-provider";
import "./styles/global.css";
import { App } from "@/app/App";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter>
      <ThemeVariables />
      <LanguageProvider>
        <MindFlowProvider>
          <App />
        </MindFlowProvider>
      </LanguageProvider>
    </BrowserRouter>
  </React.StrictMode>
);
