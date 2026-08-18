import { useNavigate } from 'react-router-dom';
import { TermsPage } from '../components/TermsPage';

export function TermsRoute() {
  const navigate = useNavigate();
  return <TermsPage onBack={() => navigate('/profile')} />;
}
