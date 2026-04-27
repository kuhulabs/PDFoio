import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

createRoot(document.getElementById("root")!).render(<App />);

// Register the service worker only in production builds. The Vite dev server
// emits HMR-aware modules that don't play well with caching, so we skip SW
// during development to avoid stale assets while iterating.
if ("serviceWorker" in navigator && import.meta.env.PROD) {
  window.addEventListener("load", () => {
    navigator.serviceWorker
      .register("/sw.js")
      .catch((err) => {
        // Non-fatal — the app works without the SW; just log for debugging.
        console.warn("SW registration failed:", err);
      });
  });
}
