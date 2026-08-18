import { useNavigate, useParams } from 'react-router-dom';
import { ManageApplicantsPage as ManageApplicantsComponent } from '../components/ManageApplicantsPage';
import { useProductStore } from '../stores/productStore';
import { useApplicationStore } from '../stores/applicationStore';
import { useProducts } from '../hooks/useProducts';
import type { Product } from '../data/mockData';

export default function ManageApplicantsPage() {
  const navigate = useNavigate();
  const { productId } = useParams<{ productId: string }>();
  const { allProducts, selectedProduct, setSelectedProduct } = useProductStore();
  const { applications } = useApplicationStore();
  const { handleUpdateApplicationStatus } = useProducts();

  const product = selectedProduct || allProducts.find(p => p.id === productId);

  if (!product) {
    navigate('/', { replace: true });
    return null;
  }

  const handleProductClick = (p: Product) => {
    setSelectedProduct(p);
    navigate(`/products/${p.id}`);
  };

  return (
    <ManageApplicantsComponent
      onBack={() => navigate(-1)}
      applications={applications}
      onProductClick={handleProductClick}
      onUpdateStatus={handleUpdateApplicationStatus}
      selectedProduct={product}
      product={product}
    />
  );
}
