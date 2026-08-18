import { useNavigate } from 'react-router-dom';
import { TermsPage as TermsComponent } from '../components/TermsPage';

export default function TermsPage() {
  const navigate = useNavigate();

  return <TermsComponent onBack={() => navigate(-1)} />;
}
