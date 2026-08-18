import { useNavigate } from 'react-router-dom';
import { CreateProductPage } from '../components/CreateProductPage';
import { useAuthStore } from '../stores/authStore';
import { useProductStore } from '../stores/productStore';
import type { Product } from '../data/mockData';

export function CreateProductRoute() {
  const navigate = useNavigate();
  const { userInfo, accessToken } = useAuthStore();
  const { addBusinessProduct } = useProductStore();

  if (!userInfo || userInfo.userType !== "business") return null;

  const handleCreate = (productData: Omit<Product, "id">) => {
    const newProduct: Product = {
      ...productData,
      id: `business-${Date.now()}`
    };
    addBusinessProduct(newProduct, accessToken);
  };

  return (
    <CreateProductPage
      onBack={() => navigate(-1)}
      onCreateProduct={handleCreate}
      userInfo={userInfo}
    />
  );
}
