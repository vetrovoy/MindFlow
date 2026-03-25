import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";

import { MindFlowProvider } from "../shared/model/mindflow-provider";
import { ThemeVariables } from "./providers/theme-variables";
import "./styles/global.css";
import { App } from "./App";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter>
      <ThemeVariables />
      <MindFlowProvider>
        <App />
      </MindFlowProvider>
    </BrowserRouter>
  </React.StrictMode>
);
