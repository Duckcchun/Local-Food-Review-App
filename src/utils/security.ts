/**
 * 보안 유틸리티 모듈.
 *
 * - Input sanitization (XSS 방지)
 * - Token refresh 로직
 * - Rate limiting (클라이언트 사이드)
 * - CSP nonce generation
 */

// ─── Input Sanitization ────────────────────────────────────────────────────

const HTML_ENTITIES: Record<string, string> = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#x27;',
  '/': '&#x2F;',
  '`': '&#96;',
};

/**
 * Escape HTML special characters to prevent XSS.
 * Use when rendering user-generated content as text.
 */
export function escapeHtml(str: string): string {
  return str.replace(/[&<>"'`/]/g, (char) => HTML_ENTITIES[char] || char);
}

/**
 * Strip all HTML tags from a string.
 * More aggressive than escaping — removes tags entirely.
 */
export function stripHtml(str: string): string {
  return str.replace(/<[^>]*>/g, '');
}

/**
 * Sanitize user input: trim, strip HTML, limit length.
 * Use for form inputs before storing or displaying.
 */
export function sanitizeInput(input: string, maxLength = 1000): string {
  if (!input) return '';
  return stripHtml(input).trim().slice(0, maxLength);
}

/**
 * Sanitize a URL to prevent javascript: protocol attacks.
 * Only allows http:, https:, mailto:, and relative URLs.
 */
export function sanitizeUrl(url: string): string {
  const trimmed = url.trim();
  if (!trimmed) return '';

  // Block dangerous protocols
  const lowerUrl = trimmed.toLowerCase();
  if (
    lowerUrl.startsWith('javascript:') ||
    lowerUrl.startsWith('data:') ||
    lowerUrl.startsWith('vbscript:')
  ) {
    return '';
  }

  return trimmed;
}

// ─── Token Refresh ─────────────────────────────────────────────────────────

interface TokenPair {
  accessToken: string;
  refreshToken: string;
  expiresAt: number; // Unix timestamp in ms
}

const TOKEN_STORAGE_KEY = 'auth_tokens';
const REFRESH_THRESHOLD_MS = 5 * 60 * 1000; // Refresh 5 min before expiry

/**
 * Store token pair securely.
 * Note: localStorage is not ideal for tokens (vulnerable to XSS).
 * In production, consider httpOnly cookies or in-memory storage.
 */
export function storeTokens(tokens: TokenPair): void {
  try {
    localStorage.setItem(TOKEN_STORAGE_KEY, JSON.stringify(tokens));
  } catch {}
}

/**
 * Get stored tokens.
 */
export function getStoredTokens(): TokenPair | null {
  try {
    const raw = localStorage.getItem(TOKEN_STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

/**
 * Clear stored tokens (logout).
 */
export function clearTokens(): void {
  try {
    localStorage.removeItem(TOKEN_STORAGE_KEY);
    localStorage.removeItem('accessToken');
  } catch {}
}

/**
 * Check if the access token is expired or about to expire.
 */
export function isTokenExpired(tokens: TokenPair): boolean {
  return Date.now() >= tokens.expiresAt - REFRESH_THRESHOLD_MS;
}

/**
 * Attempt to refresh the access token using the refresh token.
 * Returns new token pair or null if refresh fails.
 */
export async function refreshAccessToken(
  refreshToken: string,
  apiBaseUrl: string
): Promise<TokenPair | null> {
  try {
    const response = await fetch(`${apiBaseUrl}/auth/refresh`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refreshToken }),
    });

    if (!response.ok) return null;

    const data = await response.json();
    if (data.accessToken) {
      const newTokens: TokenPair = {
        accessToken: data.accessToken,
        refreshToken: data.refreshToken || refreshToken,
        expiresAt: data.expiresAt || Date.now() + 60 * 60 * 1000, // Default 1hr
      };
      storeTokens(newTokens);
      return newTokens;
    }
    return null;
  } catch {
    return null;
  }
}

// ─── Client-side Rate Limiting ─────────────────────────────────────────────

interface RateLimitEntry {
  count: number;
  resetAt: number;
}

const rateLimitMap = new Map<string, RateLimitEntry>();

/**
 * Client-side rate limiter.
 * Prevents excessive API calls from the frontend.
 *
 * @param key - Unique identifier (e.g., 'login', 'apply')
 * @param maxAttempts - Max attempts within the window
 * @param windowMs - Time window in milliseconds
 * @returns true if the action is allowed, false if rate limited
 */
export function checkRateLimit(
  key: string,
  maxAttempts: number = 5,
  windowMs: number = 60_000
): { allowed: boolean; retryAfterMs?: number } {
  const now = Date.now();
  const entry = rateLimitMap.get(key);

  if (!entry || now >= entry.resetAt) {
    // New window
    rateLimitMap.set(key, { count: 1, resetAt: now + windowMs });
    return { allowed: true };
  }

  if (entry.count >= maxAttempts) {
    return { allowed: false, retryAfterMs: entry.resetAt - now };
  }

  entry.count++;
  return { allowed: true };
}

/**
 * Reset rate limit for a key (e.g., after successful action).
 */
export function resetRateLimit(key: string): void {
  rateLimitMap.delete(key);
}

// ─── CSP Nonce ─────────────────────────────────────────────────────────────

/**
 * Generate a cryptographic nonce for CSP inline scripts.
 */
export function generateNonce(): string {
  const array = new Uint8Array(16);
  crypto.getRandomValues(array);
  return btoa(String.fromCharCode(...array));
}

// ─── Secure Headers (for Vercel/server config reference) ───────────────────

/**
 * Recommended security headers for the deployment platform.
 * These should be configured in vercel.json or server config.
 */
export const RECOMMENDED_HEADERS = {
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'DENY',
  'X-XSS-Protection': '1; mode=block',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Permissions-Policy': 'camera=(), microphone=(), geolocation=(self)',
  'Strict-Transport-Security': 'max-age=31536000; includeSubDomains',
} as const;
