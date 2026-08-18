import { useEffect, useRef } from 'react';
import { useAuthStore } from '../stores/authStore';
import { useProductStore } from '../stores/productStore';
import { useApplicationStore } from '../stores/applicationStore';
import { useReviewStore } from '../stores/reviewStore';
import { useNotificationStore } from '../stores/notificationStore';
import { usePointStore } from '../stores/pointStore';
import { toast } from 'sonner';

/**
 * Hook that loads user data from the backend when a session is established.
 * Replaces the massive loadUserData function from App.tsx.
 * Only runs once per session (tracked by a ref).
 */
export function useDataLoader() {
  const { userInfo, accessToken } = useAuthStore();
  const { loadFromServer: loadProducts } = useProductStore();
  const { loadFromServer: loadApplications } = useApplicationStore();
  const { loadFromServer: loadReviews } = useReviewStore();
  const { loadFromServer: loadNotifications } = useNotificationStore();
  const { loadFromStorage: loadPoints } = usePointStore();

  const lastLoadKeyRef = useRef<string>("");

  useEffect(() => {
    if (!userInfo || !accessToken) return;

    const key = `${accessToken}:${userInfo.userType}`;
    if (lastLoadKeyRef.current === key) return;
    lastLoadKeyRef.current = key;

    // Load points from localStorage (instant)
    loadPoints(userInfo.email);

    // Load data from server (async)
    const loadAll = async () => {
      let anySuccess = false;

      const results = await Promise.allSettled([
        loadApplications(accessToken, userInfo.userType, userInfo.email),
        loadReviews(accessToken, userInfo.email),
        loadNotifications(accessToken, userInfo.email),
        loadProducts(accessToken),
      ]);

      for (const result of results) {
        if (result.status === 'fulfilled' && result.value === true) {
          anySuccess = true;
        }
      }

      if (anySuccess) {
        toast.success("서버 데이터 로드 완료");
      }
    };

    loadAll();
  }, [userInfo, accessToken, loadProducts, loadApplications, loadReviews, loadNotifications, loadPoints]);
}
