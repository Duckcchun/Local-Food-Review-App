import { useNavigate } from 'react-router-dom';
import { MyApplicationsPage } from '../components/MyApplicationsPage';
import { useApplicationStore } from '../stores/applicationStore';
import { useProductStore } from '../stores/productStore';

export function MyApplicationsRoute() {
  const navigate = useNavigate();
  const { applications } = useApplicationStore();
  const { setSelectedProduct } = useProductStore();

  const handleProductClick = (product: any) => {
    setSelectedProduct(product);
    navigate(`/product/${product.id}`);
  };

  return (
    <MyApplicationsPage
      onBack={() => navigate('/profile')}
      applications={applications}
      onProductClick={handleProductClick}
    />
  );
}
