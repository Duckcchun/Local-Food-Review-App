import { useNavigate } from 'react-router-dom';
import { NoticePage } from '../components/NoticePage';

export function NoticeRoute() {
  const navigate = useNavigate();
  return <NoticePage onBack={() => navigate(-1)} />;
}
