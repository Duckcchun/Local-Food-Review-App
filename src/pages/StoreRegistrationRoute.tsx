import { useNavigate } from 'react-router-dom';
import { StoreRegistrationPage } from '../components/StoreRegistrationPage';
import { useAuthStore } from '../stores/authStore';

export function StoreRegistrationRoute() {
  const navigate = useNavigate();
  const { userInfo, accessToken } = useAuthStore();

  if (!userInfo) return null;

  return (
    <StoreRegistrationPage
      onBack={() => navigate('/')}
      onComplete={() => navigate('/')}
      userId={userInfo.email}
      accessToken={accessToken}
    />
  );
}
