import type { KeywordItem } from '../utils/reviewAnalytics';

interface KeywordCloudProps {
  keywords: KeywordItem[];
  title?: string;
  maxItems?: number;
}

/**
 * Word cloud component showing keyword frequency from reviews.
 * Keyword size is proportional to frequency.
 * Color indicates positive (green) / negative (orange) / neutral (gray).
 */
export function KeywordCloud({ keywords, title, maxItems = 15 }: KeywordCloudProps) {
  if (keywords.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-sm text-[#9ca89d]">분석할 리뷰가 충분하지 않습니다</p>
      </div>
    );
  }

  const displayKeywords = keywords.slice(0, maxItems);
  const maxCount = Math.max(...displayKeywords.map(k => k.count));

  // Calculate relative size (1-5 scale)
  const getSize = (count: number): number => {
    return Math.max(1, Math.ceil((count / maxCount) * 5));
  };

  const getColorClass = (type: KeywordItem['type']): string => {
    switch (type) {
      case 'positive': return 'bg-[#d4edda] text-[#155724] border-[#c3e6cb]';
      case 'negative': return 'bg-[#fff4e0] text-[#856404] border-[#ffeeba]';
      case 'neutral': return 'bg-[#f5f0dc] text-[#6b8e6f] border-[#d4c5a0]';
    }
  };

  const getSizeClass = (size: number): string => {
    switch (size) {
      case 5: return 'text-lg font-bold px-4 py-2';
      case 4: return 'text-base font-semibold px-3.5 py-1.5';
      case 3: return 'text-sm font-medium px-3 py-1.5';
      case 2: return 'text-xs font-medium px-2.5 py-1';
      default: return 'text-xs px-2 py-1';
    }
  };

  return (
    <div>
      {title && (
        <h4 className="text-sm font-bold text-[#2d3e2d] mb-3">{title}</h4>
      )}
      <div className="flex flex-wrap gap-2 items-center justify-center">
        {displayKeywords.map((keyword, idx) => {
          const size = getSize(keyword.count);
          return (
            <span
              key={`${keyword.text}-${idx}`}
              className={`inline-flex items-center rounded-full border transition-transform hover:scale-105 ${getColorClass(keyword.type)} ${getSizeClass(size)}`}
              title={`${keyword.text}: ${keyword.count}회`}
            >
              {keyword.text}
              <span className="ml-1 opacity-60 text-[0.7em]">{keyword.count}</span>
            </span>
          );
        })}
      </div>
    </div>
  );
}
