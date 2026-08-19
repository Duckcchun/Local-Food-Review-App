import { FileText, ChevronRight } from "lucide-react";
import type { Application, Review } from "../App";
import { ImageWithFallback } from "../figma/ImageWithFallback";
import { Logo } from "./Logo";

interface ReviewPageProps {
  applications: Application[];
  completedReviews: Review[];
  onSelectProduct: (product: any) => void;
  userName?: string;
}

export function ReviewPage({ applications, completedReviews, onSelectProduct, userName = "회원" }: ReviewPageProps) {
  // Filter applications that are accepted and need reviews (not yet reviewed)
  const acceptedApplications = applications.filter(app => app.status === "accepted");
  const reviewedProductIds = new Set(completedReviews.map(r => r.productId));
  const needsReview = acceptedApplications.filter(app => !reviewedProductIds.has(app.productId));

  return (
    <div className="min-h-screen bg-[#fafaf7] pb-24">
      {/* Header */}
  <div className="bg-gradient-to-br from-[#6b8e6f] via-[#7a9a7e] to-[#8fa893] pt-8 pb-14">
        <div className="max-w-md mx-auto px-6">
          <Logo className="mb-6" variant="white" />
          <h1 className="text-white mb-2">
            리뷰 작성
          </h1>
          <p className="text-white/80 text-sm">
            체험한 제품의 솔직한 리뷰를 남겨주세요
          </p>
        </div>
      </div>

      <div className="max-w-md mx-auto px-6 -mt-8">
        {/* Stats Card */}
        <div className="bg-white rounded-2xl p-6 mb-5 border border-gray-100 shadow-[0_4px_20px_rgba(0,0,0,0.06)]">
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-[#f5a145] mb-0.5">{needsReview.length}</div>
              <div className="text-xs text-gray-400">작성 대기</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-[#6b8e6f] mb-0.5">{completedReviews.length}</div>
              <div className="text-xs text-gray-400">작성 완료</div>
            </div>
          </div>
        </div>

        {/* Needs Review Section */}
        {needsReview.length > 0 && (
          <div className="mb-6">
            <h2 className="text-[#2d3e2d] text-[15px] font-semibold mb-4">리뷰 작성 대기중</h2>
            <div className="space-y-3">
              {needsReview.map((app) => (
                <button
                  key={app.productId}
                  onClick={() => onSelectProduct({ id: app.productId, name: app.productName, image: app.productImage })}
                  className="w-full bg-white rounded-2xl p-5 border border-gray-100 shadow-sm hover:shadow-md hover:border-[#f5a145]/40 transition-all text-left"
                >
                  <div className="flex gap-4 mb-3">
                    <div className="w-[72px] h-[72px] rounded-xl overflow-hidden bg-gray-100 shrink-0">
                      <ImageWithFallback
                        src={app.productImage}
                        alt={app.productName}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-[#2d3e2d] text-sm font-semibold mb-1">{app.productName}</h3>
                      <p className="text-xs text-gray-400 mb-2">{app.userName}</p>
                      <span className="text-[11px] px-2.5 py-1 rounded-full bg-[#6b8e6f]/10 text-[#6b8e6f] font-medium">
                        체험 완료
                      </span>
                    </div>
                    <ChevronRight size={20} className="text-gray-300 shrink-0 mt-1" />
                  </div>

                  <div className="bg-[#fff8ed] rounded-xl px-4 py-3 flex items-center justify-between">
                    <span className="text-xs font-medium text-[#f5a145]">리뷰 작성하고 포인트 받기</span>
                    <span className="text-sm font-bold text-[#f5a145]">+500P</span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Completed Section */}
        {completedReviews.length > 0 && (
          <div className="mb-6">
            <h2 className="text-[#2d3e2d] text-[15px] font-semibold mb-4">작성 완료</h2>
            <div className="space-y-3">
              {completedReviews.map((review) => (
                <div
                  key={review.id}
                  className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm opacity-60"
                >
                  <div className="flex gap-4">
                    <div className="w-[72px] h-[72px] rounded-xl overflow-hidden bg-gray-100 shrink-0">
                      <ImageWithFallback
                        src={review.productImage}
                        alt={review.productName}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-[#2d3e2d] text-sm font-semibold mb-1">{review.productName}</h3>
                      <p className="text-xs text-gray-400 mb-2">작성일: {review.createdAt.split('T')[0]}</p>
                      <span className="text-[11px] px-2.5 py-1 rounded-full bg-[#6b8e6f]/10 text-[#6b8e6f] font-medium">
                        리뷰 작성 완료
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Empty State */}
        {needsReview.length === 0 && completedReviews.length === 0 && (
          <div className="text-center py-16">
            <div className="w-20 h-20 mx-auto mb-5 bg-gray-50 rounded-2xl flex items-center justify-center">
              <FileText size={36} className="text-gray-300" />
            </div>
            <h3 className="text-[#2d3e2d] text-base font-semibold mb-2">작성할 리뷰가 없어요</h3>
            <p className="text-sm text-gray-400">
              체험단에 신청하고 제품을 체험해보세요!
            </p>
          </div>
        )}

        {/* Info Box */}
        <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
          <h4 className="text-[#2d3e2d] text-sm font-semibold mb-3 flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-amber-50 flex items-center justify-center text-xs">💡</span>
            리뷰 작성 TIP
          </h4>
          <ul className="text-sm text-gray-500 space-y-1.5">
            <li className="flex items-start gap-2"><span className="text-[#6b8e6f] mt-0.5">•</span>장점, 단점, 개선점을 구체적으로 작성해주세요</li>
            <li className="flex items-start gap-2"><span className="text-[#6b8e6f] mt-0.5">•</span>음식 사진과 함께 작성하면 더 좋아요</li>
            <li className="flex items-start gap-2"><span className="text-[#6b8e6f] mt-0.5">•</span>솔직한 리뷰가 사업자님께 큰 도움이 됩니다</li>
          </ul>
        </div>
      </div>
    </div>
  );
}