import { useNavigate } from 'react-router-dom';
import { NotificationsPage as NotificationsComponent } from '../components/NotificationsPage';
import { useNotificationStore } from '../stores/notificationStore';
import { useAuthStore } from '../stores/authStore';

export default function NotificationsPage() {
  const navigate = useNavigate();
  const { notifications, markAsRead } = useNotificationStore();
  const { accessToken } = useAuthStore();

  return (
    <NotificationsComponent
      onBack={() => navigate(-1)}
      notifications={notifications}
      onMarkAsRead={(id) => markAsRead(id, accessToken || undefined)}
    />
  );
}
