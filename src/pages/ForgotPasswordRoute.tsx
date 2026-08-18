import { useNavigate } from 'react-router-dom';
import { ForgotPasswordPage } from '../components/ForgotPasswordPage';

export function ForgotPasswordRoute() {
  const navigate = useNavigate();

  return (
    <ForgotPasswordPage
      onBack={() => navigate('/login')}
      onSwitchToLogin={() => navigate('/login')}
    />
  );
}
