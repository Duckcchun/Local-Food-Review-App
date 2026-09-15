/**
 * 이미지 업로드 검증 유틸
 *
 * 리뷰/상품 이미지 업로드 시 파일 형식과 용량을 검증한다.
 */

/** 허용 이미지 MIME 타입 */
export const ALLOWED_IMAGE_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
] as const;

/** 최대 업로드 용량 (10MB) */
export const MAX_IMAGE_SIZE = 10 * 1024 * 1024;

export interface ImageValidationResult {
  valid: boolean;
  error?: string;
}

/**
 * 업로드하려는 이미지 파일의 형식과 용량을 검증한다.
 * @returns valid=true 면 통과, 아니면 error 메시지 포함
 */
export function validateImageFile(file: File): ImageValidationResult {
  // 형식 검증
  if (!ALLOWED_IMAGE_TYPES.includes(file.type as (typeof ALLOWED_IMAGE_TYPES)[number])) {
    return {
      valid: false,
      error: "JPG, PNG, WebP 형식의 이미지만 업로드할 수 있어요.",
    };
  }

  // 용량 검증 (정확히 10MB 까지 허용)
  if (file.size > MAX_IMAGE_SIZE) {
    return {
      valid: false,
      error: "이미지 크기는 10MB 이하여야 해요.",
    };
  }

  return { valid: true };
}
