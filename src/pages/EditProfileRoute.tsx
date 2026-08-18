import { useNavigate } from 'react-router-dom';
import { EditProfilePage } from '../components/EditProfilePage';
import { useAuthStore } from '../stores/authStore';

export function EditProfileRoute() {
  const navigate = useNavigate();
  const { userInfo, accessToken, setUserInfo } = useAuthStore();

  if (!userInfo) return null;

  return (
    <EditProfilePage
      userInfo={userInfo}
      accessToken={accessToken}
      onBack={() => navigate('/profile')}
      onSave={(updated) => setUserInfo(userInfo ? { ...userInfo, ...updated } : null)}
    />
  );
}
