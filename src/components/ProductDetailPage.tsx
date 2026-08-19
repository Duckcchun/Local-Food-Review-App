import { useState } from "react";
import { ArrowLeft, Heart, ThumbsUp, Share2, Calendar, Users, MapPin } from "lucide-react";
import type { Product } from "../data/mockData";
import type { Review } from "../App";
import { getCategoryName } from "../data/categories";
import { shareContent } from "../utils/share";

interface ProductDetailPageProps {
  product: Product;
  onBack: () => void;
  onApply: () => void;
  onCancel?: () => void;
  isFavorite?: boolean;
  onToggleFavorite?: () => void;
  isLiked?: boolean;
  onToggleLike?: () => void;
  reviews?: Review[];
  hasApplied?: boolean;
  canCancel?: boolean;
}

export function ProductDetailPage({
  product, onBack, onApply, onCancel, isFavorite = false, onToggleFavorite,
  isLiked = false, onToggleLike, reviews = [], hasApplied = false, canCancel = false,
}: ProductDetailPageProps) {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [helpfulReviews, setHelpfulReviews] = useState<Set<string>>(() => {
    try { return new Set(JSON.parse(localStorage.getItem('helpfulReviews') || '[]')); } catch { return new Set(); }
  });
  const productReviews = reviews.filter(r => r.productId === product.id);
  const fillingRate = Math.round((product.currentApplicants / product.requiredReviewers) * 100);

  const toggleHelpful = (reviewId: string) => {
    setHelpfulReviews(prev => {
      const next = new Set(prev);
      if (next.has(reviewId)) { next.delete(reviewId); } else { next.add(reviewId); }
      try { localStorage.setItem('helpfulReviews', JSON.stringify([...next])); } catch {}
      return next;
    });
  };

  return (
    <div className="min-h-screen bg-[#fafaf7] pb-[88px]">
      {/* Hero Image */}
      <div className="relative aspect-[4/3] bg-gray-100">
        {!imageLoaded && <div className="absolute inset-0 bg-gray-100 animate-pulse" />}
        <img
          src={product.image}
          alt={product.name}
          className={`w-full h-full object-cover transition-opacity duration-300 ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
          onLoad={() => setImageLoaded(true)}
          onError={(e) => { (e.target as HTMLImageElement).src = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="400" height="300"><rect fill="%23f3f4f6" width="100%" height="100%"/></svg>'; setImageLoaded(true); }}
        />
        {/* Overlay controls */}
        <div className="absolute top-0 left-0 right-0 flex items-center justify-between p-4">
          <button onClick={onBack} className="w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-sm active:scale-90 transition-transform">
            <ArrowLeft size={20} className="text-gray-800" />
          </button>
          <div className="flex items-center gap-2">
            <button 
              onClick={() => shareContent({ title: product.name, description: product.description, url: window.location.href })}
              className="w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-sm active:scale-90 transition-transform"
            >
              <Share2 size={18} className="text-gray-700" />
            </button>
            <button onClick={onToggleFavorite} className="w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-sm active:scale-90 transition-transform">
              <Heart size={18} fill={isFavorite ? "#f43f5e" : "none"} stroke={isFavorite ? "#f43f5e" : "#374151"} strokeWidth={2} />
            </button>
          </div>
        </div>
      </div>

      {/* Main Info */}
      <div className="px-5 pt-5 pb-4">
        <span className="inline-block text-xs font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded mb-2">
          {getCategoryName(product.category)}
        </span>
        <h1 className="text-xl font-bold text-gray-900 leading-tight mb-1">{product.name}</h1>
        <p className="text-sm text-gray-500 mb-3">{product.seller}</p>
        <p className="text-sm text-gray-700 leading-relaxed mb-4">{product.description}</p>
        <div className="flex items-center gap-4 text-sm text-gray-400">
          <span className="flex items-center gap-1"><MapPin size={14} />{product.location} · {product.distance}</span>
          <button onClick={onToggleLike} className="flex items-center gap-1 hover:text-rose-500 transition-colors">
            <ThumbsUp size={14} fill={isLiked ? "currentColor" : "none"} className={isLiked ? "text-rose-500" : ""} />
            {product.likeCount}
          </button>
        </div>
      </div>

      {/* Divider */}
      <div className="h-px mx-5 bg-gradient-to-r from-transparent via-gray-200 to-transparent my-1" />

      {/* Application Info */}
      <div className="px-5 py-5">
        <h3 className="text-base font-bold text-gray-900 mb-4">모집 정보</h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5 text-sm text-gray-600">
              <Calendar size={16} className="text-gray-400" /><span>신청 기간</span>
            </div>
            <span className="text-sm font-medium text-gray-900">{product.applicationDeadline}</span>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5 text-sm text-gray-600">
              <Users size={16} className="text-gray-400" /><span>모집 인원</span>
            </div>
            <span className="text-sm font-medium text-gray-900">{product.currentApplicants} / {product.requiredReviewers}명</span>
          </div>
          <div className="pt-2">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-xs text-gray-400">모집 진행률</span>
              <span className="text-xs font-semibold text-gray-700">{fillingRate}%</span>
            </div>
            <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
              <div className={`h-full rounded-full transition-all duration-700 ${fillingRate >= 80 ? 'bg-orange-400' : 'bg-emerald-400'}`} style={{ width: `${Math.min(fillingRate, 100)}%` }} />
            </div>
          </div>
        </div>
      </div>

      <div className="h-px mx-5 bg-gradient-to-r from-transparent via-gray-200 to-transparent my-1" />

      {/* Review Mission */}
      <div className="px-5 py-5">
        <h3 className="text-base font-bold text-gray-900 mb-3">리뷰 미션</h3>
        <div className="space-y-2.5">
          {["제품을 체험하고 솔직한 리뷰를 작성해 주세요", "장점, 단점, 개선점을 구체적으로 평가해 주세요", "사진 2장 이상과 함께 작성하면 추가 포인트!"].map((item, i) => (
            <div key={i} className="flex items-start gap-2.5">
              <span className="w-5 h-5 rounded-full bg-emerald-50 text-emerald-600 text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">{i + 1}</span>
              <span className="text-sm text-gray-600 leading-relaxed">{item}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="h-px mx-5 bg-gradient-to-r from-transparent via-gray-200 to-transparent my-1" />

      {/* Reviews */}
      <div className="px-5 py-5">
        <h3 className="text-base font-bold text-gray-900 mb-4">리뷰 <span className="text-emerald-600">{productReviews.length}</span></h3>
        {productReviews.length === 0 ? (
          <div className="py-8 text-center">
            <p className="text-sm text-gray-400">아직 작성된 리뷰가 없습니다</p>
          </div>
        ) : (
          <div className="space-y-4">
            {productReviews.slice(0, 5).map((review) => (
              <div key={review.id} className="pb-4 border-b border-gray-100 last:border-0 last:pb-0">
                <div className="flex items-center gap-2.5 mb-2.5">
                  <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-xs font-bold text-gray-500">
                    {review.userName ? review.userName[0] : 'U'}
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-800">{review.userName || '익명'}</span>
                    <span className="text-xs text-gray-400 ml-2">{new Date(review.createdAt).toLocaleDateString('ko-KR')}</span>
                  </div>
                </div>
                <div className="space-y-1.5 text-sm leading-relaxed">
                  {review.pros && <p className="text-gray-700"><span className="text-emerald-600 font-medium">장점</span> {review.pros}</p>}
                  {review.cons && <p className="text-gray-700"><span className="text-orange-500 font-medium">단점</span> {review.cons}</p>}
                  {review.improvements && <p className="text-gray-700"><span className="text-blue-500 font-medium">개선</span> {review.improvements}</p>}
                </div>
                {review.photos && review.photos.length > 0 && (
                  <div className="mt-2.5 flex gap-1.5 overflow-x-auto no-scrollbar">
                    {review.photos.map((photo, idx) => (
                      <img key={idx} src={photo} alt="" className="w-16 h-16 object-cover rounded-lg shrink-0 bg-gray-100" onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
                    ))}
                  </div>
                )}
                {/* 도움이 돼요 버튼 */}
                <button
                  onClick={() => toggleHelpful(review.id)}
                  className={`mt-3 flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                    helpfulReviews.has(review.id)
                      ? 'bg-[#6b8e6f]/10 text-[#6b8e6f] border border-[#6b8e6f]/30'
                      : 'bg-gray-50 text-gray-500 border border-gray-200 hover:bg-gray-100'
                  }`}
                >
                  <ThumbsUp size={12} fill={helpfulReviews.has(review.id) ? "currentColor" : "none"} />
                  도움이 돼요
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Bottom CTA */}
      <div className="fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-md border-t border-gray-100 z-20 pb-[env(safe-area-inset-bottom)] shadow-[0_-4px_16px_rgba(0,0,0,0.06)]">
        <div className="max-w-md mx-auto px-5 py-3">
          {hasApplied ? (
            canCancel ? (
              <button onClick={onCancel} className="w-full h-[52px] bg-gray-100 text-gray-700 rounded-xl font-semibold text-base hover:bg-gray-200 active:scale-[0.98] transition-all">
                신청 취소하기
              </button>
            ) : (
              <button disabled className="w-full h-[52px] bg-gray-100 text-gray-400 rounded-xl font-semibold text-base cursor-not-allowed">
                ✓ 신청 완료
              </button>
            )
          ) : (
            <button onClick={onApply} className="w-full h-[52px] bg-[#f5a145] text-white rounded-xl font-semibold text-base hover:bg-[#e89535] active:scale-[0.98] transition-all">
              체험단 신청하기
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
