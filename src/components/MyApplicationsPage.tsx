import { ArrowLeft, Clock, CheckCircle, XCircle } from "lucide-react";
import { ImageWithFallback } from "../figma/ImageWithFallback";
// import { ImageWithFallback } from "../figma/ImageWithFallback";
import type { Application } from "../types";
import { NoApplicationsIllustration } from "./common/EmptyStateIllustrations";

interface MyApplicationsPageProps {
  onBack: () => void;
  applications: Application[];
  onProductClick: (product: any) => void;
}

export function MyApplicationsPage({ onBack, applications, onProductClick }: MyApplicationsPageProps) {
  const getStatusInfo = (status: string) => {
    switch (status) {
      case "accepted":
        return {
          label: "선정됨",
          color: "bg-[#6b8e6f] text-white",
          icon: CheckCircle,
          message: "🎉 체험단으로 선정되었습니다!",
          description: "음식을 수령한 후 리뷰를 작성해주세요",
          bgColor: "bg-[#e8f4e9]",
          textColor: "text-[#6b8e6f]"
        };
      case "pending":
        return {
          label: "대기 중",
          color: "bg-[#f5a145] text-white",
          icon: Clock,
          message: "⏳ 심사 대기 중입니다",
          description: "결과는 마감일 이후에 확인하실 수 있습니다",
          bgColor: "bg-[#fff8ed]",
          textColor: "text-[#f5a145]"
        };
      case "rejected":
        return {
          label: "미선정",
          color: "bg-[#9ca89d] text-white",
          icon: XCircle,
          message: "아쉽게도 선정되지 못했습니다",
          description: "다음 기회에 다시 도전해주세요!",
          bgColor: "bg-[#f5f5f5]",
          textColor: "text-[#9ca89d]"
        };
      case "review-completed":
        return {
          label: "리뷰 완료",
          color: "bg-blue-500 text-white",
          icon: CheckCircle,
          message: "✅ 리뷰 작성이 완료되었습니다",
          description: "소중한 의견 감사합니다!",
          bgColor: "bg-blue-50",
          textColor: "text-blue-600"
        };
      default:
        return {
          label: "대기 중",
          color: "bg-[#f5a145] text-white",
          icon: Clock,
          message: "⏳ 심사 대기 중입니다",
          description: "결과는 마감일 이후에 확인하실 수 있습니다",
          bgColor: "bg-[#fff8ed]",
          textColor: "text-[#f5a145]"
        };
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return `${date.getFullYear()}.${String(date.getMonth() + 1).padStart(2, '0')}.${String(date.getDate()).padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen bg-[#fffef5] pb-24">
      {/* Header */}
      <div className="sticky top-0 bg-white border-b-2 border-[#d4c5a0] z-10">
        <div className="max-w-md mx-auto px-6 py-4 flex items-center justify-between">
          <button onClick={onBack} className="text-[#2d3e2d] hover:text-[#6b8e6f] transition-colors">
            <ArrowLeft size={24} />
          </button>
          <h4 className="text-[#2d3e2d]">신청한 체험단</h4>
          <div className="w-6"></div>
        </div>
      </div>

      <div className="max-w-md mx-auto px-6 py-6">
        {/* Stats */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          <div className="bg-white rounded-[1.5rem] p-4 border-2 border-[#d4c5a0] text-center">
            <div className="text-[#6b8e6f] mb-1">
              {applications.filter(a => a.status === "accepted").length}
            </div>
            <div className="text-xs text-[#9ca89d]">승인</div>
          </div>
          <div className="bg-white rounded-[1.5rem] p-4 border-2 border-[#d4c5a0] text-center">
            <div className="text-[#f5a145] mb-1">
              {applications.filter(a => a.status === "pending").length}
            </div>
            <div className="text-xs text-[#9ca89d]">대기중</div>
          </div>
          <div className="bg-white rounded-[1.5rem] p-4 border-2 border-[#d4c5a0] text-center">
            <div className="text-[#2d3e2d] mb-1">
              {applications.length}
            </div>
            <div className="text-xs text-[#9ca89d]">전체</div>
          </div>
        </div>

        {/* Applications List */}
        {applications.length > 0 ? (
          <div className="space-y-4">
            {applications.map((application) => (
              <div
                key={application.id}
                className="bg-white rounded-[1.5rem] p-5 border-2 border-[#d4c5a0] cursor-pointer hover:border-[#f5a145] transition-colors"
                onClick={() => onProductClick(application)}
              >
                <div className="flex gap-4 mb-4">
                  <div className="w-24 h-24 rounded-[1rem] overflow-hidden bg-[#f5f0dc] shrink-0">
                    <ImageWithFallback
                      src={application.productImage}
                      alt={application.productName}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="text-[#2d3e2d] flex-1">{application.productName}</h3>
                      {(() => {
                        const statusInfo = getStatusInfo(application.status);
                        const StatusIcon = statusInfo.icon;
                        return (
                          <span className={`text-xs px-3 py-1 rounded-full flex items-center gap-1 ${statusInfo.color}`}>
                            <StatusIcon size={16} />
                            {statusInfo.label}
                          </span>
                        );
                      })()}
                    </div>
                    <p className="text-sm text-[#6b8e6f] mb-2">{application.userName}</p>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-[#9ca89d]">신청일: {formatDate(application.appliedAt)}</span>
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-[#d4c5a0]">
                  {application.status === "accepted" ? (
                    <div className="bg-[#e8f4e9] rounded-[1rem] p-3">
                      <p className="text-sm text-[#6b8e6f] mb-2">
                        🎉 체험단으로 선정되었습니다!
                      </p>
                      <p className="text-xs text-[#9ca89d]">
                        음식을 수령한 후 리뷰를 작성해주세요
                      </p>
                    </div>
                  ) : application.status === "pending" ? (
                    <div className="bg-[#fff8ed] rounded-[1rem] p-3">
                      <p className="text-sm text-[#f5a145]">
                        ⏳ 심사 대기중입니다
                      </p>
                      <p className="text-xs text-[#9ca89d] mt-1">
                        결과는 마감일 이후에 확인하실 수 있습니다
                      </p>
                    </div>
                  ) : application.status === "rejected" ? (
                    <div className="bg-[#f5f5f5] rounded-[1rem] p-3">
                      <p className="text-sm text-[#9ca89d]">
                        아쉽게도 선정되지 못했습니다
                      </p>
                      <p className="text-xs text-[#9ca89d] mt-1">
                        다음 기회에 다시 도전해주세요!
                      </p>
                    </div>
                  ) : application.status === "review-completed" ? (
                    <div className="bg-blue-50 rounded-[1rem] p-3">
                      <p className="text-sm text-blue-600 mb-2">
                        ✅ 리뷰 작성이 완료되었습니다
                      </p>
                      <p className="text-xs text-blue-600">
                        소중한 의견 감사합니다!
                      </p>
                    </div>
                  ) : (
                    <div className="bg-[#f5f5f5] rounded-[1rem] p-3">
                      <p className="text-sm text-[#9ca89d]">
                        아쉽게도 선정되지 못했습니다
                      </p>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <NoApplicationsIllustration className="mx-auto mb-6" />
            <h3 className="text-lg font-bold text-[#2d3e2d] mb-2">신청한 체험단이 없어요</h3>
            <p className="text-sm text-[#9ca89d] mb-6 max-w-xs mx-auto">
              우리 동네의 다양한 맛집 체험단에 신청하고<br />특별한 경험을 시작해보세요!
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