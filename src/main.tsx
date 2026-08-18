import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";
import { reportWebVitals } from "./utils/performance";
import { registerServiceWorker } from "./utils/serviceWorker";
import { initMonitoring } from "./utils/monitoring";

// Initialize error monitoring
initMonitoring();

createRoot(document.getElementById("root")!).render(<App />);

// Register Service Worker (production only)
registerServiceWorker(() => {
  console.log('[App] New version available');
});

// Report Web Vitals in production
if (import.meta.env.PROD) {
  reportWebVitals((metric) => {
    console.log(`[WebVital] ${metric.name}: ${metric.value.toFixed(1)}ms (${metric.rating})`);
  });
}
