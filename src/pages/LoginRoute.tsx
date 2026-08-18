import { useNavigate } from 'react-router-dom';
import { LoginPage } from '../components/LoginPage';
import { useAuthStore } from '../stores/authStore';
import { useProductStore } from '../stores/productStore';
import { useApplicationStore } from '../stores/applicationStore';
import { useReviewStore } from '../stores/reviewStore';
import { useNotificationStore } from '../stores/notificationStore';
import { usePointStore } from '../stores/pointStore';
import type { UserInfo } from '../types';

export function LoginRoute() {
  const navigate = useNavigate();
  const { login } = useAuthStore();
  const { initFromLocalStorage: initProducts } = useProductStore();
  const { setApplications } = useApplicationStore();
  const { setCompletedReviews } = useReviewStore();
  const { setNotifications } = useNotificationStore();
  const { reset: resetPoints } = usePointStore();

  const handleLoginComplete = (userData: UserInfo, token: string) => {
    // Reset user-scoped data
    setApplications([]);
    setCompletedReviews([]);
    setNotifications([]);
    resetPoints();

    // Clear user-scoped localStorage
    try {
      localStorage.removeItem('applications');
      localStorage.removeItem('favorites');
      localStorage.removeItem('completedReviews');
      localStorage.removeItem('notifications');
      localStorage.removeItem('productLikes');
      localStorage.removeItem('userPoints');
      localStorage.removeItem('userLevel');
      localStorage.removeItem('pointTransactions');
    } catch {}

    login(userData, token);
    initProducts(userData.email);
    navigate('/');
  };

  return (
    <LoginPage
      onBack={() => navigate('/signup')}
      onLoginComplete={handleLoginComplete}
      onSwitchToSignup={() => navigate('/signup')}
      onForgotPassword={() => navigate('/forgot-password')}
    />
  );
}
