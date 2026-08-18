import { useNavigate } from 'react-router-dom';
import { MyItemsPage } from '../components/MyItemsPage';
import { useAuthStore } from '../stores/authStore';

export function MyItemsRoute() {
  const navigate = useNavigate();
  const { userInfo } = useAuthStore();

  if (!userInfo) return null;

  return (
    <MyItemsPage
      onBack={() => navigate('/profile')}
      userEmail={userInfo.email}
    />
  );
}
