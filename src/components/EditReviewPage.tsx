import { useState } from "react";
import { ArrowLeft, Upload, X, ThumbsUp, ThumbsDown, Lightbulb } from "lucide-react";
import { toast } from "sonner@2.0.3";
import { ImageWithFallback } from "../figma/ImageWithFallback";

/**
 * Lightweight summary of a review used only for the edit-page header.
 * Intentionally narrower than the canonical `Review` type in App.tsx —
 * EditReviewPage only needs to display product info and a date, so we
 * keep this local to avoid pulling in the full review shape.
 */
interface EditReviewSummary {
  id: string;
  productName: string;
  productImage: string;
  comment: string;
  date: string;
}

interface EditReviewPageProps {
  review: EditReviewSummary;
  onBack: () => void;
}

export function EditReviewPage({ review, onBack }: EditReviewPageProps) {
  const [pros, setPros] = useState("재료가 신선하고 맛이 좋았어요");
  const [cons, setCons] = useState("양이 조금 적었어요");
  const [suggestions, setSuggestions] = useState("포장을 더 튼튼하게 해주시면 좋겠어요");
  const [uploadedImages, setUploadedImages] = useState<string[]>([
    "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400"
  ]);

  const handleImageUpload = () => {
    const mockImages = [
      "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400",
      "https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=400",
    ];
    
    if (uploadedImages.length >= 5) {
      toast.error("최대 5장까지 업로드 가능합니다");
      return;
    }

    const randomImage = mockImages[Math.floor(Math.random() * mockImages.length)];
    setUploadedImages(prev => [...prev, randomImage]);
    toast.success("이미지가 추가되었습니다");
  };

  const handleRemoveImage = (index: number) => {
    setUploadedImages(prev => prev.filter((_, i) => i !== index));
    toast.success("이미지가 삭제되었습니다");
  };

  const handleSubmit = () => {
    if (!pros.trim() && !cons.trim() && !suggestions.trim()) {
      toast.error("최소 한 가지 항목은 작성해주세요");
      return;
    }

    toast.success("리뷰가 수정되었습니다!");
    setTimeout(() => {
      onBack();
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-[#fafaf7] pb-20">
      {/* Header */}
      <div className="sticky top-0 bg-white/95 backdrop-blur-md border-b border-gray-100 z-10 shadow-[0_1px_3px_rgba(0,0,0,0.03)]">
        <div className="max-w-md mx-auto px-5 h-14 flex items-center justify-between">
          <button onClick={onBack} className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors">
            <ArrowLeft size={20} className="text-gray-800" />
          </button>
          <h4 className="text-[15px] font-semibold text-gray-900">리뷰 수정</h4>
          <div className="w-9"></div>
        </div>
      </div>

      <div className="max-w-md mx-auto px-5 py-5">
        {/* Product Info */}
        <div className="bg-white rounded-2xl p-4 mb-5 border border-gray-100 shadow-sm">
          <div className="flex gap-3.5">
            <div className="w-[72px] h-[72px] rounded-xl overflow-hidden bg-gray-100 shrink-0">
              <ImageWithFallback
                src={review.productImage}
                alt={review.productName}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex-1">
              <h3 className="text-sm font-semibold text-gray-900 mb-1">{review.productName}</h3>
              <p className="text-xs text-gray-400 mb-2">{review.date} 작성</p>
              <span className="text-[10px] px-2.5 py-1 rounded-full bg-[#6b8e6f] text-white font-medium">
                수정 중
              </span>
            </div>
          </div>
        </div>

        {/* Image Upload */}
        <div className="bg-white rounded-2xl p-5 mb-3 border border-gray-100 shadow-sm">
          <h4 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
            <Upload size={16} className="text-[#6b8e6f]" />
            음식 사진
          </h4>

          {uploadedImages.length > 0 && (
            <div className="grid grid-cols-3 gap-2.5 mb-3">
              {uploadedImages.map((image, index) => (
                <div key={index} className="relative aspect-square">
                  <ImageWithFallback
                    src={image}
                    alt={`Uploaded ${index + 1}`}
                    className="w-full h-full object-cover rounded-xl"
                  />
                  <button
                    onClick={() => handleRemoveImage(index)}
                    className="absolute -top-1.5 -right-1.5 bg-white rounded-full p-0.5 shadow-md hover:bg-gray-50"
                  >
                    <X size={14} className="text-gray-600" />
                  </button>
                </div>
              ))}
            </div>
          )}

          <button
            onClick={handleImageUpload}
            disabled={uploadedImages.length >= 5}
            className={`w-full py-3 rounded-xl border-2 border-dashed transition-colors text-sm ${
              uploadedImages.length >= 5
                ? "border-gray-200 text-gray-400 cursor-not-allowed"
                : "border-gray-200 text-[#6b8e6f] hover:border-[#6b8e6f] hover:bg-[#6b8e6f]/5"
            }`}
          >
            {uploadedImages.length >= 5 ? "최대 5장까지 업로드 가능" : `사진 추가 (${uploadedImages.length}/5)`}
          </button>
        </div>

        {/* Pros */}
        <div className="bg-white rounded-2xl p-5 mb-3 border border-gray-100 shadow-sm">
          <h4 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
            <ThumbsUp size={16} className="text-[#6b8e6f]" />
            장점
          </h4>
          <textarea
            value={pros}
            onChange={(e) => setPros(e.target.value)}
            placeholder="이 제품의 좋았던 점을 작성해주세요"
            className="w-full h-28 p-3.5 rounded-xl border border-gray-200 bg-gray-50 text-sm focus:border-[#6b8e6f] focus:ring-2 focus:ring-[#6b8e6f]/20 focus:outline-none resize-none transition-all"
          />
        </div>

        {/* Cons */}
        <div className="bg-white rounded-2xl p-5 mb-3 border border-gray-100 shadow-sm">
          <h4 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
            <ThumbsDown size={16} className="text-[#f5a145]" />
            단점
          </h4>
          <textarea
            value={cons}
            onChange={(e) => setCons(e.target.value)}
            placeholder="아쉬웠던 점을 솔직하게 작성해주세요"
            className="w-full h-28 p-3.5 rounded-xl border border-gray-200 bg-gray-50 text-sm focus:border-[#f5a145] focus:ring-2 focus:ring-[#f5a145]/20 focus:outline-none resize-none transition-all"
          />
        </div>

        {/* Suggestions */}
        <div className="bg-white rounded-2xl p-5 mb-5 border border-gray-100 shadow-sm">
          <h4 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
            <Lightbulb size={16} className="text-[#f5a145]" />
            개선점 제안
          </h4>
          <textarea
            value={suggestions}
            onChange={(e) => setSuggestions(e.target.value)}
            placeholder="사업자님께 도움이 될 개선 아이디어를 제안해주세요"
            className="w-full h-28 p-3.5 rounded-xl border border-gray-200 bg-gray-50 text-sm focus:border-[#f5a145] focus:ring-2 focus:ring-[#f5a145]/20 focus:outline-none resize-none transition-all"
          />
        </div>

        {/* Submit Buttons */}
        <div className="flex gap-2.5">
          <button
            onClick={onBack}
            className="flex-1 bg-gray-100 text-gray-700 py-3.5 rounded-xl font-medium text-sm hover:bg-gray-200 transition-colors"
          >
            취소
          </button>
          <button
            onClick={handleSubmit}
            className="flex-1 bg-[#6b8e6f] text-white py-3.5 rounded-xl font-medium text-sm hover:bg-[#5a7a5e] active:scale-[0.98] transition-all shadow-sm"
          >
            수정 완료
          </button>
        </div>
      </div>
    </div>
  );
}
