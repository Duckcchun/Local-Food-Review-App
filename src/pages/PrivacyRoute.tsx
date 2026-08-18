import { useNavigate } from 'react-router-dom';
import { PrivacyPage } from '../components/PrivacyPage';

export function PrivacyRoute() {
  const navigate = useNavigate();
  return <PrivacyPage onBack={() => navigate('/profile')} />;
}
