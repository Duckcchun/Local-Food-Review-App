import { useState, useCallback } from 'react';
import { useAuthStore } from '../stores/authStore';
import { favoritesApi } from '../utils/api';
import { toast } from 'sonner';

/**
 * Custom hook for managing favorites and product likes.
 * Handles localStorage persistence and backend sync.
 */
export function useFavorites() {
  const { userInfo, accessToken } = useAuthStore();

  const [favorites, setFavorites] = useState<string[]>(() => {
    if (!userInfo?.email) return [];
    try {
      return JSON.parse(localStorage.getItem(`favorites:${userInfo.email}`) || '[]');
    } catch { return []; }
  });

  const [productLikes, setProductLikes] = useState<string[]>(() => {
    if (!userInfo?.email) return [];
    try {
      return JSON.parse(localStorage.getItem(`productLikes:${userInfo.email}`) || '[]');
    } catch { return []; }
  });

  const handleToggleFavorite = useCallback(async (productId: string) => {
    const isCurrentlyFavorite = favorites.includes(productId);
    const newFavorites = isCurrentlyFavorite
      ? favorites.filter(id => id !== productId)
      : [...favorites, productId];

    setFavorites(newFavorites);

    // Save to localStorage
    if (userInfo?.email) {
      try {
        localStorage.setItem(`favorites:${userInfo.email}`, JSON.stringify(newFavorites));
      } catch {}
    }

    if (isCurrentlyFavorite) {
      toast.success("찜 목록에서 제거되었습니다");
    } else {
      toast.success("찜 목록에 추가되었습니다");
    }

    // Backend sync
    if (accessToken) {
      if (isCurrentlyFavorite) {
        favoritesApi.remove(productId, accessToken).catch(e =>
          console.log("Backend save failed:", e.message)
        );
      } else {
        favoritesApi.add(productId, accessToken).catch(e =>
          console.log("Backend save failed:", e.message)
        );
      }
    }
  }, [favorites, userInfo?.email, accessToken]);

  const handleToggleProductLike = useCallback(async (productId: string) => {
    const isCurrentlyLiked = productLikes.includes(productId);
    const newLikes = isCurrentlyLiked
      ? productLikes.filter(id => id !== productId)
      : [...productLikes, productId];

    setProductLikes(newLikes);

    // Save to localStorage
    if (userInfo?.email) {
      try {
        localStorage.setItem(`productLikes:${userInfo.email}`, JSON.stringify(newLikes));
      } catch {}
    }

    if (isCurrentlyLiked) {
      toast.success("좋아요를 취소했습니다");
    } else {
      toast.success("좋아요를 눌렀습니다 👍");
    }

    return isCurrentlyLiked ? -1 : 1;
  }, [productLikes, userInfo?.email]);

  const loadFavoritesFromServer = useCallback(async () => {
    if (!accessToken || !userInfo?.email) return;
    try {
      const data = await favoritesApi.getAll(accessToken);
      if (data.success) {
        const localFavs = favorites;
        const serverFavs = data.favorites ?? [];
        const merged = Array.from(new Set([...localFavs, ...serverFavs]));
        setFavorites(merged);
        try {
          localStorage.setItem(`favorites:${userInfo.email}`, JSON.stringify(merged));
        } catch {}
      }
    } catch (e) {
      console.warn('Failed to load favorites:', e);
    }
  }, [accessToken, userInfo?.email, favorites]);

  return {
    favorites,
    setFavorites,
    productLikes,
    setProductLikes,
    handleToggleFavorite,
    handleToggleProductLike,
    loadFavoritesFromServer,
  };
}
