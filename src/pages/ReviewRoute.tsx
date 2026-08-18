import { useNavigate } from 'react-router-dom';
import { ReviewPage } from '../components/ReviewPage';
import { useAuthStore } from '../stores/authStore';
import { useApplicationStore } from '../stores/applicationStore';
import { useReviewStore } from '../stores/reviewStore';
import { useProductStore } from '../stores/productStore';

export function ReviewRoute() {
  const navigate = useNavigate();
  const { userInfo } = useAuthStore();
  const { applications } = useApplicationStore();
  const { completedReviews } = useReviewStore();
  const { setSelectedProduct } = useProductStore();

  if (!userInfo || userInfo.userType !== "reviewer") return null;

  const handleSelectProduct = (product: any) => {
    setSelectedProduct(product);
    navigate('/review-write');
  };

  return (
    <ReviewPage
      applications={applications}
      completedReviews={completedReviews}
      onSelectProduct={handleSelectProduct}
      userName={userInfo.name}
    />
  );
}
