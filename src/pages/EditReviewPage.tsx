import { useNavigate, useParams } from 'react-router-dom';
import { EditReviewPage as EditReviewComponent } from '../components/EditReviewPage';
import { useProductStore } from '../stores/productStore';

export default function EditReviewPage() {
  const navigate = useNavigate();
  const { reviewId } = useParams<{ reviewId: string }>();
  const { selectedProduct } = useProductStore();

  // For now, reuse selectedProduct as the review context
  if (!selectedProduct) {
    navigate('/profile', { replace: true });
    return null;
  }

  return (
    <EditReviewComponent
      review={{
        id: selectedProduct.id,
        productName: selectedProduct.name,
        productImage: selectedProduct.image,
        comment: selectedProduct.description,
        date: "2025.11.08",
      }}
      onBack={() => navigate(-1)}
    />
  );
}
