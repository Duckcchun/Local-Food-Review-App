/**
 * 에러 모니터링 및 성능 추적 유틸리티.
 *
 * Sentry 또는 다른 모니터링 서비스와의 통합 레이어.
 * 환경 변수: VITE_SENTRY_DSN
 *
 * 사용법:
 * - initMonitoring() — 앱 시작 시 1회 호출
 * - captureError(error) — 에러 리포팅
 * - captureMessage(msg) — 정보성 메시지
 * - setUser(user) — 유저 컨텍스트 설정
 */

const SENTRY_DSN = import.meta.env?.VITE_SENTRY_DSN as string | undefined;
const IS_PRODUCTION = import.meta.env.PROD;

// ─── Types ─────────────────────────────────────────────────────────────────

interface MonitoringUser {
  id: string;
  email?: string;
  name?: string;
}

interface ErrorContext {
  /** 에러가 발생한 컴포넌트/함수 이름 */
  component?: string;
  /** 추가 데이터 */
  extra?: Record<string, unknown>;
  /** 에러 심각도 */
  level?: 'fatal' | 'error' | 'warning' | 'info';
}

// ─── Internal State ────────────────────────────────────────────────────────

let isInitialized = false;
let currentUser: MonitoringUser | null = null;
const errorBuffer: Array<{ error: Error; context?: ErrorContext; timestamp: number }> = [];
const MAX_BUFFER_SIZE = 50;

// ─── Public API ────────────────────────────────────────────────────────────

/**
 * Initialize monitoring.
 * Call once at app startup (main.tsx).
 * In production with Sentry DSN: initializes Sentry SDK.
 * Without DSN: logs to console (development fallback).
 */
export function initMonitoring(): void {
  if (isInitialized) return;
  isInitialized = true;

  if (IS_PRODUCTION && SENTRY_DSN) {
    // Dynamic import Sentry to avoid bundle size impact in dev
    loadSentry().catch(() => {
      console.warn('[Monitoring] Sentry failed to load, using fallback');
    });
  }

  // Global error handlers
  window.addEventListener('error', (event) => {
    captureError(event.error || new Error(event.message), {
      component: 'window.onerror',
      extra: { filename: event.filename, lineno: event.lineno },
    });
  });

  window.addEventListener('unhandledrejection', (event) => {
    const error = event.reason instanceof Error
      ? event.reason
      : new Error(String(event.reason));
    captureError(error, { component: 'unhandledrejection', level: 'error' });
  });

  console.log('[Monitoring] Initialized', IS_PRODUCTION ? '(production)' : '(development)');
}

/**
 * Capture and report an error.
 */
export function captureError(error: Error, context?: ErrorContext): void {
  // Buffer errors
  if (errorBuffer.length < MAX_BUFFER_SIZE) {
    errorBuffer.push({ error, context, timestamp: Date.now() });
  }

  if (IS_PRODUCTION && SENTRY_DSN && (window as any).__SENTRY__) {
    try {
      const Sentry = (window as any).__SENTRY__;
      Sentry.captureException(error, {
        tags: { component: context?.component },
        extra: context?.extra,
        level: context?.level || 'error',
      });
    } catch {}
  } else {
    // Development: log to console
    console.error(
      `[Monitor] ${context?.level || 'error'}`,
      context?.component ? `[${context.component}]` : '',
      error.message,
      context?.extra || ''
    );
  }
}

/**
 * Capture an informational message.
 */
export function captureMessage(message: string, level: 'info' | 'warning' = 'info'): void {
  if (IS_PRODUCTION && SENTRY_DSN && (window as any).__SENTRY__) {
    try {
      (window as any).__SENTRY__.captureMessage(message, level);
    } catch {}
  } else {
    console.log(`[Monitor] ${level}: ${message}`);
  }
}

/**
 * Set the current user context for error reports.
 * Call on login; pass null on logout.
 */
export function setMonitoringUser(user: MonitoringUser | null): void {
  currentUser = user;

  if (IS_PRODUCTION && SENTRY_DSN && (window as any).__SENTRY__) {
    try {
      (window as any).__SENTRY__.setUser(user ? { id: user.id, email: user.email, username: user.name } : null);
    } catch {}
  }
}

/**
 * Add a breadcrumb (trail of events leading to an error).
 */
export function addBreadcrumb(message: string, category?: string, data?: Record<string, unknown>): void {
  if (IS_PRODUCTION && SENTRY_DSN && (window as any).__SENTRY__) {
    try {
      (window as any).__SENTRY__.addBreadcrumb({ message, category, data, level: 'info' });
    } catch {}
  }
}

/**
 * Get buffered errors (useful for error reporting UI).
 */
export function getErrorBuffer() {
  return [...errorBuffer];
}

// ─── Sentry Loader ─────────────────────────────────────────────────────────

async function loadSentry(): Promise<void> {
  if (!SENTRY_DSN) return;

  // Load Sentry via CDN (avoids adding to bundle)
  const script = document.createElement('script');
  script.src = 'https://browser.sentry-cdn.com/7.100.0/bundle.min.js';
  script.crossOrigin = 'anonymous';

  await new Promise<void>((resolve, reject) => {
    script.onload = () => resolve();
    script.onerror = () => reject(new Error('Sentry script failed to load'));
    document.head.appendChild(script);
  });

  // Initialize
  if ((window as any).Sentry) {
    (window as any).Sentry.init({
      dsn: SENTRY_DSN,
      environment: 'production',
      release: `babterview@${import.meta.env.VITE_APP_VERSION || '1.0.0'}`,
      tracesSampleRate: 0.1, // 10% performance sampling
      replaysSessionSampleRate: 0.01, // 1% session replay
      integrations: [],
    });

    // Store reference
    (window as any).__SENTRY__ = (window as any).Sentry;

    // Set user if already known
    if (currentUser) {
      (window as any).Sentry.setUser({
        id: currentUser.id,
        email: currentUser.email,
        username: currentUser.name,
      });
    }
  }
}
