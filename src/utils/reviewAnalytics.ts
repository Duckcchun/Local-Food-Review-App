/**
 * 리뷰 텍스트 분석 및 고급 통계 유틸리티.
 *
 * - 키워드 빈도 분석 (장점/단점 워드 클라우드용)
 * - 감성 점수 추정 (긍정/부정 비율)
 * - 월별 트렌드 데이터 생성
 * - 카테고리별 성과 비교
 */

import type { Review } from '../types';
import type { Product } from '../data/mockData';
import type { Application } from '../types';

// ─── Keyword Analysis ──────────────────────────────────────────────────────

export interface KeywordItem {
  text: string;
  count: number;
  type: 'positive' | 'negative' | 'neutral';
}

/** Korean stop words to filter out */
const STOP_WORDS = new Set([
  '이', '그', '저', '것', '수', '등', '때', '거', '게', '데',
  '좀', '잘', '더', '좋', '정말', '너무', '매우', '아주', '진짜',
  '했', '한', '하', '된', '될', '되', '있', '없', '같', '다',
  '를', '을', '에', '의', '가', '는', '은', '도', '로', '와',
  '과', '이고', '해서', '했어요', '입니다', '합니다', '있어요', '없어요',
  '그리고', '하지만', '그래서', '그런데', '그래도', '또한', '및',
]);

/**
 * Extract keywords from review text and count their frequency.
 * Performs basic Korean text tokenization (space-based + suffix removal).
 */
export function extractKeywords(reviews: Review[], maxKeywords = 20): {
  prosKeywords: KeywordItem[];
  consKeywords: KeywordItem[];
  allKeywords: KeywordItem[];
} {
  const prosWords = new Map<string, number>();
  const consWords = new Map<string, number>();

  reviews.forEach(review => {
    // Process pros
    tokenize(review.pros).forEach(word => {
      prosWords.set(word, (prosWords.get(word) || 0) + 1);
    });
    // Process cons
    tokenize(review.cons).forEach(word => {
      consWords.set(word, (consWords.get(word) || 0) + 1);
    });
    // Process improvements as cons too
    tokenize(review.improvements).forEach(word => {
      consWords.set(word, (consWords.get(word) || 0) + 1);
    });
  });

  const prosKeywords = mapToKeywords(prosWords, 'positive', maxKeywords);
  const consKeywords = mapToKeywords(consWords, 'negative', maxKeywords);

  // Merge for "all" view
  const allMap = new Map<string, { count: number; type: 'positive' | 'negative' | 'neutral' }>();
  prosKeywords.forEach(k => allMap.set(k.text, { count: k.count, type: 'positive' }));
  consKeywords.forEach(k => {
    const existing = allMap.get(k.text);
    if (existing) {
      existing.count += k.count;
      existing.type = 'neutral';
    } else {
      allMap.set(k.text, { count: k.count, type: 'negative' });
    }
  });
  const allKeywords = Array.from(allMap.entries())
    .map(([text, { count, type }]) => ({ text, count, type }))
    .sort((a, b) => b.count - a.count)
    .slice(0, maxKeywords);

  return { prosKeywords, consKeywords, allKeywords };
}

function tokenize(text: string): string[] {
  if (!text) return [];
  return text
    .replace(/[^\uAC00-\uD7A3\u3131-\u3163a-zA-Z0-9\s]/g, '') // Keep Korean, English, numbers
    .split(/\s+/)
    .map(w => w.trim())
    .filter(w => w.length >= 2 && w.length <= 10)
    .filter(w => !STOP_WORDS.has(w));
}

function mapToKeywords(map: Map<string, number>, type: 'positive' | 'negative', max: number): KeywordItem[] {
  return Array.from(map.entries())
    .filter(([_, count]) => count >= 1)
    .sort((a, b) => b[1] - a[1])
    .slice(0, max)
    .map(([text, count]) => ({ text, count, type }));
}

// ─── Sentiment Score ───────────────────────────────────────────────────────

export interface SentimentScore {
  positive: number; // 0-100
  negative: number; // 0-100
  ratio: string;    // e.g., "3:1"
  totalReviews: number;
}

/**
 * Estimate overall sentiment from reviews.
 * Simple heuristic: compare length of pros vs cons text.
 */
export function calculateSentiment(reviews: Review[]): SentimentScore {
  if (reviews.length === 0) {
    return { positive: 50, negative: 50, ratio: '1:1', totalReviews: 0 };
  }

  let totalProsLength = 0;
  let totalConsLength = 0;

  reviews.forEach(review => {
    totalProsLength += (review.pros || '').length;
    totalConsLength += (review.cons || '').length + (review.improvements || '').length;
  });

  const total = totalProsLength + totalConsLength;
  if (total === 0) {
    return { positive: 50, negative: 50, ratio: '1:1', totalReviews: reviews.length };
  }

  const positive = Math.round((totalProsLength / total) * 100);
  const negative = 100 - positive;

  // Calculate ratio
  const gcd = (a: number, b: number): number => b === 0 ? a : gcd(b, a % b);
  const p = Math.max(1, Math.round(totalProsLength / 100));
  const n = Math.max(1, Math.round(totalConsLength / 100));
  const d = gcd(p, n);
  const ratio = `${p / d}:${n / d}`;

  return { positive, negative, ratio, totalReviews: reviews.length };
}

// ─── Monthly Trends ────────────────────────────────────────────────────────

export interface MonthlyTrend {
  month: string;        // "2024.11"
  monthLabel: string;   // "11월"
  reviews: number;
  applications: number;
  avgProsLength: number;
  avgConsLength: number;
}

/**
 * Generate monthly trend data from reviews and applications.
 */
export function getMonthlyTrends(
  reviews: Review[],
  applications: Application[],
  months = 6
): MonthlyTrend[] {
  const trends: MonthlyTrend[] = [];
  const now = new Date();

  for (let i = months - 1; i >= 0; i--) {
    const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const monthKey = `${date.getFullYear()}.${String(date.getMonth() + 1).padStart(2, '0')}`;
    const monthLabel = `${date.getMonth() + 1}월`;

    // Filter reviews for this month
    const monthReviews = reviews.filter(r => {
      const d = new Date(r.createdAt);
      return d.getFullYear() === date.getFullYear() && d.getMonth() === date.getMonth();
    });

    // Filter applications for this month
    const monthApps = applications.filter(a => {
      const d = new Date(a.appliedAt);
      return d.getFullYear() === date.getFullYear() && d.getMonth() === date.getMonth();
    });

    // Average review lengths
    const avgProsLength = monthReviews.length > 0
      ? Math.round(monthReviews.reduce((sum, r) => sum + (r.pros?.length || 0), 0) / monthReviews.length)
      : 0;
    const avgConsLength = monthReviews.length > 0
      ? Math.round(monthReviews.reduce((sum, r) => sum + (r.cons?.length || 0), 0) / monthReviews.length)
      : 0;

    trends.push({
      month: monthKey,
      monthLabel,
      reviews: monthReviews.length,
      applications: monthApps.length,
      avgProsLength,
      avgConsLength,
    });
  }

  return trends;
}

// ─── Category Performance ──────────────────────────────────────────────────

export interface CategoryPerformance {
  category: string;
  categoryName: string;
  productCount: number;
  totalApplicants: number;
  totalReviews: number;
  avgFillRate: number;
  avgLikes: number;
}

const CATEGORY_NAMES: Record<string, string> = {
  korean: '한식',
  chinese: '중식',
  japanese: '일식',
  western: '양식',
  snack: '분식',
  cafe: '카페/디저트',
  chicken: '치킨',
  pizza: '피자',
  etc: '기타',
};

/**
 * Calculate performance metrics grouped by product category.
 */
export function getCategoryPerformance(
  products: Product[],
  applications: Application[],
  reviews: Review[]
): CategoryPerformance[] {
  const categoryMap = new Map<string, {
    products: Product[];
    applications: Application[];
    reviews: Review[];
  }>();

  products.forEach(product => {
    const cat = product.category || 'etc';
    if (!categoryMap.has(cat)) {
      categoryMap.set(cat, { products: [], applications: [], reviews: [] });
    }
    categoryMap.get(cat)!.products.push(product);
  });

  // Assign applications and reviews to categories
  applications.forEach(app => {
    const product = products.find(p => p.id === app.productId);
    if (product) {
      const cat = product.category || 'etc';
      categoryMap.get(cat)?.applications.push(app);
    }
  });

  reviews.forEach(review => {
    const product = products.find(p => p.id === review.productId);
    if (product) {
      const cat = product.category || 'etc';
      categoryMap.get(cat)?.reviews.push(review);
    }
  });

  return Array.from(categoryMap.entries())
    .map(([category, data]) => {
      const productCount = data.products.length;
      const totalApplicants = data.applications.length;
      const totalReviews = data.reviews.length;
      const avgFillRate = productCount > 0
        ? Math.round(data.products.reduce((sum, p) => sum + (p.currentApplicants / p.requiredReviewers) * 100, 0) / productCount)
        : 0;
      const avgLikes = productCount > 0
        ? Math.round(data.products.reduce((sum, p) => sum + p.likeCount, 0) / productCount)
        : 0;

      return {
        category,
        categoryName: CATEGORY_NAMES[category] || category,
        productCount,
        totalApplicants,
        totalReviews,
        avgFillRate,
        avgLikes,
      };
    })
    .sort((a, b) => b.totalApplicants - a.totalApplicants);
}
