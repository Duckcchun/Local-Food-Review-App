import { create } from 'zustand';
import type { Review } from '../types';
import { reviewsApi } from '../utils/api';
import { toast } from 'sonner';

interface ReviewState {
  completedReviews: Review[];

  // Actions
  setCompletedReviews: (reviews: Review[]) => void;
  addReview: (review: Review) => void;

  // Business logic
  submitReview: (reviewData: Omit<Review, 'id' | 'createdAt'>, accessToken?: string) => Review;
  reportReview: (reviewId: string, reason: string) => void;
  toggleReviewVisibility: (reviewId: string) => void;
  loadReviews: (accessToken: string) => Promise<void>;
  initFromLocalStorage: (userEmail?: string) => void;
  persistToLocalStorage: (userEmail?: string) => void;
}

function localKey(key: string, email?: string) {
  const id = (email || '').trim();
  return id ? `${key}:${id}` : key;
}

export const useReviewStore = create<ReviewState>((set, get) => ({
  completedReviews: [],

  setCompletedReviews: (reviews) => set({ completedReviews: reviews }),

  addReview: (review) => {
    set(state => ({ completedReviews: [...state.completedReviews, review] }));
  },

  submitReview: (reviewData, accessToken) => {
    const newReview: Review = {
      ...reviewData,
      id: `review-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };

    set(state => ({ completedReviews: [...state.completedReviews, newReview] }));

    // Save to backend
    if (accessToken) {
      reviewsApi.create(newReview, accessToken).catch(error => {
        console.log("Backend save failed (using localStorage):", (error as Error).message);
      });
    }

    return newReview;
  },

  reportReview: (reviewId, reason) => {
    set(state => ({
      completedReviews: state.completedReviews.map(review =>
        review.id === reviewId
          ? { ...review, reported: true, reportReason: reason, reportedAt: new Date().toISOString() }
          : review
      ),
    }));
    toast.success("리뷰가 신고되었습니다. 검토 후 조치하겠습니다");
  },

  toggleReviewVisibility: (reviewId) => {
    const { completedReviews } = get();
    const review = completedReviews.find(r => r.id === reviewId);

    set(state => ({
      completedReviews: state.completedReviews.map(r =>
        r.id === reviewId
          ? { ...r, status: r.status === "published" ? "hidden" as const : "published" as const }
          : r
      ),
    }));

    if (review) {
      if (review.status === "published") {
        toast.success("리뷰가 비공개 처리되었습니다");
      } else {
        toast.success("리뷰가 공개 처리되었습니다");
      }
    }
  },

  loadReviews: async (accessToken) => {
    try {
      const reviewsData = await reviewsApi.getAll(accessToken);
      if (reviewsData.success && reviewsData.reviews) {
        const { completedReviews } = get();
        const map = new Map<string, Review>();
        for (const item of completedReviews) map.set(item.id, item);
        for (const item of reviewsData.reviews) map.set(item.id, item);
        set({ completedReviews: Array.from(map.values()) });
      }
    } catch (e) {
      console.warn('Failed to load reviews:', e);
    }
  },

  initFromLocalStorage: (userEmail) => {
    try {
      const saved = localStorage.getItem(localKey('completedReviews', userEmail));
      if (saved) set({ completedReviews: JSON.parse(saved) });
    } catch { /* ignore */ }
  },

  persistToLocalStorage: (userEmail) => {
    const { completedReviews } = get();
    try {
      localStorage.setItem(localKey('completedReviews', userEmail), JSON.stringify(completedReviews));
    } catch { /* ignore */ }
  },
}));
