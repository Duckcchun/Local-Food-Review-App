import { z } from 'zod';

// ─── Common Patterns ───────────────────────────────────────────────────────

const koreanPhoneRegex = /^01[016789]-?\d{3,4}-?\d{4}$/;
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// ─── Login Schema ──────────────────────────────────────────────────────────

export const loginSchema = z.object({
  email: z
    .string()
    .min(1, '이메일을 입력해주세요')
    .regex(emailRegex, '올바른 이메일 형식이 아닙니다'),
  password: z
    .string()
    .min(1, '비밀번호를 입력해주세요')
    .min(6, '비밀번호는 6자 이상이어야 합니다'),
});

export type LoginFormData = z.infer<typeof loginSchema>;

// ─── Signup Schema ─────────────────────────────────────────────────────────

export const signupSchema = z.object({
  name: z
    .string()
    .min(1, '이름을 입력해주세요')
    .min(2, '이름은 2글자 이상이어야 합니다')
    .max(20, '이름은 20글자 이하여야 합니다'),
  email: z
    .string()
    .min(1, '이메일을 입력해주세요')
    .regex(emailRegex, '올바른 이메일 형식이 아닙니다'),
  phone: z
    .string()
    .min(1, '전화번호를 입력해주세요')
    .regex(koreanPhoneRegex, '올바른 전화번호 형식이 아닙니다 (예: 010-1234-5678)'),
  password: z
    .string()
    .min(1, '비밀번호를 입력해주세요')
    .min(6, '비밀번호는 6자 이상이어야 합니다')
    .max(50, '비밀번호는 50자 이하여야 합니다'),
  confirmPassword: z
    .string()
    .min(1, '비밀번호 확인을 입력해주세요'),
  userType: z.enum(['reviewer', 'business'], {
    required_error: '계정 유형을 선택해주세요',
  }),
  // Business-specific (optional)
  businessName: z.string().optional(),
  businessNumber: z.string().optional(),
  businessAddress: z.string().optional(),
}).refine(data => data.password === data.confirmPassword, {
  message: '비밀번호가 일치하지 않습니다',
  path: ['confirmPassword'],
}).refine(data => {
  if (data.userType === 'business') {
    return !!data.businessName && data.businessName.trim().length >= 2;
  }
  return true;
}, {
  message: '상호명을 입력해주세요 (2글자 이상)',
  path: ['businessName'],
});

export type SignupFormData = z.infer<typeof signupSchema>;

// ─── Review Schema ─────────────────────────────────────────────────────────

export const reviewSchema = z.object({
  pros: z
    .string()
    .max(500, '장점은 500자 이내로 작성해주세요'),
  cons: z
    .string()
    .max(500, '단점은 500자 이내로 작성해주세요'),
  improvements: z
    .string()
    .max(500, '개선점은 500자 이내로 작성해주세요'),
}).refine(data => {
  return data.pros.trim().length > 0 || data.cons.trim().length > 0 || data.improvements.trim().length > 0;
}, {
  message: '최소 한 가지 항목은 작성해주세요',
  path: ['pros'], // Show error on first field
});

export type ReviewFormData = z.infer<typeof reviewSchema>;

// ─── Product Creation Schema ───────────────────────────────────────────────

export const createProductSchema = z.object({
  name: z
    .string()
    .min(1, '상품명을 입력해주세요')
    .min(2, '상품명은 2글자 이상이어야 합니다')
    .max(50, '상품명은 50자 이하여야 합니다'),
  description: z
    .string()
    .min(1, '상품 설명을 입력해주세요')
    .min(10, '상품 설명은 10글자 이상이어야 합니다')
    .max(200, '상품 설명은 200자 이하여야 합니다'),
  category: z
    .string()
    .min(1, '카테고리를 선택해주세요'),
  location: z
    .string()
    .min(1, '위치를 입력해주세요'),
  requiredReviewers: z
    .number({ invalid_type_error: '모집 인원을 입력해주세요' })
    .int('정수만 입력 가능합니다')
    .min(1, '최소 1명 이상이어야 합니다')
    .max(200, '최대 200명까지 가능합니다'),
  applicationDeadline: z
    .string()
    .min(1, '모집 기한을 입력해주세요'),
});

export type CreateProductFormData = z.infer<typeof createProductSchema>;

// ─── Validation Helper ─────────────────────────────────────────────────────

/**
 * Validate form data against a Zod schema.
 * Returns either success with parsed data, or failure with field-level errors.
 */
export function validateForm<T>(
  schema: z.ZodSchema<T>,
  data: unknown
): { success: true; data: T } | { success: false; errors: Record<string, string> } {
  const result = schema.safeParse(data);
  
  if (result.success) {
    return { success: true, data: result.data };
  }

  const errors: Record<string, string> = {};
  for (const issue of result.error.issues) {
    const path = issue.path.join('.');
    if (!errors[path]) {
      errors[path] = issue.message;
    }
  }

  return { success: false, errors };
}

/**
 * Hook-friendly validation: returns first error for a specific field.
 */
export function getFieldError(errors: Record<string, string> | null, field: string): string | undefined {
  return errors?.[field];
}
