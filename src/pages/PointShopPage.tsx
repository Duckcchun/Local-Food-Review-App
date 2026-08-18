import { useNavigate } from 'react-router-dom';
import { PointShop } from '../components/PointShop';
import { usePointStore } from '../stores/pointStore';
import { useAuthStore } from '../stores/authStore';
import { toast } from 'sonner';
import type { PointProduct } from '../data/pointShop';

export default function PointShopPage() {
  const navigate = useNavigate();
  const { userPoints, userLevel, spendPoints, saveToStorage } = usePointStore();
  const { userInfo } = useAuthStore();

  const handlePurchase = (product: PointProduct) => {
    spendPoints(product.price, product.name, product.category);
    if (userInfo?.email) {
      saveToStorage(userInfo.email);
    }
    toast.success(`${product.name} 구매가 완료되었습니다!`);
  };

  return (
    <PointShop
      onBack={() => navigate(-1)}
      userPoints={userPoints}
      userLevel={userLevel}
      onPurchase={handlePurchase}
    />
  );
}
