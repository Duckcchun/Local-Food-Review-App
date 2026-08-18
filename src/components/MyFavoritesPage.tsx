import { ArrowLeft, Heart } from "lucide-react";
import { ProductCard } from "./ProductCard";
import type { Product } from "../data/mockData";
import { NoFavoritesIllustration } from "./common/EmptyStateIllustrations";

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
          <div className="text-center py-12">
            <NoFavoritesIllustration className="mx-auto mb-6" />
            <h3 className="text-lg font-bold text-[#2d3e2d] mb-2">찜한 체험단이 없어요</h3>
            <p className="text-sm text-[#9ca89d] mb-6 max-w-xs mx-auto">
              하트를 눌러 마음에 드는 체험단을<br />찜 목록에 저장해보세요!
            </p>
            <button
              onClick={onBack}
              className="bg-gradient-to-r from-[#6b8e6f] to-[#8fa893] text-white px-6 py-3 rounded-[1.5rem] hover:opacity-90 transition-opacity shadow-md"
            >
              체험단 둘러보기
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
