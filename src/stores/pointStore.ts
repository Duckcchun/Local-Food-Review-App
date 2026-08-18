import { create } from 'zustand';
import type { PointProduct, PointTransaction } from '../data/pointShop';
import { getLevelInfo } from '../data/levelSystem';
import { addPurchasedItem } from '../utils/inventory';
import { toast } from 'sonner';

interface PointState {
  userPoints: number;
  userLevel: number;
  pointTransactions: PointTransaction[];

  // Actions
  setUserPoints: (points: number) => void;
  setUserLevel: (level: number) => void;
  setPointTransactions: (transactions: PointTransaction[]) => void;

  // Business logic
  earnPoints: (amount: number, description: string, category?: string) => void;
  purchaseProduct: (product: PointProduct, userEmail: string) => void;
  checkLevelUp: () => void;
  initFromLocalStorage: (userEmail?: string) => void;
  persistToLocalStorage: (userEmail?: string) => void;
  reset: () => void;
}

function localKey(key: string, email?: string) {
  const id = (email || '').trim();
  return id ? `${key}:${id}` : key;
}

export const usePointStore = create<PointState>((set, get) => ({
  userPoints: 0,
  userLevel: 1,
  pointTransactions: [],

  setUserPoints: (points) => set({ userPoints: points }),
  setUserLevel: (level) => set({ userLevel: level }),
  setPointTransactions: (transactions) => set({ pointTransactions: transactions }),

  earnPoints: (amount, description, category) => {
    const { userPoints, pointTransactions } = get();
    const newPoints = userPoints + amount;

    const transaction: PointTransaction = {
      id: `trans-${Date.now()}`,
      type: "earn",
      amount,
      description,
      date: new Date().toLocaleString('ko-KR'),
      category,
    };

    set({
      userPoints: newPoints,
      pointTransactions: [transaction, ...pointTransactions],
    });

    // Check level up
    get().checkLevelUp();
  },

  purchaseProduct: (product, userEmail) => {
    const { userPoints, pointTransactions } = get();
    const newPoints = userPoints - product.price;

    const transaction: PointTransaction = {
      id: `trans-${Date.now()}`,
      type: "spend",
      amount: product.price,
      description: product.name,
      date: new Date().toLocaleString('ko-KR'),
      category: product.category,
    };

    set({
      userPoints: newPoints,
      pointTransactions: [transaction, ...pointTransactions],
    });

    // Add to inventory
    if (userEmail) {
      addPurchasedItem(userEmail, product);
    }

    toast.success(`${product.name} 구매가 완료되었습니다! 내 아이템함에서 확인하세요`);
  },

  checkLevelUp: () => {
    const { userPoints, userLevel } = get();
    const levelInfo = getLevelInfo(userPoints);
    if (levelInfo.level !== userLevel) {
      if (levelInfo.level > userLevel) {
        toast.success(`🎉 레벨 ${levelInfo.level}로 승급했습니다!`);
      }
      set({ userLevel: levelInfo.level });
    }
  },

  initFromLocalStorage: (userEmail) => {
    try {
      const points = localStorage.getItem(localKey('userPoints', userEmail));
      const level = localStorage.getItem(localKey('userLevel', userEmail));
      const transactions = localStorage.getItem(localKey('pointTransactions', userEmail));
      set({
        userPoints: points ? parseInt(points) : 0,
        userLevel: level ? parseInt(level) : 1,
        pointTransactions: transactions ? JSON.parse(transactions) : [],
      });
    } catch { /* ignore */ }
  },

  persistToLocalStorage: (userEmail) => {
    const { userPoints, userLevel, pointTransactions } = get();
    try {
      localStorage.setItem(localKey('userPoints', userEmail), userPoints.toString());
      localStorage.setItem(localKey('userLevel', userEmail), userLevel.toString());
      localStorage.setItem(localKey('pointTransactions', userEmail), JSON.stringify(pointTransactions));
    } catch { /* ignore */ }
  },

  reset: () => {
    set({ userPoints: 0, userLevel: 1, pointTransactions: [] });
  },
}));
