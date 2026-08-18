import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { handleOAuthCallback } from '../utils/socialAuth';
import { useAuthStore } from '../stores/authStore';
import { toast } from 'sonner';
import { Loader2, CheckCircle, XCircle } from 'lucide-react';

type CallbackState = 'processing' | 'success' | 'error';

/**
 * OAuth callback page.
 * Handles the redirect from social login providers.
 * Extracts the auth code, exchanges it for tokens, and redirects to home.
 */
export default function AuthCallbackPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { login } = useAuthStore();
  const [state, setState] = useState<CallbackState>('processing');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const processCallback = async () => {
      const result = await handleOAuthCallback(searchParams);

      if (result.success && result.user && result.accessToken) {
        setState('success');
        toast.success('소셜 로그인 성공!');

        // Login to app
        login(
          {
            name: result.user.name,
            email: result.user.email,
            phone: result.user.phone || '',
            userType: result.user.userType,
          },
          result.accessToken
        );

        // Redirect to home after brief delay
        setTimeout(() => navigate('/', { replace: true }), 1000);
      } else {
        setState('error');
        setErrorMessage(result.error || '소셜 로그인에 실패했습니다');
        toast.error(result.error || '소셜 로그인에 실패했습니다');

        // Redirect to login after delay
        setTimeout(() => navigate('/login', { replace: true }), 3000);
      }
    };

    processCallback();
  }, [searchParams, login, navigate]);

  return (
    <div className="min-h-screen bg-[#fffef5] flex items-center justify-center px-6">
      <div className="max-w-sm w-full text-center">
        {state === 'processing' && (
          <>
            <Loader2 size={48} className="mx-auto mb-4 text-[#6b8e6f] animate-spin" />
            <h2 className="text-lg font-bold text-[#2d3e2d] mb-2">로그인 처리 중...</h2>
            <p className="text-sm text-[#9ca89d]">소셜 계정 정보를 확인하고 있습니다</p>
          </>
        )}

        {state === 'success' && (
          <>
            <CheckCircle size={48} className="mx-auto mb-4 text-[#6b8e6f]" />
            <h2 className="text-lg font-bold text-[#2d3e2d] mb-2">로그인 성공!</h2>
            <p className="text-sm text-[#9ca89d]">홈으로 이동합니다...</p>
          </>
        )}

        {state === 'error' && (
          <>
            <XCircle size={48} className="mx-auto mb-4 text-[#f5a145]" />
            <h2 className="text-lg font-bold text-[#2d3e2d] mb-2">로그인 실패</h2>
            <p className="text-sm text-[#9ca89d] mb-4">{errorMessage}</p>
            <button
              onClick={() => navigate('/login', { replace: true })}
              className="text-sm text-[#6b8e6f] underline"
            >
              로그인 페이지로 돌아가기
            </button>
          </>
        )}
      </div>
    </div>
  );
}
