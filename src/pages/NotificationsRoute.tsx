import { useNavigate } from 'react-router-dom';
import { NotificationsPage } from '../components/NotificationsPage';
import { useAuthStore } from '../stores/authStore';
import { useNotificationStore } from '../stores/notificationStore';

export function NotificationsRoute() {
  const navigate = useNavigate();
  const { accessToken } = useAuthStore();
  const { notifications, markAsRead } = useNotificationStore();

  return (
    <NotificationsPage
      onBack={() => navigate(-1)}
      notifications={notifications}
      onMarkAsRead={async (id) => markAsRead(id, accessToken)}
    />
  );
}
