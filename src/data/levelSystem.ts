export interface Level {
  level: number;
  name: string;
  icon: string;
  minPoints: number;
  maxPoints: number;
  color: string;
  bgColor: string;
  benefits: string[];
  description: string;
}

export const LEVELS: Level[] = [
  {
    level: 1,
    name: "새싹 평가단",
    icon: "🌱",
    minPoints: 0,
    maxPoints: 99,
    color: "#a8d5ba",
    bgColor: "#f0f9f4",
    benefits: [
      "체험단 신청 가능",
      "리뷰 작성 시 50 포인트",
    ],
    description: "이제 막 시작한 신입 평가단"
  },
  {
    level: 2,
    name: "초보 평가단",
    icon: "🌿",
    minPoints: 100,
    maxPoints: 299,
    color: "#6b8e6f",
    bgColor: "#e8f5e9",
    benefits: [
      "리뷰 작성 시 60 포인트 (+20%)",
      "월 1회 우선 선정 기회",
      "특별 이벤트 참여 가능"
    ],
    description: "꾸준한 활동으로 성장하는 평가단"
  },
  {
    level: 3,
    name: "일반 평가단",
    icon: "🍀",
    minPoints: 300,
    maxPoints: 599,
    color: "#4a7c59",
    bgColor: "#d4edda",
    benefits: [
      "리뷰 작성 시 75 포인트 (+50%)",
      "월 2회 우선 선정 기회",
      "프리미엄 체험단 신청 가능",
      "사업자 직접 초대 우선권"
    ],
    description: "신뢰도 높은 중견 평가단"
  },
  {
    level: 4,
    name: "고급 평가단",
    icon: "⭐",
    minPoints: 600,
    maxPoints: 999,
    color: "#f5a145",
    bgColor: "#fff3e0",
    benefits: [
      "리뷰 작성 시 100 포인트 (+100%)",
      "월 4회 우선 선정 기회",
      "VIP 체험단 신청 가능",
      "리뷰 검수 우선 통과",
      "특별 할인 혜택"
    ],
    description: "검증된 전문성을 갖춘 평가단"
  },
  {
    level: 5,
    name: "전문 평가단",
    icon: "👑",
    minPoints: 1000,
    maxPoints: Infinity,
    color: "#d4af37",
    bgColor: "#fffbf0",
    benefits: [
      "리뷰 작성 시 150 포인트 (+200%)",
      "무제한 우선 선정",
      "신메뉴 선 체험 기회",
      "사업자 컨설팅 참여",
      "최상위 등급 전용 혜택",
      "월간 TOP 평가단 이벤트"
    ],
    description: "최고의 신뢰도를 자랑하는 마스터 평가단"
  }
];

/**
 * Get level information based on total points
 */
export function getLevelInfo(points: number): Level {
  for (let i = LEVELS.length - 1; i >= 0; i--) {
    if (points >= LEVELS[i].minPoints) {
      return LEVELS[i];
    }
  }
  return LEVELS[0];
}

/**
 * Calculate progress to next level (0-100)
 */
export function getLevelProgress(points: number): number {
  const currentLevel = getLevelInfo(points);
  
  if (currentLevel.level === LEVELS.length) {
    return 100; // Max level
  }
  
  const pointsInLevel = points - currentLevel.minPoints;
  const pointsNeeded = currentLevel.maxPoints - currentLevel.minPoints + 1;
  
  return Math.min(100, Math.round((pointsInLevel / pointsNeeded) * 100));
}

/**
 * Get points needed for next level
 */
export function getPointsToNextLevel(points: number): number {
  const currentLevel = getLevelInfo(points);
  
  if (currentLevel.level === LEVELS.length) {
    return 0; // Max level
  }
  
  return currentLevel.maxPoints + 1 - points;
}

/**
 * Calculate points earned from review
 */
export function calculateReviewPoints(userLevel: number, hasPhotos: boolean = false): number {
  const basePoints = 50;
  
  // Level bonus
  const levelMultiplier = [1, 1.2, 1.5, 2, 3]; // 0%, 20%, 50%, 100%, 200%
  const levelBonus = basePoints * (levelMultiplier[userLevel - 1] || 1);
  
  // Photo bonus
  const photoBonus = hasPhotos ? 20 : 0;
  
  return Math.round(levelBonus + photoBonus);
}

/**
 * Get level badge component props
 */
export function getLevelBadgeProps(level: number) {
  const levelInfo = LEVELS[level - 1] || LEVELS[0];
  return {
    icon: levelInfo.icon,
    name: levelInfo.name,
    color: levelInfo.color,
    bgColor: levelInfo.bgColor
  };
}
