import type { Product } from "../data/mockData";
import type { Application, Review } from "../App";

export type PeriodFilter = "week" | "month" | "all";

export interface BusinessStats {
  totalProducts: number;
  totalApplicants: number;
  totalReviews: number;
  averageFillRate: number;
  totalLikes: number;
  reviewCompletionRate: number;
}

export interface ProductPerformance {
  product: Product;
  applicants: number;
  selected: number;
  reviews: number;
  fillRate: number;
  reviewRate: number;
  likes: number;
  status: "active" | "deadline-soon" | "closed";
}

export interface ChartData {
  name: string;
  신청자: number;
  리뷰: number;
  date?: string;
}

/**
 * Calculate business statistics
 */
export function calculateBusinessStats(
  products: Product[],
  applications: Application[],
  reviews: Review[],
  period: PeriodFilter = "all"
): BusinessStats {
  // Filter by period
  const now = new Date();
  const filteredProducts = products.filter((product) => {
    if (period === "all") return true;
    
    // For demo purposes, assume all products are recent
    // In real app, check product.createdAt
    return true;
  });

  const totalProducts = filteredProducts.length;
  const totalApplicants = applications.length;
  const totalReviews = reviews.length;
  
  // Calculate average fill rate
  const fillRates = filteredProducts.map(p => 
    (p.currentApplicants / p.requiredReviewers) * 100
  );
  const averageFillRate = fillRates.length > 0
    ? fillRates.reduce((sum, rate) => sum + rate, 0) / fillRates.length
    : 0;

  // Total likes
  const totalLikes = filteredProducts.reduce((sum, p) => sum + p.likeCount, 0);

  // Review completion rate
  const selectedApplicants = applications.filter(a => a.status === "accepted").length;
  const reviewCompletionRate = selectedApplicants > 0
    ? (totalReviews / selectedApplicants) * 100
    : 0;

  return {
    totalProducts,
    totalApplicants,
    totalReviews,
    averageFillRate: Math.round(averageFillRate),
    totalLikes,
    reviewCompletionRate: Math.round(reviewCompletionRate)
  };
}

/**
 * Get performance data for each product
 */
export function getProductPerformances(
  products: Product[],
  applications: Application[],
  reviews: Review[]
): ProductPerformance[] {
  return products.map((product) => {
    const productApplications = applications.filter(a => a.productId === product.id);
    const selectedApplications = productApplications.filter(a => a.status === "accepted");
    const productReviews = reviews.filter(r => r.productId === product.id);

    const applicants = productApplications.length;
    const selected = selectedApplications.length;
    const reviewCount = productReviews.length;
    const fillRate = (product.currentApplicants / product.requiredReviewers) * 100;
    const reviewRate = selected > 0 ? (reviewCount / selected) * 100 : 0;

    // Determine status
    let status: "active" | "deadline-soon" | "closed" = "active";
    const deadline = parseDeadline(product.applicationDeadline);
    const daysUntil = Math.ceil((deadline.getTime() - Date.now()) / (1000 * 60 * 60 * 24));
    
    if (daysUntil <= 0) {
      status = "closed";
    } else if (daysUntil <= 2) {
      status = "deadline-soon";
    }

    return {
      product,
      applicants,
      selected,
      reviews: reviewCount,
      fillRate: Math.round(fillRate),
      reviewRate: Math.round(reviewRate),
      likes: product.likeCount,
      status
    };
  });
}

/**
 * Get chart data for trends
 */
export function getChartData(
  applications: Application[],
  reviews: Review[],
  period: PeriodFilter = "week"
): ChartData[] {
  const days = period === "week" ? 7 : period === "month" ? 30 : 90;
  const data: ChartData[] = [];

  for (let i = days - 1; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    const dateStr = `${date.getMonth() + 1}/${date.getDate()}`;

    // In real app, filter by actual date
    // For demo, simulate decreasing trend
    const applicantCount = Math.floor(Math.random() * 10) + 5;
    const reviewCount = Math.floor(Math.random() * 5) + 2;

    data.push({
      name: dateStr,
      신청자: applicantCount,
      리뷰: reviewCount,
      date: date.toISOString()
    });
  }

  return data;
}

/**
 * Parse deadline string to Date
 */
function parseDeadline(deadlineStr: string): Date {
  try {
    const endDateMatch = deadlineStr.match(/- (\d+)\.(\d+)/);
    if (endDateMatch) {
      const month = parseInt(endDateMatch[1]);
      const day = parseInt(endDateMatch[2]);
      const year = new Date().getFullYear();
      return new Date(year, month - 1, day);
    }
    return new Date();
  } catch {
    return new Date();
  }
}

/**
 * Get period label
 */
export function getPeriodLabel(period: PeriodFilter): string {
  switch (period) {
    case "week":
      return "이번 주";
    case "month":
      return "이번 달";
    case "all":
      return "전체";
  }
}

/**
 * Calculate percentage change (for demo)
 */
export function getPercentageChange(current: number, previous: number): number {
  if (previous === 0) return 0;
  return Math.round(((current - previous) / previous) * 100);
}
