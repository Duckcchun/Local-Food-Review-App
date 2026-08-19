import { useState } from "react";
import { ChevronLeft, ShoppingCart, Lock } from "lucide-react";
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
    <div className="min-h-screen bg-[#fafaf7] pb-20">
      {/* Compact Sticky Header */}
      <div className="sticky top-0 z-30 bg-gradient-to-r from-[#f5a145] to-[#e89535]">
        <div className="max-w-md mx-auto px-5 pt-4 pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button onClick={onBack} className="w-9 h-9 flex items-center justify-center rounded-full bg-white/15 hover:bg-white/25 transition-colors">
                <ChevronLeft size={18} className="text-white" />
              </button>
              <div>
                <h1 className="text-white text-lg font-bold">포인트 샵</h1>
                <p className="text-white/70 text-xs">적립한 포인트로 혜택을 받아보세요</p>
              </div>
            </div>
            <div className="text-right bg-white/15 rounded-xl px-3 py-1.5">
              <div className="text-sm font-bold text-white">{userPoints.toLocaleString()}P</div>
              <div className="text-[10px] text-white/70">보유</div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-md mx-auto px-5 pt-4">
        {/* Category Tabs */}
        <div className="flex gap-2 mb-5 overflow-x-auto pb-1 -mx-5 px-5 no-scrollbar">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-full whitespace-nowrap transition-all duration-200 text-[13px] font-medium ${
                selectedCategory === cat.id
                  ? "bg-[#f5a145] text-white shadow-sm shadow-[#f5a145]/20"
                  : "bg-white text-gray-600 border border-gray-100 hover:bg-gray-50"
              }`}
            >
              <span className="text-sm">{cat.icon}</span>
              <span>{cat.name}</span>
            </button>
          ))}
        </div>

        {/* Products Grid */}
        <div className="space-y-3 mb-5">
          {filteredProducts.map((product) => {
            const purchaseCheck = canPurchase(product, userLevel, userPoints);
            const isLocked = !purchaseCheck.canBuy && product.availability;
            const isInsufficient = !purchaseCheck.canBuy && !product.availability;

            return (
              <div
                key={product.id}
                className={`bg-white rounded-2xl p-4 border transition-all ${
                  purchaseCheck.canBuy
                    ? "border-gray-100 shadow-sm hover:shadow-md hover:border-gray-200 cursor-pointer"
                    : "border-gray-100 opacity-50"
                }`}
                onClick={() => purchaseCheck.canBuy && handlePurchaseClick(product)}
              >
                <div className="flex gap-3.5">
                  {/* Icon */}
                  <div
                    className="w-14 h-14 rounded-xl flex items-center justify-center text-2xl shrink-0"
                    style={{ backgroundColor: product.bgColor }}
                  >
                    {isLocked ? <Lock size={22} className="text-gray-400" /> : product.icon}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-semibold text-gray-900 mb-0.5">{product.name}</h3>
                    <p className="text-xs text-gray-500 mb-2">{product.description}</p>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold" style={{ color: product.color }}>
                          {product.price.toLocaleString()}P
                        </span>
                        {product.availability && (
                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-gray-50 text-gray-500 font-medium">
                            {product.availability}
                          </span>
                        )}
                      </div>

                      {purchaseCheck.canBuy ? (
                        <button
                          className="px-3 py-1.5 rounded-lg text-xs font-medium text-white transition-colors"
                          style={{ backgroundColor: product.color }}
                        >
                          구매
                        </button>
                      ) : (
                        <span className="text-[11px] text-gray-400">{purchaseCheck.reason}</span>
                      )}
                    </div>

                    <p className="mt-1.5 text-[11px] text-gray-400">✓ {product.benefit}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Info Card */}
        <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
          <h4 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-amber-50 flex items-center justify-center text-xs">💡</span>
            포인트 적립 방법
          </h4>
          <ul className="text-xs text-gray-500 space-y-1.5">
            <li className="flex items-start gap-2"><span className="text-[#f5a145] mt-0.5">•</span>리뷰 작성 시 기본 50P + 등급 보너스</li>
            <li className="flex items-start gap-2"><span className="text-[#f5a145] mt-0.5">•</span>사진 첨부 리뷰: 추가 20P</li>
            <li className="flex items-start gap-2"><span className="text-[#f5a145] mt-0.5">•</span>우수 리뷰 선정: 추가 100P</li>
            <li className="flex items-start gap-2"><span className="text-[#f5a145] mt-0.5">•</span>친구 추천: 500P</li>
          </ul>
        </div>
      </div>

      {/* Purchase Confirmation Modal */}
      {selectedProduct && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          onClick={() => setSelectedProduct(null)}
        >
          <div
            className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="text-center mb-5">
              <div
                className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl mx-auto mb-3"
                style={{ backgroundColor: selectedProduct.bgColor }}
              >
                {selectedProduct.icon}
              </div>
              <h3 className="text-base font-bold text-gray-900 mb-1">{selectedProduct.name}</h3>
              <p className="text-xs text-gray-500">{selectedProduct.description}</p>
            </div>

            <div className="bg-gray-50 rounded-xl p-4 mb-5 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">상품 가격</span>
                <span className="text-gray-900 font-medium">
                  {selectedProduct.price.toLocaleString()}P
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">현재 보유</span>
                <span className="text-gray-900">{userPoints.toLocaleString()}P</span>
              </div>
              <div className="border-t border-gray-200 pt-2 mt-2">
                <div className="flex justify-between">
                  <span className="text-gray-500 text-sm">구매 후 잔액</span>
                  <span className="text-[#f5a145] font-bold">
                    {(userPoints - selectedProduct.price).toLocaleString()}P
                  </span>
                </div>
              </div>
            </div>

            <div className="flex gap-2.5">
              <button
                onClick={() => setSelectedProduct(null)}
                className="flex-1 bg-gray-100 text-gray-700 py-3 px-4 rounded-xl font-medium text-sm hover:bg-gray-200 transition-colors"
              >
                취소
              </button>
              <button
                onClick={confirmPurchase}
                className="flex-1 bg-[#f5a145] text-white py-3 px-4 rounded-xl font-medium text-sm hover:bg-[#e89535] transition-colors shadow-sm"
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
