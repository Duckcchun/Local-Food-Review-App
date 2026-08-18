import { useNavigate } from 'react-router-dom';
import { PrivacyPage as PrivacyComponent } from '../components/PrivacyPage';

export default function PrivacyPage() {
  const navigate = useNavigate();

  return <PrivacyComponent onBack={() => navigate(-1)} />;
}
