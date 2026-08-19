import { ArrowLeft, Clock, CheckCircle, XCircle } from "lucide-react";
import { ImageWithFallback } from "../figma/ImageWithFallback";
// import { ImageWithFallback } from "../figma/ImageWithFallback";
import { EmptyState } from "./common/EmptyState";
import type { Application } from "../App";

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
    <div className="min-h-screen bg-[#fafaf7] pb-20">
      {/* Header */}
      <div className="sticky top-0 bg-white/95 backdrop-blur-md border-b border-gray-100 z-10 shadow-[0_1px_3px_rgba(0,0,0,0.03)]">
        <div className="max-w-md mx-auto px-5 h-14 flex items-center justify-between">
          <button onClick={onBack} className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors">
            <ArrowLeft size={20} className="text-gray-800" />
          </button>
          <h4 className="text-[15px] font-semibold text-gray-900">신청한 체험단</h4>
          <div className="w-9"></div>
        </div>
      </div>

      <div className="max-w-md mx-auto px-5 py-5">
        {/* Stats */}
        <div className="grid grid-cols-3 gap-2.5 mb-5">
          <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm text-center">
            <div className="text-lg font-bold text-[#6b8e6f] mb-0.5">
              {applications.filter(a => a.status === "accepted").length}
            </div>
            <div className="text-[11px] text-gray-400">승인</div>
          </div>
          <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm text-center">
            <div className="text-lg font-bold text-[#f5a145] mb-0.5">
              {applications.filter(a => a.status === "pending").length}
            </div>
            <div className="text-[11px] text-gray-400">대기중</div>
          </div>
          <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm text-center">
            <div className="text-lg font-bold text-[#2d3e2d] mb-0.5">
              {applications.length}
            </div>
            <div className="text-[11px] text-gray-400">전체</div>
          </div>
        </div>

        {/* Applications List */}
        {applications.length > 0 ? (
          <div className="space-y-3">
            {applications.map((application) => (
              <div
                key={application.id}
                className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm cursor-pointer hover:shadow-md hover:border-gray-200 transition-all"
                onClick={() => onProductClick(application)}
              >
                <div className="flex gap-3.5 mb-4">
                  <div className="w-[72px] h-[72px] rounded-xl overflow-hidden bg-gray-100 shrink-0">
                    <ImageWithFallback
                      src={application.productImage}
                      alt={application.productName}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between mb-1.5">
                      <h3 className="text-[#2d3e2d] text-sm font-semibold flex-1 truncate">{application.productName}</h3>
                      {(() => {
                        const statusInfo = getStatusInfo(application.status);
                        const StatusIcon = statusInfo.icon;
                        return (
                          <span className={`text-[11px] px-2.5 py-1 rounded-full flex items-center gap-1 font-medium ${statusInfo.color}`}>
                            <StatusIcon size={12} />
                            {statusInfo.label}
                          </span>
                        );
                      })()}
                    </div>
                    <p className="text-xs text-gray-400 mb-1.5">{application.userName}</p>
                    <span className="text-[11px] text-gray-400">신청일: {formatDate(application.appliedAt)}</span>
                  </div>
                </div>

                <div className="pt-3.5 border-t border-gray-50">
                  {application.status === "accepted" ? (
                    <div className="bg-[#6b8e6f]/5 rounded-xl p-3">
                      <p className="text-xs font-medium text-[#6b8e6f] mb-0.5">
                        🎉 체험단으로 선정되었습니다!
                      </p>
                      <p className="text-[11px] text-gray-400">
                        음식을 수령한 후 리뷰를 작성해주세요
                      </p>
                    </div>
                  ) : application.status === "pending" ? (
                    <div className="bg-[#f5a145]/5 rounded-xl p-3">
                      <p className="text-xs font-medium text-[#f5a145] mb-0.5">
                        ⏳ 심사 대기중입니다
                      </p>
                      <p className="text-[11px] text-gray-400">
                        결과는 마감일 이후에 확인하실 수 있습니다
                      </p>
                    </div>
                  ) : application.status === "rejected" ? (
                    <div className="bg-gray-50 rounded-xl p-3">
                      <p className="text-xs font-medium text-gray-500 mb-0.5">
                        아쉽게도 선정되지 못했습니다
                      </p>
                      <p className="text-[11px] text-gray-400">
                        다음 기회에 다시 도전해주세요!
                      </p>
                    </div>
                  ) : application.status === "review-completed" ? (
                    <div className="bg-blue-50/60 rounded-xl p-3">
                      <p className="text-xs font-medium text-blue-600 mb-0.5">
                        ✅ 리뷰 작성이 완료되었습니다
                      </p>
                      <p className="text-[11px] text-gray-400">
                        소중한 의견 감사합니다!
                      </p>
                    </div>
                  ) : (
                    <div className="bg-gray-50 rounded-xl p-3">
                      <p className="text-xs font-medium text-gray-500">
                        아쉽게도 선정되지 못했습니다
                      </p>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <EmptyState
            icon="📝"
            title="신청한 체험단이 없어요"
            description="원하는 체험단에 신청해보세요"
            actionLabel="체험단 둘러보기"
            onAction={onBack}
          />
        )}
      </div>
    </div>
  );
}