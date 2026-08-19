import { create } from 'zustand';
import type { Product } from '../data/mockData';
import { mockProducts } from '../data/mockData';
import { productsApi, favoritesApi } from '../utils/api';
import { toast } from 'sonner';

interface ProductState {
  businessProducts: Product[];
  allProducts: Product[];
  favorites: string[];
  productLikes: string[];
  selectedProduct: Product | null;

  // Actions
  setSelectedProduct: (product: Product | null) => void;
  setBusinessProducts: (products: Product[]) => void;
  setAllProducts: (products: Product[]) => void;
  setFavorites: (favorites: string[]) => void;
  setProductLikes: (likes: string[]) => void;

  // Business logic
  addBusinessProduct: (product: Product, accessToken?: string) => void;
  deleteBusinessProduct: (productId: string, accessToken?: string) => void;
  toggleFavorite: (productId: string, accessToken?: string) => void;
  toggleProductLike: (productId: string) => void;
  incrementApplicants: (productId: string) => void;
  decrementApplicants: (productId: string) => void;
  incrementReviewCount: (productId: string) => void;
  loadProducts: (accessToken: string) => Promise<void>;
  initFromLocalStorage: (userEmail?: string) => void;
  syncAllProducts: () => void;
}

// Helper: user-scoped localStorage key
function localKey(key: string, email?: string) {
  const id = (email || '').trim();
  return id ? `${key}:${id}` : key;
}

export const useProductStore = create<ProductState>((set, get) => ({
  businessProducts: (() => {
    try { return JSON.parse(localStorage.getItem('businessProducts') || '[]'); } catch { return []; }
  })(),
  allProducts: (() => {
    try {
      const biz = JSON.parse(localStorage.getItem('businessProducts') || '[]');
      return biz.length > 0 ? [...mockProducts, ...biz] : [...mockProducts];
    } catch { return [...mockProducts]; }
  })(),
  favorites: [],
  productLikes: [],
  selectedProduct: null,

  setSelectedProduct: (product) => set({ selectedProduct: product }),
  setBusinessProducts: (products) => set({ businessProducts: products }),
  setAllProducts: (products) => set({ allProducts: products }),
  setFavorites: (favorites) => set({ favorites }),
  setProductLikes: (likes) => set({ productLikes: likes }),

  initFromLocalStorage: (userEmail?: string) => {
    try {
      const favs = JSON.parse(localStorage.getItem(localKey('favorites', userEmail)) || '[]');
      const likes = JSON.parse(localStorage.getItem(localKey('productLikes', userEmail)) || '[]');
      const biz = JSON.parse(localStorage.getItem('businessProducts') || '[]');
      set({
        favorites: favs,
        productLikes: likes,
        businessProducts: biz,
        allProducts: [...mockProducts, ...biz],
      });
    } catch { /* ignore */ }
  },

  syncAllProducts: () => {
    const { businessProducts } = get();
    set((state: ProductState) => {
      const prevById = new Map<string, Product>(state.allProducts.map((p: Product) => [p.id, p]));
      const newAll = [...mockProducts, ...businessProducts].map(product => {
        const prev = prevById.get(product.id);
        if (!prev) return product;
        return {
          ...product,
          currentApplicants: prev.currentApplicants ?? product.currentApplicants,
          likeCount: prev.likeCount ?? product.likeCount,
          reviewCount: prev.reviewCount ?? product.reviewCount,
        };
      });
      return { allProducts: newAll };
    });
  },

  addBusinessProduct: (product, accessToken) => {
    set(state => {
      const updated = [...state.businessProducts, product];
      try { localStorage.setItem('businessProducts', JSON.stringify(updated)); } catch {}
      return {
        businessProducts: updated,
        allProducts: [...mockProducts, ...updated],
      };
    });
    if (accessToken) {
      productsApi.create(product, accessToken).catch(e => {
        console.log("Backend save failed (using localStorage):", (e as Error).message);
      });
    }
  },

  deleteBusinessProduct: (productId, accessToken) => {
    set(state => {
      const updated = state.businessProducts.filter(p => p.id !== productId);
      try { localStorage.setItem('businessProducts', JSON.stringify(updated)); } catch {}
      return {
        businessProducts: updated,
        allProducts: [...mockProducts, ...updated],
      };
    });
    toast.success("체험단이 삭제되었습니다");
    if (accessToken) {
      console.log("Backend delete not implemented yet");
    }
  },

  toggleFavorite: (productId, accessToken) => {
    const { favorites } = get();
    const isCurrentlyFavorite = favorites.includes(productId);
    const newFavorites = isCurrentlyFavorite
      ? favorites.filter(id => id !== productId)
      : [...favorites, productId];
    const delta = isCurrentlyFavorite ? -1 : 1;

    set(state => ({
      favorites: newFavorites,
      allProducts: state.allProducts.map(p =>
        p.id === productId
          ? { ...p, likeCount: Math.max(0, (p.likeCount || 0) + delta) }
          : p
      ),
      businessProducts: state.businessProducts.map(p =>
        p.id === productId
          ? { ...p, likeCount: Math.max(0, (p.likeCount || 0) + delta) }
          : p
      ),
    }));

    if (isCurrentlyFavorite) {
      toast.success("찜 목록에서 제거되었습니다");
    } else {
      toast.success("찜 목록에 추가되었습니다");
    }

    if (accessToken) {
      if (isCurrentlyFavorite) {
        favoritesApi.remove(productId, accessToken).catch((e: Error) => {
          console.log("Backend save failed (using localStorage):", e.message);
        });
      } else {
        favoritesApi.add(productId, accessToken).catch((e: Error) => {
          console.log("Backend save failed (using localStorage):", e.message);
        });
      }
    }
  },

  toggleProductLike: (productId) => {
    const { productLikes, selectedProduct } = get();
    const isCurrentlyLiked = productLikes.includes(productId);
    const delta = isCurrentlyLiked ? -1 : 1;
    const newLikes = isCurrentlyLiked
      ? productLikes.filter(id => id !== productId)
      : [...productLikes, productId];

    set(state => ({
      productLikes: newLikes,
      allProducts: state.allProducts.map(p =>
        p.id === productId
          ? { ...p, likeCount: Math.max(0, (p.likeCount || 0) + delta) }
          : p
      ),
      businessProducts: state.businessProducts.map(p =>
        p.id === productId
          ? { ...p, likeCount: Math.max(0, (p.likeCount || 0) + delta) }
          : p
      ),
      selectedProduct: selectedProduct && selectedProduct.id === productId
        ? { ...selectedProduct, likeCount: Math.max(0, (selectedProduct.likeCount || 0) + delta) }
        : selectedProduct,
    }));

    if (isCurrentlyLiked) {
      toast.success("좋아요를 취소했습니다");
    } else {
      toast.success("좋아요를 눌렀습니다 👍");
    }
  },

  incrementApplicants: (productId) => {
    set(state => ({
      allProducts: state.allProducts.map(p =>
        p.id === productId ? { ...p, currentApplicants: p.currentApplicants + 1 } : p
      ),
      businessProducts: state.businessProducts.map(p =>
        p.id === productId ? { ...p, currentApplicants: p.currentApplicants + 1 } : p
      ),
    }));
  },

  decrementApplicants: (productId) => {
    set(state => ({
      allProducts: state.allProducts.map(p =>
        p.id === productId ? { ...p, currentApplicants: Math.max(0, (p.currentApplicants || 0) - 1) } : p
      ),
      businessProducts: state.businessProducts.map(p =>
        p.id === productId ? { ...p, currentApplicants: Math.max(0, (p.currentApplicants || 0) - 1) } : p
      ),
    }));
  },

  incrementReviewCount: (productId) => {
    set(state => ({
      allProducts: state.allProducts.map(p =>
        p.id === productId ? { ...p, reviewCount: p.reviewCount + 1 } : p
      ),
      businessProducts: state.businessProducts.map(p =>
        p.id === productId ? { ...p, reviewCount: p.reviewCount + 1 } : p
      ),
    }));
  },

  loadProducts: async (accessToken) => {
    try {
      const productsData = await productsApi.getAll(accessToken);
      if (productsData.success && Array.isArray(productsData.products) && productsData.products.length > 0) {
        const localBiz: Product[] = (() => {
          try { return JSON.parse(localStorage.getItem('businessProducts') || '[]'); } catch { return []; }
        })();
        // Merge by id - server takes precedence
        const map = new Map<string, Product>();
        for (const item of localBiz) map.set(item.id, item);
        for (const item of productsData.products) map.set(item.id, item);
        const merged = Array.from(map.values());
        try { localStorage.setItem('businessProducts', JSON.stringify(merged)); } catch {}
        set({
          businessProducts: merged,
          allProducts: merged.length > 0 ? merged : [...mockProducts],
        });
      }
    } catch (e) {
      console.warn('Failed to load business products from server, using localStorage:', e);
    }
  },
}));
