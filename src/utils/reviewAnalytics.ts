/**
 * 리뷰 분석 유틸 (사장님 대시보드 "리뷰 분석 리포트"용)
 *
 * 리뷰의 장점(pros)/단점(cons)/개선점(improvements) 텍스트를 집계해
 * - 키워드 빈도 추출
 * - 긍정/부정 비중(감성) 추정
 * - 월별 리뷰 추이
 * - 카테고리별 성과
 * 를 계산한다.
 *
 * 한글 형태소분석기 없이 공백 기반 토큰화 + 불용어 제거로 단순 빈도 집계하는
 * 실용적인 접근이다. (NLP 라이브러리를 붙이면 정확도는 올라가지만 이 규모에선 과함)
 */
import type { Review } from "../types";
import type { Product } from "../data/mockData";
import type { Application } from "../types";
import { getCategoryName } from "../data/categories";

// ─── 타입 ────────────────────────────────────────────────────────────────

export type KeywordType = "positive" | "negative" | "neutral";

export interface Keyword {
  keyword: string;
  count: number;
  type: KeywordType;
}

export interface ExtractedKeywords {
  prosKeywords: Keyword[];
  consKeywords: Keyword[];
  allKeywords: Keyword[];
}

export interface SentimentResult {
  positive: number; // 0-100
  negative: number; // 0-100
  totalReviews: number;
}

export interface MonthlyTrend {
  monthLabel: string; // 예: "3월"
  reviews: number;
  applications: number;
}

export interface CategoryPerformance {
  category: string;
  categoryName: string;
  productCount: number;
  totalApplicants: number;
  totalReviews: number;
  totalLikes: number;
  averageFillRate: number;
}

// ─── 상수 ────────────────────────────────────────────────────────────────

/** 빈도 집계에서 제외할 불용어 (조사/부사/의미 약한 단어) */
const STOPWORDS = new Set([
  "그리고",
  "그래서",
  "너무",
  "정말",
  "진짜",
  "조금",
  "약간",
  "그냥",
  "매우",
  "아주",
  "많이",
  "좀",
  "것",
  "수",
  "때",
  "등",
  "및",
  "제품",
  "제품이",
  "있어요",
  "있습니다",
  "없어요",
  "좋아요",
  "같아요",
  "합니다",
]);

// ─── 내부 헬퍼 ───────────────────────────────────────────────────────────

/**
 * 텍스트 배열에서 단순 토큰화 후 단어 빈도를 집계한다.
 * - 문장부호 제거
 * - 공백 기준 분리
 * - 2글자 이상 & 불용어 제외
 */
function countWords(texts: string[]): Record<string, number> {
  const freq: Record<string, number> = {};

  texts.forEach((text) => {
    if (!text) return;
    const words = text
      .replace(/[.,!?~()\[\]"'·…\-]/g, " ")
      .split(/\s+/)
      .map((w) => w.trim())
      .filter((w) => w.length >= 2 && !STOPWORDS.has(w));

    words.forEach((w) => {
      freq[w] = (freq[w] || 0) + 1;
    });
  });

  return freq;
}

/** 빈도 맵을 Keyword[] 로 변환 (내림차순, 상위 N개) */
function toKeywords(
  freq: Record<string, number>,
  type: KeywordType,
  maxKeywords: number
): Keyword[] {
  return Object.entries(freq)
    .map(([keyword, count]) => ({ keyword, count, type }))
    .sort((a, b) => b.count - a.count)
    .slice(0, maxKeywords);
}

// ─── 공개 API ────────────────────────────────────────────────────────────

/**
 * 리뷰의 장점/단점 텍스트에서 키워드를 추출한다.
 * @param reviews 대상 리뷰 목록
 * @param maxKeywords 카테고리별 최대 키워드 수 (기본 5)
 */
export function extractKeywords(
  reviews: Review[],
  maxKeywords = 5
): ExtractedKeywords {
  if (!reviews || reviews.length === 0) {
    return { prosKeywords: [], consKeywords: [], allKeywords: [] };
  }

  const prosFreq = countWords(reviews.map((r) => r.pros));
  const consFreq = countWords(reviews.map((r) => r.cons));

  const prosKeywords = toKeywords(prosFreq, "positive", maxKeywords);
  const consKeywords = toKeywords(consFreq, "negative", maxKeywords);

  // allKeywords: 긍정+부정 통합 후 빈도순
  const allKeywords = [...prosKeywords, ...consKeywords].sort(
    (a, b) => b.count - a.count
  );

  return { prosKeywords, consKeywords, allKeywords };
}

/**
 * 리뷰 전반의 긍정/부정 비중을 추정한다.
 * 장점 텍스트 총량 대비 단점 텍스트 총량의 비율로 근사한다.
 * 리뷰가 없으면 중립(50/50)을 반환한다.
 */
export function calculateSentiment(reviews: Review[]): SentimentResult {
  if (!reviews || reviews.length === 0) {
    return { positive: 50, negative: 50, totalReviews: 0 };
  }

  const prosLength = reviews.reduce(
    (sum, r) => sum + (r.pros ? r.pros.trim().length : 0),
    0
  );
  const consLength = reviews.reduce(
    (sum, r) => sum + (r.cons ? r.cons.trim().length : 0),
    0
  );

  const total = prosLength + consLength;

  // 장단점 모두 비어있으면 중립 처리
  if (total === 0) {
    return { positive: 50, negative: 50, totalReviews: reviews.length };
  }

  const positive = Math.round((prosLength / total) * 100);
  const negative = 100 - positive;

  return { positive, negative, totalReviews: reviews.length };
}

/**
 * 최근 N개월(기본 6개월)의 월별 리뷰/신청 추이를 계산한다.
 */
export function getMonthlyTrends(
  reviews: Review[],
  applications: Application[],
  months = 6
): MonthlyTrend[] {
  const now = new Date();
  const trends: MonthlyTrend[] = [];

  for (let i = months - 1; i >= 0; i--) {
    const target = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const year = target.getFullYear();
    const month = target.getMonth(); // 0-indexed

    const inMonth = (iso?: string): boolean => {
      if (!iso) return false;
      const d = new Date(iso);
      return d.getFullYear() === year && d.getMonth() === month;
    };

    const reviewCount = (reviews || []).filter((r) => inMonth(r.createdAt)).length;
    const applicationCount = (applications || []).filter((a) =>
      inMonth(a.appliedAt)
    ).length;

    trends.push({
      monthLabel: `${month + 1}월`,
      reviews: reviewCount,
      applications: applicationCount,
    });
  }

  return trends;
}

/**
 * 카테고리별 성과를 집계한다.
 */
export function getCategoryPerformance(
  products: Product[],
  applications: Application[],
  reviews: Review[]
): CategoryPerformance[] {
  if (!products || products.length === 0) return [];

  const groups: Record<string, Product[]> = {};
  products.forEach((p) => {
    const key = p.category || "other";
    (groups[key] ||= []).push(p);
  });

  return Object.entries(groups).map(([category, catProducts]) => {
    const productIds = new Set(catProducts.map((p) => p.id));

    const totalApplicants = (applications || []).filter((a) =>
      productIds.has(a.productId)
    ).length;
    const totalReviews = (reviews || []).filter((r) =>
      productIds.has(r.productId)
    ).length;
    const totalLikes = catProducts.reduce(
      (sum, p) => sum + (p.likeCount || 0),
      0
    );

    const fillRates = catProducts.map((p) =>
      p.requiredReviewers > 0
        ? (p.currentApplicants / p.requiredReviewers) * 100
        : 0
    );
    const averageFillRate =
      fillRates.length > 0
        ? Math.round(
            fillRates.reduce((sum, r) => sum + r, 0) / fillRates.length
          )
        : 0;

    return {
      category,
      categoryName: getCategoryName(category),
      productCount: catProducts.length,
      totalApplicants,
      totalReviews,
      totalLikes,
      averageFillRate,
    };
  });
}
