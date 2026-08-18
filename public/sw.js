/**
 * 밥터뷰 Service Worker
 *
 * 캐싱 전략:
 * - App Shell (HTML, CSS, JS): Cache-First (빠른 로딩)
 * - API 호출: Network-First (최신 데이터 우선, 실패 시 캐시)
 * - 이미지: Stale-While-Revalidate (캐시 반환 후 백그라운드 갱신)
 * - 폰트: Cache-First (변경 드묾)
 */

const CACHE_VERSION = 'v1';
const APP_SHELL_CACHE = `app-shell-${CACHE_VERSION}`;
const DYNAMIC_CACHE = `dynamic-${CACHE_VERSION}`;
const IMAGE_CACHE = `images-${CACHE_VERSION}`;

// App Shell 파일 (빌드 후 존재하는 핵심 자산)
const APP_SHELL_FILES = [
  '/',
  '/index.html',
  '/favicon.svg',
  '/manifest.webmanifest',
];

// 캐시하지 않을 URL 패턴
const NEVER_CACHE = [
  /\/api\//,
  /supabase\.co\/functions/,
  /chrome-extension/,
  /hot-update/,
];

// ─── Install ───────────────────────────────────────────────────────────────

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(APP_SHELL_CACHE).then((cache) => {
      return cache.addAll(APP_SHELL_FILES).catch((err) => {
        console.warn('[SW] Some app shell files failed to cache:', err);
      });
    })
  );
  // Activate immediately without waiting for old SW to finish
  self.skipWaiting();
});

// ─── Activate ──────────────────────────────────────────────────────────────

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys
          .filter((key) => key !== APP_SHELL_CACHE && key !== DYNAMIC_CACHE && key !== IMAGE_CACHE)
          .map((key) => caches.delete(key))
      );
    })
  );
  // Take control of all pages immediately
  self.clients.claim();
});

// ─── Fetch ─────────────────────────────────────────────────────────────────

self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET requests
  if (request.method !== 'GET') return;

  // Skip URLs that should never be cached
  if (NEVER_CACHE.some((pattern) => pattern.test(request.url))) return;

  // Strategy: Images → Stale-While-Revalidate
  if (request.destination === 'image' || /\.(png|jpg|jpeg|webp|svg|gif)$/i.test(url.pathname)) {
    event.respondWith(staleWhileRevalidate(request, IMAGE_CACHE));
    return;
  }

  // Strategy: Navigations (HTML) → Network-First with offline fallback
  if (request.mode === 'navigate') {
    event.respondWith(networkFirstWithFallback(request));
    return;
  }

  // Strategy: Static assets (JS, CSS, fonts) → Cache-First
  if (
    request.destination === 'script' ||
    request.destination === 'style' ||
    request.destination === 'font' ||
    /\.(js|css|woff2?)$/i.test(url.pathname)
  ) {
    event.respondWith(cacheFirst(request, APP_SHELL_CACHE));
    return;
  }

  // Default: Network-First
  event.respondWith(networkFirst(request, DYNAMIC_CACHE));
});

// ─── Caching Strategies ────────────────────────────────────────────────────

async function cacheFirst(request, cacheName) {
  const cached = await caches.match(request);
  if (cached) return cached;

  try {
    const response = await fetch(request);
    if (response.ok) {
      const cache = await caches.open(cacheName);
      cache.put(request, response.clone());
    }
    return response;
  } catch {
    return new Response('Offline', { status: 503 });
  }
}

async function networkFirst(request, cacheName) {
  try {
    const response = await fetch(request);
    if (response.ok) {
      const cache = await caches.open(cacheName);
      cache.put(request, response.clone());
    }
    return response;
  } catch {
    const cached = await caches.match(request);
    return cached || new Response('Offline', { status: 503 });
  }
}

async function networkFirstWithFallback(request) {
  try {
    const response = await fetch(request);
    if (response.ok) {
      const cache = await caches.open(APP_SHELL_CACHE);
      cache.put(request, response.clone());
    }
    return response;
  } catch {
    // Return cached index.html for SPA navigation
    const cached = await caches.match('/index.html');
    return cached || new Response(offlineHTML(), {
      headers: { 'Content-Type': 'text/html' },
    });
  }
}

async function staleWhileRevalidate(request, cacheName) {
  const cache = await caches.open(cacheName);
  const cached = await cache.match(request);

  // Fetch in background to update cache
  const fetchPromise = fetch(request)
    .then((response) => {
      if (response.ok) {
        cache.put(request, response.clone());
      }
      return response;
    })
    .catch(() => cached);

  // Return cached immediately, or wait for network
  return cached || fetchPromise;
}

// ─── Offline Fallback HTML ─────────────────────────────────────────────────

function offlineHTML() {
  return `<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>밥터뷰 - 오프라인</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: -apple-system, sans-serif; min-height: 100vh; display: flex; align-items: center; justify-content: center; background: #fff; color: #1f2937; padding: 24px; }
    .container { text-align: center; max-width: 320px; }
    .icon { font-size: 48px; margin-bottom: 16px; }
    h1 { font-size: 20px; margin-bottom: 8px; }
    p { font-size: 14px; color: #6b7280; margin-bottom: 24px; line-height: 1.5; }
    button { background: #1f2937; color: #fff; border: none; padding: 12px 24px; border-radius: 12px; font-size: 14px; font-weight: 600; cursor: pointer; }
    button:active { opacity: 0.8; }
  </style>
</head>
<body>
  <div class="container">
    <div class="icon">📡</div>
    <h1>인터넷에 연결할 수 없어요</h1>
    <p>네트워크 연결을 확인하고 다시 시도해주세요.<br>이전에 방문한 페이지는 오프라인에서도 볼 수 있어요.</p>
    <button onclick="location.reload()">다시 시도</button>
  </div>
</body>
</html>`;
}

// ─── Push Notification Handler ─────────────────────────────────────────────

self.addEventListener('push', (event) => {
  if (!event.data) return;

  try {
    const data = event.data.json();
    event.waitUntil(
      self.registration.showNotification(data.title || '밥터뷰', {
        body: data.body || data.message || '',
        icon: '/favicon.svg',
        badge: '/favicon.svg',
        tag: data.tag || 'default',
        data: { url: data.url || '/' },
      })
    );
  } catch {
    // Non-JSON push, ignore
  }
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  const url = event.notification.data?.url || '/';

  event.waitUntil(
    self.clients.matchAll({ type: 'window' }).then((clients) => {
      // Focus existing tab if available
      for (const client of clients) {
        if (client.url.includes(url) && 'focus' in client) {
          return client.focus();
        }
      }
      // Otherwise open new tab
      return self.clients.openWindow(url);
    })
  );
});
