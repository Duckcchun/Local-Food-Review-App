/**
 * 소셜 로그인 (OAuth 2.0) 유틸리티.
 *
 * 지원 프로바이더:
 * - 카카오 (Kakao)
 * - 구글 (Google)
 *
 * 플로우:
 * 1. 사용자가 소셜 로그인 버튼 클릭
 * 2. OAuth 인증 페이지로 리다이렉트 (또는 팝업)
 * 3. 콜백 URL로 인증 코드 수신
 * 4. 백엔드(Supabase Edge Function)에서 코드 → 토큰 교환
 * 5. 사용자 정보 + 앱 JWT 반환
 *
 * 환경 변수:
 * - VITE_KAKAO_CLIENT_ID
 * - VITE_GOOGLE_CLIENT_ID
 */

import { projectId, publicAnonKey } from './supabase/info';

const API_BASE = `https://${projectId}.supabase.co/functions/v1/make-server-98b21042`;

// ─── Configuration ─────────────────────────────────────────────────────────

const KAKAO_CLIENT_ID = import.meta.env?.VITE_KAKAO_CLIENT_ID as string || '';
const GOOGLE_CLIENT_ID = import.meta.env?.VITE_GOOGLE_CLIENT_ID as string || '';
const REDIRECT_URI = `${window.location.origin}/auth/callback`;

export type SocialProvider = 'kakao' | 'google';

interface SocialAuthConfig {
  clientId: string;
  authUrl: string;
  scope: string;
  responseType: string;
}

const PROVIDER_CONFIGS: Record<SocialProvider, SocialAuthConfig> = {
  kakao: {
    clientId: KAKAO_CLIENT_ID,
    authUrl: 'https://kauth.kakao.com/oauth/authorize',
    scope: 'profile_nickname profile_image account_email',
    responseType: 'code',
  },
  google: {
    clientId: GOOGLE_CLIENT_ID,
    authUrl: 'https://accounts.google.com/o/oauth2/v2/auth',
    scope: 'openid email profile',
    responseType: 'code',
  },
};

// ─── OAuth Flow ────────────────────────────────────────────────────────────

/**
 * Check if a social provider is configured (has client ID).
 */
export function isProviderConfigured(provider: SocialProvider): boolean {
  return !!PROVIDER_CONFIGS[provider].clientId;
}

/**
 * Get the list of available (configured) social login providers.
 */
export function getAvailableProviders(): SocialProvider[] {
  return (['kakao', 'google'] as SocialProvider[]).filter(isProviderConfigured);
}

/**
 * Generate a random state parameter for CSRF protection.
 */
function generateState(): string {
  const array = new Uint8Array(16);
  crypto.getRandomValues(array);
  return Array.from(array, b => b.toString(16).padStart(2, '0')).join('');
}

/**
 * Start the OAuth flow by redirecting to the provider's auth page.
 * Saves the state in sessionStorage for verification on callback.
 */
export function startOAuthFlow(provider: SocialProvider): void {
  const config = PROVIDER_CONFIGS[provider];
  
  if (!config.clientId) {
    throw new Error(`${provider} OAuth is not configured. Set VITE_${provider.toUpperCase()}_CLIENT_ID`);
  }

  const state = generateState();
  sessionStorage.setItem('oauth_state', state);
  sessionStorage.setItem('oauth_provider', provider);

  const params = new URLSearchParams({
    client_id: config.clientId,
    redirect_uri: REDIRECT_URI,
    response_type: config.responseType,
    scope: config.scope,
    state,
  });

  // Provider-specific params
  if (provider === 'google') {
    params.set('access_type', 'offline');
    params.set('prompt', 'consent');
  }

  window.location.href = `${config.authUrl}?${params.toString()}`;
}

/**
 * Handle the OAuth callback.
 * Extracts the code from URL params, verifies state, and exchanges for tokens.
 */
export async function handleOAuthCallback(
  searchParams: URLSearchParams
): Promise<{
  success: boolean;
  user?: {
    name: string;
    email: string;
    phone: string;
    userType: 'reviewer' | 'business';
    profileImage?: string;
  };
  accessToken?: string;
  error?: string;
}> {
  const code = searchParams.get('code');
  const state = searchParams.get('state');
  const error = searchParams.get('error');

  if (error) {
    return { success: false, error: `OAuth error: ${error}` };
  }

  if (!code) {
    return { success: false, error: '인증 코드가 없습니다' };
  }

  // Verify state for CSRF protection
  const savedState = sessionStorage.getItem('oauth_state');
  const savedProvider = sessionStorage.getItem('oauth_provider') as SocialProvider | null;

  if (state !== savedState) {
    return { success: false, error: '잘못된 인증 요청입니다 (state mismatch)' };
  }

  // Clear stored state
  sessionStorage.removeItem('oauth_state');
  sessionStorage.removeItem('oauth_provider');

  if (!savedProvider) {
    return { success: false, error: '프로바이더 정보가 없습니다' };
  }

  // Exchange code for tokens via backend
  try {
    const response = await fetch(`${API_BASE}/auth/social`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${publicAnonKey}`,
      },
      body: JSON.stringify({
        provider: savedProvider,
        code,
        redirectUri: REDIRECT_URI,
      }),
    });

    const data = await response.json();

    if (!response.ok || !data.success) {
      return { success: false, error: data.error || '소셜 로그인에 실패했습니다' };
    }

    return {
      success: true,
      user: data.user,
      accessToken: data.accessToken,
    };
  } catch (e: any) {
    return { success: false, error: e.message || '서버 연결에 실패했습니다' };
  }
}

// ─── Provider Metadata (for UI) ────────────────────────────────────────────

export interface ProviderMeta {
  id: SocialProvider;
  name: string;
  color: string;
  bgColor: string;
  icon: string; // SVG path or emoji
}

export const PROVIDER_META: Record<SocialProvider, ProviderMeta> = {
  kakao: {
    id: 'kakao',
    name: '카카오',
    color: '#191919',
    bgColor: '#FEE500',
    icon: 'kakao',
  },
  google: {
    id: 'google',
    name: '구글',
    color: '#4285F4',
    bgColor: '#FFFFFF',
    icon: 'google',
  },
};
