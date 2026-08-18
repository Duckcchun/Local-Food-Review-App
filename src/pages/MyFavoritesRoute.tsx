import { useNavigate } from 'react-router-dom';
import { MyFavoritesPage } from '../components/MyFavoritesPage';
import { useAuthStore } from '../stores/authStore';
import { useProductStore } from '../stores/productStore';
import type { Product } from '../data/mockData';

export function MyFavoritesRoute() {
  const navigate = useNavigate();
  const { accessToken } = useAuthStore();
  const { favorites, allProducts, toggleFavorite, setSelectedProduct } = useProductStore();

  const handleProductClick = (product: Product) => {
    setSelectedProduct(product);
    navigate(`/product/${product.id}`);
  };

  return (
    <MyFavoritesPage
      onBack={() => navigate('/profile')}
      favorites={favorites.map(id => allProducts.find(p => p.id === id)).filter(Boolean) as Product[]}
      onProductClick={handleProductClick}
      onToggleFavorite={(productId) => toggleFavorite(productId, accessToken)}
    />
  );
}
