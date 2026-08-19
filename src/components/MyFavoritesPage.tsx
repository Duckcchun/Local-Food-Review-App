import { ArrowLeft, Heart } from "lucide-react";
import { ProductCard } from "./ProductCard";
import { EmptyState } from "./common/EmptyState";
import type { Product } from "../data/mockData";

interface MyFavoritesPageProps {
  onBack: () => void;
  favorites: Product[];
  onProductClick: (product: Product) => void;
  onToggleFavorite: (productId: string) => void;
}

export function MyFavoritesPage({ onBack, favorites, onProductClick, onToggleFavorite }: MyFavoritesPageProps) {
  return (
    <div className="min-h-screen bg-[#fafaf7] pb-20">
      {/* Header */}
      <div className="sticky top-0 bg-white/95 backdrop-blur-md border-b border-gray-100 z-10 shadow-[0_1px_3px_rgba(0,0,0,0.03)]">
        <div className="max-w-md mx-auto px-5 h-14 flex items-center justify-between">
          <button onClick={onBack} className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors">
            <ArrowLeft size={20} className="text-gray-800" />
          </button>
          <h4 className="text-[15px] font-semibold text-gray-900">찜한 체험단</h4>
          <div className="w-9"></div>
        </div>
      </div>

      <div className="max-w-md mx-auto px-5 py-5">
        {/* Count */}
        <div className="flex items-center gap-2 mb-5">
          <Heart size={18} className="text-[#f5a145]" fill="#f5a145" />
          <span className="text-sm text-gray-700">
            찜한 체험단 <span className="font-bold text-[#f5a145]">{favorites.length}</span>개
          </span>
        </div>

        {/* Favorites List */}
        {favorites.length > 0 ? (
          <div className="grid gap-3.5">
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
          <EmptyState
            icon="💛"
            title="찜한 체험단이 없어요"
            description="마음에 드는 체험단을 찜해보세요"
            actionLabel="체험단 둘러보기"
            onAction={onBack}
          />
        )}
      </div>
    </div>
  );
}
