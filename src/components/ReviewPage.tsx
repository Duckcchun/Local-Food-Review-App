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
    <div className="min-h-screen bg-[#fffef5] pb-24">
      {/* Header */}
  <div className="bg-linear-to-br from-[#6b8e6f] to-[#8fa893] pt-8 pb-12">
        <div className="max-w-md mx-auto px-6">
          <Logo className="mb-6" variant="white" />
          <h1 className="text-white mb-2">
            리뷰 작성
          </h1>
          <p className="text-white opacity-90">
            체험한 제품의 솔직한 리뷰를 남겨주세요
          </p>
        </div>
      </div>

      <div className="max-w-md mx-auto px-6 -mt-6">
        {/* Stats Card */}
        <div className="bg-white rounded-[1.5rem] p-6 mb-6 border-2 border-[#d4c5a0] shadow-lg">
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center">
              <div className="text-2xl text-[#f5a145] mb-1">{needsReview.length}</div>
              <div className="text-sm text-[#9ca89d]">작성 대기</div>
            </div>
            <div className="text-center">
              <div className="text-2xl text-[#6b8e6f] mb-1">{completedReviews.length}</div>
              <div className="text-sm text-[#9ca89d]">작성 완료</div>
            </div>
          </div>
        </div>

        {/* Needs Review Section */}
        {needsReview.length > 0 && (
          <div className="mb-6">
            <h2 className="text-[#2d3e2d] mb-4">리뷰 작성 대기중</h2>
            <div className="space-y-3">
              {needsReview.map((app) => (
                <button
                  key={app.productId}
                  onClick={() => onSelectProduct({ id: app.productId, name: app.productName, image: app.productImage })}
                  className="w-full bg-white rounded-[1.5rem] p-5 border-2 border-[#d4c5a0] hover:border-[#f5a145] transition-colors text-left"
                >
                  <div className="flex gap-4 mb-3">
                    <div className="w-20 h-20 rounded-[1rem] overflow-hidden bg-[#f5f0dc] shrink-0">
                      <ImageWithFallback
                        src={app.productImage}
                        alt={app.productName}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-[#2d3e2d] mb-1">{app.productName}</h3>
                      <p className="text-sm text-[#9ca89d] mb-2">{app.userName}</p>
                      <span className="text-xs px-3 py-1 rounded-full bg-[#e8f4e9] text-[#6b8e6f]">
                        체험 완료
                      </span>
                    </div>
                    <ChevronRight size={24} className="text-[#6b8e6f] shrink-0" />
                  </div>

                  <div className="bg-[#fff8ed] rounded-[1rem] px-4 py-3 flex items-center justify-between">
                    <span className="text-sm text-[#f5a145]">리뷰 작성하고 포인트 받기</span>
                    <span className="text-[#f5a145]">+500P</span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Completed Section */}
        {completedReviews.length > 0 && (
          <div className="mb-6">
            <h2 className="text-[#2d3e2d] mb-4">작성 완료</h2>
            <div className="space-y-3">
              {completedReviews.map((review) => (
                <div
                  key={review.id}
                  className="bg-white rounded-[1.5rem] p-5 border-2 border-[#d4c5a0] opacity-60"
                >
                  <div className="flex gap-4">
                    <div className="w-20 h-20 rounded-[1rem] overflow-hidden bg-[#f5f0dc] shrink-0">
                      <ImageWithFallback
                        src={review.productImage}
                        alt={review.productName}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-[#2d3e2d] mb-1">{review.productName}</h3>
                      <p className="text-sm text-[#9ca89d] mb-2">작성일: {review.createdAt.split('T')[0]}</p>
                      <span className="text-xs px-3 py-1 rounded-full bg-[#e8f4e9] text-[#6b8e6f]">
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
            <div className="text-6xl mb-4">
              <FileText size={64} className="text-[#d4c5a0] mx-auto" />
            </div>
            <h3 className="text-[#2d3e2d] mb-2">작성할 리뷰가 없어요</h3>
            <p className="text-sm text-[#9ca89d] mb-6">
              체험단에 신청하고 제품을 체험해보세요!
            </p>
          </div>
        )}

        {/* Info Box */}
        <div className="bg-[#f5f0dc] rounded-[1.5rem] p-5 border-2 border-[#d4c5a0]">
          <h4 className="text-[#2d3e2d] mb-2 flex items-center gap-2">
            <span>💡</span>
            리뷰 작성 TIP
          </h4>
          <ul className="text-sm text-[#6b8e6f] space-y-1">
            <li>• 장점, 단점, 개선점을 구체적으로 작성해주세요</li>
            <li>• 음식 사진과 함께 작성하면 더 좋아요</li>
            <li>• 솔직한 리뷰가 사업자님께 큰 도움이 됩니다</li>
          </ul>
        </div>
      </div>
    </div>
  );
}