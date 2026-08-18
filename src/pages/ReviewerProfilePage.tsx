import { useNavigate, useParams } from 'react-router-dom';
import { ReviewerProfile } from '../components/ReviewerProfile';
import { useAuthStore } from '../stores/authStore';
import { useReviewStore } from '../stores/reviewStore';
import { usePointStore } from '../stores/pointStore';

/**
 * Public reviewer profile page.
 * Accessible at /reviewer/:userId
 * Shows the reviewer's public stats and review history.
 */
export default function ReviewerProfilePage() {
  const navigate = useNavigate();
  const { userId } = useParams<{ userId: string }>();
  const { userInfo } = useAuthStore();
  const { completedReviews } = useReviewStore();
  const { userPoints, userLevel } = usePointStore();

  // For now, only own profile is viewable (expandable to other users via API)
  const isOwnProfile = !userId || userId === userInfo?.email;

  const reviewerData = {
    name: userInfo?.name || '리뷰어',
    email: userInfo?.email || '',
    joinDate: '2024.11',
    profileImage: undefined,
  };

  // Filter reviews by this reviewer
  const reviewerReviews = completedReviews.filter(r =>
    isOwnProfile ? true : r.userId === userId
  );

  return (
    <ReviewerProfile
      onBack={() => navigate(-1)}
      reviewer={reviewerData}
      reviews={reviewerReviews}
      points={userPoints}
      level={userLevel}
      isOwnProfile={isOwnProfile}
    />
  );
}
