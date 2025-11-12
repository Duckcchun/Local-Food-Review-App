import { ChevronLeft, TrendingUp, TrendingDown, Calendar } from "lucide-react";
import { Logo } from "./Logo";
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
    <div className="min-h-screen bg-[#fffef5] pb-24">
      {/* Header */}
      <div className="bg-gradient-to-br from-[#6b8e6f] to-[#8fa893] pt-8 pb-12">
        <div className="max-w-md mx-auto px-6">
          <button onClick={onBack} className="mb-6 text-white hover:opacity-80">
            <ChevronLeft size={24} />
          </button>
          <Logo className="mb-6" variant="white" />
          <h1 className="text-white mb-2">포인트 내역</h1>
          <p className="text-white opacity-90">포인트 적립 및 사용 내역을 확인하세요</p>
        </div>
      </div>

      <div className="max-w-md mx-auto px-6 -mt-6">
        {/* Summary Card */}
        <div className="bg-white rounded-[1.5rem] p-6 mb-6 border-2 border-[#d4c5a0] shadow-lg">
          <div className="text-center mb-4">
            <p className="text-sm text-[#9ca89d] mb-1">현재 보유 포인트</p>
            <div className="flex items-baseline justify-center gap-2">
              <span className="text-3xl text-[#f5a145]">{currentPoints.toLocaleString()}</span>
              <span className="text-[#9ca89d]">P</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 pt-4 border-t border-[#d4c5a0]">
            <div className="text-center">
              <div className="flex items-center justify-center gap-1 mb-1">
                <TrendingUp size={16} className="text-[#6b8e6f]" />
                <span className="text-sm text-[#9ca89d]">총 적립</span>
              </div>
              <div className="text-lg text-[#6b8e6f]">+{totalEarned.toLocaleString()}P</div>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center gap-1 mb-1">
                <TrendingDown size={16} className="text-[#e63946]" />
                <span className="text-sm text-[#9ca89d]">총 사용</span>
              </div>
              <div className="text-lg text-[#e63946]">-{totalSpent.toLocaleString()}P</div>
            </div>
          </div>
        </div>

        {/* Transactions List */}
        {transactions.length === 0 ? (
          <div className="bg-white rounded-[1.5rem] p-12 text-center border-2 border-[#d4c5a0]">
            <Calendar size={48} className="mx-auto mb-4 text-[#d4c5a0]" />
            <h3 className="text-[#2d3e2d] mb-2">포인트 내역이 없어요</h3>
            <p className="text-sm text-[#9ca89d]">
              리뷰를 작성하고 포인트를 적립해보세요!
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {Object.keys(groupedTransactions)
              .sort((a, b) => b.localeCompare(a))
              .map((date) => (
                <div key={date}>
                  <div className="flex items-center gap-2 mb-3">
                    <Calendar size={16} className="text-[#9ca89d]" />
                    <h3 className="text-sm text-[#6b8e6f]">{date}</h3>
                  </div>

                  <div className="space-y-3">
                    {groupedTransactions[date].map((transaction) => {
                      const isEarn = transaction.type === "earn";
                      const time = transaction.date.split(' ')[1] || "";

                      return (
                        <div
                          key={transaction.id}
                          className="bg-white rounded-[1rem] p-4 border-2 border-[#d4c5a0]"
                        >
                          <div className="flex items-start justify-between mb-2">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                {isEarn ? (
                                  <TrendingUp size={16} className="text-[#6b8e6f]" />
                                ) : (
                                  <TrendingDown size={16} className="text-[#e63946]" />
                                )}
                                <span className="text-[#2d3e2d]">{transaction.description}</span>
                              </div>
                              {transaction.category && (
                                <span className="text-xs px-2 py-1 rounded-full bg-[#f5f0dc] text-[#6b8e6f]">
                                  {transaction.category}
                                </span>
                              )}
                            </div>
                            <div className="text-right">
                              <div
                                className={`font-medium ${
                                  isEarn ? "text-[#6b8e6f]" : "text-[#e63946]"
                                }`}
                              >
                                {isEarn ? "+" : "-"}
                                {transaction.amount.toLocaleString()}P
                              </div>
                              {time && <div className="text-xs text-[#9ca89d] mt-1">{time}</div>}
                            </div>
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
