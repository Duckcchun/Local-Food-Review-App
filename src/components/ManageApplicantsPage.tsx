import { useState } from "react";
import { ChevronLeft, CheckCircle, XCircle, Clock, User, Phone, Mail } from "lucide-react";
import { Logo } from "./Logo";
import { LevelBadge } from "./LevelBadge";
import type { Application, ApplicationStatus } from "../App";
import type { Product } from "../data/mockData";

interface ManageApplicantsPageProps {
  product: Product | null;
  applications: Application[];
  onBack: () => void;
  onUpdateStatus: (applicationId: string, status: ApplicationStatus) => void;
  onProductClick: (product: Product) => void;
  selectedProduct: Product | null;
}

export function ManageApplicantsPage({ selectedProduct, applications, onBack, onUpdateStatus }: ManageApplicantsPageProps) {
  const [activeTab, setActiveTab] = useState<"pending" | "accepted" | "rejected">("pending");

  if (!selectedProduct) {
    return null;
  }

  // Filter applications for this product
  const productApplications = applications.filter(app => app.productId === selectedProduct.id);
  
  const pendingApps = productApplications.filter(app => app.status === "pending");
  const acceptedApps = productApplications.filter(app => app.status === "accepted");
  const rejectedApps = productApplications.filter(app => app.status === "rejected");

  const getStatusBadge = (status: ApplicationStatus) => {
    switch (status) {
      case "pending":
        return { text: "대기 중", color: "bg-yellow-100 text-yellow-700", icon: Clock };
      case "accepted":
        return { text: "선정됨", color: "bg-green-100 text-green-700", icon: CheckCircle };
      case "rejected":
        return { text: "미선정", color: "bg-gray-100 text-gray-600", icon: XCircle };
      case "review-completed":
        return { text: "리뷰 완료", color: "bg-blue-100 text-blue-700", icon: CheckCircle };
    }
  };

  const currentApps = activeTab === "pending" ? pendingApps : activeTab === "accepted" ? acceptedApps : rejectedApps;

  return (
    <div className="min-h-screen bg-[#fffef5] pb-6">
      {/* Header */}
  <div className="bg-linear-to-br from-[#6b8e6f] to-[#8fa893] pt-8 pb-12">
        <div className="max-w-md mx-auto px-6">
          <button onClick={onBack} className="mb-6 text-white hover:opacity-80">
            <ChevronLeft size={24} />
          </button>
          <Logo className="mb-6" variant="white" />
          <h1 className="text-white mb-2">신청자 관리</h1>
          <p className="text-white opacity-90">{selectedProduct.name}</p>
        </div>
      </div>

      <div className="max-w-md mx-auto px-6 -mt-6">
        {/* Stats Card */}
        <div className="bg-white rounded-[1.5rem] p-6 mb-6 border-2 border-[#d4c5a0] shadow-lg">
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-2xl text-[#f5a145] mb-1">{pendingApps.length}</div>
              <div className="text-sm text-[#9ca89d]">대기 중</div>
            </div>
            <div className="text-center">
              <div className="text-2xl text-[#6b8e6f] mb-1">{acceptedApps.length}</div>
              <div className="text-sm text-[#9ca89d]">선정됨</div>
            </div>
            <div className="text-center">
              <div className="text-2xl text-[#9ca89d] mb-1">{rejectedApps.length}</div>
              <div className="text-sm text-[#9ca89d]">미선정</div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6">
          <button
            onClick={() => setActiveTab("pending")}
            className={`flex-1 py-3 px-4 rounded-[1rem] transition-all ${
              activeTab === "pending"
                ? "bg-[#6b8e6f] text-white shadow-md"
                : "bg-white text-[#6b8e6f] border-2 border-[#d4c5a0]"
            }`}
          >
            대기 중 ({pendingApps.length})
          </button>
          <button
            onClick={() => setActiveTab("accepted")}
            className={`flex-1 py-3 px-4 rounded-[1rem] transition-all ${
              activeTab === "accepted"
                ? "bg-[#6b8e6f] text-white shadow-md"
                : "bg-white text-[#6b8e6f] border-2 border-[#d4c5a0]"
            }`}
          >
            선정됨 ({acceptedApps.length})
          </button>
          <button
            onClick={() => setActiveTab("rejected")}
            className={`flex-1 py-3 px-4 rounded-[1rem] transition-all ${
              activeTab === "rejected"
                ? "bg-[#6b8e6f] text-white shadow-md"
                : "bg-white text-[#6b8e6f] border-2 border-[#d4c5a0]"
            }`}
          >
            미선정 ({rejectedApps.length})
          </button>
        </div>

        {/* Applicants List */}
        <div className="space-y-4">
          {currentApps.length === 0 ? (
            <div className="bg-white rounded-[1.5rem] p-8 text-center border-2 border-[#d4c5a0]">
              <p className="text-[#9ca89d]">
                {activeTab === "pending" && "대기 중인 신청자가 없습니다"}
                {activeTab === "accepted" && "선정된 신청자가 없습니다"}
                {activeTab === "rejected" && "미선정된 신청자가 없습니다"}
              </p>
            </div>
          ) : (
            currentApps.map((app) => {
              const badge = getStatusBadge(app.status);
              const BadgeIcon = badge.icon;
              const appliedDate = new Date(app.appliedAt);
              const formattedDate = `${appliedDate.getFullYear()}.${String(appliedDate.getMonth() + 1).padStart(2, '0')}.${String(appliedDate.getDate()).padStart(2, '0')}`;

              return (
                <div key={app.id} className="bg-white rounded-[1.5rem] p-6 border-2 border-[#d4c5a0]">
                  {/* User Info */}
                  <div className="flex items-start gap-4 mb-4">
                    <div className="w-12 h-12 rounded-full bg-linear-to-br from-[#f5a145] to-[#e89535] flex items-center justify-center text-white shrink-0">
                      <User size={24} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="text-[#2d3e2d]">{app.userName}</h3>
                        <LevelBadge level={app.userLevel || 1} size="sm" />
                      </div>
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 text-sm text-[#6b8e6f]">
                          <Mail size={14} />
                          <span className="truncate">{app.userEmail}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-[#6b8e6f]">
                          <Phone size={14} />
                          <span>{app.userPhone}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Status Badge and Date */}
                  <div className="flex items-center justify-between mb-4 pb-4 border-b border-[#d4c5a0]">
                    <span className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-sm ${badge.color}`}>
                      <BadgeIcon size={14} />
                      {badge.text}
                    </span>
                    <div className="text-xs text-[#9ca89d]">
                      {formattedDate}
                    </div>
                  </div>

                  {/* Action Buttons */}
                  {app.status === "pending" && (
                    <div className="flex gap-2">
                      <button
                        onClick={() => onUpdateStatus(app.id, "accepted")}
                        className="flex-1 bg-[#6b8e6f] text-white py-3 px-4 rounded-[1rem] hover:bg-[#5a7a5e] transition-colors flex items-center justify-center gap-2"
                      >
                        <CheckCircle size={18} />
                        선정하기
                      </button>
                      <button
                        onClick={() => onUpdateStatus(app.id, "rejected")}
                        className="flex-1 bg-[#f5f0dc] text-[#6b8e6f] py-3 px-4 rounded-[1rem] hover:bg-[#ebe5cc] transition-colors flex items-center justify-center gap-2 border-2 border-[#d4c5a0]"
                      >
                        <XCircle size={18} />
                        거절하기
                      </button>
                    </div>
                  )}

                  {app.status === "accepted" && (
                    <div className="bg-[#f0f7f1] rounded-[1rem] p-3 text-center">
                      <p className="text-sm text-[#6b8e6f]">
                        ✅ 체험단으로 선정되었습니다
                      </p>
                    </div>
                  )}

                  {app.status === "rejected" && (
                    <div className="bg-[#f5f0dc] rounded-[1rem] p-3 text-center">
                      <p className="text-sm text-[#9ca89d]">
                        미선정 처리되었습니다
                      </p>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}