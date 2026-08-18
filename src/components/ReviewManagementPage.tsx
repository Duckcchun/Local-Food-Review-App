import { useState } from "react";
import { ChevronLeft, Eye, EyeOff, AlertTriangle, CheckCircle, Flag } from "lucide-react";
import { Logo } from "./Logo";
import { ReportModal } from "./ReportModal";
// Simple local ImageWithFallback to avoid missing module; falls back to a 1x1 transparent GIF if load fails
function ImageWithFallback({
  src,
  alt,
  className,
}: {
  src?: string | null;
  alt?: string;
  className?: string;
}) {
  const [imgSrc, setImgSrc] = useState<string | undefined>(src ?? undefined);
  const fallback =
    "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw==";
  return (
    // eslint-disable-next-line jsx-a11y/alt-text
    <img
      src={imgSrc ?? fallback}
      alt={alt}
      className={className}
      onError={() => setImgSrc(fallback)}
    />
  );
}
import type { Review } from "../App";

interface ReviewManagementPageProps {
  reviews: Review[];
  onBack: () => void;
  onToggleVisibility: (reviewId: string) => void;
  onReportReview?: (reviewId: string, reason: string) => void;
}

export function ReviewManagementPage({ reviews, onBack, onToggleVisibility, onReportReview }: ReviewManagementPageProps) {
  const [activeTab, setActiveTab] = useState<"all" | "published" | "hidden" | "reported">("all");
  const [reportModalOpen, setReportModalOpen] = useState(false);
  const [selectedReviewId, setSelectedReviewId] = useState<string>("");

  const publishedReviews = reviews.filter(r => r.status === "published" && !r.reported);
  const hiddenReviews = reviews.filter(r => r.status === "hidden");
  const reportedReviews = reviews.filter(r => r.reported);

  const getFilteredReviews = () => {
    switch (activeTab) {
      case "published":
        return publishedReviews;
      case "hidden":
        return hiddenReviews;
      case "reported":
        return reportedReviews;
      default:
        return reviews;
    }
  };

  const filteredReviews = getFilteredReviews();

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return `${date.getFullYear()}.${String(date.getMonth() + 1).padStart(2, '0')}.${String(date.getDate()).padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen bg-[#fffef5] pb-6">
      {/* Header */}
  <div className="bg-gradient-to-br from-[#6b8e6f] to-[#8fa893] pt-8 pb-12">
        <div className="max-w-md mx-auto px-6">
          <button onClick={onBack} className="mb-6 text-white hover:opacity-80">
            <ChevronLeft size={24} />
          </button>
          <Logo className="mb-6" variant="white" />
          <h1 className="text-white mb-2">리뷰 관리</h1>
          <p className="text-white opacity-90">받은 리뷰를 관리하고 검수하세요</p>
        </div>
      </div>

      <div className="max-w-md mx-auto px-6 -mt-6">
        {/* Stats Card */}
        <div className="bg-white rounded-[1.5rem] p-6 mb-6 border-2 border-[#d4c5a0] shadow-lg">
          <div className="grid grid-cols-4 gap-3">
            <div className="text-center">
              <div className="text-2xl text-[#2d3e2d] mb-1">{reviews.length}</div>
              <div className="text-xs text-[#9ca89d]">전체</div>
            </div>
            <div className="text-center">
              <div className="text-2xl text-[#6b8e6f] mb-1">{publishedReviews.length}</div>
              <div className="text-xs text-[#9ca89d]">공개</div>
            </div>
            <div className="text-center">
              <div className="text-2xl text-[#9ca89d] mb-1">{hiddenReviews.length}</div>
              <div className="text-xs text-[#9ca89d]">비공개</div>
            </div>
            <div className="text-center">
              <div className="text-2xl text-[#f5a145] mb-1">{reportedReviews.length}</div>
              <div className="text-xs text-[#9ca89d]">신고됨</div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6 overflow-x-auto">
          <button
            onClick={() => setActiveTab("all")}
            className={`shrink-0 py-2 px-4 rounded-[1rem] transition-all text-sm ${
              activeTab === "all"
                ? "bg-[#6b8e6f] text-white shadow-md"
                : "bg-white text-[#6b8e6f] border-2 border-[#d4c5a0]"
            }`}
          >
            전체 ({reviews.length})
          </button>
          <button
            onClick={() => setActiveTab("published")}
            className={`shrink-0 py-2 px-4 rounded-[1rem] transition-all text-sm ${
              activeTab === "published"
                ? "bg-[#6b8e6f] text-white shadow-md"
                : "bg-white text-[#6b8e6f] border-2 border-[#d4c5a0]"
            }`}
          >
            공개 ({publishedReviews.length})
          </button>
          <button
            onClick={() => setActiveTab("hidden")}
            className={`shrink-0 py-2 px-4 rounded-[1rem] transition-all text-sm ${
              activeTab === "hidden"
                ? "bg-[#6b8e6f] text-white shadow-md"
                : "bg-white text-[#6b8e6f] border-2 border-[#d4c5a0]"
            }`}
          >
            비공개 ({hiddenReviews.length})
          </button>
          <button
            onClick={() => setActiveTab("reported")}
            className={`shrink-0 py-2 px-4 rounded-[1rem] transition-all text-sm ${
              activeTab === "reported"
                ? "bg-[#6b8e6f] text-white shadow-md"
                : "bg-white text-[#6b8e6f] border-2 border-[#d4c5a0]"
            }`}
          >
            신고됨 ({reportedReviews.length})
          </button>
        </div>

        {/* Reviews List */}
        <div className="space-y-4">
          {filteredReviews.length === 0 ? (
            <div className="bg-white rounded-[1.5rem] p-12 text-center border-2 border-[#d4c5a0]">
              <p className="text-[#9ca89d]">
                {activeTab === "all" && "받은 리뷰가 없습니다"}
                {activeTab === "published" && "공개된 리뷰가 없습니다"}
                {activeTab === "hidden" && "비공개 처리한 리뷰가 없습니다"}
                {activeTab === "reported" && "신고된 리뷰가 없습니다"}
              </p>
            </div>
          ) : (
            filteredReviews.map((review) => (
              <div
                key={review.id}
                className={`bg-white rounded-[1.5rem] p-5 border-2 ${
                  review.reported ? "border-[#f5a145]" : "border-[#d4c5a0]"
                }`}
              >
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex gap-3">
                    <div className="w-16 h-16 rounded-[1rem] overflow-hidden bg-[#f5f0dc] shrink-0">
                      <ImageWithFallback
                        src={review.productImage}
                        alt={review.productName}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <h3 className="text-[#2d3e2d] mb-1">{review.productName}</h3>
                      <p className="text-sm text-[#9ca89d]">
                        {review.userName || "익명"} • {formatDate(review.createdAt)}
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-col gap-1">
                    {review.status === "published" ? (
                      <span className="text-xs px-2 py-1 rounded-full bg-[#e8f4e9] text-[#6b8e6f] flex items-center gap-1">
                        <Eye size={12} />
                        공개
                      </span>
                    ) : (
                      <span className="text-xs px-2 py-1 rounded-full bg-gray-100 text-gray-600 flex items-center gap-1">
                        <EyeOff size={12} />
                        비공개
                      </span>
                    )}
                    {review.reported && (
                      <span className="text-xs px-2 py-1 rounded-full bg-[#fff8ed] text-[#f5a145] flex items-center gap-1">
                        <AlertTriangle size={12} />
                        신고됨
                      </span>
                    )}
                  </div>
                </div>

                {/* Report Reason */}
                {review.reported && review.reportReason && (
                  <div className="bg-[#fff8ed] rounded-[1rem] p-3 mb-4 border border-[#f5a145]">
                    <div className="flex items-center gap-2 mb-1">
                      <AlertTriangle size={16} className="text-[#f5a145]" />
                      <span className="text-sm text-[#f5a145]">신고 사유</span>
                    </div>
                    <p className="text-sm text-[#6b8e6f]">{review.reportReason}</p>
                  </div>
                )}

                {/* Review Content */}
                <div className="space-y-3 mb-4">
                  <div>
                    <div className="text-sm text-[#6b8e6f] mb-1">👍 장점</div>
                    <p className="text-sm text-[#2d3e2d]">{review.pros}</p>
                  </div>
                  <div>
                    <div className="text-sm text-[#6b8e6f] mb-1">👎 단점</div>
                    <p className="text-sm text-[#2d3e2d]">{review.cons}</p>
                  </div>
                  <div>
                    <div className="text-sm text-[#6b8e6f] mb-1">💡 개선점</div>
                    <p className="text-sm text-[#2d3e2d]">{review.improvements}</p>
                  </div>
                </div>

                {/* Photos */}
                {review.photos && review.photos.length > 0 && (
                  <div className="mb-4">
                    <div className="flex gap-2 overflow-x-auto">
                      {review.photos.map((photo, index) => (
                        <div
                          key={index}
                          className="w-20 h-20 rounded-[0.75rem] overflow-hidden bg-[#f5f0dc] shrink-0"
                        >
                          <ImageWithFallback
                            src={photo}
                            alt={`리뷰 사진 ${index + 1}`}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex gap-2">
                  <button
                    onClick={() => onToggleVisibility(review.id)}
                    className={`flex-1 py-3 px-4 rounded-[1rem] transition-colors flex items-center justify-center gap-2 ${
                      review.status === "published"
                        ? "bg-[#f5f0dc] text-[#6b8e6f] hover:bg-[#ebe5cc] border-2 border-[#d4c5a0]"
                        : "bg-[#6b8e6f] text-white hover:bg-[#5a7a5e]"
                    }`}
                  >
                    {review.status === "published" ? (
                      <>
                        <EyeOff size={18} />
                        비공개 처리
                      </>
                    ) : (
                      <>
                        <Eye size={18} />
                        공개 처리
                      </>
                    )}
                  </button>
                  {!review.reported && onReportReview && (
                    <button
                      onClick={() => {
                        setSelectedReviewId(review.id);
                        setReportModalOpen(true);
                      }}
                      className="py-3 px-4 rounded-[1rem] bg-[#fff8ed] text-[#f5a145] hover:bg-[#ffe5c7] transition-colors flex items-center justify-center gap-2 border-2 border-[#f5a145]"
                    >
                      <Flag size={18} />
                      신고
                    </button>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Report Modal */}
      {onReportReview && (
        <ReportModal
          isOpen={reportModalOpen}
          onClose={() => {
            setReportModalOpen(false);
            setSelectedReviewId("");
          }}
          onSubmit={(reason) => {
            onReportReview(selectedReviewId, reason);
          }}
          reviewId={selectedReviewId}
        />
      )}
    </div>
  );
}
