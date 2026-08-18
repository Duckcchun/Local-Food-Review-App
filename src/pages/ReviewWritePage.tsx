import { useNavigate, useParams } from 'react-router-dom';
import { ReviewWritePage as ReviewWriteComponent } from '../components/ReviewWritePage';
import { useAuthStore } from '../stores/authStore';
import { useProductStore } from '../stores/productStore';
import { useProducts } from '../hooks/useProducts';

export default function ReviewWritePage() {
  const navigate = useNavigate();
  const { productId } = useParams<{ productId: string }>();
  const { userInfo } = useAuthStore();
  const { allProducts, selectedProduct } = useProductStore();
  const { handleSubmitReview } = useProducts();

  const product = selectedProduct || allProducts.find(p => p.id === productId);

  if (!product || !userInfo) {
    navigate('/review', { replace: true });
    return null;
  }

  return (
    <ReviewWriteComponent
      product={product}
      onBack={() => navigate(-1)}
      userName={userInfo.name}
      onSubmit={handleSubmitReview}
    />
  );
}
