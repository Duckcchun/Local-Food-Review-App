import { useNavigate } from 'react-router-dom';
import { ReviewPage as ReviewPageComponent } from '../components/ReviewPage';
import { useAuthStore } from '../stores/authStore';
import { useApplicationStore } from '../stores/applicationStore';
import { useReviewStore } from '../stores/reviewStore';
import { useProductStore } from '../stores/productStore';
import type { Product } from '../data/mockData';

export default function ReviewPage() {
  const navigate = useNavigate();
  const { userInfo } = useAuthStore();
  const { applications } = useApplicationStore();
  const { completedReviews } = useReviewStore();
  const { setSelectedProduct } = useProductStore();

  if (!userInfo) return null;

  const handleSelectProduct = (product: Product) => {
    setSelectedProduct(product);
    navigate(`/review/write/${product.id}`);
  };

  return (
    <ReviewPageComponent
      applications={applications}
      completedReviews={completedReviews}
      onSelectProduct={handleSelectProduct}
      userName={userInfo.name}
    />
  );
}
