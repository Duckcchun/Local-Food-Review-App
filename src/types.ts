/**
 * Shared type definitions used across the application.
 * Previously defined inline in App.tsx.
 */

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

export type ApplicationStatus = "pending" | "accepted" | "rejected" | "review-completed";

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
  hasPriority?: boolean;
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
