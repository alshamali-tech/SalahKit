import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { ErrorBoundary } from "./components/ui/ErrorBoundary";

// Legacy hash routes (/#/tools/quran → /tools/quran), once, before React mounts.
if (window.location.hash.startsWith("#/")) {
  const path = window.location.hash.slice(1) || "/";
  window.history.replaceState({}, "", path + window.location.search);
}

// Dev hygiene: a service worker registered by an earlier production
// preview on this origin would otherwise intercept the dev server and
// produce "FetchEvent ... network error response" noise. Dev never
// registers one, so unregister any leftover and drop its caches.
if (import.meta.env.DEV && "serviceWorker" in navigator) {
  void navigator.serviceWorker.getRegistrations().then((regs) => {
    regs.forEach((reg) => void reg.unregister());
  });
  if ("caches" in window) {
    void caches.keys().then((keys) => keys.forEach((k) => void caches.delete(k)));
  }
}

ReactDOM.createRoot(document.getElementById("root")!).render(
  <ErrorBoundary>
    <App />
  </ErrorBoundary>
);