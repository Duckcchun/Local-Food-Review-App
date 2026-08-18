import { useState } from "react";
import { MapPin, Heart, Users, Clock } from "lucide-react";
import type { Product } from "../data/mockData";
import { getProductStats } from "../utils/sortUtils";

interface ProductCardProps {
  product: Product;
  onClick: () => void;
  isFavorite?: boolean;
  onToggleFavorite?: () => void;
}

export function ProductCard({ product, onClick, isFavorite = false, onToggleFavorite }: ProductCardProps) {
  const [imageLoaded, setImageLoaded] = useState(false);

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onToggleFavorite?.();
  };

  const { daysUntilDeadline, fillingRate } = getProductStats(product);
  const isUrgent = daysUntilDeadline <= 3 && daysUntilDeadline > 0;
  const isAlmostFull = fillingRate >= 80;

  return (
    <div
      onClick={onClick}
      className="bg-white rounded-[1rem] overflow-hidden cursor-pointer shadow-[0_2px_12px_rgba(0,0,0,0.06)] transition-all duration-200 hover:shadow-[0_4px_20px_rgba(0,0,0,0.1)] active:scale-[0.98]"
    >
      {/* Image Section */}
      <div className="relative aspect-[16/10] overflow-hidden bg-[#f3f4f6]">
        {!imageLoaded && (
          <div className="absolute inset-0 bg-[#f3f4f6] animate-pulse" />
        )}
        <img
          src={product.image}
          alt={product.name}
          className={`w-full h-full object-cover transition-opacity duration-300 ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
          onLoad={() => setImageLoaded(true)}
          onError={(e) => { (e.target as HTMLImageElement).src = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="400" height="250"><rect fill="%23f3f4f6" width="100%" height="100%"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" fill="%239ca3af" font-size="16">이미지 없음</text></svg>'; setImageLoaded(true); }}
        />

        {/* Top badges */}
        <div className="absolute top-3 left-3 flex items-center gap-1.5">
          {product.badge && (
            <span className="bg-[#2d3e2d]/80 backdrop-blur-sm text-white text-[11px] font-medium px-2.5 py-1 rounded-[0.375rem]">
              {product.badge}
            </span>
          )}
          {isUrgent && (
            <span className="bg-[#ef4444]/90 backdrop-blur-sm text-white text-[11px] font-medium px-2.5 py-1 rounded-[0.375rem] flex items-center gap-1">
              <Clock size={11} />
              D-{daysUntilDeadline}
            </span>
          )}
          {isAlmostFull && !isUrgent && (
            <span className="bg-[#f97316]/90 backdrop-blur-sm text-white text-[11px] font-medium px-2.5 py-1 rounded-[0.375rem]">
              🔥 {Math.round(fillingRate)}%
            </span>
          )}
        </div>

        {/* Favorite button */}
        {onToggleFavorite && (
          <button
            onClick={handleFavoriteClick}
            className="absolute top-3 right-3 w-8 h-8 flex items-center justify-center bg-white/90 backdrop-blur-sm rounded-full shadow-md active:scale-90 transition-transform"
          >
            <Heart
              size={18}
              fill={isFavorite ? "#f43f5e" : "none"}
              stroke={isFavorite ? "#f43f5e" : "#9ca3af"}
              strokeWidth={2}
            />
          </button>
        )}
      </div>

      {/* Content Section */}
      <div className="px-4 py-3.5">
        {/* Title + Seller */}
        <div className="mb-2">
          <h3 className="text-[15px] font-bold text-[#1f2937] leading-tight mb-0.5 line-clamp-1">
            {product.name}
          </h3>
          <p className="text-[13px] text-[#6b7280]">{product.seller}</p>
        </div>

        {/* Description */}
        <p className="text-[13px] text-[#4b5563] leading-relaxed line-clamp-1 mb-3">
          {product.description}
        </p>

        {/* Progress bar */}
        <div className="mb-3">
          <div className="h-1.5 bg-[#f3f4f6] rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-500 ${
                fillingRate >= 80 ? 'bg-[#fb923c]' : fillingRate >= 50 ? 'bg-[#34d399]' : 'bg-[#6ee7b7]'
              }`}
              style={{ width: `${Math.min(fillingRate, 100)}%` }}
            />
          </div>
        </div>

        {/* Bottom meta row */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 text-[12px] text-[#9ca3af]">
            <span className="flex items-center gap-1">
              <MapPin size={13} />
              {product.distance}
            </span>
            <span className="flex items-center gap-1">
              <Users size={13} />
              {product.currentApplicants}/{product.requiredReviewers}
            </span>
          </div>
          <div className="flex items-center gap-2 text-[12px]">
            <span className="text-[#9ca3af]">리뷰 {product.reviewCount}</span>
            <span className="text-[#fb7185]">♥ {product.likeCount}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
