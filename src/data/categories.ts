export interface Category {
  id: string;
  name: string;
  icon: string;
  color: string;
  bgColor: string;
}

export const CATEGORIES: Category[] = [
  {
    id: "all",
    name: "전체",
    icon: "🍽️",
    color: "#6b8e6f",
    bgColor: "#f5f0dc"
  },
  {
    id: "korean",
    name: "한식",
    icon: "🍚",
    color: "#e63946",
    bgColor: "#ffe5e8"
  },
  {
    id: "chinese",
    name: "중식",
    icon: "🥟",
    color: "#f77f00",
    bgColor: "#fff3e0"
  },
  {
    id: "japanese",
    name: "일식",
    icon: "🍱",
    color: "#d62828",
    bgColor: "#ffe8e8"
  },
  {
    id: "western",
    name: "양식",
    icon: "🍝",
    color: "#9d4edd",
    bgColor: "#f3e8ff"
  },
  {
    id: "snack",
    name: "분식",
    icon: "🍜",
    color: "#f72585",
    bgColor: "#ffe5f0"
  },
  {
    id: "dessert",
    name: "디저트",
    icon: "🍰",
    color: "#ff006e",
    bgColor: "#ffe5f1"
  },
  {
    id: "cafe",
    name: "카페",
    icon: "☕",
    color: "#8b4513",
    bgColor: "#f5e6d3"
  },
  {
    id: "bakery",
    name: "베이커리",
    icon: "🥐",
    color: "#e09f3e",
    bgColor: "#fff4e0"
  },
  {
    id: "chicken",
    name: "치킨",
    icon: "🍗",
    color: "#f4a261",
    bgColor: "#fff0e5"
  },
  {
    id: "pizza",
    name: "피자",
    icon: "🍕",
    color: "#e76f51",
    bgColor: "#ffebe5"
  },
  {
    id: "burger",
    name: "버거",
    icon: "🍔",
    color: "#d4a373",
    bgColor: "#f8f0e8"
  },
  {
    id: "asian",
    name: "아시안",
    icon: "🍛",
    color: "#06a77d",
    bgColor: "#e5f9f3"
  },
  {
    id: "other",
    name: "기타",
    icon: "🍴",
    color: "#6c757d",
    bgColor: "#f1f3f5"
  }
];

/**
 * Get category by ID
 */
export function getCategoryById(id: string): Category {
  return CATEGORIES.find(cat => cat.id === id) || CATEGORIES[0];
}

/**
 * Get category name by ID
 */
export function getCategoryName(id: string): string {
  const category = getCategoryById(id);
  return category.name;
}
