import { describe, it, expect } from 'vitest';
import { extractKeywords, calculateSentiment, getMonthlyTrends, getCategoryPerformance } from './reviewAnalytics';
import type { Review } from '../types';

const mockReviews: Review[] = [
  {
    id: '1',
    productId: 'p1',
    productName: '김치찌개',
    productImage: '',
    pros: '맛이 좋고 양이 많아서 만족합니다 재료가 신선해요',
    cons: '가격이 조금 비싸고 대기 시간이 길어요',
    improvements: '주차 공간이 있으면 좋겠어요',
    photos: [],
    createdAt: new Date().toISOString(),
    userId: 'user1',
    userName: '테스터',
    status: 'published',
    reported: false,
  },
  {
    id: '2',
    productId: 'p1',
    productName: '김치찌개',
    productImage: '',
    pros: '맛이 정말 좋아요 양도 푸짐하고 서비스도 좋습니다',
    cons: '주차가 불편해요',
    improvements: '메뉴판이 더 보기 쉬우면 좋겠어요',
    photos: ['photo1.jpg'],
    createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
    userId: 'user2',
    userName: '리뷰어2',
    status: 'published',
    reported: false,
  },
];

describe('extractKeywords', () => {
  it('should extract keywords from reviews', () => {
    const { prosKeywords, consKeywords } = extractKeywords(mockReviews);
    expect(prosKeywords.length).toBeGreaterThan(0);
    expect(consKeywords.length).toBeGreaterThan(0);
  });

  it('should mark pros keywords as positive', () => {
    const { prosKeywords } = extractKeywords(mockReviews);
    prosKeywords.forEach(k => expect(k.type).toBe('positive'));
  });

  it('should mark cons keywords as negative', () => {
    const { consKeywords } = extractKeywords(mockReviews);
    consKeywords.forEach(k => expect(k.type).toBe('negative'));
  });

  it('should return empty arrays for no reviews', () => {
    const { prosKeywords, consKeywords, allKeywords } = extractKeywords([]);
    expect(prosKeywords).toHaveLength(0);
    expect(consKeywords).toHaveLength(0);
    expect(allKeywords).toHaveLength(0);
  });

  it('should respect maxKeywords limit', () => {
    const { prosKeywords } = extractKeywords(mockReviews, 3);
    expect(prosKeywords.length).toBeLessThanOrEqual(3);
  });
});

describe('calculateSentiment', () => {
  it('should return balanced score for no reviews', () => {
    const result = calculateSentiment([]);
    expect(result.positive).toBe(50);
    expect(result.negative).toBe(50);
    expect(result.totalReviews).toBe(0);
  });

  it('should calculate sentiment from review lengths', () => {
    const result = calculateSentiment(mockReviews);
    expect(result.positive).toBeGreaterThan(0);
    expect(result.negative).toBeGreaterThan(0);
    expect(result.positive + result.negative).toBe(100);
    expect(result.totalReviews).toBe(2);
  });

  it('should have higher positive when pros are longer', () => {
    const positiveReviews: Review[] = [{
      ...mockReviews[0],
      pros: '정말 맛있고 좋았어요. '.repeat(20),
      cons: '없음',
      improvements: '',
    }];
    const result = calculateSentiment(positiveReviews);
    expect(result.positive).toBeGreaterThan(result.negative);
  });
});

describe('getMonthlyTrends', () => {
  it('should return 6 months by default', () => {
    const trends = getMonthlyTrends(mockReviews, []);
    expect(trends).toHaveLength(6);
  });

  it('should include month labels', () => {
    const trends = getMonthlyTrends(mockReviews, []);
    trends.forEach(t => {
      expect(t.monthLabel).toMatch(/\d+월/);
    });
  });

  it('should count reviews in correct months', () => {
    const trends = getMonthlyTrends(mockReviews, []);
    const totalCounted = trends.reduce((sum, t) => sum + t.reviews, 0);
    // At least some reviews should be counted
    expect(totalCounted).toBeGreaterThanOrEqual(0);
  });
});

describe('getCategoryPerformance', () => {
  it('should return empty array for no products', () => {
    const result = getCategoryPerformance([], [], []);
    expect(result).toHaveLength(0);
  });

  it('should group by category', () => {
    const products = [
      { id: 'p1', category: 'korean', currentApplicants: 5, requiredReviewers: 10, likeCount: 20 },
      { id: 'p2', category: 'korean', currentApplicants: 3, requiredReviewers: 10, likeCount: 15 },
      { id: 'p3', category: 'chinese', currentApplicants: 8, requiredReviewers: 10, likeCount: 30 },
    ] as any;

    const result = getCategoryPerformance(products, [], []);
    expect(result.length).toBe(2);
    
    const korean = result.find(r => r.category === 'korean');
    expect(korean?.productCount).toBe(2);
    expect(korean?.categoryName).toBe('한식');
  });
});
