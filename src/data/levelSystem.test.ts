import { describe, it, expect } from 'vitest';
import { getLevelInfo, getLevelProgress, getPointsToNextLevel, calculateReviewPoints } from './levelSystem';

describe('getLevelInfo', () => {
  it('should return level 1 for 0 points', () => {
    const info = getLevelInfo(0);
    expect(info.level).toBe(1);
    expect(info.name).toBe('새싹 평가단');
  });

  it('should return level 2 for 100 points', () => {
    const info = getLevelInfo(100);
    expect(info.level).toBe(2);
    expect(info.name).toBe('초보 평가단');
  });

  it('should return level 3 for 300 points', () => {
    const info = getLevelInfo(300);
    expect(info.level).toBe(3);
  });

  it('should return level 5 for 1000+ points', () => {
    const info = getLevelInfo(1500);
    expect(info.level).toBe(5);
    expect(info.name).toBe('전문 평가단');
  });

  it('should return level 1 for negative points', () => {
    const info = getLevelInfo(-10);
    expect(info.level).toBe(1);
  });
});

describe('getLevelProgress', () => {
  it('should return 0 for 0 points at level 1', () => {
    expect(getLevelProgress(0)).toBe(0);
  });

  it('should return 100 for max level', () => {
    expect(getLevelProgress(2000)).toBe(100);
  });

  it('should return 50 for midway through level', () => {
    // Level 1: 0-99, so 50 should be 50%
    const progress = getLevelProgress(50);
    expect(progress).toBe(50);
  });
});

describe('getPointsToNextLevel', () => {
  it('should return correct points needed at level 1', () => {
    const needed = getPointsToNextLevel(50);
    expect(needed).toBe(50); // Need 100 to reach level 2, have 50
  });

  it('should return 0 at max level', () => {
    expect(getPointsToNextLevel(1500)).toBe(0);
  });
});

describe('calculateReviewPoints', () => {
  it('should return base 50 for level 1 without photos', () => {
    expect(calculateReviewPoints(1, false)).toBe(50);
  });

  it('should add photo bonus', () => {
    const withPhoto = calculateReviewPoints(1, true);
    const withoutPhoto = calculateReviewPoints(1, false);
    expect(withPhoto).toBeGreaterThan(withoutPhoto);
  });

  it('should apply level multiplier', () => {
    const level1 = calculateReviewPoints(1, false);
    const level3 = calculateReviewPoints(3, false);
    expect(level3).toBeGreaterThan(level1);
  });
});
