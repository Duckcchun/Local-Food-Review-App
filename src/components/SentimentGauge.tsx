import type { SentimentScore } from '../utils/reviewAnalytics';

interface SentimentGaugeProps {
  sentiment: SentimentScore;
}

/**
 * Visual gauge showing positive vs negative sentiment ratio.
 * Horizontal bar with green (positive) and orange (negative) segments.
 */
export function SentimentGauge({ sentiment }: SentimentGaugeProps) {
  const { positive, negative, ratio, totalReviews } = sentiment;

  return (
    <div className="space-y-3">
      {/* Labels */}
      <div className="flex items-center justify-between text-xs">
        <span className="text-[#155724] font-medium">👍 긍정 {positive}%</span>
        <span className="text-[#856404] font-medium">👎 부정 {negative}%</span>
      </div>

      {/* Bar */}
      <div className="h-4 rounded-full overflow-hidden bg-gray-100 flex">
        <div
          className="h-full bg-gradient-to-r from-[#6b8e6f] to-[#8fa893] transition-all duration-700 ease-out rounded-l-full"
          style={{ width: `${positive}%` }}
        />
        <div
          className="h-full bg-gradient-to-r from-[#f5a145] to-[#ffc078] transition-all duration-700 ease-out rounded-r-full"
          style={{ width: `${negative}%` }}
        />
      </div>

      {/* Summary */}
      <div className="flex items-center justify-between">
        <span className="text-xs text-[#9ca89d]">
          긍정:부정 = {ratio}
        </span>
        <span className="text-xs text-[#9ca89d]">
          총 {totalReviews}개 리뷰 분석
        </span>
      </div>
    </div>
  );
}
