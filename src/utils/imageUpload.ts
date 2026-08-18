import { projectId, publicAnonKey } from './supabase/info';

const STORAGE_URL = `https://${projectId}.supabase.co/storage/v1`;
const BUCKET_NAME = 'review-images';

/**
 * Compress and resize an image file before upload.
 * Target: max 1200px width, JPEG quality 0.8, max ~500KB output.
 */
export async function compressImage(file: File, maxWidth = 1200, quality = 0.8): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(file);

    img.onload = () => {
      URL.revokeObjectURL(url);

      let { width, height } = img;

      // Scale down if wider than maxWidth
      if (width > maxWidth) {
        height = Math.round((height * maxWidth) / width);
        width = maxWidth;
      }

      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;

      const ctx = canvas.getContext('2d');
      if (!ctx) {
        reject(new Error('Canvas context not available'));
        return;
      }

      ctx.drawImage(img, 0, 0, width, height);

      canvas.toBlob(
        (blob) => {
          if (blob) {
            resolve(blob);
          } else {
            reject(new Error('Failed to compress image'));
          }
        },
        'image/jpeg',
        quality
      );
    };

    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error('Failed to load image'));
    };

    img.src = url;
  });
}

/**
 * Generate a unique filename for upload.
 */
function generateFileName(userId: string, originalName: string): string {
  const ext = originalName.split('.').pop()?.toLowerCase() || 'jpg';
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 8);
  return `${userId}/${timestamp}-${random}.${ext}`;
}

/**
 * Upload a compressed image blob to Supabase Storage.
 * Returns the public URL of the uploaded image.
 */
export async function uploadImage(
  file: File,
  userId: string,
  accessToken?: string
): Promise<string> {
  // Compress image
  const compressed = await compressImage(file);
  const fileName = generateFileName(userId, file.name);

  const headers: Record<string, string> = {
    'Authorization': `Bearer ${accessToken || publicAnonKey}`,
  };

  // Upload to Supabase Storage
  const uploadResponse = await fetch(
    `${STORAGE_URL}/object/${BUCKET_NAME}/${fileName}`,
    {
      method: 'POST',
      headers: {
        ...headers,
        'Content-Type': 'image/jpeg',
        'x-upsert': 'true',
      },
      body: compressed,
    }
  );

  if (!uploadResponse.ok) {
    const error = await uploadResponse.text();
    throw new Error(`Upload failed: ${error}`);
  }

  // Return public URL
  return `${STORAGE_URL}/object/public/${BUCKET_NAME}/${fileName}`;
}

/**
 * Upload multiple images in parallel.
 * Returns array of public URLs (same order as input).
 */
export async function uploadMultipleImages(
  files: File[],
  userId: string,
  accessToken?: string,
  onProgress?: (completed: number, total: number) => void
): Promise<string[]> {
  const urls: string[] = [];
  let completed = 0;

  for (const file of files) {
    const url = await uploadImage(file, userId, accessToken);
    urls.push(url);
    completed++;
    onProgress?.(completed, files.length);
  }

  return urls;
}

/**
 * Create a local preview URL from a File object.
 * Remember to call URL.revokeObjectURL() when done.
 */
export function createPreviewUrl(file: File): string {
  return URL.createObjectURL(file);
}

/**
 * Validate image file before processing.
 */
export function validateImageFile(file: File): { valid: boolean; error?: string } {
  const MAX_SIZE = 10 * 1024 * 1024; // 10MB
  const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/heic', 'image/heif'];

  if (!ALLOWED_TYPES.includes(file.type)) {
    return { valid: false, error: 'JPG, PNG, WebP 형식만 업로드 가능합니다' };
  }

  if (file.size > MAX_SIZE) {
    return { valid: false, error: '파일 크기는 10MB 이하만 가능합니다' };
  }

  return { valid: true };
}
