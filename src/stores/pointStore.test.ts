import { describe, it, expect, beforeEach } from 'vitest';
import { usePointStore } from './pointStore';

describe('pointStore', () => {
  beforeEach(() => {
    // Reset store state before each test
    const { setUserPoints, setUserLevel, setPointTransactions } = usePointStore.getState();
    setUserPoints(0);
    setUserLevel(1);
    setPointTransactions([]);
    localStorage.clear();
  });

  it('should initialize with default values', () => {
    const { userPoints, userLevel, pointTransactions } = usePointStore.getState();
    expect(userPoints).toBe(0);
    expect(userLevel).toBe(1);
    expect(pointTransactions).toHaveLength(0);
  });

  it('should earn points correctly', () => {
    const { earnPoints } = usePointStore.getState();
    earnPoints(100, '리뷰 작성', '리뷰');

    const { userPoints, pointTransactions } = usePointStore.getState();
    expect(userPoints).toBe(100);
    expect(pointTransactions).toHaveLength(1);
    expect(pointTransactions[0].type).toBe('earn');
    expect(pointTransactions[0].amount).toBe(100);
    expect(pointTransactions[0].description).toBe('리뷰 작성');
  });

  it('should spend points correctly', () => {
    const { earnPoints, spendPoints } = usePointStore.getState();
    earnPoints(500, '리뷰 작성');
    spendPoints(200, '쿠폰 구매', 'coupon');

    const { userPoints, pointTransactions } = usePointStore.getState();
    expect(userPoints).toBe(300);
    expect(pointTransactions).toHaveLength(2);
    expect(pointTransactions[0].type).toBe('spend');
  });

  it('should update level when earning enough points', () => {
    const { earnPoints } = usePointStore.getState();
    // Level 2 requires 100 points
    earnPoints(150, '리뷰 작성');

    const { userLevel } = usePointStore.getState();
    expect(userLevel).toBe(2);
  });

  it('should save and load from storage', () => {
    const { earnPoints, saveToStorage, loadFromStorage, setUserPoints, setPointTransactions } = usePointStore.getState();
    
    earnPoints(250, '테스트');
    saveToStorage('test@email.com');

    // Reset state
    setUserPoints(0);
    setPointTransactions([]);

    // Load from storage
    loadFromStorage('test@email.com');
    const { userPoints, pointTransactions } = usePointStore.getState();
    expect(userPoints).toBe(250);
    expect(pointTransactions).toHaveLength(1);
  });
});
