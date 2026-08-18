import { useState } from "react";
import { ChevronLeft, TrendingUp, Users, FileText, Heart, BarChart3, Calendar, AlertCircle } from "lucide-react";
import { Logo } from "./Logo";
import { StatCard } from "./StatCard";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import type { Product } from "../data/mockData";
import type { Application, Review } from "../types";
import { calculateBusinessStats, getProductPerformances, getChartData, getPeriodLabel } from "../utils/statsUtils";
import type { PeriodFilter, ProductPerformance } from "../utils/statsUtils";
import { ImageWithFallback } from "../figma/ImageWithFallback";

interface BusinessDashboardProps {
  onBack: () => void;
  products: Product[];
  applications: Application[];
  reviews: Review[];
}

export function BusinessDashboard({
  onBack,
  products,
  applications,
  reviews
}: BusinessDashboardProps) {
  const [period, setPeriod] = useState<PeriodFilter>("week");

  // Filter reviews for only this business's products
  const businessReviews = reviews.filter(review => 
    products.some(product => product.id === review.productId)
  );

  // Safely calculate stats
  const stats = calculateBusinessStats(products || [], applications || [], businessReviews || [], period);
  const performances = getProductPerformances(products || [], applications || [], businessReviews || []);
  const chartData = getChartData(applications || [], businessReviews || [], period);

  const periods: Array<{ id: PeriodFilter; label: string }> = [
    { id: "week", label: "이번 주" },
    { id: "month", label: "이번 달" },
    { id: "all", label: "전체" }
  ];

  const getStatusBadge = (status: ProductPerformance["status"]) => {
    switch (status) {
      case "active":
        return { text: "진행중", color: "bg-[#d4edda] text-[#155724]" };
      case "deadline-soon":
        return { text: "마감임박", color: "bg-[#fff3cd] text-[#856404]" };
      case "closed":
        return { text: "마감", color: "bg-[#f8d7da] text-[#721c24]" };
    }
  };

  return (
    <div className="min-h-screen bg-[#fffef5] pb-24">
      {/* Header */}
  <div className="bg-linear-to-br from-[#6b8e6f] to-[#8fa893] pt-8 pb-12">
        <div className="max-w-6xl mx-auto px-6">
          <button onClick={onBack} className="mb-6 text-white hover:opacity-80">
            <ChevronLeft size={24} />
          </button>
          <Logo className="mb-6" variant="white" />
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-white mb-2">통계 대시보드</h1>
              <p className="text-white opacity-90">체험단 운영 현황을 한눈에 확인하세요</p>
            </div>
            <BarChart3 size={48} className="text-white opacity-20" />
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 -mt-6">
        {/* Period Filter */}
        <div className="flex gap-2 mb-6">
          {periods.map((p) => (
            <button
              key={p.id}
              onClick={() => setPeriod(p.id)}
              className={`px-4 py-2.5 rounded-[1rem] text-sm transition-all ${
                period === p.id
                  ? "bg-white text-[#6b8e6f] border-2 border-[#6b8e6f] shadow-md"
                  : "bg-white text-[#9ca89d] border-2 border-[#d4c5a0]"
              }`}
            >
              {p.label}
            </button>
          ))}
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="stagger-item">
            <StatCard
              icon={<BarChart3 size={24} />}
              label="총 체험단"
              value={stats.totalProducts}
              suffix="개"
              trend={12}
              color="#6b8e6f"
              bgColor="#e8f5e9"
            />
          </div>
          <div className="stagger-item" style={{ animationDelay: '0.15s' }}>
            <StatCard
              icon={<Users size={24} />}
              label="총 신청자"
              value={stats.totalApplicants}
              suffix="명"
              trend={8}
              color="#f5a145"
              bgColor="#fff4e0"
            />
          </div>
          <div className="stagger-item" style={{ animationDelay: '0.3s' }}>
            <StatCard
              icon={<FileText size={24} />}
              label="총 리뷰"
              value={stats.totalReviews}
              suffix="개"
              trend={15}
              color="#4a7c59"
              bgColor="#d4edda"
            />
          </div>
          <div className="stagger-item" style={{ animationDelay: '0.45s' }}>
            <StatCard
              icon={<Heart size={24} />}
              label="총 좋아요"
              value={stats.totalLikes}
              suffix="개"
              trend={22}
              color="#e63946"
              bgColor="#ffe5e8"
            />
          </div>
        </div>

        {/* Additional Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div className="bg-white rounded-[1.5rem] p-6 border-2 border-[#d4c5a0]">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-[#f3e8ff] rounded-[1rem] flex items-center justify-center">
                <TrendingUp size={24} className="text-[#9d4edd]" />
              </div>
              <div>
                <h3 className="text-[#2d3e2d]">평균 모집률</h3>
                <p className="text-sm text-[#9ca89d]">목표 대비 달성률</p>
              </div>
            </div>
            <div className="mb-3">
              <div className="flex items-end gap-2 mb-2">
                <span className="text-4xl text-[#9d4edd] font-medium">
                  {stats.averageFillRate}
                </span>
                <span className="text-[#9ca89d] mb-2">%</span>
              </div>
              <div className="w-full bg-[#f5f0dc] rounded-full h-3 overflow-hidden">
                <div
                  className="bg-linear-to-r from-[#9d4edd] to-[#c77dff] h-full rounded-full transition-all"
                  style={{ width: `${Math.min(stats.averageFillRate, 100)}%` }}
                />
              </div>
            </div>
            <p className="text-sm text-[#6b8e6f]">
              {stats.averageFillRate >= 100 ? "🎉 목표 달성!" : "조금만 더 힘내세요!"}
            </p>
          </div>

          <div className="bg-white rounded-[1.5rem] p-6 border-2 border-[#d4c5a0]">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-[#e5f9f3] rounded-[1rem] flex items-center justify-center">
                <FileText size={24} className="text-[#06a77d]" />
              </div>
              <div>
                <h3 className="text-[#2d3e2d]">리뷰 작성률</h3>
                <p className="text-sm text-[#9ca89d]">선정자 중 리뷰 작성</p>
              </div>
            </div>
            <div className="mb-3">
              <div className="flex items-end gap-2 mb-2">
                <span className="text-4xl text-[#06a77d] font-medium">
                  {stats.reviewCompletionRate}
                </span>
                <span className="text-[#9ca89d] mb-2">%</span>
              </div>
              <div className="w-full bg-[#f5f0dc] rounded-full h-3 overflow-hidden">
                <div
                  className="bg-linear-to-r from-[#06a77d] to-[#38b2ac] h-full rounded-full transition-all"
                  style={{ width: `${Math.min(stats.reviewCompletionRate, 100)}%` }}
                />
              </div>
            </div>
            <p className="text-sm text-[#6b8e6f]">
              {stats.reviewCompletionRate >= 80 ? "✨ 우수한 참여율!" : "리뷰 작성을 독려해보세요"}
            </p>
          </div>
        </div>

        {/* Chart */}
        <div className="bg-white rounded-[1.5rem] p-6 border-2 border-[#d4c5a0] mb-6">
          <div className="flex items-center gap-2 mb-6">
            <Calendar size={20} className="text-[#6b8e6f]" />
            <h3 className="text-[#2d3e2d]">활동 추이</h3>
            <span className="text-sm text-[#9ca89d]">({getPeriodLabel(period)})</span>
          </div>
          
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#d4c5a0" />
              <XAxis 
                dataKey="name" 
                stroke="#6b8e6f"
                style={{ fontSize: '12px' }}
              />
              <YAxis 
                stroke="#6b8e6f"
                style={{ fontSize: '12px' }}
              />
              <Tooltip 
                contentStyle={{
                  backgroundColor: '#fff',
                  border: '2px solid #d4c5a0',
                  borderRadius: '12px',
                  fontSize: '14px'
                }}
              />
              <Legend 
                wrapperStyle={{ fontSize: '14px' }}
              />
              <Line 
                type="monotone" 
                dataKey="신청자" 
                stroke="#f5a145" 
                strokeWidth={2}
                dot={{ fill: '#f5a145', r: 4 }}
              />
              <Line 
                type="monotone" 
                dataKey="리뷰" 
                stroke="#6b8e6f" 
                strokeWidth={2}
                dot={{ fill: '#6b8e6f', r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Product Performances */}
        <div className="bg-white rounded-[1.5rem] p-6 border-2 border-[#d4c5a0]">
          <h3 className="text-[#2d3e2d] mb-4">체험단별 성과</h3>

          {performances.length === 0 ? (
            <div className="text-center py-12">
              <AlertCircle size={48} className="mx-auto mb-4 text-[#d4c5a0]" />
              <p className="text-[#9ca89d]">등록된 체험단이 없습니다</p>
            </div>
          ) : (
            <div className="space-y-4">
              {performances.map((perf) => {
                const statusBadge = getStatusBadge(perf.status);
                
                return (
                  <div
                    key={perf.product.id}
                    className="border-2 border-[#d4c5a0] rounded-[1rem] p-4 hover:border-[#6b8e6f] transition-all"
                  >
                    <div className="flex gap-4">
                      {/* Product Image */}
                      <div className="w-20 h-20 rounded-[1rem] overflow-hidden bg-[#f5f0dc] shrink-0">
                        <ImageWithFallback
                          src={perf.product.image}
                          alt={perf.product.name}
                          className="w-full h-full object-cover"
                        />
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex-1">
                            <h4 className="text-[#2d3e2d] mb-1">{perf.product.name}</h4>
                            <p className="text-sm text-[#9ca89d]">{perf.product.category}</p>
                          </div>
                          <span className={`text-xs px-3 py-1 rounded-full ${statusBadge.color}`}>
                            {statusBadge.text}
                          </span>
                        </div>

                        {/* Stats Grid */}
                        <div className="grid grid-cols-4 gap-3 mb-3">
                          <div className="text-center">
                            <div className="text-lg text-[#f5a145] font-medium">{perf.applicants}</div>
                            <div className="text-xs text-[#9ca89d]">신청자</div>
                          </div>
                          <div className="text-center">
                            <div className="text-lg text-[#6b8e6f] font-medium">{perf.selected}</div>
                            <div className="text-xs text-[#9ca89d]">선정자</div>
                          </div>
                          <div className="text-center">
                            <div className="text-lg text-[#4a7c59] font-medium">{perf.reviews}</div>
                            <div className="text-xs text-[#9ca89d]">리뷰</div>
                          </div>
                          <div className="text-center">
                            <div className="text-lg text-[#e63946] font-medium">{perf.likes}</div>
                            <div className="text-xs text-[#9ca89d]">좋아요</div>
                          </div>
                        </div>

                        {/* Progress Bars */}
                        <div className="space-y-2">
                          <div>
                            <div className="flex justify-between text-xs text-[#9ca89d] mb-1">
                              <span>모집률</span>
                              <span>{perf.fillRate}%</span>
                            </div>
                            <div className="w-full bg-[#f5f0dc] rounded-full h-2 overflow-hidden">
                              <div
                                className="bg-linear-to-r from-[#f5a145] to-[#e89535] h-full rounded-full transition-all"
                                style={{ width: `${Math.min(perf.fillRate, 100)}%` }}
                              />
                            </div>
                          </div>
                          
                          {perf.selected > 0 && (
                            <div>
                              <div className="flex justify-between text-xs text-[#9ca89d] mb-1">
                                <span>리뷰 작성률</span>
                                <span>{perf.reviewRate}%</span>
                              </div>
                              <div className="w-full bg-[#f5f0dc] rounded-full h-2 overflow-hidden">
                                <div
                                  className="bg-linear-to-r from-[#6b8e6f] to-[#8fa893] h-full rounded-full transition-all"
                                  style={{ width: `${Math.min(perf.reviewRate, 100)}%` }}
                                />
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Reviews Section */}
        <div className="bg-white rounded-[1.5rem] p-6 border-2 border-[#d4c5a0] mb-6">
          <h2 className="text-[#2d3e2d] mb-4">받은 리뷰 ({businessReviews.length})</h2>
          {businessReviews.length === 0 ? (
            <div className="text-center py-12">
              <FileText size={48} className="mx-auto mb-4 text-[#d4c5a0]" />
              <p className="text-[#9ca89d]">받은 리뷰가 없습니다</p>
            </div>
          ) : (
            <div className="space-y-4">
              {businessReviews.map((review) => {
                const product = products.find(p => p.id === review.productId);
                return (
                  <div
                    key={review.id}
                    className="border-2 border-[#d4c5a0] rounded-[1rem] p-4 hover:border-[#6b8e6f] transition-all"
                  >
                    <div className="flex gap-4">
                      {/* Product Info */}
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <h4 className="text-[#2d3e2d] mb-1">{review.productName}</h4>
                            <div className="flex items-center gap-2 text-sm text-[#9ca89d]">
                              <span>{review.userName || '익명'}</span>
                              <span>•</span>
                              <span>{new Date(review.createdAt).toLocaleDateString('ko-KR')}</span>
                            </div>
                          </div>
                          {review.status === "published" ? (
                            <span className="text-xs px-3 py-1 rounded-full bg-[#d4edda] text-[#155724]">
                              공개
                            </span>
                          ) : (
                            <span className="text-xs px-3 py-1 rounded-full bg-[#f8d7da] text-[#721c24]">
                              비공개
                            </span>
                          )}
                        </div>

                        {/* Review Content */}
                        <div className="space-y-2 text-sm">
                          {review.pros && (
                            <div className="bg-[#d4edda] rounded-lg p-3">
                              <span className="text-[#155724] font-medium">👍 장점: </span>
                              <span className="text-[#2d3e2d]">{review.pros}</span>
                            </div>
                          )}
                          {review.cons && (
                            <div className="bg-[#f8d7da] rounded-lg p-3">
                              <span className="text-[#721c24] font-medium">👎 단점: </span>
                              <span className="text-[#2d3e2d]">{review.cons}</span>
                            </div>
                          )}
                          {review.improvements && (
                            <div className="bg-[#fff3cd] rounded-lg p-3">
                              <span className="text-[#856404] font-medium">💡 개선점: </span>
                              <span className="text-[#2d3e2d]">{review.improvements}</span>
                            </div>
                          )}
                        </div>

                        {/* Review Photos */}
                        {review.photos && review.photos.length > 0 && (
                          <div className="mt-3 flex gap-2 overflow-x-auto">
                            {review.photos.map((photo, idx) => (
                              <img 
                                key={idx} 
                                src={photo} 
                                alt={`리뷰 사진 ${idx + 1}`}
                                className="w-20 h-20 object-cover rounded-lg shrink-0"
                              />
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Info Card */}
        <div className="mt-6 bg-[#f5f0dc] rounded-[1.5rem] p-5 border-2 border-[#d4c5a0]">
          <div className="flex gap-3">
            <span className="text-2xl">💡</span>
            <div className="flex-1 text-sm text-[#6b8e6f]">
              <p className="mb-2 font-medium text-[#2d3e2d]">통계 활용 팁</p>
              <ul className="space-y-1">
                <li>• 모집률이 낮다면 제공 가격이나 혜택을 조정해보세요</li>
                <li>• 리뷰 작성률이 낮다면 리뷰 작성 독려 메시지를 보내보세요</li>
                <li>• 인기 있는 시간대에 체험단을 오픈하면 신청률이 높아집니다</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}