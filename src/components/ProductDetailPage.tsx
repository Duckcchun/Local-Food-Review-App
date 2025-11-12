import { ArrowLeft, MapPin, Heart, ThumbsUp, Share2, Calendar, Users } from "lucide-react";
// Simple ImageWithFallback component to avoid missing module error
function ImageWithFallback({
  src,
  alt,
  className,
  ...props
}: {
  src: string;
  alt?: string;
  className?: string;
  [key: string]: any;
}) {
  const handleError = (e: any) => {
    const target = e.currentTarget as HTMLImageElement;
    if (!target.dataset.fallbackApplied) {
      target.dataset.fallbackApplied = "true";
      // Update this path to a real local fallback image if you have one
      target.src = "/images/fallback.png";
    }
  };

  return <img src={src} alt={alt} className={className} onError={handleError} {...props} />;
}
import type { Product } from "../data/mockData";

interface ProductDetailPageProps {
  product: Product;
  onBack: () => void;
  onApply: () => void;
  isFavorite?: boolean;
  onToggleFavorite?: () => void;
}

export function ProductDetailPage({ product, onBack, onApply, isFavorite = false, onToggleFavorite }: ProductDetailPageProps) {
  const handleFavoriteClick = () => {
    if (onToggleFavorite) {
      onToggleFavorite();
    }
  };

  return (
    <div className="min-h-screen bg-[#fffef5] pb-32">
      {/* Header */}
      <div className="sticky top-0 bg-white border-b-2 border-[#d4c5a0] z-10">
        <div className="max-w-md mx-auto px-6 py-4 flex items-center justify-between">
          <button onClick={onBack} className="text-[#2d3e2d] hover:text-[#6b8e6f] transition-colors">
            <ArrowLeft size={24} />
          </button>
          <h4 className="text-[#2d3e2d]">체험단 상세</h4>
          <button 
            onClick={handleFavoriteClick}
            className="text-[#f5a145] hover:scale-110 transition-transform"
          >
            <Heart size={24} fill={isFavorite ? "#f5a145" : "none"} stroke="#f5a145" />
          </button>
        </div>
      </div>

      <div className="max-w-md mx-auto">
        {/* Product Image */}
        <div className="aspect-4/3 relative bg-[#f5f0dc]">
          <ImageWithFallback
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Product Info */}
        <div className="px-6 py-6 bg-white">
          <h2 className="text-[#2d3e2d] mb-4">{product.name}</h2>
          
          <div className="flex items-center gap-3 mb-4">
            <span className="text-[#6b8e6f]">리뷰 {product.reviewCount}개</span>
          </div>

          <p className="text-[#2d3e2d] mb-6">{product.description}</p>

          {/* Location & Stats */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="flex items-center gap-2 text-[#6b8e6f]">
              <MapPin size={20} />
              <span>{product.location}</span>
            </div>
            <div className="flex items-center gap-2 text-[#6b8e6f]">
              <span className="text-[#2d3e2d]">{product.distance}</span>
            </div>
          </div>

          {/* Application Info */}
          <div className="bg-[#f5f0dc] rounded-[1rem] p-4 mb-4">
            <div className="flex items-start gap-3 mb-3">
              <Calendar size={20} className="text-[#6b8e6f] mt-1" />
              <div>
                <div className="text-sm text-[#9ca89d] mb-1">신청 기간</div>
                <div className="text-[#2d3e2d]">{product.applicationDeadline}</div>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Users size={20} className="text-[#6b8e6f] mt-1" />
              <div>
                <div className="text-sm text-[#9ca89d] mb-1">모집 현황</div>
                <div className="text-[#2d3e2d]">
                  {product.currentApplicants} / {product.requiredReviewers}명
                </div>
              </div>
            </div>
          </div>

          {/* Review Mission */}
          <div className="border-2 border-[#6b8e6f] rounded-[1rem] p-4 mb-6">
            <h4 className="text-[#2d3e2d] mb-3">리뷰 미션</h4>
            <ul className="space-y-2 text-sm text-[#6b8e6f]">
              <li className="flex items-start gap-2">
                <span className="text-[#f5a145]">•</span>
                <span>제품을 맛보고 솔직하게 리뷰를 작성해 주세요</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#f5a145]">•</span>
                <span>장점, 단점, 개선점을 상세히 평가해 주세요</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#f5a145]">•</span>
                <span>사진과 함께 리뷰를 작성하면 더 좋아요</span>
              </li>
            </ul>
          </div>

          {/* Seller Info */}
          <div className="mb-6">
            <h4 className="text-[#2d3e2d] mb-3">판매자 정보</h4>
            <div className="bg-[#f5f0dc] rounded-[1rem] p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[#2d3e2d]">{product.seller}</span>
                <div className="flex gap-2">
                  <button className="text-[#f5a145] hover:scale-110 transition-transform">
                    <Heart size={20} />
                  </button>
                  <button className="text-[#6b8e6f] hover:scale-110 transition-transform">
                    <Share2 size={20} />
                  </button>
                </div>
              </div>
              <div className="text-sm text-[#6b8e6f]">{product.category}</div>
            </div>
          </div>

          {/* Stats */}
          <div className="flex items-center justify-around py-4 border-t-2 border-[#d4c5a0]">
            <div className="text-center">
              <div className="flex items-center justify-center gap-1 mb-1">
                <ThumbsUp size={20} fill="#6b8e6f" stroke="#6b8e6f" />
                <span className="text-[#2d3e2d]">{product.likeCount}</span>
              </div>
              <div className="text-sm text-[#9ca89d]">좋아요</div>
            </div>
            <div className="w-px h-12 bg-[#d4c5a0]"></div>
            <div className="text-center">
              <div className="text-[#2d3e2d] mb-1">{product.reviewCount}</div>
              <div className="text-sm text-[#9ca89d]">리뷰 수</div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom CTA */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t-2 border-[#6b8e6f] z-20">
        <div className="max-w-md mx-auto px-6 py-4">
          <button
            onClick={onApply}
            className="w-full bg-[#f5a145] text-white py-4 rounded-[1rem] hover:bg-[#e89535] transition-colors text-center"
          >
            체험단 신청하기
          </button>
        </div>
      </div>
    </div>
  );
}