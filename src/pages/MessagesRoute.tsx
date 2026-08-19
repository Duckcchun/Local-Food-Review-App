import { useNavigate } from 'react-router-dom';
import { MessagesPage } from '../components/MessagesPage';
import { useAuthStore } from '../stores/authStore';

export function MessagesRoute() {
  const navigate = useNavigate();
  const { userInfo } = useAuthStore();

  if (!userInfo) return null;

  return (
    <MessagesPage
      onBack={() => navigate(-1)}
      userEmail={userInfo.email}
      userName={userInfo.name}
    />
  );
}
