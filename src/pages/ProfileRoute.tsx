import { useNavigate } from 'react-router-dom';
import { ProfilePage } from '../components/ProfilePage';
import { useAuthStore } from '../stores/authStore';
import { useReviewStore } from '../stores/reviewStore';
import { usePointStore } from '../stores/pointStore';
import { useProductStore } from '../stores/productStore';
import { toast } from 'sonner';

export function ProfileRoute() {
  const navigate = useNavigate();
  const { userInfo, accessToken, logout } = useAuthStore();
  const { completedReviews } = useReviewStore();
  const { userPoints, userLevel } = usePointStore();
  const { setSelectedProduct } = useProductStore();

  if (!userInfo) return null;

  const handleLogout = () => {
    logout();
    toast.success("로그아웃 되었습니다");
    navigate('/signup');
  };

  const handleEditReview = (product: any) => {
    setSelectedProduct(product);
    navigate('/edit-review');
  };

  return (
    <ProfilePage
      userInfo={userInfo}
      completedReviews={completedReviews}
      userPoints={userPoints}
      userLevel={userLevel}
      onNavigateToApplications={() => navigate('/my-applications')}
      onNavigateToFavorites={() => navigate('/my-favorites')}
      onNavigateToPointShop={() => navigate('/point-shop')}
      onNavigateToPointHistory={() => navigate('/point-history')}
      onEditReview={handleEditReview}
      onNavigateToDashboard={() => navigate('/business-dashboard')}
      onNavigateToTerms={() => navigate('/terms')}
      onNavigateToPrivacy={() => navigate('/privacy')}
      onEditProfile={() => navigate('/edit-profile')}
      onNavigateToMyItems={() => navigate('/my-items')}
      accessToken={accessToken}
      onLogout={handleLogout}
    />
  );
}
