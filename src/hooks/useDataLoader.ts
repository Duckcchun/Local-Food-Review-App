import { useEffect, useRef } from 'react';
import { useAuthStore } from '../stores/authStore';
import { useProductStore } from '../stores/productStore';
import { useApplicationStore } from '../stores/applicationStore';
import { useReviewStore } from '../stores/reviewStore';
import { useNotificationStore } from '../stores/notificationStore';
import { usePointStore } from '../stores/pointStore';
import { toast } from 'sonner';

/**
 * Hook that loads user data from localStorage and backend when the user is authenticated.
 * Replicates the original App.tsx loadUserData + session restore logic.
 */
export function useDataLoader() {
  const { userInfo, accessToken } = useAuthStore();
  const { initFromLocalStorage: initProducts, loadProducts } = useProductStore();
  const { initFromLocalStorage: initApps, loadApplications, persistToLocalStorage: persistApps } = useApplicationStore();
  const { initFromLocalStorage: initReviews, loadReviews, persistToLocalStorage: persistReviews } = useReviewStore();
  const { initFromLocalStorage: initNotifs, loadNotifications, persistToLocalStorage: persistNotifs } = useNotificationStore();
  const { initFromLocalStorage: initPoints } = usePointStore();

  const lastLoadKeyRef = useRef<string>("");

  // Initialize from localStorage when user is set
  useEffect(() => {
    if (!userInfo) return;
    const email = userInfo.email;
    initProducts(email);
    initApps(email);
    initReviews(email);
    initNotifs(email);
    initPoints(email);
  }, [userInfo?.email]);

  // Load from backend when user + token are available
  useEffect(() => {
    if (!userInfo || !accessToken) return;
    const key = `${accessToken}:${userInfo.userType}`;
    if (lastLoadKeyRef.current === key) return;
    lastLoadKeyRef.current = key;

    const loadAll = async () => {
      let anySuccess = false;

      try {
        await loadApplications(accessToken, userInfo.userType);
        anySuccess = true;
      } catch {}

      try {
        await loadReviews(accessToken);
        anySuccess = true;
      } catch {}

      try {
        await loadNotifications(accessToken);
        anySuccess = true;
      } catch {}

      try {
        await loadProducts(accessToken);
        anySuccess = true;
      } catch {}

      if (anySuccess) {
        toast.success("서버 데이터 로드 완료");
      }

      // Persist merged data
      persistApps(userInfo.email);
      persistReviews(userInfo.email);
      persistNotifs(userInfo.email);
    };

    loadAll();
  }, [userInfo, accessToken]);

  // Persist stores to localStorage when they change
  useEffect(() => {
    if (!userInfo) return;
    const email = userInfo.email;

    // Subscribe to store changes and persist
    const unsubApps = useApplicationStore.subscribe((state) => {
      try { localStorage.setItem(`applications:${email}`, JSON.stringify(state.applications)); } catch {}
    });
    const unsubReviews = useReviewStore.subscribe((state) => {
      try { localStorage.setItem(`completedReviews:${email}`, JSON.stringify(state.completedReviews)); } catch {}
    });
    const unsubNotifs = useNotificationStore.subscribe((state) => {
      try { localStorage.setItem(`notifications:${email}`, JSON.stringify(state.notifications)); } catch {}
    });
    const unsubPoints = usePointStore.subscribe((state) => {
      try {
        localStorage.setItem(`userPoints:${email}`, state.userPoints.toString());
        localStorage.setItem(`userLevel:${email}`, state.userLevel.toString());
        localStorage.setItem(`pointTransactions:${email}`, JSON.stringify(state.pointTransactions));
      } catch {}
    });
    const unsubProducts = useProductStore.subscribe((state) => {
      try {
        localStorage.setItem(`favorites:${email}`, JSON.stringify(state.favorites));
        localStorage.setItem(`productLikes:${email}`, JSON.stringify(state.productLikes));
      } catch {}
    });

    return () => {
      unsubApps();
      unsubReviews();
      unsubNotifs();
      unsubPoints();
      unsubProducts();
    };
  }, [userInfo?.email]);
}
