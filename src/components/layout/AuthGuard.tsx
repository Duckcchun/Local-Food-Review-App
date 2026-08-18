import { useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../stores/authStore';
import { PageSkeleton } from '../common/PageSkeleton';

/**
 * Route guard that redirects unauthenticated users to signup page.
 * Also handles session restoration on first load.
 */
export function AuthGuard() {
  const navigate = useNavigate();
  const { userInfo, accessToken, isSessionRestoring, restoreSession } = useAuthStore();

  useEffect(() => {
    if (!userInfo && accessToken) {
      // Try to restore session
      restoreSession();
    }
  }, [userInfo, accessToken, restoreSession]);

  useEffect(() => {
    if (!userInfo && !accessToken && !isSessionRestoring) {
      navigate('/signup', { replace: true });
    }
  }, [userInfo, accessToken, isSessionRestoring, navigate]);

  if (isSessionRestoring) {
    return <PageSkeleton />;
  }

  if (!userInfo) {
    return <PageSkeleton />;
  }

  return <Outlet />;
}
