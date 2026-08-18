import { useState } from 'react';
import { startOAuthFlow, getAvailableProviders, type SocialProvider } from '../utils/socialAuth';
import { toast } from 'sonner';

interface SocialLoginButtonsProps {
  /** Text prefix: "로그인" or "회원가입" */
  action?: '로그인' | '회원가입';
  className?: string;
}

/**
 * Social login buttons for Kakao and Google OAuth.
 * Only shows buttons for configured providers.
 * Gracefully handles missing API keys.
 */
export function SocialLoginButtons({ action = '로그인', className = '' }: SocialLoginButtonsProps) {
  const [isLoading, setIsLoading] = useState<SocialProvider | null>(null);
  const availableProviders = getAvailableProviders();

  const handleSocialLogin = (provider: SocialProvider) => {
    try {
      setIsLoading(provider);
      startOAuthFlow(provider);
    } catch (e: any) {
      toast.error(e.message || '소셜 로그인을 시작할 수 없습니다');
      setIsLoading(null);
    }
  };

  // Don't render if no providers configured
  if (availableProviders.length === 0) {
    return null;
  }

  return (
    <div className={`space-y-3 ${className}`}>
      {/* Divider */}
      <div className="flex items-center gap-3">
        <div className="flex-1 h-px bg-[#d4c5a0]" />
        <span className="text-xs text-[#9ca89d]">간편 {action}</span>
        <div className="flex-1 h-px bg-[#d4c5a0]" />
      </div>

      {/* Buttons */}
      <div className="flex flex-col gap-2">
        {availableProviders.includes('kakao') && (
          <button
            onClick={() => handleSocialLogin('kakao')}
            disabled={isLoading !== null}
            className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-[1rem] font-medium text-sm transition-all hover:opacity-90 disabled:opacity-50"
            style={{ backgroundColor: '#FEE500', color: '#191919' }}
          >
            {isLoading === 'kakao' ? (
              <LoadingSpinner />
            ) : (
              <KakaoIcon />
            )}
            카카오로 {action}
          </button>
        )}

        {availableProviders.includes('google') && (
          <button
            onClick={() => handleSocialLogin('google')}
            disabled={isLoading !== null}
            className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-[1rem] font-medium text-sm border-2 border-[#d4c5a0] bg-white text-[#2d3e2d] transition-all hover:bg-gray-50 disabled:opacity-50"
          >
            {isLoading === 'google' ? (
              <LoadingSpinner />
            ) : (
              <GoogleIcon />
            )}
            구글로 {action}
          </button>
        )}
      </div>
    </div>
  );
}

// ─── Icons ─────────────────────────────────────────────────────────────────

function KakaoIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M9 1.5C4.86 1.5 1.5 4.14 1.5 7.38C1.5 9.42 2.88 11.22 4.92 12.24L4.2 15.06C4.14 15.3 4.38 15.48 4.56 15.36L7.86 13.2C8.22 13.26 8.6 13.26 9 13.26C13.14 13.26 16.5 10.62 16.5 7.38C16.5 4.14 13.14 1.5 9 1.5Z"
        fill="#191919"
      />
    </svg>
  );
}

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" xmlns="http://www.w3.org/2000/svg">
      <path d="M17.64 9.2c0-.63-.06-1.25-.16-1.84H9v3.49h4.84a4.14 4.14 0 0 1-1.8 2.71v2.26h2.92a8.78 8.78 0 0 0 2.68-6.62z" fill="#4285F4" />
      <path d="M9 18c2.43 0 4.47-.8 5.96-2.18l-2.92-2.26c-.8.54-1.83.86-3.04.86-2.34 0-4.32-1.58-5.03-3.71H.96v2.33A9 9 0 0 0 9 18z" fill="#34A853" />
      <path d="M3.97 10.71A5.41 5.41 0 0 1 3.69 9c0-.59.1-1.17.28-1.71V4.96H.96A9 9 0 0 0 0 9c0 1.45.35 2.82.96 4.04l3.01-2.33z" fill="#FBBC05" />
      <path d="M9 3.58c1.32 0 2.5.45 3.44 1.35l2.58-2.59C13.46.89 11.43 0 9 0A9 9 0 0 0 .96 4.96l3.01 2.33C4.68 5.16 6.66 3.58 9 3.58z" fill="#EA4335" />
    </svg>
  );
}

function LoadingSpinner() {
  return (
    <svg className="animate-spin" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="12" r="10" strokeOpacity="0.25" />
      <path d="M12 2a10 10 0 0 1 10 10" strokeLinecap="round" />
    </svg>
  );
}
