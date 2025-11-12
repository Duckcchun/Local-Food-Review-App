export interface PointProduct {
  id: string;
  name: string;
  description: string;
  price: number;
  icon: string;
  category: "priority" | "coupon" | "premium" | "badge";
  benefit: string;
  availability?: string;
  color: string;
  bgColor: string;
}

export const POINT_PRODUCTS: PointProduct[] = [
  // Priority Items
  {
    id: "priority-1",
    name: "우선 선정권",
    description: "체험단 신청 시 우선적으로 선정됩니다",
    price: 200,
    icon: "⭐",
    category: "priority",
    benefit: "1회 사용 가능",
    color: "#f5a145",
    bgColor: "#fff4e0"
  },
  {
    id: "priority-2",
    name: "프리미엄 선정권",
    description: "프리미엄 체험단에 우선 선정됩니다",
    price: 500,
    icon: "👑",
    category: "priority",
    benefit: "1회 사용 가능",
    availability: "Lv.3 이상",
    color: "#d4af37",
    bgColor: "#fffbf0"
  },
  {
    id: "priority-3",
    name: "VIP 선정권",
    description: "모든 체험단에 최우선 선정됩니다",
    price: 1000,
    icon: "💎",
    category: "priority",
    benefit: "1회 사용 가능",
    availability: "Lv.4 이상",
    color: "#9d4edd",
    bgColor: "#f3e8ff"
  },

  // Coupons
  {
    id: "coupon-1",
    name: "5,000원 할인 쿠폰",
    description: "제휴 식당에서 5,000원 할인",
    price: 300,
    icon: "🎫",
    category: "coupon",
    benefit: "30일 유효",
    color: "#e63946",
    bgColor: "#ffe5e8"
  },
  {
    id: "coupon-2",
    name: "10,000원 할인 쿠폰",
    description: "제휴 식당에서 10,000원 할인",
    price: 550,
    icon: "🎟️",
    category: "coupon",
    benefit: "30일 유효",
    color: "#d62828",
    bgColor: "#ffe8e8"
  },
  {
    id: "coupon-3",
    name: "배달비 무료 쿠폰",
    description: "배달비 전액 무료 (최대 3,000원)",
    price: 200,
    icon: "🚚",
    category: "coupon",
    benefit: "15일 유효",
    color: "#06a77d",
    bgColor: "#e5f9f3"
  },

  // Premium Benefits
  {
    id: "premium-1",
    name: "신메뉴 선 체험권",
    description: "신메뉴 출시 전 먼저 체험할 기회",
    price: 400,
    icon: "🆕",
    category: "premium",
    benefit: "1개월간 유효",
    color: "#f77f00",
    bgColor: "#fff3e0"
  },
  {
    id: "premium-2",
    name: "사업자 직접 초대권",
    description: "사업자가 직접 초대하는 VIP 체험단 참여",
    price: 800,
    icon: "💌",
    category: "premium",
    benefit: "1개월간 유효",
    availability: "Lv.3 이상",
    color: "#ff006e",
    bgColor: "#ffe5f1"
  },
  {
    id: "premium-3",
    name: "월간 무제한 신청권",
    description: "한 달 동안 무제한으로 체험단 신청 가능",
    price: 1500,
    icon: "🔓",
    category: "premium",
    benefit: "30일간 유효",
    availability: "Lv.4 이상",
    color: "#9d4edd",
    bgColor: "#f3e8ff"
  },

  // Badges
  {
    id: "badge-1",
    name: "맛집 탐험가 배지",
    description: "프로필에 특별 배지 표시",
    price: 250,
    icon: "🗺️",
    category: "badge",
    benefit: "영구 보유",
    color: "#4a7c59",
    bgColor: "#d4edda"
  },
  {
    id: "badge-2",
    name: "미식가 배지",
    description: "프로필에 미식가 배지 표시",
    price: 600,
    icon: "🍽️",
    category: "badge",
    benefit: "영구 보유",
    availability: "Lv.3 이상",
    color: "#6b8e6f",
    bgColor: "#e8f5e9"
  },
  {
    id: "badge-3",
    name: "골드 리뷰어 배지",
    description: "프로필에 골드 리뷰어 배지 표시",
    price: 1200,
    icon: "🏆",
    category: "badge",
    benefit: "영구 보유",
    availability: "Lv.5 이상",
    color: "#d4af37",
    bgColor: "#fffbf0"
  }
];

export interface PointTransaction {
  id: string;
  type: "earn" | "spend";
  amount: number;
  description: string;
  date: string;
  category?: string;
}

export const CATEGORY_NAMES = {
  priority: "우선권",
  coupon: "쿠폰",
  premium: "프리미엄",
  badge: "배지"
};

/**
 * Get products by category
 */
export function getProductsByCategory(category: PointProduct["category"]): PointProduct[] {
  return POINT_PRODUCTS.filter(product => product.category === category);
}

/**
 * Get product by ID
 */
export function getProductById(id: string): PointProduct | undefined {
  return POINT_PRODUCTS.find(product => product.id === id);
}

/**
 * Check if user can purchase product (based on level)
 */
export function canPurchase(product: PointProduct, userLevel: number, userPoints: number): {
  canBuy: boolean;
  reason?: string;
} {
  // Check points
  if (userPoints < product.price) {
    return {
      canBuy: false,
      reason: `포인트가 ${product.price - userPoints}P 부족합니다`
    };
  }

  // Check level requirement
  if (product.availability) {
    const requiredLevel = parseInt(product.availability.match(/\d+/)?.[0] || "1");
    if (userLevel < requiredLevel) {
      return {
        canBuy: false,
        reason: `${product.availability} 필요`
      };
    }
  }

  return { canBuy: true };
}
