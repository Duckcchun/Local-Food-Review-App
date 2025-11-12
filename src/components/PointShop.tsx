import { useState } from "react";
import { ChevronLeft, ShoppingCart, Sparkles, Lock } from "lucide-react";
import { Logo } from "./Logo";
import { POINT_PRODUCTS, CATEGORY_NAMES, canPurchase } from "../data/pointShop";
import type { PointProduct } from "../data/pointShop";

interface PointShopProps {
  onBack: () => void;
  userPoints: number;
  userLevel: number;
  onPurchase: (product: PointProduct) => void;
}

export function PointShop({ onBack, userPoints, userLevel, onPurchase }: PointShopProps) {
  const [selectedCategory, setSelectedCategory] = useState<PointProduct["category"]>("priority");
  const [selectedProduct, setSelectedProduct] = useState<PointProduct | null>(null);

  const categories: Array<{ id: PointProduct["category"]; name: string; icon: string }> = [
    { id: "priority", name: "우선권", icon: "⭐" },
    { id: "coupon", name: "쿠폰", icon: "🎫" },
    { id: "premium", name: "프리미엄", icon: "👑" },
    { id: "badge", name: "배지", icon: "🏆" }
  ];

  const filteredProducts = POINT_PRODUCTS.filter(p => p.category === selectedCategory);

  const handlePurchaseClick = (product: PointProduct) => {
    const { canBuy } = canPurchase(product, userLevel, userPoints);
    if (canBuy) {
      setSelectedProduct(product);
    }
  };

  const confirmPurchase = () => {
    if (selectedProduct) {
      onPurchase(selectedProduct);
      setSelectedProduct(null);
    }
  };

  return (
    <div className="min-h-screen bg-[#fffef5] pb-24">
      {/* Header */}
      <div className="bg-gradient-to-br from-[#f5a145] to-[#e89535] pt-8 pb-12">
        <div className="max-w-md mx-auto px-6">
          <button onClick={onBack} className="mb-6 text-white hover:opacity-80">
            <ChevronLeft size={24} />
          </button>
          <Logo className="mb-6" variant="white" />
          <h1 className="text-white mb-2">포인트 샵</h1>
          <p className="text-white opacity-90">적립한 포인트로 혜택을 받아보세요</p>
        </div>
      </div>

      <div className="max-w-md mx-auto px-6 -mt-6">
        {/* Points Balance Card */}
        <div className="bg-white rounded-[1.5rem] p-6 mb-6 border-2 border-[#d4c5a0] shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-[#9ca89d] mb-1">보유 포인트</p>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl text-[#f5a145]">{userPoints.toLocaleString()}</span>
                <span className="text-[#9ca89d]">P</span>
              </div>
            </div>
            <div className="bg-gradient-to-br from-[#f5a145] to-[#e89535] rounded-full p-4">
              <Sparkles size={32} className="text-white" />
            </div>
          </div>
        </div>

        {/* Category Tabs */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2 -mx-6 px-6 scrollbar-hide">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-full whitespace-nowrap transition-all ${
                selectedCategory === cat.id
                  ? "bg-[#f5a145] text-white shadow-md"
                  : "bg-white text-[#6b8e6f] border-2 border-[#d4c5a0]"
              }`}
            >
              <span className="text-lg">{cat.icon}</span>
              <span className="text-sm font-medium">{cat.name}</span>
            </button>
          ))}
        </div>

        {/* Products Grid */}
        <div className="space-y-4 mb-6">
          {filteredProducts.map((product) => {
            const purchaseCheck = canPurchase(product, userLevel, userPoints);
            const isLocked = !purchaseCheck.canBuy && product.availability;
            const isInsufficient = !purchaseCheck.canBuy && !product.availability;

            return (
              <div
                key={product.id}
                className={`bg-white rounded-[1.5rem] p-5 border-2 transition-all ${
                  purchaseCheck.canBuy
                    ? "border-[#d4c5a0] hover:border-[#f5a145] hover:shadow-md cursor-pointer"
                    : "border-[#e5e5e5] opacity-60"
                }`}
                onClick={() => purchaseCheck.canBuy && handlePurchaseClick(product)}
              >
                <div className="flex gap-4">
                  {/* Icon */}
                  <div
                    className="w-16 h-16 rounded-[1rem] flex items-center justify-center text-3xl shrink-0"
                    style={{ backgroundColor: product.bgColor }}
                  >
                    {isLocked ? <Lock size={28} className="text-[#9ca89d]" /> : product.icon}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <h3 className="text-[#2d3e2d] mb-1">{product.name}</h3>
                        <p className="text-sm text-[#6b8e6f]">{product.description}</p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between mt-3">
                      <div className="flex items-center gap-2">
                        <span className="text-lg font-medium" style={{ color: product.color }}>
                          {product.price.toLocaleString()}P
                        </span>
                        {product.availability && (
                          <span className="text-xs px-2 py-1 rounded-full bg-[#f5f0dc] text-[#6b8e6f]">
                            {product.availability}
                          </span>
                        )}
                      </div>

                      {purchaseCheck.canBuy ? (
                        <button
                          className="px-4 py-2 rounded-[0.75rem] text-sm text-white transition-colors"
                          style={{ backgroundColor: product.color }}
                        >
                          구매하기
                        </button>
                      ) : (
                        <span className="text-xs text-[#9ca89d]">{purchaseCheck.reason}</span>
                      )}
                    </div>

                    <div className="mt-2 text-xs text-[#9ca89d]">✓ {product.benefit}</div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Info Card */}
        <div className="bg-[#f5f0dc] rounded-[1.5rem] p-5 border-2 border-[#d4c5a0]">
          <div className="flex gap-3">
            <span className="text-2xl">💡</span>
            <div className="flex-1 text-sm text-[#6b8e6f]">
              <p className="mb-2 font-medium text-[#2d3e2d]">포인트 적립 방법</p>
              <ul className="space-y-1">
                <li>• 리뷰 작성 시 기본 50P + 등급 보너스</li>
                <li>• 사진 첨부 리뷰: 추가 20P</li>
                <li>• 우수 리뷰 선정: 추가 100P</li>
                <li>• 친구 추천: 500P</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Purchase Confirmation Modal */}
      {selectedProduct && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          onClick={() => setSelectedProduct(null)}
        >
          <div
            className="bg-white rounded-[1.5rem] max-w-md w-full p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="text-center mb-6">
              <div
                className="w-20 h-20 rounded-[1.5rem] flex items-center justify-center text-4xl mx-auto mb-4"
                style={{ backgroundColor: selectedProduct.bgColor }}
              >
                {selectedProduct.icon}
              </div>
              <h3 className="text-[#2d3e2d] mb-2">{selectedProduct.name}</h3>
              <p className="text-sm text-[#6b8e6f]">{selectedProduct.description}</p>
            </div>

            <div className="bg-[#f5f0dc] rounded-[1rem] p-4 mb-6 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-[#6b8e6f]">상품 가격</span>
                <span className="text-[#2d3e2d] font-medium">
                  {selectedProduct.price.toLocaleString()}P
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-[#6b8e6f]">현재 보유</span>
                <span className="text-[#2d3e2d]">{userPoints.toLocaleString()}P</span>
              </div>
              <div className="border-t border-[#d4c5a0] pt-2 mt-2">
                <div className="flex justify-between">
                  <span className="text-[#6b8e6f]">구매 후 잔액</span>
                  <span className="text-[#f5a145] font-medium">
                    {(userPoints - selectedProduct.price).toLocaleString()}P
                  </span>
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setSelectedProduct(null)}
                className="flex-1 bg-[#f5f0dc] text-[#6b8e6f] py-3 px-4 rounded-[1rem] hover:bg-[#ebe5cc] transition-colors border-2 border-[#d4c5a0]"
              >
                취소
              </button>
              <button
                onClick={confirmPurchase}
                className="flex-1 bg-[#f5a145] text-white py-3 px-4 rounded-[1rem] hover:bg-[#e89535] transition-colors"
              >
                구매하기
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
