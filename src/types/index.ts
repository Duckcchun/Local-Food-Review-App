/**
 * Shared domain types for the 밥터뷰 app.
 *
 * All interfaces/types that are used across multiple components live here.
 * Previously these were defined in App.tsx which forced every consumer to
 * import from the root component — creating a tight coupling between the
 * presentation layer and type definitions.
 */

/** 사용자 기본 정보 (리뷰어/사업자 공통) */
export interface UserInfo {
  name: string;
  email: string;
  phone: string;
  userType: "reviewer" | "business";
  businessName?: string;
  businessNumber?: string;
  businessAddress?: string;
}


export type NotificationType = "selection" | "rejection" | "review-request" | "review-received" | "application";

export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  productId?: string;
  productName?: string;
  productImage?: string;
  createdAt: string;
  read: boolean;
}

/** 체험단 신청 상태 */
export type ApplicationStatus = "pending" | "accepted" | "rejected" | "review-completed";

/** 체험단 신청 내역 */
export interface Application {
  id: string;
  productId: string;
  productName: string;
  productImage: string;
  userId: string;
  userName: string;
  userEmail: string;
  userPhone: string;
  userLevel: number;
  status: ApplicationStatus;
  appliedAt: string;
}

export interface Review {
  id: string;
  productId: string;
  productName: string;
  productImage: string;
  pros: string;
  cons: string;
  improvements: string;
  photos: string[];
  createdAt: string;
  userId?: string;
  userName?: string;
  status: "published" | "hidden";
  reported: boolean;
  reportReason?: string;
  reportedAt?: string;
}
