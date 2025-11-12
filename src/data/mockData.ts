export interface Product {
  calculatedDistance: any;
  id: string;
  name: string;
  seller: string;
  category: string;
  location: string;
  latitude?: number;
  longitude?: number;
  image: string;
  reviewCount: number;
  description: string;
  applicationDeadline: string;
  requiredReviewers: number;
  currentApplicants: number;
  likeCount: number;
  distance: string;
  badge?: string;
}

export interface Review {
  id: string;
  productId: string;
  productName: string;
  productImage: string;
  comment: string;
  pros: string;
  cons: string;
  suggestions: string;
  date: string;
  userName: string;
  userLevel: number;
}

export const mockProducts: Product[] = [
  {
    id: "1",
    name: "할머니 손맛 김치찌개",
    seller: "동네식당",
    category: "한식",
    location: "서울시 마포구",
    latitude: 37.5665,
    longitude: 126.9019,
    image: "https://images.unsplash.com/photo-1760228865341-675704c22a5b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxrb3JlYW4lMjBraW1jaGklMjBqamlnYWUlMjBzdGV3fGVufDF8fHx8MTc2Mjc3MjAxMHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    reviewCount: 32,
    description: "20년 전통의 집밥 같은 김치찌개를 맛보세요",
    applicationDeadline: "12.20(금) - 12.25(수)",
    requiredReviewers: 50,
    currentApplicants: 38,
    likeCount: 124,
    distance: "0.5km",
    badge: "체험 후 리뷰 작성",
    calculatedDistance: undefined
  },
  {
    id: "2",
    name: "손으로 빚은 왕교자",
    seller: "만두집",
    category: "중식",
    location: "서울시 마포구",
    latitude: 37.5665,
    longitude: 126.9019,
    image: "https://images.unsplash.com/photo-1583224994076-ae951d019af7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxrb3JlYW4lMjBkdW1wbGluZ3MlMjBtYW5kdXxlbnwxfHx8fDE3NjI4MjY2NzB8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    reviewCount: 45,
    description: "매일 아침 직접 빚는 수제 만두, 고기가 가득!",
    applicationDeadline: "12.18(수) - 12.23(월)",
    requiredReviewers: 40,
    currentApplicants: 51,
    likeCount: 156,
    distance: "0.8km",
    calculatedDistance: undefined
  },
  {
    id: "3",
    name: "엄마손 김밥 세트",
    seller: "우리분식",
    category: "분식",
    location: "서울시 마포구",
    latitude: 37.5665,
    longitude: 126.9019,
    image: "https://images.unsplash.com/photo-1709741123566-4083be97eb35?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxrb3JlYW4lMjBnaW1iYXAlMjBraW1iYXB8ZW58MXx8fHwxNzYyNzUxOTQ1fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    reviewCount: 28,
    description: "재료 아끼지 않는 푸짐한 김밥, 떡볶이 세트",
    applicationDeadline: "12.19(목) - 12.24(화)",
    requiredReviewers: 60,
    currentApplicants: 42,
    likeCount: 92,
    distance: "1.2km",
    calculatedDistance: undefined
  },
  {
    id: "4",
    name: "수제 크림 케이크",
    seller: "동네베이커리",
    category: "디저트",
    location: "서울시 마포구",
    latitude: 37.5665,
    longitude: 126.9019,
    image: "https://images.unsplash.com/photo-1631600198408-ed0a4ae3443c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjcmVhbSUyMGNha2UlMjBkZXNzZXJ0fGVufDF8fHx8MTc2MjgyNjY3MXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    reviewCount: 56,
    description: "매일 갓 만드는 생크림 케이크와 빵",
    applicationDeadline: "12.21(토) - 12.26(목)",
    requiredReviewers: 30,
    currentApplicants: 28,
    likeCount: 203,
    distance: "0.3km",
    calculatedDistance: undefined
  },
  {
    id: "5",
    name: "국물 떡볶이와 튀김",
    seller: "신당동 떡볶이",
    category: "분식",
    location: "서울시 마포구",
    latitude: 37.5665,
    longitude: 126.9019,
    image: "https://images.unsplash.com/photo-1747228469031-c5fc60b9d9f9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxrb3JlYW4lMjB0dGVva2Jva2tpJTIwcmljZSUyMGNha2V8ZW58MXx8fHwxNzYyODI2NjcxfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    reviewCount: 41,
    description: "매콤 달콤한 국물 떡볶이와 바삭한 튀김 모듬",
    applicationDeadline: "12.22(일) - 12.27(금)",
    requiredReviewers: 50,
    currentApplicants: 47,
    likeCount: 167,
    distance: "1.5km",
    calculatedDistance: undefined
  },
  {
    id: "6",
    name: "직화 닭갈비 정식",
    seller: "춘천집",
    category: "한식",
    location: "서울시 마포구",
    latitude: 37.5665,
    longitude: 126.9019,
    image: "https://images.unsplash.com/photo-1616627152550-5aac9b71a949?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxrb3JlYW4lMjBkYWslMjBnYWxiaSUyMGNoaWNrZW58ZW58MXx8fHwxNzYyNzUxOTQ4fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    reviewCount: 63,
    description: "직접 양념한 닭갈비와 볶음밥까지",
    applicationDeadline: "12.17(화) - 12.22(일)",
    requiredReviewers: 45,
    currentApplicants: 59,
    likeCount: 189,
    distance: "2.1km",
    calculatedDistance: undefined
  },
  {
    id: "7",
    name: "수제 버거 세트",
    seller: "버거 스튜디오",
    category: "버거",
    location: "서울시 마포구",
    latitude: 37.5665,
    longitude: 126.9019,
    image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxidXJnZXIlMjBmcmllc3xlbnwxfHx8fDE3NjI4MjY2NzF8MA&ixlib=rb-4.1.0&q=80&w=1080",
    reviewCount: 72,
    description: "두툼한 패티와 신선한 야채가 만나는 수제 버거",
    applicationDeadline: "12.20(금) - 12.25(수)",
    requiredReviewers: 35,
    currentApplicants: 41,
    likeCount: 234,
    distance: "0.9km",
    calculatedDistance: undefined
  },
  {
    id: "8",
    name: "시그니처 아메리카노",
    seller: "골목 카페",
    category: "카페",
    location: "서울시 마포구",
    latitude: 37.5665,
    longitude: 126.9019,
    image: "https://images.unsplash.com/photo-1509042239860-f550ce710b93?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb2ZmZWUlMjBjYWZlJTIwbGF0dGV8ZW58MXx8fHwxNzYyODI2NjcxfDA&ixlib=rb-4.1.0&q=80&w=1080",
    reviewCount: 38,
    description: "직접 로스팅한 원두로 내리는 스페셜티 커피",
    applicationDeadline: "12.18(수) - 12.23(월)",
    requiredReviewers: 25,
    currentApplicants: 19,
    likeCount: 145,
    distance: "0.4km",
    calculatedDistance: undefined
  },
  {
    id: "9",
    name: "정통 마르게리타 피자",
    seller: "이탈리아노",
    category: "피자",
    location: "서울시 마포구",
    latitude: 37.5665,
    longitude: 126.9019,
    image: "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwaXp6YSUyMG1hcmdoZXJpdGF8ZW58MXx8fHwxNzYyODI2NjcxfDA&ixlib=rb-4.1.0&q=80&w=1080",
    reviewCount: 54,
    description: "화덕에서 구운 정통 이탈리아 피자",
    applicationDeadline: "12.19(목) - 12.24(화)",
    requiredReviewers: 40,
    currentApplicants: 52,
    likeCount: 198,
    distance: "1.7km",
    calculatedDistance: undefined
  },
  {
    id: "10",
    name: "크로아상 모음",
    seller: "파리 베이커리",
    category: "베이커리",
    location: "서울시 마포구",
    latitude: 37.5665,
    longitude: 126.9019,
    image: "https://images.unsplash.com/photo-1555507036-ab1f4038808a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjcm9pc3NhbnQlMjBiYWtlcnl8ZW58MXx8fHwxNzYyODI2NjcxfDA&ixlib=rb-4.1.0&q=80&w=1080",
    reviewCount: 47,
    description: "매일 새벽에 굽는 바삭한 프랑스 정통 크로아상",
    applicationDeadline: "12.21(토) - 12.26(목)",
    requiredReviewers: 30,
    currentApplicants: 25,
    likeCount: 176,
    distance: "0.6km",
    calculatedDistance: undefined
  },
  {
    id: "11",
    name: "양념 치킨 세트",
    seller: "황금 치킨",
    category: "치킨",
    location: "서울시 마포구",
    latitude: 37.5665,
    longitude: 126.9019,
    image: "https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmcmllZCUyMGNoaWNrZW4lMjBrb3JlYW58ZW58MXx8fHwxNzYyODI2NjcxfDA&ixlib=rb-4.1.0&q=80&w=1080",
    reviewCount: 89,
    description: "겉은 바삭, 속은 촉촉! 비법 양념 치킨",
    applicationDeadline: "12.17(화) - 12.22(일)",
    requiredReviewers: 50,
    currentApplicants: 62,
    likeCount: 267,
    distance: "1.3km",
    calculatedDistance: undefined
  },
  {
    id: "12",
    name: "참치 회 덮밥",
    seller: "스시 하우스",
    category: "일식",
    location: "서울시 마포구",
    latitude: 37.5665,
    longitude: 126.9019,
    image: "https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzYXNoaW1pJTIwYm93bCUyMGphcGFuZXNlfGVufDF8fHx8MTc2MjgyNjY3MXww&ixlib=rb-4.1.0&q=80&w=1080",
    reviewCount: 66,
    description: "매일 아침 공수하는 신선한 참치 회 덮밥",
    applicationDeadline: "12.20(금) - 12.25(수)",
    requiredReviewers: 35,
    currentApplicants: 44,
    likeCount: 211,
    distance: "1.0km",
    calculatedDistance: undefined
  },
  {
    id: "13",
    name: "크림 파스타",
    seller: "파스타 공방",
    category: "양식",
    location: "서울시 마포구",
    latitude: 37.5665,
    longitude: 126.9019,
    image: "https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjcmVhbSUyMHBhc3RhJTIwaXRhbGlhbnxlbnwxfHx8fDE3NjI4MjY2NzF8MA&ixlib=rb-4.1.0&q=80&w=1080",
    reviewCount: 51,
    description: "수제 생면으로 만드는 부드러운 크림 파스타",
    applicationDeadline: "12.18(수) - 12.23(월)",
    requiredReviewers: 40,
    currentApplicants: 36,
    likeCount: 183,
    distance: "1.8km",
    calculatedDistance: undefined
  },
  {
    id: "14",
    name: "팟타이 세트",
    seller: "방콕 키친",
    category: "아시안",
    location: "서울시 마포구",
    latitude: 37.5665,
    longitude: 126.9019,
    image: "https://images.unsplash.com/photo-1559314809-0d155014e29e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwYWQlMjB0aGFpJTIwdGhhaXxlbnwxfHx8fDE3NjI4MjY2NzF8MA&ixlib=rb-4.1.0&q=80&w=1080",
    reviewCount: 43,
    description: "태국 현지 맛 그대로! 쌀국수 팟타이",
    applicationDeadline: "12.19(목) - 12.24(화)",
    requiredReviewers: 30,
    currentApplicants: 27,
    likeCount: 152,
    distance: "2.3km",
    calculatedDistance: undefined
  }
];

export const mockReviews: Review[] = [
  {
    id: "1",
    productId: "1",
    productName: "할머니 손맛 김치찌개",
    productImage: "https://images.unsplash.com/photo-1760228865341-675704c22a5b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxrb3JlYW4lMjBraW1jaGklMjBqamlnYWUlMjBzdGV3fGVufDF8fHx8MTc2Mjc3MjAxMHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    comment: "진짜 집에서 먹는 것처럼 푸근한 맛이에요. 김치도 직접 담그신다고 하는데 정말 맛있었습니다.",
    pros: "김치가 정말 맛있고, 고기도 푸짐하게 들어있어요. 밑반찬도 깔끔하고 맛있습니다.",
    cons: "점심시간에는 사람이 많아서 조금 기다려야 해요.",
    suggestions: "배달 용기를 좀 더 튼튼한 걸로 바꾸면 좋을 것 같아요.",
    date: "2025.11.05",
    userName: "김맛평",
    userLevel: 3
  },
  {
    id: "2",
    productId: "2",
    productName: "손으로 빚은 왕교자",
    productImage: "https://images.unsplash.com/photo-1583224994076-ae951d019af7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxrb3JlYW4lMjBkdW1wbGluZ3MlMjBtYW5kdXxlbnwxfHx8fDE3NjI4MjY2NzB8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    comment: "만두 크기가 정말 크고 속이 꽉 차있어요! 재주문 의사 100%입니다.",
    pros: "만두가 크고 속재료가 가득해요. 피도 쫄깃하고 맛있습니다.",
    cons: "배달 시간이 조금 걸려요. 만들어서 보내주시는 것 같아요.",
    suggestions: "소스를 한두 개 더 주시면 좋을 것 같아요.",
    date: "2025.11.03",
    userName: "김맛평",
    userLevel: 3
  }
];

export const userProfile = {
  name: "김맛평",
  level: 3,
  reviewCount: 12,
  likeReceived: 45,
  totalPoints: 1250
};