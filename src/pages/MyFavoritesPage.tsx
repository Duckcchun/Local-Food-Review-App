import { useNavigate } from 'react-router-dom';
import { MyFavoritesPage as MyFavoritesComponent } from '../components/MyFavoritesPage';
import { useProductStore } from '../stores/productStore';
import { useFavorites } from '../hooks/useFavorites';
import type { Product } from '../data/mockData';

export default function MyFavoritesPage() {
  const navigate = useNavigate();
  const { allProducts, setSelectedProduct } = useProductStore();
  const { favorites, handleToggleFavorite } = useFavorites();

  const favoriteProducts = favorites
    .map(id => allProducts.find(p => p.id === id))
    .filter(Boolean) as Product[];

  const handleProductClick = (product: Product) => {
    setSelectedProduct(product);
    navigate(`/products/${product.id}`);
  };

  return (
    <MyFavoritesComponent
      onBack={() => navigate(-1)}
      favorites={favoriteProducts}
      onProductClick={handleProductClick}
      onToggleFavorite={handleToggleFavorite}
    />
  );
}
