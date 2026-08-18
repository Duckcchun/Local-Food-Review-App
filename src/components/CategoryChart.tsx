import type { CategoryPerformance } from '../utils/reviewAnalytics';

interface CategoryChartProps {
  categories: CategoryPerformance[];
}

/**
 * Horizontal bar chart showing performance by category.
 * Each category shows applicant count as a proportional bar.
 */
export function CategoryChart({ categories }: CategoryChartProps) {
  if (categories.length === 0) {
    return (
      <div className="text-center py-6">
        <p className="text-sm text-[#9ca89d]">카테고리 데이터가 없습니다</p>
      </div>
    );
  }

  const maxApplicants = Math.max(...categories.map(c => c.totalApplicants), 1);

  return (
    <div className="space-y-3">
      {categories.slice(0, 6).map((cat) => {
        const barWidth = Math.max(5, (cat.totalApplicants / maxApplicants) * 100);

        return (
          <div key={cat.category} className="space-y-1">
            {/* Label row */}
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-[#2d3e2d]">{cat.categoryName}</span>
              <div className="flex items-center gap-3 text-xs text-[#9ca89d]">
                <span>{cat.productCount}개 상품</span>
                <span>❤️ 평균 {cat.avgLikes}</span>
              </div>
            </div>

            {/* Bar */}
            <div className="flex items-center gap-2">
              <div className="flex-1 h-6 bg-gray-50 rounded-lg overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-[#6b8e6f] to-[#8fa893] rounded-lg flex items-center justify-end pr-2 transition-all duration-500"
                  style={{ width: `${barWidth}%` }}
                >
                  {barWidth > 30 && (
                    <span className="text-[10px] text-white font-medium">
                      {cat.totalApplicants}명
                    </span>
                  )}
                </div>
              </div>
              {barWidth <= 30 && (
                <span className="text-xs text-[#6b8e6f] font-medium min-w-[35px]">
                  {cat.totalApplicants}명
                </span>
              )}
            </div>

            {/* Sub stats */}
            <div className="flex items-center gap-4 pl-1">
              <span className="text-[10px] text-[#9ca89d]">
                채움률 {cat.avgFillRate}%
              </span>
              <span className="text-[10px] text-[#9ca89d]">
                리뷰 {cat.totalReviews}개
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
