import { useNavigate, useParams } from 'react-router-dom';
import { ProductDetailPage } from '../components/ProductDetailPage';
import { useAuthStore } from '../stores/authStore';
import { useProductStore } from '../stores/productStore';
import { useApplicationStore } from '../stores/applicationStore';
import { useReviewStore } from '../stores/reviewStore';

export function ProductDetailRoute() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { userInfo, accessToken } = useAuthStore();

  // 단일 store 호출 - allProducts에서 최신 데이터 참조
  const allProducts = useProductStore(state => state.allProducts);
  const favorites = useProductStore(state => state.favorites);
  const productLikes = useProductStore(state => state.productLikes);
  const toggleFavorite = useProductStore(state => state.toggleFavorite);
  const toggleProductLike = useProductStore(state => state.toggleProductLike);
  const setSelectedProduct = useProductStore(state => state.setSelectedProduct);
  const incrementApplicants = useProductStore(state => state.incrementApplicants);
  const decrementApplicants = useProductStore(state => state.decrementApplicants);

  const { applications, apply, cancelApplication } = useApplicationStore();
  const { completedReviews } = useReviewStore();

  // 항상 allProducts에서 최신 product를 가져옴
  const product = allProducts.find(p => p.id === id);

  if (!product) {
    navigate('/');
    return null;
  }

  const handleApply = () => {
    if (!userInfo) return;
    const result = apply({
      product: { id: product.id, name: product.name, image: product.image },
      userInfo: { email: userInfo.email, name: userInfo.name, phone: userInfo.phone },
      accessToken,
    });
    if (result) {
      incrementApplicants(product.id);
      setTimeout(() => {
        setSelectedProduct(null);
        navigate('/');
      }, 1500);
    }
  };

  const handleCancel = () => {
    if (!userInfo) return;
    const productId = cancelApplication(product.id, userInfo.email, accessToken);
    if (productId) {
      decrementApplicants(productId);
    }
  };

  return (
    <ProductDetailPage
      product={product}
      onBack={() => navigate(-1)}
      onApply={handleApply}
      isFavorite={favorites.includes(product.id)}
      onToggleFavorite={() => toggleFavorite(product.id, accessToken)}
      isLiked={productLikes.includes(product.id)}
      onToggleLike={() => toggleProductLike(product.id)}
      reviews={completedReviews}
      hasApplied={applications.some(a => a.productId === product.id && a.userEmail === userInfo?.email)}
      canCancel={applications.some(a => a.productId === product.id && a.userEmail === userInfo?.email && a.status === "pending")}
      onCancel={handleCancel}
    />
  );
}
