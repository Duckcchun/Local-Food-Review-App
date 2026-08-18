import { useNavigate } from 'react-router-dom';
import { HomePage as HomePageComponent } from '../components/HomePage';
import { BusinessHomePage } from '../components/BusinessHomePage';
import { useAuthStore } from '../stores/authStore';
import { useProductStore } from '../stores/productStore';
import { useApplicationStore } from '../stores/applicationStore';
import { useNotificationStore } from '../stores/notificationStore';
import { useReviewStore } from '../stores/reviewStore';
import { useFavorites } from '../hooks/useFavorites';
import { useProducts } from '../hooks/useProducts';
import { useDataLoader } from '../hooks/useDataLoader';
import type { Product } from '../data/mockData';

export default function HomePage() {
  const navigate = useNavigate();
  const { userInfo } = useAuthStore();
  const { allProducts, businessProducts, setSelectedProduct } = useProductStore();
  const { applications } = useApplicationStore();
  const { completedReviews } = useReviewStore();
  const notifications = useNotificationStore(s => s.notifications);
  const { favorites, handleToggleFavorite } = useFavorites();
  const { handleDeleteProduct, handleUpdateApplicationStatus } = useProducts();

  // Data loader for initial server sync
  useDataLoader();

  if (!userInfo) return null;

  const handleProductClick = (product: Product) => {
    setSelectedProduct(product);
    navigate(`/products/${product.id}`);
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
          navigate(`/manage-applicants/${product.id}`);
        }}
        onManageReviews={() => navigate('/review-management')}
        onViewDashboard={() => navigate('/dashboard')}
        onDeleteProduct={handleDeleteProduct}
      />
    );
  }

  return (
    <HomePageComponent
      onProductClick={handleProductClick}
      userName={userInfo.name}
      favorites={favorites}
      onToggleFavorite={handleToggleFavorite}
      products={allProducts}
      onNotificationsClick={() => navigate('/notifications')}
      unreadNotifications={notifications.filter(n => !n.read).length}
    />
  );
}
