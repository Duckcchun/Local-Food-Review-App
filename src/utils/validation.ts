/**
 * 폼 유효성 검증 스키마 및 헬퍼
 *
 * zod 스키마로 로그인/회원가입/리뷰/상품등록 폼을 검증한다.
 * validateForm() 은 zod 결과를 { success, errors } 형태로 정규화해
 * 컴포넌트에서 필드별 에러 메시지를 쉽게 쓸 수 있게 한다.
 */
import { z } from "zod";

// ─── 공통 스키마 조각 ────────────────────────────────────────────────────

const emailSchema = z
  .string()
  .min(1, "이메일을 입력해주세요")
  .email("올바른 이메일 형식이 아니에요");

const passwordSchema = z.string().min(6, "비밀번호는 6자 이상이어야 해요");

// 010-1234-5678 또는 01012345678 형태 허용
const phoneSchema = z
  .string()
  .regex(/^01[0-9]-?\d{3,4}-?\d{4}$/, "올바른 전화번호 형식이 아니에요");

// ─── 로그인 ──────────────────────────────────────────────────────────────

export const loginSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
});

// ─── 회원가입 ────────────────────────────────────────────────────────────

export const signupSchema = z
  .object({
    name: z.string().min(2, "이름은 2글자 이상이어야 해요"),
    email: emailSchema,
    phone: phoneSchema,
    password: passwordSchema,
    confirmPassword: z.string().min(1, "비밀번호 확인을 입력해주세요"),
    userType: z.enum(["reviewer", "business"]),
    businessName: z.string().optional(),
    businessNumber: z.string().optional(),
    businessAddress: z.string().optional(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "비밀번호가 일치하지 않아요",
    path: ["confirmPassword"],
  })
  .refine(
    (data) =>
      data.userType !== "business" ||
      (data.businessName != null && data.businessName.trim().length > 0),
    {
      message: "상호명을 입력해주세요",
      path: ["businessName"],
    }
  );

// ─── 리뷰 작성 ───────────────────────────────────────────────────────────

export const reviewSchema = z
  .object({
    pros: z.string().max(500, "500자 이하로 작성해주세요"),
    cons: z.string().max(500, "500자 이하로 작성해주세요"),
    improvements: z.string().max(500, "500자 이하로 작성해주세요"),
  })
  .refine(
    (data) =>
      data.pros.trim().length > 0 ||
      data.cons.trim().length > 0 ||
      data.improvements.trim().length > 0,
    {
      message: "장점, 단점, 개선점 중 최소 한 가지는 작성해주세요",
      path: ["pros"],
    }
  );

// ─── 상품(체험단) 등록 ───────────────────────────────────────────────────

export const createProductSchema = z.object({
  name: z.string().min(2, "상품명은 2글자 이상이어야 해요"),
  description: z.string().min(10, "설명은 10글자 이상 작성해주세요"),
  category: z.string().min(1, "카테고리를 선택해주세요"),
  location: z.string().min(1, "위치를 입력해주세요"),
  requiredReviewers: z
    .number()
    .int()
    .min(1, "모집 인원은 1명 이상이어야 해요"),
  applicationDeadline: z.string().min(1, "마감일을 선택해주세요"),
});

// ─── 검증 헬퍼 ───────────────────────────────────────────────────────────

export type ValidationResult<T> =
  | { success: true; data: T }
  | { success: false; errors: Record<string, string> };

/**
 * zod 스키마로 데이터를 검증하고, 결과를 { success, errors } 로 정규화한다.
 * 에러는 필드명 → 첫 번째 에러 메시지 형태의 맵으로 반환한다.
 */
export function validateForm<T>(
  schema: z.ZodType<T>,
  data: unknown
): ValidationResult<T> {
  const result = schema.safeParse(data);

  if (result.success) {
    return { success: true, data: result.data };
  }

  const errors: Record<string, string> = {};
  for (const issue of result.error.issues) {
    const key = issue.path.length > 0 ? String(issue.path[0]) : "_form";
    // 필드별 첫 번째 에러 메시지만 유지
    if (!errors[key]) {
      errors[key] = issue.message;
    }
  }

  return { success: false, errors };
}
