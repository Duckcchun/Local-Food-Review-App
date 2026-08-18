import { useNavigate } from 'react-router-dom';
import { MyApplicationsPage as MyApplicationsComponent } from '../components/MyApplicationsPage';
import { useApplicationStore } from '../stores/applicationStore';
import { useProductStore } from '../stores/productStore';
import type { Product } from '../data/mockData';

export default function MyApplicationsPage() {
  const navigate = useNavigate();
  const { applications } = useApplicationStore();
  const { setSelectedProduct } = useProductStore();

  const handleProductClick = (product: Product) => {
    setSelectedProduct(product);
    navigate(`/products/${product.id}`);
  };

  return (
    <MyApplicationsComponent
      onBack={() => navigate(-1)}
      applications={applications}
      onProductClick={handleProductClick}
    />
  );
}
