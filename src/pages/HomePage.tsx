import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { HomePage as HomePageComponent } from '../components/HomePage';
import { BusinessHomePage } from '../components/BusinessHomePage';
import { MapView } from '../components/MapView';
import { useAuthStore } from '../stores/authStore';
import { useProductStore } from '../stores/productStore';
import { useApplicationStore } from '../stores/applicationStore';
import { useNotificationStore } from '../stores/notificationStore';
import { useReviewStore } from '../stores/reviewStore';
import { useFavorites } from '../hooks/useFavorites';
import { useProducts } from '../hooks/useProducts';
import { useDataLoader } from '../hooks/useDataLoader';
import { useRealtimeNotifications } from '../hooks/useRealtimeNotifications';
import { NotificationPermissionBanner } from '../components/common/NotificationPermissionBanner';
import type { Product } from '../data/mockData';
import { Map } from 'lucide-react';

type ViewMode = 'list' | 'map';

export default function HomePage() {
  const navigate = useNavigate();
  const { userInfo } = useAuthStore();
  const { allProducts, businessProducts, setSelectedProduct } = useProductStore();
  const { applications } = useApplicationStore();
  const { completedReviews } = useReviewStore();
  const notifications = useNotificationStore(s => s.notifications);
  const { favorites, handleToggleFavorite } = useFavorites();
  const { handleDeleteProduct, handleUpdateApplicationStatus } = useProducts();
  const [viewMode, setViewMode] = useState<ViewMode>('list');

  // Data loader for initial server sync
  useDataLoader();

  // Real-time notification subscription
  useRealtimeNotifications();

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

  // Map view for reviewer
  if (viewMode === 'map') {
    return (
      <div className="min-h-screen bg-[#fffef5] pb-24">
        <div className="max-w-md mx-auto px-4 pt-4">
          <MapView
            products={allProducts}
            onProductClick={handleProductClick}
            onToggleView={() => setViewMode('list')}
          />
        </div>
      </div>
    );
  }

  return (
    <>
      <NotificationPermissionBanner />
      <HomePageComponent
        onProductClick={handleProductClick}
        userName={userInfo.name}
        favorites={favorites}
        onToggleFavorite={handleToggleFavorite}
        products={allProducts}
        onNotificationsClick={() => navigate('/notifications')}
        unreadNotifications={notifications.filter(n => !n.read).length}
        onMapView={() => setViewMode('map')}
      />
    </>
  );
}
