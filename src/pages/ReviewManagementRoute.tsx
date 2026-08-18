import { useNavigate } from 'react-router-dom';
import { ReviewManagementPage } from '../components/ReviewManagementPage';
import { useReviewStore } from '../stores/reviewStore';

export function ReviewManagementRoute() {
  const navigate = useNavigate();
  const { completedReviews, toggleReviewVisibility, reportReview } = useReviewStore();

  return (
    <ReviewManagementPage
      onBack={() => navigate(-1)}
      reviews={completedReviews}
      onToggleVisibility={toggleReviewVisibility}
      onReportReview={reportReview}
    />
  );
}
