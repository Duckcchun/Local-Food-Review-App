import { useNavigate } from 'react-router-dom';
import { EditReviewPage } from '../components/EditReviewPage';
import { useProductStore } from '../stores/productStore';

export function EditReviewRoute() {
  const navigate = useNavigate();
  const { selectedProduct } = useProductStore();

  if (!selectedProduct) {
    navigate('/profile');
    return null;
  }

  return (
    <EditReviewPage
      review={{
        id: selectedProduct.id,
        productName: selectedProduct.name,
        productImage: selectedProduct.image,
        comment: selectedProduct.description,
        date: "2025.11.08"
      }}
      onBack={() => navigate(-1)}
    />
  );
}
