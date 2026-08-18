import { useNavigate } from 'react-router-dom';
import { BusinessDashboard } from '../components/BusinessDashboard';
import { useProductStore } from '../stores/productStore';
import { useApplicationStore } from '../stores/applicationStore';
import { useReviewStore } from '../stores/reviewStore';

export default function BusinessDashboardPage() {
  const navigate = useNavigate();
  const { businessProducts } = useProductStore();
  const { applications } = useApplicationStore();
  const { completedReviews } = useReviewStore();

  return (
    <BusinessDashboard
      onBack={() => navigate(-1)}
      products={businessProducts}
      applications={applications}
      reviews={completedReviews}
    />
  );
}
