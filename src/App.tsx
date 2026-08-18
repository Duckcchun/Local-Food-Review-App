import { useEffect } from "react";
import { RouterProvider } from "react-router-dom";
import { Toaster } from "./components/ui/sonner";
import { router } from "./routes";
import { useAuthStore } from "./stores/authStore";
import { useDataLoader } from "./hooks/useDataLoader";

// Re-export types for backward compatibility with components that import from './App'
export type { UserInfo, Notification, NotificationType, Application, ApplicationStatus, Review } from "./types";

/**
 * App shell - thin wrapper around React Router.
 * All page logic is in src/pages/, state in src/stores/.
 */
export default function App() {
  const { restoreSession } = useAuthStore();

  // Restore session on mount
  useEffect(() => {
    restoreSession();
  }, []);

  // Load user data when authenticated (works outside router context)
  useDataLoader();

  return (
    <>
      <RouterProvider router={router} />
      <Toaster position="top-center" />
    </>
  );
}
