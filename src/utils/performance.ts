/**
 * Performance utilities and helpers.
 *
 * - Debounce/throttle for scroll and input handlers
 * - Web Vitals measurement
 * - Preload hints for critical resources
 */

/**
 * Debounce function - delays execution until after wait ms have elapsed
 * since the last invocation.
 */
export function debounce<T extends (...args: any[]) => any>(
  fn: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeoutId: ReturnType<typeof setTimeout> | null = null;

  return (...args: Parameters<T>) => {
    if (timeoutId) clearTimeout(timeoutId);
    timeoutId = setTimeout(() => fn(...args), wait);
  };
}

/**
 * Throttle function - ensures function is called at most once per interval.
 */
export function throttle<T extends (...args: any[]) => any>(
  fn: T,
  interval: number
): (...args: Parameters<T>) => void {
  let lastCallTime = 0;
  let timeoutId: ReturnType<typeof setTimeout> | null = null;

  return (...args: Parameters<T>) => {
    const now = Date.now();
    const remaining = interval - (now - lastCallTime);

    if (remaining <= 0) {
      if (timeoutId) {
        clearTimeout(timeoutId);
        timeoutId = null;
      }
      lastCallTime = now;
      fn(...args);
    } else if (!timeoutId) {
      timeoutId = setTimeout(() => {
        lastCallTime = Date.now();
        timeoutId = null;
        fn(...args);
      }, remaining);
    }
  };
}

/**
 * Preload a critical image (e.g., hero image, LCP element).
 */
export function preloadImage(src: string): void {
  const link = document.createElement('link');
  link.rel = 'preload';
  link.as = 'image';
  link.href = src;
  document.head.appendChild(link);
}

/**
 * Preload critical route chunks for anticipated navigation.
 * Call this after the initial page load to preload likely next pages.
 */
export function preloadRoute(importFn: () => Promise<any>): void {
  // Use requestIdleCallback if available, otherwise setTimeout
  const schedule = window.requestIdleCallback || ((cb) => setTimeout(cb, 1));
  schedule(() => {
    importFn().catch(() => {
      // Silently fail - this is just a performance hint
    });
  });
}

/**
 * Measure and report Web Vitals (CLS, FID, LCP, FCP, TTFB).
 * Sends metrics to an analytics endpoint or console in dev mode.
 */
export function reportWebVitals(onMetric?: (metric: {
  name: string;
  value: number;
  rating: 'good' | 'needs-improvement' | 'poor';
}) => void): void {
  if (!('PerformanceObserver' in window)) return;

  // LCP (Largest Contentful Paint)
  try {
    const lcpObserver = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      const lastEntry = entries[entries.length - 1] as any;
      if (lastEntry) {
        const value = lastEntry.startTime;
        const rating = value <= 2500 ? 'good' : value <= 4000 ? 'needs-improvement' : 'poor';
        onMetric?.({ name: 'LCP', value, rating });
      }
    });
    lcpObserver.observe({ type: 'largest-contentful-paint', buffered: true });
  } catch {}

  // FCP (First Contentful Paint)
  try {
    const fcpObserver = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      const fcp = entries.find(e => e.name === 'first-contentful-paint');
      if (fcp) {
        const value = fcp.startTime;
        const rating = value <= 1800 ? 'good' : value <= 3000 ? 'needs-improvement' : 'poor';
        onMetric?.({ name: 'FCP', value, rating });
      }
    });
    fcpObserver.observe({ type: 'paint', buffered: true });
  } catch {}

  // CLS (Cumulative Layout Shift)
  try {
    let clsValue = 0;
    const clsObserver = new PerformanceObserver((list) => {
      for (const entry of list.getEntries() as any[]) {
        if (!entry.hadRecentInput) {
          clsValue += entry.value;
        }
      }
    });
    clsObserver.observe({ type: 'layout-shift', buffered: true });

    // Report on page hide
    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'hidden') {
        const rating = clsValue <= 0.1 ? 'good' : clsValue <= 0.25 ? 'needs-improvement' : 'poor';
        onMetric?.({ name: 'CLS', value: clsValue, rating });
      }
    }, { once: true });
  } catch {}
}

/**
 * Check if the user prefers reduced motion.
 * Useful for disabling animations.
 */
export function prefersReducedMotion(): boolean {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}
