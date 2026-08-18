import { create } from 'zustand';
import type { Product } from '../data/mockData';
import { mockProducts } from '../data/mockData';
import { productsApi } from '../utils/api';

interface ProductState {
  allProducts: Product[];
  businessProducts: Product[];
  selectedProduct: Product | null;
  isLoading: boolean;

  // Actions
  setSelectedProduct: (product: Product | null) => void;
  setAllProducts: (products: Product[]) => void;
  setBusinessProducts: (products: Product[]) => void;
  addBusinessProduct: (product: Product, accessToken?: string) => void;
  deleteBusinessProduct: (productId: string, accessToken?: string) => void;
  updateProductField: (productId: string, field: Partial<Product>) => void;
  syncBusinessProducts: () => void;
  loadFromServer: (accessToken: string) => Promise<void>;
}

export const useProductStore = create<ProductState>((set, get) => {
  // Load business products from localStorage
  const savedBiz: Product[] = (() => {
    try {
      return JSON.parse(localStorage.getItem('businessProducts') || '[]');
    } catch { return []; }
  })();

  return {
    allProducts: [...mockProducts, ...savedBiz],
    businessProducts: savedBiz,
    selectedProduct: null,
    isLoading: false,

    setSelectedProduct: (product) => set({ selectedProduct: product }),

    setAllProducts: (products) => set({ allProducts: products }),

    setBusinessProducts: (products) => {
      set({ businessProducts: products });
      // Sync allProducts
      const prevAll = get().allProducts;
      const prevById = new Map(prevAll.map(p => [p.id, p]));
      const newAll = [...mockProducts, ...products].map(product => {
        const prev = prevById.get(product.id);
        if (!prev) return product;
        return {
          ...product,
          currentApplicants: prev.currentApplicants ?? product.currentApplicants,
          likeCount: prev.likeCount ?? product.likeCount,
          reviewCount: prev.reviewCount ?? product.reviewCount,
        };
      });
      set({ allProducts: newAll });
    },

    addBusinessProduct: (product, accessToken) => {
      const updated = [...get().businessProducts, product];
      set({ businessProducts: updated });
      try { localStorage.setItem('businessProducts', JSON.stringify(updated)); } catch {}
      // Sync allProducts
      get().syncBusinessProducts();
      // Backend save (fire-and-forget)
      if (accessToken) {
        productsApi.create(product, accessToken).catch(e => 
          console.log("Backend save failed:", e.message)
        );
      }
    },

    deleteBusinessProduct: (productId, accessToken) => {
      const updated = get().businessProducts.filter(p => p.id !== productId);
      set({ businessProducts: updated });
      try { localStorage.setItem('businessProducts', JSON.stringify(updated)); } catch {}
      get().syncBusinessProducts();
      if (accessToken) {
        console.log("Backend delete not implemented yet");
      }
    },

    updateProductField: (productId, field) => {
      set(state => ({
        allProducts: state.allProducts.map(p => 
          p.id === productId ? { ...p, ...field } : p
        ),
        businessProducts: state.businessProducts.map(p => 
          p.id === productId ? { ...p, ...field } : p
        ),
        selectedProduct: state.selectedProduct?.id === productId 
          ? { ...state.selectedProduct, ...field } 
          : state.selectedProduct,
      }));
    },

    syncBusinessProducts: () => {
      const { businessProducts, allProducts } = get();
      const prevById = new Map(allProducts.map(p => [p.id, p]));
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
      set({ allProducts: newAll });
    },

    loadFromServer: async (accessToken) => {
      set({ isLoading: true });
      try {
        const data = await productsApi.getAll(accessToken);
        if (data.success && Array.isArray(data.products) && data.products.length > 0) {
          const localBiz: Product[] = (() => {
            try { return JSON.parse(localStorage.getItem('businessProducts') || '[]'); } catch { return []; }
          })();
          // Merge server + local
          const map = new Map<string, Product>();
          for (const item of localBiz) map.set(item.id, item);
          for (const item of data.products) map.set(item.id, item);
          const merged = Array.from(map.values());
          set({ businessProducts: merged });
          try { localStorage.setItem('businessProducts', JSON.stringify(merged)); } catch {}
          get().syncBusinessProducts();
        }
      } catch (e) {
        console.warn('Failed to load products from server:', e);
      } finally {
        set({ isLoading: false });
      }
    },
  };
});
