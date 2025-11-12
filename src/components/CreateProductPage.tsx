import { useState } from "react";
import { ArrowLeft, Upload, X } from "lucide-react";
import { toast } from "sonner@2.0.3";
import type { Product } from "../data/mockData";
import type { UserInfo } from "../App";

interface CreateProductPageProps {
  onBack: () => void;
  onCreateProduct: (product: Omit<Product, "id">) => void;
  userInfo: UserInfo;
}

export function CreateProductPage({ onBack, onCreateProduct, userInfo }: CreateProductPageProps) {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    requiredReviewers: "10",
    deadline: "",
    category: "한식",
    detailDescription: "",
    benefits: "",
  });

  const [imagePreview, setImagePreview] = useState<string>("");

  // Get minimum date (today)
  const getMinDate = () => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  };

  // Get maximum date (3 months from now)
  const getMaxDate = () => {
    const maxDate = new Date();
    maxDate.setMonth(maxDate.getMonth() + 3);
    return maxDate.toISOString().split('T')[0];
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageUpload = () => {
    // Mock image upload - in real app, would handle file upload
    const mockImageUrl = "https://images.unsplash.com/photo-1595955809761-dcd4c857e147?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmb29kJTIwZGlzaCUyMHBsYXRlfGVufDF8fHx8MTc2MjgyODIyN3ww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral";
    setImagePreview(mockImageUrl);
    toast.success("이미지가 업로드되었습니다");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.description || !formData.price || !formData.deadline) {
      toast.error("필수 정보를 모두 입력해주세요");
      return;
    }

    if (!imagePreview) {
      toast.error("상품 이미지를 업로드해주세요");
      return;
    }

    const newProduct: Omit<Product, "id"> = {
      name: formData.name,
      seller: userInfo.businessName || userInfo.name,
      category: formData.category,
      location: userInfo.businessAddress || "서울시 마포구",
      latitude: 37.5665, // Default to Seoul coordinates - would use actual coordinates from store registration
      longitude: 126.9780,
      image: imagePreview,
      reviewCount: 0,
      description: formData.description,
      applicationDeadline: formData.deadline,
      requiredReviewers: parseInt(formData.requiredReviewers),
      currentApplicants: 0,
      likeCount: 0,
      distance: "0km",
      badge: formData.benefits || undefined
    };

    onCreateProduct(newProduct);
    toast.success("체험단 모집이 등록되었습니다!");
    
    setTimeout(() => {
      onBack();
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-[#fffef5] pb-24">
      {/* Header */}
      <div className="sticky top-0 bg-white border-b-2 border-[#d4c5a0] z-10">
        <div className="max-w-md mx-auto px-6 py-4 flex items-center justify-between">
          <button onClick={onBack} className="text-[#2d3e2d] hover:text-[#6b8e6f] transition-colors">
            <ArrowLeft size={24} />
          </button>
          <h4 className="text-[#2d3e2d]">체험단 모집하기</h4>
          <div className="w-6"></div>
        </div>
      </div>

      <div className="max-w-md mx-auto px-6 py-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Image Upload */}
          <div>
            <label className="block text-[#2d3e2d] mb-2">
              상품 이미지 <span className="text-[#f5a145]">*</span>
            </label>
            {imagePreview ? (
              <div className="relative">
                <img 
                  src={imagePreview} 
                  alt="Preview" 
                  className="w-full h-48 object-cover rounded-[1.5rem] border-2 border-[#d4c5a0]"
                />
                <button
                  type="button"
                  onClick={() => setImagePreview("")}
                  className="absolute top-3 right-3 bg-white rounded-full p-2 shadow-lg hover:bg-[#f5f0dc]"
                >
                  <X size={20} className="text-[#2d3e2d]" />
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={handleImageUpload}
                className="w-full h-48 border-2 border-dashed border-[#d4c5a0] rounded-[1.5rem] flex flex-col items-center justify-center gap-3 hover:border-[#f5a145] hover:bg-[#f5f0dc] transition-colors"
              >
                <Upload size={32} className="text-[#9ca89d]" />
                <span className="text-[#9ca89d]">이미지 업로드</span>
              </button>
            )}
          </div>

          {/* Product Name */}
          <div>
            <label className="block text-[#2d3e2d] mb-2">
              메뉴 이름 <span className="text-[#f5a145]">*</span>
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              placeholder="예: 수제 돈까스 세트"
              className="w-full px-4 py-3 rounded-[1rem] border-2 border-[#d4c5a0] bg-white focus:border-[#f5a145] focus:outline-none"
            />
          </div>

          {/* Category */}
          <div>
            <label className="block text-[#2d3e2d] mb-2">카테고리</label>
            <select
              name="category"
              value={formData.category}
              onChange={handleInputChange}
              className="w-full px-4 py-3 rounded-[1rem] border-2 border-[#d4c5a0] bg-white focus:border-[#f5a145] focus:outline-none"
            >
              <option value="한식">한식</option>
              <option value="중식">중식</option>
              <option value="일식">일식</option>
              <option value="양식">양식</option>
              <option value="분식">분식</option>
              <option value="카페">카페</option>
              <option value="디저트">디저트</option>
            </select>
          </div>

          {/* Description */}
          <div>
            <label className="block text-[#2d3e2d] mb-2">
              한 줄 소개 <span className="text-[#f5a145]">*</span>
            </label>
            <input
              type="text"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              placeholder="예: 바삭한 수제 돈까스와 특제 소스"
              className="w-full px-4 py-3 rounded-[1rem] border-2 border-[#d4c5a0] bg-white focus:border-[#f5a145] focus:outline-none"
            />
          </div>

          {/* Detail Description */}
          <div>
            <label className="block text-[#2d3e2d] mb-2">상세 설명</label>
            <textarea
              name="detailDescription"
              value={formData.detailDescription}
              onChange={handleInputChange}
              placeholder="메뉴에 대한 자세한 설명을 작성해주세요"
              rows={4}
              className="w-full px-4 py-3 rounded-[1rem] border-2 border-[#d4c5a0] bg-white focus:border-[#f5a145] focus:outline-none resize-none"
            />
          </div>

          {/* Price */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[#2d3e2d] mb-2">
                체험 가격 <span className="text-[#f5a145]">*</span>
              </label>
              <div className="relative">
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleInputChange}
                  placeholder="5000"
                  className="w-full px-4 py-3 rounded-[1rem] border-2 border-[#d4c5a0] bg-white focus:border-[#f5a145] focus:outline-none"
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[#9ca89d]">원</span>
              </div>
            </div>
            <div>
              <label className="block text-[#2d3e2d] mb-2">
                모집 인원 <span className="text-[#f5a145]">*</span>
              </label>
              <div className="relative">
                <input
                  type="number"
                  name="requiredReviewers"
                  value={formData.requiredReviewers}
                  onChange={handleInputChange}
                  placeholder="10"
                  className="w-full px-4 py-3 rounded-[1rem] border-2 border-[#d4c5a0] bg-white focus:border-[#f5a145] focus:outline-none"
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[#9ca89d]">명</span>
              </div>
            </div>
          </div>

          {/* Deadline */}
          <div>
            <label className="block text-[#2d3e2d] mb-2">
              모집 마감일 <span className="text-[#f5a145]">*</span>
            </label>
            <input
              type="date"
              name="deadline"
              value={formData.deadline}
              onChange={handleInputChange}
              min={getMinDate()}
              max={getMaxDate()}
              className="w-full px-4 py-3 rounded-[1rem] border-2 border-[#d4c5a0] bg-white focus:border-[#f5a145] focus:outline-none"
            />
          </div>

          {/* Benefits */}
          <div>
            <label className="block text-[#2d3e2d] mb-2">체험단 혜택</label>
            <textarea
              name="benefits"
              value={formData.benefits}
              onChange={handleInputChange}
              placeholder="혜택을 한 줄씩 입력해주세요&#10;예:&#10;정상가 대비 70% 할인&#10;무료 배달&#10;리뷰 작성 시 포인트 적립"
              rows={5}
              className="w-full px-4 py-3 rounded-[1rem] border-2 border-[#d4c5a0] bg-white focus:border-[#f5a145] focus:outline-none resize-none"
            />
            <p className="text-xs text-[#9ca89d] mt-2">* 한 줄에 하나씩 입력해주세요</p>
          </div>

          {/* Info Box */}
          <div className="bg-[#f5f0dc] rounded-[1.5rem] p-5 border-2 border-[#d4c5a0]">
            <h4 className="text-[#2d3e2d] mb-2 flex items-center gap-2">
              <span>💡</span>
              체험단 모집 안내
            </h4>
            <ul className="text-sm text-[#6b8e6f] space-y-1">
              <li>• 모집 인원이 채워지면 자동으로 마감됩니다</li>
              <li>• 신청자를 직접 승인/거절할 수 있습니다</li>
              <li>• 체험 후 리뷰 작성은 필수입니다</li>
            </ul>
          </div>

          {/* Submit Button */}
          <div>
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-[#6b8e6f] to-[#8fa893] text-white py-4 rounded-[1.5rem] hover:opacity-90 transition-opacity text-center"
            >
              체험단 모집 등록하기
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}