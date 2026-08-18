import { useState, useEffect, useRef, useCallback, useMemo } from 'react';

interface UseInfiniteScrollOptions<T> {
  /** Full list of items to paginate */
  items: T[];
  /** Number of items per page (default: 6) */
  pageSize?: number;
  /** Distance from bottom in px to trigger next page load (default: 300) */
  threshold?: number;
}

interface UseInfiniteScrollReturn<T> {
  /** Currently visible items (paginated subset) */
  visibleItems: T[];
  /** Whether there are more items to load */
  hasMore: boolean;
  /** Whether currently loading next page (for showing skeleton) */
  isLoadingMore: boolean;
  /** Ref to attach to the sentinel element at the bottom of the list */
  sentinelRef: React.RefObject<HTMLDivElement | null>;
  /** Reset pagination (e.g., when filters change) */
  reset: () => void;
  /** Total number of items */
  totalItems: number;
  /** Number of loaded items */
  loadedItems: number;
}

/**
 * Custom hook for client-side infinite scroll pagination.
 * Uses IntersectionObserver for efficient scroll detection.
 * Items are loaded in pages as the user scrolls down.
 */
export function useInfiniteScroll<T>({
  items,
  pageSize = 6,
  threshold = 300,
}: UseInfiniteScrollOptions<T>): UseInfiniteScrollReturn<T> {
  const [page, setPage] = useState(1);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const sentinelRef = useRef<HTMLDivElement | null>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const prevItemsLengthRef = useRef(items.length);

  // Reset page when items array changes (filter/sort applied)
  useEffect(() => {
    if (items.length !== prevItemsLengthRef.current) {
      setPage(1);
      prevItemsLengthRef.current = items.length;
    }
  }, [items.length]);

  const visibleItems = useMemo(() => {
    return items.slice(0, page * pageSize);
  }, [items, page, pageSize]);

  const hasMore = visibleItems.length < items.length;

  const loadMore = useCallback(() => {
    if (!hasMore || isLoadingMore) return;

    setIsLoadingMore(true);
    // Simulate a small delay to show loading state (feels more natural)
    setTimeout(() => {
      setPage(prev => prev + 1);
      setIsLoadingMore(false);
    }, 300);
  }, [hasMore, isLoadingMore]);

  // IntersectionObserver setup
  useEffect(() => {
    if (observerRef.current) {
      observerRef.current.disconnect();
    }

    observerRef.current = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting && hasMore && !isLoadingMore) {
          loadMore();
        }
      },
      {
        rootMargin: `${threshold}px`,
      }
    );

    const sentinel = sentinelRef.current;
    if (sentinel) {
      observerRef.current.observe(sentinel);
    }

    return () => {
      observerRef.current?.disconnect();
    };
  }, [hasMore, isLoadingMore, loadMore, threshold]);

  const reset = useCallback(() => {
    setPage(1);
    setIsLoadingMore(false);
  }, []);

  return {
    visibleItems,
    hasMore,
    isLoadingMore,
    sentinelRef,
    reset,
    totalItems: items.length,
    loadedItems: visibleItems.length,
  };
}
