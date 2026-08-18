import { useNavigate } from 'react-router-dom';
import { CreateProductPage as CreateProductComponent } from '../components/CreateProductPage';
import { useAuthStore } from '../stores/authStore';
import { useProducts } from '../hooks/useProducts';

export default function CreateProductPage() {
  const navigate = useNavigate();
  const { userInfo } = useAuthStore();
  const { handleCreateProduct } = useProducts();

  if (!userInfo || userInfo.userType !== "business") {
    navigate('/', { replace: true });
    return null;
  }

  return (
    <CreateProductComponent
      onBack={() => navigate(-1)}
      onCreateProduct={handleCreateProduct}
      userInfo={userInfo}
    />
  );
}
