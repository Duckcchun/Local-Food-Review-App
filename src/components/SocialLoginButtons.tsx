import { useState } from 'react';
import { toast } from 'sonner';

interface SocialLoginButtonsProps {
  action?: '로그인' | '회원가입';
  className?: string;
}

/**
 * 소셜 로그인 버튼 (카카오/구글).
 * 환경변수 미설정 시에도 버튼을 보여주되, 클릭 시 "준비 중" 메시지 표시.
 */
export function SocialLoginButtons({ action = '로그인', className = '' }: SocialLoginButtonsProps) {
  const [isLoading, setIsLoading] = useState<'kakao' | 'google' | null>(null);

  const kakaoClientId = import.meta.env?.VITE_KAKAO_CLIENT_ID;
  const googleClientId = import.meta.env?.VITE_GOOGLE_CLIENT_ID;

  const handleKakaoLogin = () => {
    if (!kakaoClientId) {
      toast.info('카카오 로그인은 준비 중입니다');
      return;
    }
    setIsLoading('kakao');
    const redirectUri = `${window.location.origin}/auth/callback`;
    const state = Math.random().toString(36).substring(2);
    sessionStorage.setItem('oauth_state', state);
    sessionStorage.setItem('oauth_provider', 'kakao');
    window.location.href = `https://kauth.kakao.com/oauth/authorize?client_id=${kakaoClientId}&redirect_uri=${encodeURIComponent(redirectUri)}&response_type=code&state=${state}`;
  };

  const handleGoogleLogin = () => {
    if (!googleClientId) {
      toast.info('구글 로그인은 준비 중입니다');
      return;
    }
    setIsLoading('google');
    const redirectUri = `${window.location.origin}/auth/callback`;
    const state = Math.random().toString(36).substring(2);
    sessionStorage.setItem('oauth_state', state);
    sessionStorage.setItem('oauth_provider', 'google');
    window.location.href = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${googleClientId}&redirect_uri=${encodeURIComponent(redirectUri)}&response_type=code&scope=openid+email+profile&state=${state}`;
  };

  return (
    <div className={`space-y-2.5 ${className}`}>
      {/* Divider */}
      <div className="flex items-center gap-3 py-3">
        <div className="flex-1 h-px bg-gray-100" />
        <span className="text-xs text-gray-400">간편 {action}</span>
        <div className="flex-1 h-px bg-gray-100" />
      </div>

      {/* Kakao */}
      <button
        onClick={handleKakaoLogin}
        disabled={isLoading !== null}
        className="w-full flex items-center justify-center gap-2 h-[48px] rounded-xl font-medium text-sm transition-all hover:opacity-90 disabled:opacity-50"
        style={{ backgroundColor: '#FEE500', color: '#191919' }}
      >
        {isLoading === 'kakao' ? (
          <div className="w-4 h-4 border-2 border-gray-900 border-t-transparent rounded-full animate-spin" />
        ) : (
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
            <path fillRule="evenodd" clipRule="evenodd" d="M9 1.5C4.86 1.5 1.5 4.14 1.5 7.38C1.5 9.42 2.88 11.22 4.92 12.24L4.2 15.06C4.14 15.3 4.38 15.48 4.56 15.36L7.86 13.2C8.22 13.26 8.6 13.26 9 13.26C13.14 13.26 16.5 10.62 16.5 7.38C16.5 4.14 13.14 1.5 9 1.5Z" fill="#191919"/>
          </svg>
        )}
        카카오로 {action}
      </button>

      {/* Google */}
      <button
        onClick={handleGoogleLogin}
        disabled={isLoading !== null}
        className="w-full flex items-center justify-center gap-2 h-[48px] rounded-xl font-medium text-sm border border-gray-200 bg-white text-gray-700 transition-all hover:bg-gray-50 disabled:opacity-50"
      >
        {isLoading === 'google' ? (
          <div className="w-4 h-4 border-2 border-gray-600 border-t-transparent rounded-full animate-spin" />
        ) : (
          <svg width="18" height="18" viewBox="0 0 18 18">
            <path d="M17.64 9.2c0-.63-.06-1.25-.16-1.84H9v3.49h4.84a4.14 4.14 0 0 1-1.8 2.71v2.26h2.92a8.78 8.78 0 0 0 2.68-6.62z" fill="#4285F4"/>
            <path d="M9 18c2.43 0 4.47-.8 5.96-2.18l-2.92-2.26c-.8.54-1.83.86-3.04.86-2.34 0-4.32-1.58-5.03-3.71H.96v2.33A9 9 0 0 0 9 18z" fill="#34A853"/>
            <path d="M3.97 10.71A5.41 5.41 0 0 1 3.69 9c0-.59.1-1.17.28-1.71V4.96H.96A9 9 0 0 0 0 9c0 1.45.35 2.82.96 4.04l3.01-2.33z" fill="#FBBC05"/>
            <path d="M9 3.58c1.32 0 2.5.45 3.44 1.35l2.58-2.59C13.46.89 11.43 0 9 0A9 9 0 0 0 .96 4.96l3.01 2.33C4.68 5.16 6.66 3.58 9 3.58z" fill="#EA4335"/>
          </svg>
        )}
        구글로 {action}
      </button>
    </div>
  );
}
