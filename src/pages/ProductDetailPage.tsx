import { useNavigate, useParams } from 'react-router-dom';
import { ProductDetailPage as ProductDetailComponent } from '../components/ProductDetailPage';
import { useAuthStore } from '../stores/authStore';
import { useProductStore } from '../stores/productStore';
import { useApplicationStore } from '../stores/applicationStore';
import { useReviewStore } from '../stores/reviewStore';
import { useFavorites } from '../hooks/useFavorites';
import { useProducts } from '../hooks/useProducts';

export default function ProductDetailPage() {
  const navigate = useNavigate();
  const { productId } = useParams<{ productId: string }>();
  const { userInfo } = useAuthStore();
  const { allProducts, selectedProduct, setSelectedProduct, updateProductField } = useProductStore();
  const { applications } = useApplicationStore();
  const { completedReviews } = useReviewStore();
  const { favorites, handleToggleFavorite, productLikes, handleToggleProductLike } = useFavorites();
  const { handleApply, handleCancelApplication } = useProducts();

  // Find the product from store or URL param
  const product = selectedProduct || allProducts.find(p => p.id === productId);

  if (!product) {
    navigate('/', { replace: true });
    return null;
  }

  const hasApplied = applications.some(
    a => a.productId === product.id && a.userEmail === userInfo?.email
  );
  const canCancel = applications.some(
    a => a.productId === product.id && a.userEmail === userInfo?.email && a.status === "pending"
  );

  const handleToggleLike = async () => {
    const delta = await handleToggleProductLike(product.id);
    updateProductField(product.id, {
      likeCount: Math.max(0, (product.likeCount || 0) + delta),
    });
  };

  return (
    <ProductDetailComponent
      product={product}
      onBack={() => navigate(-1)}
      onApply={() => handleApply(product)}
      isFavorite={favorites.includes(product.id)}
      onToggleFavorite={() => handleToggleFavorite(product.id)}
      isLiked={productLikes.includes(product.id)}
      onToggleLike={handleToggleLike}
      reviews={completedReviews}
      hasApplied={hasApplied}
      canCancel={canCancel}
      onCancel={() => handleCancelApplication(product.id)}
    />
  );
}
