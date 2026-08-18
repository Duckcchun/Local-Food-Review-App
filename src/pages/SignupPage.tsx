import { useNavigate } from 'react-router-dom';
import { SignupPage as SignupPageComponent } from '../components/SignupPage';
import { useAuthStore } from '../stores/authStore';
import type { UserInfo } from '../types';

export default function SignupPage() {
  const navigate = useNavigate();
  const { login, setUserInfo } = useAuthStore();

  const handleSignupComplete = (userData: UserInfo, token?: string) => {
    if (!token) {
      setUserInfo(userData);
      navigate('/', { replace: true });
      return;
    }
    login(userData, token);
    navigate('/', { replace: true });
  };

  return (
    <SignupPageComponent
      onBack={() => navigate('/')}
      onSignupComplete={handleSignupComplete}
      onSwitchToLogin={() => navigate('/login')}
    />
  );
}
