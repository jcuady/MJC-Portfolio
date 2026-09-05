import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import { ThemeProvider } from "./lib/theme.jsx";
import { CertViewerProvider } from "./lib/certViewer.jsx";
import "./index.css";

// Prevent flash of wrong theme before React hydrates styles (light is default)
const saved = localStorage.getItem("mc-theme");
const initial = saved === "light" || saved === "dark" ? saved : "light";
document.documentElement.classList.add(initial);
document.documentElement.dataset.theme = initial;

// Drop stale Workbox SWs from other localhost apps (causes fake manifest/404 noise)
if (import.meta.env.DEV && "serviceWorker" in navigator) {
  navigator.serviceWorker.getRegistrations().then((regs) => {
    regs.forEach((r) => r.unregister());
  });
}

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ThemeProvider>
      <CertViewerProvider>
        <App />
      </CertViewerProvider>
    </ThemeProvider>
  </React.StrictMode>
);
