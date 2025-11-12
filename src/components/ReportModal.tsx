import { X, AlertTriangle } from "lucide-react";
import { useState } from "react";

interface ReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (reason: string) => void;
  reviewId: string;
}

const reportReasons = [
  "부적절한 언어 사용",
  "허위 정보 포함",
  "광고/스팸성 리뷰",
  "제품과 무관한 내용",
  "악의적인 평가",
  "기타"
];

export function ReportModal({ isOpen, onClose, onSubmit }: ReportModalProps) {
  const [selectedReason, setSelectedReason] = useState<string>("");
  const [customReason, setCustomReason] = useState<string>("");

  if (!isOpen) return null;

  const handleSubmit = () => {
    const reason = selectedReason === "기타" ? customReason : selectedReason;
    if (reason) {
      onSubmit(reason);
      setSelectedReason("");
      setCustomReason("");
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-[1.5rem] max-w-md w-full max-h-[80vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-[#d4c5a0] px-6 py-4 rounded-t-[1.5rem] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertTriangle size={24} className="text-[#f5a145]" />
            <h3 className="text-[#2d3e2d]">리뷰 신고</h3>
          </div>
          <button onClick={onClose} className="text-[#9ca89d] hover:text-[#6b8e6f]">
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          <p className="text-sm text-[#6b8e6f] mb-6">
            부적절한 리뷰를 신고해주세요. 신고된 리뷰는 관리자가 검토한 후 조치됩니다.
          </p>

          {/* Reason Selection */}
          <div className="space-y-3 mb-6">
            {reportReasons.map((reason) => (
              <label
                key={reason}
                className={`flex items-center gap-3 p-4 rounded-[1rem] border-2 cursor-pointer transition-all ${
                  selectedReason === reason
                    ? "border-[#f5a145] bg-[#fff8ed]"
                    : "border-[#d4c5a0] bg-white hover:border-[#f5a145]/50"
                }`}
              >
                <input
                  type="radio"
                  name="report-reason"
                  value={reason}
                  checked={selectedReason === reason}
                  onChange={(e) => setSelectedReason(e.target.value)}
                  className="w-5 h-5 text-[#f5a145] focus:ring-[#f5a145]"
                />
                <span className="text-[#2d3e2d]">{reason}</span>
              </label>
            ))}
          </div>

          {/* Custom Reason Input */}
          {selectedReason === "기타" && (
            <div className="mb-6">
              <label className="block text-sm text-[#6b8e6f] mb-2">
                신고 사유를 입력해주세요
              </label>
              <textarea
                value={customReason}
                onChange={(e) => setCustomReason(e.target.value)}
                placeholder="구체적인 신고 사유를 작성해주세요..."
                className="w-full px-4 py-3 rounded-[1rem] border-2 border-[#d4c5a0] focus:border-[#f5a145] focus:outline-none resize-none"
                rows={4}
              />
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 py-3 px-4 rounded-[1rem] bg-[#f5f0dc] text-[#6b8e6f] hover:bg-[#ebe5cc] transition-colors"
            >
              취소
            </button>
            <button
              onClick={handleSubmit}
              disabled={!selectedReason || (selectedReason === "기타" && !customReason.trim())}
              className="flex-1 py-3 px-4 rounded-[1rem] bg-[#f5a145] text-white hover:bg-[#e89535] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              신고하기
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
