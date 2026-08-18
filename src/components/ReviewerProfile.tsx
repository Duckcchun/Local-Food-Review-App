import { useState } from 'react';
import { ArrowLeft, Star, FileText, Heart, Calendar, Award, TrendingUp, ChevronRight } from 'lucide-react';
import type { Review } from '../types';
import { getLevelInfo, getLevelProgress, LEVELS } from '../data/levelSystem';

interface ReviewerProfileProps {
  onBack: () => void;
  reviewer: {
    name: string;
    email: string;
    joinDate?: string;
    profileImage?: string;
  };
  reviews: Review[];
  points: number;
  level: number;
  /** Whether this is the current user viewing their own profile */
  isOwnProfile?: boolean;
  onReviewClick?: (review: Review) => void;
}

/**
 * Public reviewer profile page.
 * Shows reviewer's level, badges, activity stats, and review history.
 * Accessible by other users (e.g., businesses checking reviewer credibility).
 */
export function ReviewerProfile({
  onBack,
  reviewer,
  reviews,
  points,
  level,
  isOwnProfile = false,
  onReviewClick,
}: ReviewerProfileProps) {
  const [activeTab, setActiveTab] = useState<'reviews' | 'stats'>('reviews');
  const levelInfo = getLevelInfo(points);
  const progress = getLevelProgress(points);

  // Calculate stats
  const totalReviews = reviews.length;
  const avgProsLength = totalReviews > 0
    ? Math.round(reviews.reduce((sum, r) => sum + (r.pros?.length || 0), 0) / totalReviews)
    : 0;
  const avgConsLength = totalReviews > 0
    ? Math.round(reviews.reduce((sum, r) => sum + (r.cons?.length || 0), 0) / totalReviews)
    : 0;
  const photosCount = reviews.reduce((sum, r) => sum + (r.photos?.length || 0), 0);
  const uniqueProducts = new Set(reviews.map(r => r.productId)).size;

  // Activity badges
  const badges = getBadges(totalReviews, photosCount, points, level);

  // Monthly activity (last 6 months)
  const monthlyActivity = getMonthlyActivity(reviews);

  return (
    <div className="min-h-screen bg-[#fffef5] pb-24">
      {/* Header */}
      <div className="bg-gradient-to-br from-[#6b8e6f] to-[#8fa893] pt-8 pb-20">
        <div className="max-w-md mx-auto px-6">
          <button onClick={onBack} className="text-white mb-6 hover:opacity-80">
            <ArrowLeft size={24} />
          </button>

          {/* Profile Card */}
          <div className="flex items-center gap-4">
            {/* Avatar */}
            <div className="w-20 h-20 rounded-full bg-white/20 flex items-center justify-center text-3xl border-3 border-white/40">
              {reviewer.profileImage ? (
                <img
                  src={reviewer.profileImage}
                  alt={reviewer.name}
                  className="w-full h-full rounded-full object-cover"
                />
              ) : (
                <span>{levelInfo.icon}</span>
              )}
            </div>

            <div className="flex-1">
              <h1 className="text-xl font-bold text-white mb-1">{reviewer.name}</h1>
              <div className="flex items-center gap-2">
                <span className="text-sm bg-white/20 text-white px-3 py-0.5 rounded-full">
                  {levelInfo.icon} {levelInfo.name}
                </span>
                <span className="text-xs text-white/70">Lv.{level}</span>
              </div>
              {reviewer.joinDate && (
                <p className="text-xs text-white/60 mt-1 flex items-center gap-1">
                  <Calendar size={12} /> {reviewer.joinDate} 가입
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-md mx-auto px-6 -mt-12">
        {/* Stats Summary Cards */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          <div className="bg-white rounded-2xl p-4 text-center border-2 border-[#d4c5a0] shadow-sm">
            <p className="text-2xl font-bold text-[#6b8e6f]">{totalReviews}</p>
            <p className="text-xs text-[#9ca89d] mt-1">리뷰 수</p>
          </div>
          <div className="bg-white rounded-2xl p-4 text-center border-2 border-[#d4c5a0] shadow-sm">
            <p className="text-2xl font-bold text-[#f5a145]">{points.toLocaleString()}</p>
            <p className="text-xs text-[#9ca89d] mt-1">포인트</p>
          </div>
          <div className="bg-white rounded-2xl p-4 text-center border-2 border-[#d4c5a0] shadow-sm">
            <p className="text-2xl font-bold text-[#4a7c59]">{uniqueProducts}</p>
            <p className="text-xs text-[#9ca89d] mt-1">체험 맛집</p>
          </div>
        </div>

        {/* Level Progress */}
        <div className="bg-white rounded-2xl p-5 border-2 border-[#d4c5a0] mb-6">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-bold text-[#2d3e2d]">레벨 진행도</h3>
            <span className="text-xs text-[#9ca89d]">
              {levelInfo.level < LEVELS.length ? `다음: ${LEVELS[levelInfo.level].name}` : '최고 레벨!'}
            </span>
          </div>
          <div className="h-3 bg-gray-100 rounded-full overflow-hidden mb-2">
            <div
              className="h-full rounded-full transition-all duration-700"
              style={{ width: `${progress}%`, backgroundColor: levelInfo.color }}
            />
          </div>
          <div className="flex items-center justify-between text-xs text-[#9ca89d]">
            <span>{levelInfo.icon} {levelInfo.name}</span>
            <span>{progress}%</span>
          </div>
        </div>

        {/* Badges */}
        {badges.length > 0 && (
          <div className="bg-white rounded-2xl p-5 border-2 border-[#d4c5a0] mb-6">
            <h3 className="text-sm font-bold text-[#2d3e2d] mb-3 flex items-center gap-2">
              <Award size={16} className="text-[#f5a145]" /> 획득한 배지
            </h3>
            <div className="flex flex-wrap gap-2">
              {badges.map((badge, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border"
                  style={{ backgroundColor: badge.bgColor, borderColor: badge.borderColor }}
                >
                  <span className="text-sm">{badge.icon}</span>
                  <span className="text-xs font-medium" style={{ color: badge.textColor }}>
                    {badge.label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab Selector */}
        <div className="flex gap-2 mb-4">
          <button
            onClick={() => setActiveTab('reviews')}
            className={`flex-1 py-2.5 rounded-xl text-sm font-medium transition-all ${
              activeTab === 'reviews'
                ? 'bg-[#6b8e6f] text-white'
                : 'bg-white text-[#9ca89d] border-2 border-[#d4c5a0]'
            }`}
          >
            리뷰 히스토리
          </button>
          <button
            onClick={() => setActiveTab('stats')}
            className={`flex-1 py-2.5 rounded-xl text-sm font-medium transition-all ${
              activeTab === 'stats'
                ? 'bg-[#6b8e6f] text-white'
                : 'bg-white text-[#9ca89d] border-2 border-[#d4c5a0]'
            }`}
          >
            활동 통계
          </button>
        </div>

        {/* Tab Content */}
        {activeTab === 'reviews' && (
          <div className="space-y-3">
            {reviews.length === 0 ? (
              <div className="bg-white rounded-2xl p-8 text-center border-2 border-[#d4c5a0]">
                <FileText size={32} className="mx-auto mb-3 text-[#d4c5a0]" />
                <p className="text-sm text-[#9ca89d]">아직 작성한 리뷰가 없습니다</p>
              </div>
            ) : (
              reviews.slice(0, 10).map((review) => (
                <div
                  key={review.id}
                  className="bg-white rounded-2xl p-4 border-2 border-[#d4c5a0] cursor-pointer hover:border-[#6b8e6f] transition-colors"
                  onClick={() => onReviewClick?.(review)}
                >
                  <div className="flex gap-3">
                    <img
                      src={review.productImage}
                      alt={review.productName}
                      className="w-14 h-14 rounded-xl object-cover border border-[#d4c5a0]"
                      onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                    />
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-bold text-[#2d3e2d] truncate">{review.productName}</h4>
                      <p className="text-xs text-[#9ca89d] mt-0.5">
                        {new Date(review.createdAt).toLocaleDateString('ko-KR')}
                      </p>
                      {review.pros && (
                        <p className="text-xs text-[#6b8e6f] mt-1 line-clamp-2">
                          👍 {review.pros}
                        </p>
                      )}
                    </div>
                    <ChevronRight size={16} className="text-[#d4c5a0] shrink-0 mt-1" />
                  </div>
                  {review.photos && review.photos.length > 0 && (
                    <div className="flex gap-1.5 mt-2 overflow-hidden">
                      {review.photos.slice(0, 3).map((photo, i) => (
                        <img
                          key={i}
                          src={photo}
                          alt=""
                          className="w-12 h-12 rounded-lg object-cover border border-[#d4c5a0]"
                          onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                        />
                      ))}
                      {review.photos.length > 3 && (
                        <div className="w-12 h-12 rounded-lg bg-[#f5f0dc] flex items-center justify-center">
                          <span className="text-xs text-[#9ca89d]">+{review.photos.length - 3}</span>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        )}

        {activeTab === 'stats' && (
          <div className="space-y-4">
            {/* Writing Stats */}
            <div className="bg-white rounded-2xl p-5 border-2 border-[#d4c5a0]">
              <h4 className="text-sm font-bold text-[#2d3e2d] mb-3 flex items-center gap-2">
                <TrendingUp size={16} className="text-[#6b8e6f]" /> 리뷰 작성 통계
              </h4>
              <div className="grid grid-cols-2 gap-3">
                <StatItem label="평균 장점 글자수" value={`${avgProsLength}자`} />
                <StatItem label="평균 단점 글자수" value={`${avgConsLength}자`} />
                <StatItem label="업로드한 사진" value={`${photosCount}장`} />
                <StatItem label="체험한 가게" value={`${uniqueProducts}곳`} />
              </div>
            </div>

            {/* Monthly Activity */}
            <div className="bg-white rounded-2xl p-5 border-2 border-[#d4c5a0]">
              <h4 className="text-sm font-bold text-[#2d3e2d] mb-3 flex items-center gap-2">
                <Calendar size={16} className="text-[#f5a145]" /> 월별 활동
              </h4>
              <div className="flex items-end gap-1 h-20">
                {monthlyActivity.map((month, idx) => (
                  <div key={idx} className="flex-1 flex flex-col items-center gap-1">
                    <div
                      className="w-full rounded-t-md transition-all"
                      style={{
                        height: `${Math.max(4, (month.count / Math.max(...monthlyActivity.map(m => m.count), 1)) * 60)}px`,
                        backgroundColor: month.count > 0 ? '#6b8e6f' : '#f0f0f0',
                      }}
                    />
                    <span className="text-[9px] text-[#9ca89d]">{month.label}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Review Quality Score */}
            <div className="bg-gradient-to-r from-[#6b8e6f]/10 to-[#f5a145]/10 rounded-2xl p-5 border-2 border-[#d4c5a0]">
              <h4 className="text-sm font-bold text-[#2d3e2d] mb-2">📝 리뷰 퀄리티 점수</h4>
              <div className="flex items-center gap-3">
                <div className="text-3xl font-bold text-[#6b8e6f]">
                  {calculateQualityScore(reviews)}
                </div>
                <div className="text-xs text-[#9ca89d]">
                  / 100점<br />
                  <span className="text-[#6b8e6f]">
                    {getQualityLabel(calculateQualityScore(reviews))}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Helpers ───────────────────────────────────────────────────────────────

function StatItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-[#f9f6ed] rounded-xl p-3">
      <p className="text-xs text-[#9ca89d] mb-0.5">{label}</p>
      <p className="text-sm font-bold text-[#2d3e2d]">{value}</p>
    </div>
  );
}

interface Badge {
  icon: string;
  label: string;
  bgColor: string;
  borderColor: string;
  textColor: string;
}

function getBadges(reviews: number, photos: number, points: number, level: number): Badge[] {
  const badges: Badge[] = [];

  if (reviews >= 1) badges.push({ icon: '✍️', label: '첫 리뷰', bgColor: '#f0f9f4', borderColor: '#c3e6cb', textColor: '#155724' });
  if (reviews >= 5) badges.push({ icon: '📝', label: '리뷰 5개', bgColor: '#e8f5e9', borderColor: '#a8d5ba', textColor: '#2d6a4f' });
  if (reviews >= 10) badges.push({ icon: '🏆', label: '리뷰 마스터', bgColor: '#fffbf0', borderColor: '#ffeeba', textColor: '#856404' });
  if (photos >= 10) badges.push({ icon: '📸', label: '포토 리뷰어', bgColor: '#fff4e0', borderColor: '#ffd699', textColor: '#a86800' });
  if (level >= 3) badges.push({ icon: '⭐', label: '검증된 리뷰어', bgColor: '#f3e8ff', borderColor: '#d4b0ff', textColor: '#6b21a8' });
  if (level >= 5) badges.push({ icon: '👑', label: '전문 평가단', bgColor: '#fffbf0', borderColor: '#d4af37', textColor: '#8b6914' });
  if (points >= 1000) badges.push({ icon: '💰', label: '포인트 부자', bgColor: '#fff4e0', borderColor: '#f5a145', textColor: '#a86800' });

  return badges;
}

function getMonthlyActivity(reviews: Review[]): { label: string; count: number }[] {
  const now = new Date();
  const months: { label: string; count: number }[] = [];

  for (let i = 5; i >= 0; i--) {
    const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const label = `${date.getMonth() + 1}월`;
    const count = reviews.filter(r => {
      const d = new Date(r.createdAt);
      return d.getFullYear() === date.getFullYear() && d.getMonth() === date.getMonth();
    }).length;
    months.push({ label, count });
  }

  return months;
}

function calculateQualityScore(reviews: Review[]): number {
  if (reviews.length === 0) return 0;

  let score = 0;
  reviews.forEach(review => {
    // Pros written (max 20)
    if (review.pros && review.pros.length > 10) score += 20;
    else if (review.pros) score += 10;
    // Cons written (max 20)
    if (review.cons && review.cons.length > 10) score += 20;
    else if (review.cons) score += 10;
    // Improvements (max 20)
    if (review.improvements && review.improvements.length > 10) score += 20;
    else if (review.improvements) score += 10;
    // Photos (max 20)
    if (review.photos && review.photos.length >= 3) score += 20;
    else if (review.photos && review.photos.length >= 1) score += 10;
    // Detail bonus (max 20)
    const totalLength = (review.pros?.length || 0) + (review.cons?.length || 0) + (review.improvements?.length || 0);
    if (totalLength > 200) score += 20;
    else if (totalLength > 100) score += 10;
  });

  return Math.min(100, Math.round(score / reviews.length));
}

function getQualityLabel(score: number): string {
  if (score >= 80) return '우수한 리뷰어';
  if (score >= 60) return '성실한 리뷰어';
  if (score >= 40) return '성장하는 리뷰어';
  return '시작하는 리뷰어';
}
