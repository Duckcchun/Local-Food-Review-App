import { useNavigate } from 'react-router-dom';
import { HomePage } from '../components/HomePage';
import { BusinessHomePage } from '../components/BusinessHomePage';
import { useAuthStore } from '../stores/authStore';
import { useProductStore } from '../stores/productStore';
import { useNotificationStore } from '../stores/notificationStore';

export function HomeRoute() {
  const navigate = useNavigate();
  const { userInfo } = useAuthStore();
  const { allProducts, businessProducts, favorites, toggleFavorite, setSelectedProduct, deleteBusinessProduct } = useProductStore();
  const { accessToken } = useAuthStore();
  const { unreadCount } = useNotificationStore();

  if (!userInfo) return null;

  const handleProductClick = (product: any) => {
    setSelectedProduct(product);
    navigate(`/product/${product.id}`);
  };

  if (userInfo.userType === "business") {
    return (
      <BusinessHomePage
        userInfo={userInfo}
        onProductClick={handleProductClick}
        myProducts={businessProducts}
        onCreateProduct={() => navigate('/create-product')}
        onManageApplicants={(product) => {
          setSelectedProduct(product);
          navigate('/manage-applicants');
        }}
        onManageReviews={() => navigate('/review-management')}
        onViewDashboard={() => navigate('/business-dashboard')}
        onDeleteProduct={(productId) => deleteBusinessProduct(productId, accessToken)}
      />
    );
  }

  return (
    <HomePage
      onProductClick={handleProductClick}
      userName={userInfo.name}
      favorites={favorites}
      onToggleFavorite={(productId) => toggleFavorite(productId, accessToken)}
      products={allProducts}
      onNotificationsClick={() => navigate('/notifications')}
      unreadNotifications={unreadCount}
    />
  );
}
