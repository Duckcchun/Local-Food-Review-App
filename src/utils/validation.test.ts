import { describe, it, expect } from 'vitest';
import { validateForm, loginSchema, signupSchema, reviewSchema, createProductSchema } from './validation';

describe('loginSchema', () => {
  it('should pass with valid email and password', () => {
    const result = validateForm(loginSchema, { email: 'test@email.com', password: '123456' });
    expect(result.success).toBe(true);
  });

  it('should fail with empty email', () => {
    const result = validateForm(loginSchema, { email: '', password: '123456' });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.errors.email).toBeDefined();
    }
  });

  it('should fail with invalid email format', () => {
    const result = validateForm(loginSchema, { email: 'notanemail', password: '123456' });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.errors.email).toContain('이메일');
    }
  });

  it('should fail with short password', () => {
    const result = validateForm(loginSchema, { email: 'test@email.com', password: '123' });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.errors.password).toContain('6자');
    }
  });
});

describe('signupSchema', () => {
  const validData = {
    name: '홍길동',
    email: 'test@email.com',
    phone: '010-1234-5678',
    password: 'password123',
    confirmPassword: 'password123',
    userType: 'reviewer' as const,
  };

  it('should pass with valid reviewer data', () => {
    const result = validateForm(signupSchema, validData);
    expect(result.success).toBe(true);
  });

  it('should fail when passwords do not match', () => {
    const result = validateForm(signupSchema, { ...validData, confirmPassword: 'different' });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.errors.confirmPassword).toContain('일치');
    }
  });

  it('should fail with invalid phone number', () => {
    const result = validateForm(signupSchema, { ...validData, phone: '123-456' });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.errors.phone).toBeDefined();
    }
  });

  it('should fail when name is too short', () => {
    const result = validateForm(signupSchema, { ...validData, name: '김' });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.errors.name).toContain('2글자');
    }
  });

  it('should require businessName for business user type', () => {
    const result = validateForm(signupSchema, {
      ...validData,
      userType: 'business',
      businessName: '',
    });
    expect(result.success).toBe(false);
  });
});

describe('reviewSchema', () => {
  it('should pass when at least one field has content', () => {
    const result = validateForm(reviewSchema, { pros: '맛있어요', cons: '', improvements: '' });
    expect(result.success).toBe(true);
  });

  it('should fail when all fields are empty', () => {
    const result = validateForm(reviewSchema, { pros: '', cons: '', improvements: '' });
    expect(result.success).toBe(false);
  });

  it('should fail when text exceeds 500 characters', () => {
    const longText = 'a'.repeat(501);
    const result = validateForm(reviewSchema, { pros: longText, cons: '', improvements: '' });
    expect(result.success).toBe(false);
  });
});

describe('createProductSchema', () => {
  it('should pass with valid product data', () => {
    const result = validateForm(createProductSchema, {
      name: '맛있는 김치찌개',
      description: '20년 전통의 김치찌개를 맛보세요. 신선한 재료만 사용합니다.',
      category: 'korean',
      location: '서울시 마포구',
      requiredReviewers: 10,
      applicationDeadline: '2025-12-31',
    });
    expect(result.success).toBe(true);
  });

  it('should fail with short description', () => {
    const result = validateForm(createProductSchema, {
      name: '김치찌개',
      description: '맛있어요',
      category: 'korean',
      location: '서울',
      requiredReviewers: 10,
      applicationDeadline: '2025-12-31',
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.errors.description).toContain('10글자');
    }
  });

  it('should fail with zero reviewers', () => {
    const result = validateForm(createProductSchema, {
      name: '김치찌개 세트',
      description: '20년 전통의 김치찌개를 맛보세요. 신선한 재료만 사용합니다.',
      category: 'korean',
      location: '서울시 마포구',
      requiredReviewers: 0,
      applicationDeadline: '2025-12-31',
    });
    expect(result.success).toBe(false);
  });
});
