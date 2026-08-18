/**
 * Service Worker 등록 및 업데이트 관리.
 *
 * - 자동 등록 (production only)
 * - 새 버전 감지 → 사용자에게 업데이트 안내
 * - 업데이트 적용 (skipWaiting 호출)
 */

type UpdateCallback = () => void;

let updateCallback: UpdateCallback | null = null;

/**
 * Register the service worker.
 * Call this once on app startup (production only).
 */
export async function registerServiceWorker(onUpdate?: UpdateCallback): Promise<void> {
  if (!('serviceWorker' in navigator)) return;
  if (import.meta.env.DEV) return; // Skip in development

  updateCallback = onUpdate || null;

  try {
    const registration = await navigator.serviceWorker.register('/sw.js', {
      scope: '/',
    });

    // Check for updates periodically (every 60 minutes)
    setInterval(() => {
      registration.update().catch(() => {});
    }, 60 * 60 * 1000);

    // Listen for new service worker installing
    registration.addEventListener('updatefound', () => {
      const newWorker = registration.installing;
      if (!newWorker) return;

      newWorker.addEventListener('statechange', () => {
        if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
          // New version available
          updateCallback?.();
        }
      });
    });

    console.log('[SW] Registered successfully');
  } catch (error) {
    console.warn('[SW] Registration failed:', error);
  }
}

/**
 * Force the waiting service worker to activate (apply update).
 * Call this when user confirms the update.
 */
export async function applyServiceWorkerUpdate(): Promise<void> {
  const registration = await navigator.serviceWorker.getRegistration();
  if (registration?.waiting) {
    registration.waiting.postMessage({ type: 'SKIP_WAITING' });
    window.location.reload();
  }
}

/**
 * Unregister all service workers (for debugging/reset).
 */
export async function unregisterServiceWorker(): Promise<void> {
  if (!('serviceWorker' in navigator)) return;
  const registrations = await navigator.serviceWorker.getRegistrations();
  for (const registration of registrations) {
    await registration.unregister();
  }
}
