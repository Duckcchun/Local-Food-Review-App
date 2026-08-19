import { ChevronLeft, TrendingUp, TrendingDown, Calendar } from "lucide-react";
import type { PointTransaction } from "../data/pointShop";

interface PointHistoryProps {
  onBack: () => void;
  transactions: PointTransaction[];
  currentPoints: number;
}

export function PointHistory({ onBack, transactions, currentPoints }: PointHistoryProps) {
  // Group transactions by date
  const groupedTransactions: { [date: string]: PointTransaction[] } = {};
  
  transactions.forEach(transaction => {
    const date = transaction.date.split(' ')[0]; // Get date part only
    if (!groupedTransactions[date]) {
      groupedTransactions[date] = [];
    }
    groupedTransactions[date].push(transaction);
  });

  // Calculate totals
  const totalEarned = transactions
    .filter(t => t.type === "earn")
    .reduce((sum, t) => sum + t.amount, 0);
  
  const totalSpent = transactions
    .filter(t => t.type === "spend")
    .reduce((sum, t) => sum + t.amount, 0);

  return (
    <div className="min-h-screen bg-[#fafaf7] pb-20">
      {/* Compact Sticky Header */}
      <div className="sticky top-0 z-30 bg-[#6b8e6f]">
        <div className="max-w-md mx-auto px-5 pt-4 pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button onClick={onBack} className="w-9 h-9 flex items-center justify-center rounded-full bg-white/15 hover:bg-white/25 transition-colors">
                <ChevronLeft size={18} className="text-white" />
              </button>
              <div>
                <h1 className="text-white text-lg font-bold">포인트 내역</h1>
                <p className="text-white/70 text-xs">적립 및 사용 내역</p>
              </div>
            </div>
            <div className="text-right bg-white/15 rounded-xl px-3 py-1.5">
              <div className="text-sm font-bold text-white">{currentPoints.toLocaleString()}P</div>
              <div className="text-[10px] text-white/70">보유</div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-md mx-auto px-5 pt-4">
        {/* Summary Stats */}
        <div className="grid grid-cols-2 gap-2.5 mb-5">
          <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm">
            <div className="flex items-center gap-1.5 mb-1">
              <TrendingUp size={14} className="text-[#6b8e6f]" />
              <span className="text-[11px] text-gray-400">총 적립</span>
            </div>
            <div className="text-base font-bold text-[#6b8e6f]">+{totalEarned.toLocaleString()}P</div>
          </div>
          <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm">
            <div className="flex items-center gap-1.5 mb-1">
              <TrendingDown size={14} className="text-[#e63946]" />
              <span className="text-[11px] text-gray-400">총 사용</span>
            </div>
            <div className="text-base font-bold text-[#e63946]">-{totalSpent.toLocaleString()}P</div>
          </div>
        </div>

        {/* Transactions List */}
        {transactions.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 text-center border border-gray-100 shadow-sm">
            <div className="w-16 h-16 mx-auto mb-4 bg-gray-50 rounded-2xl flex items-center justify-center">
              <Calendar size={28} className="text-gray-300" />
            </div>
            <h3 className="text-base font-semibold text-gray-800 mb-1">포인트 내역이 없어요</h3>
            <p className="text-sm text-gray-400">
              리뷰를 작성하고 포인트를 적립해보세요!
            </p>
          </div>
        ) : (
          <div className="space-y-5">
            {Object.keys(groupedTransactions)
              .sort((a, b) => b.localeCompare(a))
              .map((date) => (
                <div key={date}>
                  <div className="flex items-center gap-2 mb-2.5">
                    <Calendar size={13} className="text-gray-400" />
                    <h3 className="text-xs font-medium text-gray-500">{date}</h3>
                  </div>

                  <div className="space-y-2">
                    {groupedTransactions[date].map((transaction) => {
                      const isEarn = transaction.type === "earn";
                      const time = transaction.date.split(' ')[1] || "";

                      return (
                        <div
                          key={transaction.id}
                          className="bg-white rounded-xl p-3.5 border border-gray-100 shadow-sm"
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2.5 flex-1 min-w-0">
                              <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${isEarn ? 'bg-[#6b8e6f]/10' : 'bg-red-50'}`}>
                                {isEarn ? (
                                  <TrendingUp size={15} className="text-[#6b8e6f]" />
                                ) : (
                                  <TrendingDown size={15} className="text-[#e63946]" />
                                )}
                              </div>
                              <div className="min-w-0">
                                <p className="text-sm font-medium text-gray-900 truncate">{transaction.description}</p>
                                <div className="flex items-center gap-2">
                                  {transaction.category && (
                                    <span className="text-[10px] text-gray-400">{transaction.category}</span>
                                  )}
                                  {time && <span className="text-[10px] text-gray-300">{time}</span>}
                                </div>
                              </div>
                            </div>
                            <span className={`text-sm font-bold shrink-0 ml-3 ${isEarn ? "text-[#6b8e6f]" : "text-[#e63946]"}`}>
                              {isEarn ? "+" : "-"}{transaction.amount.toLocaleString()}P
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
          </div>
        )}
      </div>
    </div>
  );
}
