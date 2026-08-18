import { useNavigate } from 'react-router-dom';
import { StoreRegistrationPage as StoreRegistrationComponent } from '../components/StoreRegistrationPage';
import { useAuthStore } from '../stores/authStore';

export default function StoreRegistrationPage() {
  const navigate = useNavigate();
  const { userInfo, accessToken } = useAuthStore();

  if (!userInfo) {
    navigate('/', { replace: true });
    return null;
  }

  return (
    <StoreRegistrationComponent
      onBack={() => navigate(-1)}
      onComplete={() => navigate('/', { replace: true })}
      userId={userInfo.email}
      accessToken={accessToken}
    />
  );
}
