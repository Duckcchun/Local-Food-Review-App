import { Loader2, ArrowDown } from 'lucide-react';

interface PullToRefreshIndicatorProps {
  pullProgress: number;
  isRefreshing: boolean;
  pullDistance: number;
}

/**
 * Visual indicator shown during pull-to-refresh.
 * Animates based on pull progress and shows spinner during refresh.
 */
export function PullToRefreshIndicator({ 
  pullProgress, 
  isRefreshing, 
  pullDistance 
}: PullToRefreshIndicatorProps) {
  if (pullDistance <= 0 && !isRefreshing) return null;

  return (
    <div
      className="absolute top-0 left-0 right-0 flex items-center justify-center overflow-hidden pointer-events-none z-40"
      style={{
        height: `${pullDistance}px`,
        opacity: Math.min(pullProgress * 1.5, 1),
      }}
    >
      <div className="flex flex-col items-center gap-1">
        {isRefreshing ? (
          <>
            <Loader2 
              size={24} 
              className="text-[#6b8e6f] animate-spin" 
            />
            <span className="text-xs text-[#6b8e6f] font-medium">
              새로고침 중...
            </span>
          </>
        ) : (
          <>
            <ArrowDown
              size={22}
              className="text-[#6b8e6f] transition-transform duration-200"
              style={{
                transform: `rotate(${pullProgress >= 1 ? 180 : 0}deg)`,
              }}
            />
            <span className="text-xs text-[#9ca89d]">
              {pullProgress >= 1 ? '놓으면 새로고침' : '당겨서 새로고침'}
            </span>
          </>
        )}
      </div>
    </div>
  );
}
