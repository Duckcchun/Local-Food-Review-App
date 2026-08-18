import { useState, useEffect, useCallback } from 'react';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

interface UsePWAReturn {
  /** Whether the app can be installed (install prompt available) */
  canInstall: boolean;
  /** Whether the app is already installed (standalone mode) */
  isInstalled: boolean;
  /** Whether an app update is available */
  hasUpdate: boolean;
  /** Whether the user is offline */
  isOffline: boolean;
  /** Trigger the install prompt */
  install: () => Promise<boolean>;
  /** Apply pending update (reload) */
  applyUpdate: () => void;
  /** Dismiss the install prompt */
  dismissInstall: () => void;
}

/**
 * PWA lifecycle hook.
 *
 * Manages:
 * - Install prompt (A2HS)
 * - Installed state detection
 * - Update availability
 * - Online/offline status
 */
export function usePWA(): UsePWAReturn {
  const [installPrompt, setInstallPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isInstalled, setIsInstalled] = useState(false);
  const [hasUpdate, setHasUpdate] = useState(false);
  const [isOffline, setIsOffline] = useState(!navigator.onLine);

  // Detect standalone mode (already installed)
  useEffect(() => {
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches
      || (navigator as any).standalone === true;
    setIsInstalled(isStandalone);
  }, []);

  // Capture beforeinstallprompt event
  useEffect(() => {
    const handler = (e: Event) => {
      e.preventDefault(); // Prevent auto-prompt
      setInstallPrompt(e as BeforeInstallPromptEvent);
    };
    window.addEventListener('beforeinstallprompt', handler);
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  // Listen for appinstalled event
  useEffect(() => {
    const handler = () => {
      setIsInstalled(true);
      setInstallPrompt(null);
    };
    window.addEventListener('appinstalled', handler);
    return () => window.removeEventListener('appinstalled', handler);
  }, []);

  // Online/offline detection
  useEffect(() => {
    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Register SW and listen for updates
  useEffect(() => {
    import('../utils/serviceWorker').then(({ registerServiceWorker }) => {
      registerServiceWorker(() => setHasUpdate(true));
    });
  }, []);

  const install = useCallback(async (): Promise<boolean> => {
    if (!installPrompt) return false;
    installPrompt.prompt();
    const { outcome } = await installPrompt.userChoice;
    setInstallPrompt(null);
    return outcome === 'accepted';
  }, [installPrompt]);

  const applyUpdate = useCallback(() => {
    import('../utils/serviceWorker').then(({ applyServiceWorkerUpdate }) => {
      applyServiceWorkerUpdate();
    });
  }, []);

  const dismissInstall = useCallback(() => {
    setInstallPrompt(null);
    try { sessionStorage.setItem('pwa-install-dismissed', 'true'); } catch {}
  }, []);

  const canInstall = !!installPrompt && !isInstalled;

  return {
    canInstall,
    isInstalled,
    hasUpdate,
    isOffline,
    install,
    applyUpdate,
    dismissInstall,
  };
}
