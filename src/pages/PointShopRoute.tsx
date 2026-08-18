import { useNavigate } from 'react-router-dom';
import { PointShop } from '../components/PointShop';
import { useAuthStore } from '../stores/authStore';
import { usePointStore } from '../stores/pointStore';

export function PointShopRoute() {
  const navigate = useNavigate();
  const { userInfo } = useAuthStore();
  const { userPoints, userLevel, purchaseProduct } = usePointStore();

  if (!userInfo) return null;

  return (
    <PointShop
      onBack={() => navigate('/profile')}
      userPoints={userPoints}
      userLevel={userLevel}
      onPurchase={(product) => purchaseProduct(product, userInfo.email)}
    />
  );
}
