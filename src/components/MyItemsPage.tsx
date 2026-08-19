import { useState } from "react";
import { ArrowLeft, Package, Clock, CheckCircle, XCircle } from "lucide-react";
import { getPurchasedItems, useItem, type PurchasedItem } from "../utils/inventory";
import { toast } from "sonner";

interface MyItemsPageProps {
  onBack: () => void;
  userEmail: string;
}

type TabType = "active" | "used" | "expired";

export function MyItemsPage({ onBack, userEmail }: MyItemsPageProps) {
  const [activeTab, setActiveTab] = useState<TabType>("active");
  const [items, setItems] = useState<PurchasedItem[]>(() => getPurchasedItems(userEmail));

  const now = new Date();

  const activeItems = items.filter(i => !i.used && (!i.expiresAt || new Date(i.expiresAt) > now));
  const usedItems = items.filter(i => i.used);
  const expiredItems = items.filter(i => !i.used && i.expiresAt && new Date(i.expiresAt) <= now);

  const displayItems = activeTab === "active" ? activeItems : activeTab === "used" ? usedItems : expiredItems;

  const handleUseItem = (item: PurchasedItem) => {
    if (item.category === "badge") {
      toast.info("배지는 프로필에 자동 표시됩니다");
      return;
    }
    if (item.category === "priority") {
      toast.info("우선 선정권은 체험단 신청 시 자동 적용됩니다");
      return;
    }

    const success = useItem(userEmail, item.id);
    if (success) {
      setItems(getPurchasedItems(userEmail));
      toast.success(`${item.name}을(를) 사용했습니다!`);
    } else {
      toast.error("사용에 실패했습니다");
    }
  };

  const getCategoryLabel = (category: string) => {
    switch (category) {
      case "priority": return "선정권";
      case "coupon": return "쿠폰";
      case "premium": return "프리미엄";
      case "badge": return "배지";
      default: return "";
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "priority": return "bg-[#fff4e0] text-[#f5a145] border-[#f5a145]/20";
      case "coupon": return "bg-red-50 text-red-600 border-red-200";
      case "premium": return "bg-purple-50 text-purple-600 border-purple-200";
      case "badge": return "bg-[#fffbf0] text-[#d4af37] border-[#d4af37]/20";
      default: return "bg-gray-50 text-gray-600 border-gray-200";
    }
  };

  const getRemainingDays = (expiresAt: string | null): string => {
    if (!expiresAt) return "영구";
    const diff = Math.ceil((new Date(expiresAt).getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    if (diff <= 0) return "만료됨";
    if (diff === 1) return "오늘 만료";
    return `${diff}일 남음`;
  };

  const tabs: { id: TabType; label: string; count: number }[] = [
    { id: "active", label: "사용 가능", count: activeItems.length },
    { id: "used", label: "사용 완료", count: usedItems.length },
    { id: "expired", label: "만료", count: expiredItems.length },
  ];

  return (
    <div className="min-h-screen bg-[#fafaf7] pb-20">
      {/* Header */}
      <div className="sticky top-0 z-30 bg-[#6b8e6f]">
        <div className="max-w-md mx-auto px-5 pt-4 pb-3">
          <div className="flex items-center gap-3">
            <button onClick={onBack} className="w-9 h-9 flex items-center justify-center rounded-full bg-white/15 hover:bg-white/25 transition-colors">
              <ArrowLeft size={18} className="text-white" />
            </button>
            <div>
              <h1 className="text-white text-lg font-bold">내 아이템함</h1>
              <p className="text-white/70 text-xs">구매한 아이템을 확인하고 사용하세요</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-md mx-auto px-5 pt-4">
        {/* Summary Card */}
        <div className="bg-white rounded-2xl p-5 mb-4 border border-gray-100 shadow-sm">
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-lg font-bold text-[#6b8e6f]">{activeItems.length}</div>
              <div className="text-[11px] text-gray-400">사용 가능</div>
            </div>
            <div>
              <div className="text-lg font-bold text-gray-400">{usedItems.length}</div>
              <div className="text-[11px] text-gray-400">사용 완료</div>
            </div>
            <div>
              <div className="text-lg font-bold text-red-400">{expiredItems.length}</div>
              <div className="text-[11px] text-gray-400">만료</div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-4">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 py-2.5 rounded-xl text-xs font-medium transition-all duration-200 ${
                activeTab === tab.id
                  ? "bg-[#6b8e6f] text-white shadow-sm shadow-[#6b8e6f]/20"
                  : "bg-white text-gray-500 border border-gray-100"
              }`}
            >
              {tab.label} ({tab.count})
            </button>
          ))}
        </div>

        {/* Items List */}
        {displayItems.length === 0 ? (
          <div className="text-center py-16">
            <Package size={48} className="mx-auto mb-4 text-[#d4c5a0]" />
            <h3 className="text-gray-700 font-semibold mb-1">
              {activeTab === "active" && "사용 가능한 아이템이 없어요"}
              {activeTab === "used" && "사용한 아이템이 없어요"}
              {activeTab === "expired" && "만료된 아이템이 없어요"}
            </h3>
            <p className="text-sm text-gray-400">포인트샵에서 아이템을 구매해보세요</p>
          </div>
        ) : (
          <div className="space-y-3">
            {displayItems.map(item => (
              <div
                key={item.id}
                className={`bg-white rounded-2xl p-4 border-2 transition-all ${
                  item.used ? "border-gray-100 opacity-60" : "border-[#d4c5a0]"
                }`}
              >
                <div className="flex items-start gap-3">
                  {/* Icon */}
                  <div className="w-12 h-12 rounded-xl bg-[#f5f0dc] flex items-center justify-center text-2xl shrink-0">
                    {item.icon}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="text-sm font-semibold text-[#2d3e2d] truncate">{item.name}</h4>
                      <span className={`text-[10px] px-2 py-0.5 rounded-full border font-medium ${getCategoryColor(item.category)}`}>
                        {getCategoryLabel(item.category)}
                      </span>
                    </div>

                    <div className="flex items-center gap-3 text-xs text-gray-400">
                      <span>{new Date(item.purchasedAt).toLocaleDateString('ko-KR')} 구매</span>
                      {!item.used && (
                        <span className={`flex items-center gap-1 ${
                          item.expiresAt && getRemainingDays(item.expiresAt).includes('만료') ? 'text-red-500' :
                          item.expiresAt && parseInt(getRemainingDays(item.expiresAt)) <= 3 ? 'text-orange-500' :
                          'text-[#6b8e6f]'
                        }`}>
                          <Clock size={11} />
                          {getRemainingDays(item.expiresAt)}
                        </span>
                      )}
                      {item.used && (
                        <span className="flex items-center gap-1 text-gray-400">
                          <CheckCircle size={11} />
                          사용 완료
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Action */}
                  {!item.used && activeTab === "active" && item.category !== "badge" && item.category !== "priority" && (
                    <button
                      onClick={() => handleUseItem(item)}
                      className="shrink-0 px-3 py-1.5 bg-[#f5a145] text-white text-xs font-semibold rounded-lg hover:bg-[#e89535] active:scale-95 transition-all"
                    >
                      사용
                    </button>
                  )}

                  {!item.used && item.category === "badge" && (
                    <span className="shrink-0 text-xs text-[#6b8e6f] font-medium">자동 적용</span>
                  )}

                  {!item.used && item.category === "priority" && (
                    <span className="shrink-0 text-xs text-[#f5a145] font-medium">신청 시 적용</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
