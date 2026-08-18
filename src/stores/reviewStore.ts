import { create } from 'zustand';
import type { Review } from '../types';
import { reviewsApi } from '../utils/api';

interface ReviewState {
  completedReviews: Review[];
  isLoading: boolean;

  // Actions
  setCompletedReviews: (reviews: Review[]) => void;
  addReview: (review: Review, accessToken?: string) => void;
  reportReview: (reviewId: string, reason: string) => void;
  toggleVisibility: (reviewId: string) => void;
  loadFromServer: (accessToken: string, userEmail?: string) => Promise<boolean>;
}

export const useReviewStore = create<ReviewState>((set, get) => ({
  completedReviews: [],
  isLoading: false,

  setCompletedReviews: (reviews) => set({ completedReviews: reviews }),

  addReview: (review, accessToken) => {
    const updated = [...get().completedReviews, review];
    set({ completedReviews: updated });
    // Backend save (fire-and-forget)
    if (accessToken) {
      reviewsApi.create(review, accessToken).catch(e =>
        console.log("Backend save failed:", e.message)
      );
    }
  },

  reportReview: (reviewId, reason) => {
    set(state => ({
      completedReviews: state.completedReviews.map(review =>
        review.id === reviewId
          ? { ...review, reported: true, reportReason: reason, reportedAt: new Date().toISOString() }
          : review
      ),
    }));
  },

  toggleVisibility: (reviewId) => {
    set(state => ({
      completedReviews: state.completedReviews.map(review =>
        review.id === reviewId
          ? { ...review, status: review.status === "published" ? "hidden" : "published" }
          : review
      ),
    }));
  },

  loadFromServer: async (accessToken, userEmail) => {
    set({ isLoading: true });
    try {
      const data = await reviewsApi.getAll(accessToken);
      if (data.success) {
        const localKey = userEmail ? `completedReviews:${userEmail}` : 'completedReviews';
        const localReviews: Review[] = (() => {
          try { return JSON.parse(localStorage.getItem(localKey) || '[]'); } catch { return []; }
        })();
        // Merge
        const map = new Map<string, Review>();
        for (const item of localReviews) map.set(item.id, item);
        for (const item of (data.reviews ?? [])) map.set(item.id, item);
        const merged = Array.from(map.values());
        set({ completedReviews: merged });
        try { localStorage.setItem(localKey, JSON.stringify(merged)); } catch {}
        return true;
      }
      return false;
    } catch (e) {
      console.warn('Failed to load reviews:', e);
      return false;
    } finally {
      set({ isLoading: false });
    }
  },
}));
