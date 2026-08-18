import { useState, useRef, useCallback, useEffect } from 'react';

interface UsePullToRefreshOptions {
  /** Async function to call on refresh */
  onRefresh: () => Promise<void>;
  /** Minimum pull distance in px to trigger refresh (default: 80) */
  threshold?: number;
  /** Maximum pull distance in px (default: 120) */
  maxPull?: number;
  /** Whether pull-to-refresh is enabled (default: true) */
  enabled?: boolean;
}

interface UsePullToRefreshReturn {
  /** Whether currently refreshing */
  isRefreshing: boolean;
  /** Current pull distance (0 when not pulling) */
  pullDistance: number;
  /** Progress 0-1 of pull towards threshold */
  pullProgress: number;
  /** Props to spread on the scrollable container */
  containerProps: {
    onTouchStart: (e: React.TouchEvent) => void;
    onTouchMove: (e: React.TouchEvent) => void;
    onTouchEnd: () => void;
    style: React.CSSProperties;
  };
}

/**
 * Custom hook for mobile Pull-to-Refresh behavior.
 * Works with touch events, shows visual indicator proportional to pull distance.
 */
export function usePullToRefresh({
  onRefresh,
  threshold = 80,
  maxPull = 120,
  enabled = true,
}: UsePullToRefreshOptions): UsePullToRefreshReturn {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [pullDistance, setPullDistance] = useState(0);
  const startYRef = useRef(0);
  const isPullingRef = useRef(false);

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    if (!enabled || isRefreshing) return;
    
    // Only activate when scrolled to top
    const scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
    if (scrollTop > 5) return;

    startYRef.current = e.touches[0].clientY;
    isPullingRef.current = true;
  }, [enabled, isRefreshing]);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    if (!isPullingRef.current || !enabled || isRefreshing) return;

    const currentY = e.touches[0].clientY;
    const diff = currentY - startYRef.current;

    if (diff > 0) {
      // Apply resistance (diminishing returns as you pull further)
      const resistance = Math.min(diff * 0.5, maxPull);
      setPullDistance(resistance);
    } else {
      setPullDistance(0);
      isPullingRef.current = false;
    }
  }, [enabled, isRefreshing, maxPull]);

  const handleTouchEnd = useCallback(async () => {
    if (!isPullingRef.current || !enabled) return;
    isPullingRef.current = false;

    if (pullDistance >= threshold && !isRefreshing) {
      setIsRefreshing(true);
      setPullDistance(threshold * 0.6); // Settle at a smaller distance during refresh

      try {
        await onRefresh();
      } finally {
        setIsRefreshing(false);
        setPullDistance(0);
      }
    } else {
      setPullDistance(0);
    }
  }, [pullDistance, threshold, isRefreshing, enabled, onRefresh]);

  // Reset on unmount
  useEffect(() => {
    return () => {
      setPullDistance(0);
      isPullingRef.current = false;
    };
  }, []);

  const pullProgress = Math.min(pullDistance / threshold, 1);

  return {
    isRefreshing,
    pullDistance,
    pullProgress,
    containerProps: {
      onTouchStart: handleTouchStart,
      onTouchMove: handleTouchMove,
      onTouchEnd: handleTouchEnd,
      style: {
        transform: pullDistance > 0 ? `translateY(${pullDistance}px)` : undefined,
        transition: isPullingRef.current ? 'none' : 'transform 0.3s ease-out',
      },
    },
  };
}
