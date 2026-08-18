import { create } from 'zustand';
import type { PointTransaction } from '../data/pointShop';
import { getLevelInfo } from '../data/levelSystem';

interface PointState {
  userPoints: number;
  userLevel: number;
  pointTransactions: PointTransaction[];

  // Actions
  setUserPoints: (points: number) => void;
  setUserLevel: (level: number) => void;
  setPointTransactions: (transactions: PointTransaction[]) => void;
  earnPoints: (amount: number, description: string, category?: string) => void;
  spendPoints: (amount: number, description: string, category?: string) => void;
  recalculateLevel: () => void;
  loadFromStorage: (userEmail: string) => void;
  saveToStorage: (userEmail: string) => void;
}

export const usePointStore = create<PointState>((set, get) => ({
  userPoints: 0,
  userLevel: 1,
  pointTransactions: [],

  setUserPoints: (points) => set({ userPoints: points }),
  setUserLevel: (level) => set({ userLevel: level }),
  setPointTransactions: (transactions) => set({ pointTransactions: transactions }),

  earnPoints: (amount, description, category) => {
    const newPoints = get().userPoints + amount;
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
      pointTransactions: [transaction, ...get().pointTransactions],
    });
    // Recalculate level
    const levelInfo = getLevelInfo(newPoints);
    if (levelInfo.level !== get().userLevel) {
      set({ userLevel: levelInfo.level });
    }
  },

  spendPoints: (amount, description, category) => {
    const newPoints = get().userPoints - amount;
    const transaction: PointTransaction = {
      id: `trans-${Date.now()}`,
      type: "spend",
      amount,
      description,
      date: new Date().toLocaleString('ko-KR'),
      category,
    };
    set({
      userPoints: newPoints,
      pointTransactions: [transaction, ...get().pointTransactions],
    });
  },

  recalculateLevel: () => {
    const levelInfo = getLevelInfo(get().userPoints);
    set({ userLevel: levelInfo.level });
  },

  loadFromStorage: (userEmail) => {
    try {
      const points = localStorage.getItem(`userPoints:${userEmail}`);
      const level = localStorage.getItem(`userLevel:${userEmail}`);
      const transactions = localStorage.getItem(`pointTransactions:${userEmail}`);
      set({
        userPoints: points ? parseInt(points) : 0,
        userLevel: level ? parseInt(level) : 1,
        pointTransactions: transactions ? JSON.parse(transactions) : [],
      });
    } catch {}
  },

  saveToStorage: (userEmail) => {
    const { userPoints, userLevel, pointTransactions } = get();
    try {
      localStorage.setItem(`userPoints:${userEmail}`, userPoints.toString());
      localStorage.setItem(`userLevel:${userEmail}`, userLevel.toString());
      localStorage.setItem(`pointTransactions:${userEmail}`, JSON.stringify(pointTransactions));
    } catch {}
  },
}));
