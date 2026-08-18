import { Plus, TrendingUp, Users, MessageSquare, BarChart3 } from "lucide-react";
import { Logo } from "./Logo";
import type { Product } from "../data/mockData";
import type { UserInfo } from "../App";
import { ImageWithFallback } from "../figma/ImageWithFallback";

interface BusinessHomePageProps {
  userInfo: UserInfo;
  onProductClick: (product: Product) => void;
  myProducts: Product[];
  onCreateProduct: () => void;
  onManageApplicants?: (product: Product) => void;
  onManageReviews?: () => void;
  onViewDashboard?: () => void;
  onDeleteProduct?: (productId: string) => void;
}

export function BusinessHomePage({ userInfo, onProductClick, myProducts, onCreateProduct, onManageApplicants, onManageReviews, onViewDashboard, onDeleteProduct }: BusinessHomePageProps) {
  // Mock data for business dashboard
  const stats = [
    { label: "진행중인 체험단", value: "1", color: "#f5a145" },
    { label: "총 신청자", value: "38", color: "#6b8e6f" },
    { label: "받은 리뷰", value: "40", color: "#8fa893" }
  ];

  return (
    <div className="min-h-screen bg-[#fffef5] pb-24">
      {/* Hero Section */}
  <div className="bg-gradient-to-br from-[#6b8e6f] to-[#8fa893] pt-8 pb-12">
        <div className="max-w-md mx-auto px-6">
          <Logo className="mb-6" variant="white" />
          <h1 className="text-white mb-2">
            안녕하세요,<br />{userInfo.businessName || userInfo.name}님! 👋
          </h1>
          <p className="text-white opacity-90">
            체험단을 통해 고객의 솔직한 피드백을 받아보세요
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="max-w-md mx-auto px-6 -mt-6 mb-6">
        <div className="grid grid-cols-3 gap-3">
          {stats.map((stat, index) => (
            <div key={index} className="bg-white rounded-[1.5rem] p-4 border-2 border-[#d4c5a0] text-center">
              <div className="text-2xl mb-1" style={{ color: stat.color }}>
                {stat.value}
              </div>
              <div className="text-xs text-[#9ca89d]">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="max-w-md mx-auto px-6 mb-6">
        <div className="space-y-3">
          <button 
            className="w-full bg-gradient-to-r from-[#f5a145] to-[#e89535] text-white rounded-[1.5rem] p-5 flex items-center justify-between transition-all duration-300 hover:shadow-xl hover:-translate-y-1 active:scale-[0.98] hover-glow" 
            onClick={onCreateProduct}
          >
            <div className="flex items-center gap-3">
              <div className="bg-white/20 rounded-full p-3 transition-transform group-hover:rotate-90">
                <Plus size={24} />
              </div>
              <div className="text-left">
                <h3 className="mb-1">새 체험단 모집하기</h3>
                <p className="text-sm opacity-90">메뉴를 등록하고 평가단을 모집하세요</p>
              </div>
            </div>
            <div className="text-3xl transition-transform group-hover:translate-x-2">→</div>
          </button>

          <button 
            className="w-full bg-gradient-to-r from-[#6b8e6f] to-[#8fa893] text-white rounded-[1.5rem] p-5 flex items-center justify-between transition-all duration-300 hover:shadow-xl hover:-translate-y-1 active:scale-[0.98] hover-lift" 
            onClick={onViewDashboard}
          >
            <div className="flex items-center gap-3">
              <div className="bg-white/20 rounded-full p-3">
                <BarChart3 size={24} />
              </div>
              <div className="text-left">
                <h3 className="mb-1">통계 대시보드</h3>
                <p className="text-sm opacity-90">체험단 운영 현황을 한눈에 확인</p>
              </div>
            </div>
            <div className="text-3xl transition-transform group-hover:translate-x-2">→</div>
          </button>
        </div>
      </div>

      {/* My Products */}
      <div className="max-w-md mx-auto px-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-[#2d3e2d]">내 체험단 관리</h2>
          <span className="text-sm text-[#9ca89d]">{myProducts.length}개</span>
        </div>

        {myProducts.length > 0 ? (
          <div className="space-y-4">
            {myProducts.map((product) => (
              <div key={product.id} className="bg-white rounded-[1.5rem] p-5 border-2 border-[#d4c5a0]">
                <div className="flex gap-4 mb-4">
                  <div className="w-20 h-20 rounded-[1rem] overflow-hidden bg-[#f5f0dc] shrink-0">
                    <ImageWithFallback
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-[#2d3e2d] mb-2">{product.name}</h3>
                    <div className="flex items-center gap-2">
                      <span className="text-xs px-3 py-1 rounded-full bg-[#f5a145] text-white">
                        모집중
                      </span>
                      <span className="text-xs text-[#9ca89d]">{product.deadline}</span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4 mb-4">
                  <div className="text-center">
                    <div className="text-sm text-[#9ca89d] mb-1">신청자</div>
                    <div className="text-[#f5a145]">
                      {product.currentApplicants}/{product.requiredReviewers}
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-sm text-[#9ca89d] mb-1">받은 리뷰</div>
                    <div className="text-[#6b8e6f]">
                      {product.reviewCount}
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-sm text-[#9ca89d] mb-1">진행률</div>
                    <div className="text-[#2d3e2d]">
                      {Math.round((product.currentApplicants / product.requiredReviewers) * 100)}%
                    </div>
                  </div>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => onManageApplicants && onManageApplicants(product)}
                    className="flex-1 bg-[#f5f0dc] text-[#6b8e6f] py-3 rounded-[1rem] hover:bg-[#ebe5d0] transition-colors text-center"
                  >
                    신청자 관리
                  </button>
                  <button 
                    onClick={() => onManageReviews && onManageReviews()}
                    className="flex-1 bg-[#6b8e6f] text-white py-3 rounded-[1rem] hover:bg-[#5a7a5e] transition-colors text-center"
                  >
                    리뷰 확인
                  </button>
                  <button
                    onClick={() => {
                      if (confirm(`"${product.name}" 체험단을 삭제하시겠습니까?\n\n이 작업은 되돌릴 수 없습니다.`)) {
                        onDeleteProduct && onDeleteProduct(product.id);
                      }
                    }}
                    className="bg-red-50 text-red-600 px-4 py-3 rounded-[1rem] hover:bg-red-100 transition-colors"
                    title="체험단 삭제"
                  >
                    🗑️
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-[1.5rem] p-8 border-2 border-[#d4c5a0] text-center">
            <div className="text-5xl mb-4">📝</div>
            <h3 className="text-[#2d3e2d] mb-2">등록된 체험단이 없습니다</h3>
            <p className="text-sm text-[#9ca89d] mb-4">
              첫 체험단을 등록하고 고객의 피드백을 받아보세요
            </p>
            <button 
              onClick={onCreateProduct}
              className="bg-[#f5a145] text-white px-6 py-3 rounded-[1rem] hover:bg-[#e89535] transition-colors"
            >
              체험단 등록하기
            </button>
          </div>
        )}
      </div>

      {/* Insights */}
      <div className="max-w-md mx-auto px-6 mb-6">
        <h2 className="text-[#2d3e2d] mb-4">인사이트</h2>
        
        <div className="space-y-4">
          {/* Review Summary */}
          <div className="bg-white rounded-[1.5rem] p-5 border-2 border-[#d4c5a0]">
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-[#f5a145] rounded-full p-3">
                <MessageSquare size={20} className="text-white" />
              </div>
              <div className="flex-1">
                <h3 className="text-[#2d3e2d] mb-1">최근 리뷰 요약</h3>
                <p className="text-sm text-[#9ca89d]">고객들의 피드백을 확인하세요</p>
              </div>
            </div>
            
            <div className="space-y-3">
              <div className="flex items-start gap-2">
                <span className="text-lg">👍</span>
                <div className="flex-1">
                  <div className="text-sm text-[#6b8e6f] mb-1">가장 많은 장점</div>
                  <p className="text-sm text-[#2d3e2d]">재료가 신선하고 맛이 깔끔해요</p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-lg">💡</span>
                <div className="flex-1">
                  <div className="text-sm text-[#6b8e6f] mb-1">개선 제안</div>
                  <p className="text-sm text-[#2d3e2d]">양을 조금 더 늘려주시면 좋겠어요</p>
                </div>
              </div>
            </div>
          </div>

          {/* Performance */}
          <div className="bg-white rounded-[1.5rem] p-5 border-2 border-[#d4c5a0]">
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-[#6b8e6f] rounded-full p-3">
                <TrendingUp size={20} className="text-white" />
              </div>
              <div className="flex-1">
                <h3 className="text-[#2d3e2d] mb-1">이번 달 성과</h3>
                <p className="text-sm text-[#9ca89d]">지난 달 대비 +15%</p>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-3 bg-[#f5f0dc] rounded-[1rem]">
                <div className="text-sm text-[#6b8e6f] mb-1">총 신청</div>
                <div className="text-xl text-[#2d3e2d]">89</div>
              </div>
              <div className="text-center p-3 bg-[#f5f0dc] rounded-[1rem]">
                <div className="text-sm text-[#6b8e6f] mb-1">리뷰 수</div>
                <div className="text-xl text-[#2d3e2d]">40</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tips */}
      <div className="max-w-md mx-auto px-6 mb-6">
  <div className="bg-gradient-to-br from-[#f5f0dc] to-[#ebe5d0] rounded-[1.5rem] p-5 border-2 border-[#d4c5a0]">
          <div className="flex items-start gap-3">
            <span className="text-2xl">💡</span>
            <div>
              <h3 className="text-[#2d3e2d] mb-2">성공 TIP</h3>
              <p className="text-sm text-[#6b8e6f] mb-3">
                체험단 리뷰는 24시간 내에 답변하면 고객 신뢰도가 높아집니다!
              </p>
              <button className="text-sm text-[#6b8e6f] hover:text-[#5a7a5e]">
                더 알아보기 →
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}