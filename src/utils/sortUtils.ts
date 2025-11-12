import type { Product } from "../data/mockData";

export type SortOption = "distance" | "popular" | "newest" | "deadline" | "filling";

export interface SortConfig {
  id: SortOption;
  name: string;
  icon: string;
  description: string;
}

export const SORT_OPTIONS: SortConfig[] = [
  {
    id: "distance",
    name: "거리순",
    icon: "📍",
    description: "가까운 순서대로"
  },
  {
    id: "popular",
    name: "인기순",
    icon: "❤️",
    description: "좋아요 많은 순"
  },
  {
    id: "newest",
    name: "최신순",
    icon: "🆕",
    description: "최근 등록순"
  },
  {
    id: "deadline",
    name: "마감임박순",
    icon: "⏰",
    description: "마감일 가까운 순"
  },
  {
    id: "filling",
    name: "모집률순",
    icon: "📊",
    description: "모집률 높은 순"
  }
];

/**
 * Parse deadline string to Date
 * Format: "12.20(금) - 12.25(수)" -> use end date
 */
function parseDeadline(deadlineStr: string): Date {
  try {
    // Extract end date: "12.20(금) - 12.25(수)" -> "12.25"
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
 * Calculate filling rate (percentage)
 */
function getFillingRate(product: Product): number {
  return (product.currentApplicants / product.requiredReviewers) * 100;
}

/**
 * Get days until deadline
 */
function getDaysUntilDeadline(product: Product): number {
  const deadline = parseDeadline(product.applicationDeadline);
  const now = new Date();
  const diff = deadline.getTime() - now.getTime();
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
}

/**
 * Sort products based on selected option
 */
export function sortProducts(
  products: Product[],
  sortBy: SortOption
): Product[] {
  const sorted = [...products];

  switch (sortBy) {
    case "distance":
      // Sort by calculated distance (already sorted in HomePage)
      sorted.sort((a, b) => {
        if (!a.calculatedDistance) return 1;
        if (!b.calculatedDistance) return -1;
        return a.calculatedDistance - b.calculatedDistance;
      });
      break;

    case "popular":
      // Sort by like count (descending)
      sorted.sort((a, b) => {
        const diff = b.likeCount - a.likeCount;
        if (diff !== 0) return diff;
        // If same likes, sort by distance
        if (a.calculatedDistance && b.calculatedDistance) {
          return a.calculatedDistance - b.calculatedDistance;
        }
        return 0;
      });
      break;

    case "newest":
      // Sort by ID (higher ID = newer, assuming timestamp-based IDs)
      // In real app, this would use createdAt timestamp
      sorted.sort((a, b) => {
        // Try to parse numeric part of ID
        const aNum = parseInt(a.id.replace(/\D/g, "")) || 0;
        const bNum = parseInt(b.id.replace(/\D/g, "")) || 0;
        const diff = bNum - aNum;
        if (diff !== 0) return diff;
        // If same, sort by distance
        if (a.calculatedDistance && b.calculatedDistance) {
          return a.calculatedDistance - b.calculatedDistance;
        }
        return 0;
      });
      break;

    case "deadline":
      // Sort by days until deadline (ascending - closest first)
      sorted.sort((a, b) => {
        const aDays = getDaysUntilDeadline(a);
        const bDays = getDaysUntilDeadline(b);
        const diff = aDays - bDays;
        if (diff !== 0) return diff;
        // If same deadline, sort by distance
        if (a.calculatedDistance && b.calculatedDistance) {
          return a.calculatedDistance - b.calculatedDistance;
        }
        return 0;
      });
      break;

    case "filling":
      // Sort by filling rate (descending - highest first)
      sorted.sort((a, b) => {
        const aRate = getFillingRate(a);
        const bRate = getFillingRate(b);
        const diff = bRate - aRate;
        if (diff !== 0) return diff;
        // If same rate, sort by distance
        if (a.calculatedDistance && b.calculatedDistance) {
          return a.calculatedDistance - b.calculatedDistance;
        }
        return 0;
      });
      break;

    default:
      // Default: distance
      break;
  }

  return sorted;
}

/**
 * Get sort option by ID
 */
export function getSortOption(id: SortOption): SortConfig {
  return SORT_OPTIONS.find(opt => opt.id === id) || SORT_OPTIONS[0];
}

/**
 * Get product stats for display
 */
export function getProductStats(product: Product): {
  fillingRate: number;
  daysUntilDeadline: number;
} {
  return {
    fillingRate: getFillingRate(product),
    daysUntilDeadline: getDaysUntilDeadline(product)
  };
}
