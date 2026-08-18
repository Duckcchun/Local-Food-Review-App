import { forwardRef } from 'react';
import { Loader2 } from 'lucide-react';

interface InfiniteScrollSentinelProps {
  isLoading: boolean;
  hasMore: boolean;
  loadedCount: number;
  totalCount: number;
}

/**
 * Sentinel element placed at the bottom of infinite scroll lists.
 * Shows a loading spinner when more items are being loaded,
 * or "end of list" message when all items are visible.
 */
export const InfiniteScrollSentinel = forwardRef<HTMLDivElement, InfiniteScrollSentinelProps>(
  ({ isLoading, hasMore, loadedCount, totalCount }, ref) => {
    return (
      <div ref={ref} className="py-6 flex flex-col items-center justify-center">
        {isLoading ? (
          <div className="flex items-center gap-2">
            <Loader2 size={18} className="text-[#6b8e6f] animate-spin" />
            <span className="text-sm text-[#9ca89d]">더 불러오는 중...</span>
          </div>
        ) : hasMore ? (
          // Invisible trigger area (detected by IntersectionObserver)
          <div className="h-4" />
        ) : totalCount > 0 ? (
          <div className="text-center">
            <p className="text-xs text-[#9ca89d]">
              모든 체험단을 확인했어요 ({totalCount}개)
            </p>
          </div>
        ) : null}
      </div>
    );
  }
);

InfiniteScrollSentinel.displayName = 'InfiniteScrollSentinel';
