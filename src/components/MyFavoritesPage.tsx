import { ArrowLeft, Heart } from "lucide-react";
import { ProductCard } from "./ProductCard";
import type { Product } from "../data/mockData";

interface MyFavoritesPageProps {
  onBack: () => void;
  favorites: Product[];
  onProductClick: (product: Product) => void;
  onToggleFavorite: (productId: string) => void;
}

export function MyFavoritesPage({ onBack, favorites, onProductClick, onToggleFavorite }: MyFavoritesPageProps) {
  return (
    <div className="min-h-screen bg-[#fffef5] pb-24">
      {/* Header */}
      <div className="sticky top-0 bg-white border-b-2 border-[#d4c5a0] z-10">
        <div className="max-w-md mx-auto px-6 py-4 flex items-center justify-between">
          <button onClick={onBack} className="text-[#2d3e2d] hover:text-[#6b8e6f] transition-colors">
            <ArrowLeft size={24} />
          </button>
          <h4 className="text-[#2d3e2d]">찜한 체험단</h4>
          <div className="w-6"></div>
        </div>
      </div>

      <div className="max-w-md mx-auto px-6 py-6">
        {/* Count */}
        <div className="flex items-center gap-2 mb-6">
          <Heart size={20} className="text-[#f5a145]" fill="#f5a145" />
          <span className="text-[#2d3e2d]">
            찜한 체험단 <span className="text-[#f5a145]">{favorites.length}</span>개
          </span>
        </div>

        {/* Favorites List */}
        {favorites.length > 0 ? (
          <div className="grid gap-4">
            {favorites.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onClick={() => onProductClick(product)}
                isFavorite={true}
                onToggleFavorite={() => onToggleFavorite(product.id)}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">💛</div>
            <h3 className="text-[#2d3e2d] mb-2">찜한 체험단이 없어요</h3>
            <p className="text-sm text-[#9ca89d] mb-6">
              마음에 드는 체험단을 찜해보세요
            </p>
            <button
              onClick={onBack}
              className="bg-[#f5a145] text-white px-6 py-3 rounded-[1rem] hover:bg-[#e89535] transition-colors"
            >
              체험단 둘러보기
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
