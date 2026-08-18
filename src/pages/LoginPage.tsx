import { useNavigate } from 'react-router-dom';
import { LoginPage as LoginPageComponent } from '../components/LoginPage';
import { useAuthStore } from '../stores/authStore';
import type { UserInfo } from '../types';

export default function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuthStore();

  const handleLoginComplete = (userData: UserInfo, accessToken: string) => {
    login(userData, accessToken);
    navigate('/', { replace: true });
  };

  return (
    <LoginPageComponent
      onBack={() => navigate('/')}
      onLoginComplete={handleLoginComplete}
      onSwitchToSignup={() => navigate('/signup')}
    />
  );
}
