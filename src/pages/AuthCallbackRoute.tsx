import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../stores/authStore';
import { toast } from 'sonner';
import { requestJson } from '../utils/request';

/**
 * OAuth 콜백 처리 페이지.
 * 카카오/구글에서 리다이렉트 후 인가 코드를 받아 백엔드에서 토큰 교환.
 */
export function AuthCallbackRoute() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { login } = useAuthStore();
  const [status, setStatus] = useState<'processing' | 'error'>('processing');
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    const processCallback = async () => {
      const code = searchParams.get('code');
      const error = searchParams.get('error');
      const state = searchParams.get('state');
      const provider = sessionStorage.getItem('oauth_provider') || 'kakao';

      // 에러 체크
      if (error) {
        setStatus('error');
        setErrorMsg(`인증이 취소되었습니다: ${error}`);
        setTimeout(() => navigate('/login', { replace: true }), 2000);
        return;
      }

      if (!code) {
        setStatus('error');
        setErrorMsg('인증 코드를 받지 못했습니다');
        setTimeout(() => navigate('/login', { replace: true }), 2000);
        return;
      }

      // CSRF state 검증
      const savedState = sessionStorage.getItem('oauth_state');
      if (state && savedState && state !== savedState) {
        setStatus('error');
        setErrorMsg('잘못된 인증 요청입니다');
        setTimeout(() => navigate('/login', { replace: true }), 2000);
        return;
      }

      // 세션 정리
      sessionStorage.removeItem('oauth_state');
      sessionStorage.removeItem('oauth_provider');

      // 백엔드에서 토큰 교환
      try {
        const redirectUri = `${window.location.origin}/auth/callback`;
        const { response, data } = await requestJson<any, any>({
          path: '/auth/social',
          method: 'POST',
          body: { provider, code, redirectUri },
          timeoutMs: 15000,
        });

        if (response.ok && data?.accessToken && data?.user) {
          login(
            {
              name: data.user.name || data.user.nickname || '사용자',
              email: data.user.email || `${provider}_${Date.now()}@social.login`,
              phone: data.user.phone || '',
              userType: data.user.userType || 'reviewer',
            },
            data.accessToken
          );
          toast.success('소셜 로그인 성공!');
          navigate('/', { replace: true });
        } else {
          throw new Error(data?.error || '소셜 로그인에 실패했습니다');
        }
      } catch (err: any) {
        console.error('Social login callback error:', err);
        setStatus('error');
        setErrorMsg(err?.message || '소셜 로그인 처리 중 오류가 발생했습니다');
        toast.error('소셜 로그인에 실패했습니다. 다시 시도해주세요.');
        setTimeout(() => navigate('/login', { replace: true }), 3000);
      }
    };

    processCallback();
  }, [searchParams, navigate, login]);

  return (
    <div className="min-h-screen bg-[#fffef5] flex items-center justify-center px-5">
      <div className="text-center">
        {status === 'processing' && (
          <>
            <div className="w-10 h-10 mx-auto mb-4 border-3 border-[#6b8e6f] border-t-transparent rounded-full animate-spin" />
            <h2 className="text-lg font-bold text-gray-900 mb-1">로그인 처리 중...</h2>
            <p className="text-sm text-gray-500">잠시만 기다려주세요</p>
          </>
        )}
        {status === 'error' && (
          <>
            <div className="w-12 h-12 mx-auto mb-4 bg-red-50 rounded-full flex items-center justify-center">
              <span className="text-2xl">⚠️</span>
            </div>
            <h2 className="text-lg font-bold text-gray-900 mb-1">로그인 실패</h2>
            <p className="text-sm text-gray-500 mb-4">{errorMsg}</p>
            <button
              onClick={() => navigate('/login', { replace: true })}
              className="text-sm text-[#6b8e6f] font-medium hover:underline"
            >
              로그인 페이지로 돌아가기
            </button>
          </>
        )}
      </div>
    </div>
  );
}
