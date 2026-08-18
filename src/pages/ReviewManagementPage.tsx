import { useNavigate } from 'react-router-dom';
import { ReviewManagementPage as ReviewManagementComponent } from '../components/ReviewManagementPage';
import { useReviewStore } from '../stores/reviewStore';
import { toast } from 'sonner';

export default function ReviewManagementPage() {
  const navigate = useNavigate();
  const { completedReviews, reportReview, toggleVisibility } = useReviewStore();

  const handleToggleVisibility = (reviewId: string) => {
    const review = completedReviews.find(r => r.id === reviewId);
    toggleVisibility(reviewId);
    if (review) {
      if (review.status === "published") {
        toast.success("리뷰가 비공개 처리되었습니다");
      } else {
        toast.success("리뷰가 공개 처리되었습니다");
      }
    }
  };

  const handleReportReview = (reviewId: string, reason: string) => {
    reportReview(reviewId, reason);
    toast.success("리뷰가 신고되었습니다. 검토 후 조치하겠습니다");
  };

  return (
    <ReviewManagementComponent
      onBack={() => navigate(-1)}
      reviews={completedReviews}
      onToggleVisibility={handleToggleVisibility}
      onReportReview={handleReportReview}
    />
  );
}
