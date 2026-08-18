import { useNavigate } from 'react-router-dom';
import { ReviewWritePage } from '../components/ReviewWritePage';
import { useAuthStore } from '../stores/authStore';
import { useProductStore } from '../stores/productStore';
import { useReviewStore } from '../stores/reviewStore';
import { usePointStore } from '../stores/pointStore';
import { toast } from 'sonner';
import type { Review } from '../types';

export function ReviewWriteRoute() {
  const navigate = useNavigate();
  const { userInfo, accessToken } = useAuthStore();
  const { selectedProduct, setSelectedProduct, incrementReviewCount } = useProductStore();
  const { submitReview } = useReviewStore();
  const { earnPoints } = usePointStore();

  if (!selectedProduct || !userInfo) {
    navigate('/review');
    return null;
  }

  const handleSubmit = (reviewData: Omit<Review, "id" | "createdAt">) => {
    submitReview(reviewData, accessToken);
    incrementReviewCount(reviewData.productId);

    // Calculate points
    const basePoints = 500;
    earnPoints(basePoints, "리뷰 작성", "리뷰");
    toast.success(`리뷰가 등록되었습니다! +${basePoints}P 적립`);

    setTimeout(() => {
      setSelectedProduct(null);
      navigate('/review');
    }, 1500);
  };

  return (
    <ReviewWritePage
      product={selectedProduct}
      onBack={() => navigate(-1)}
      userName={userInfo.name}
      onSubmit={handleSubmit}
    />
  );
}
