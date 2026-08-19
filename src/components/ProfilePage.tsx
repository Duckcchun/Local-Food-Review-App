import { Logo } from "./Logo";
import { ChevronRight, Download, TrendingUp, Award, Store, BarChart3, Settings, LogOut, Star, Info, ShoppingBag, History, Moon, Sun, Edit3, Package, Mail, ClipboardList, Heart, Megaphone, FileText, Shield } from "lucide-react";
import { DeleteAccountModal } from "./DeleteAccountModal";
import { getOwnedBadges, getActiveItems } from "../utils/inventory";
import { useDarkMode } from "../hooks/useDarkMode";

/**
 * Lightweight ImageWithFallback component to avoid dependency on ../figma/ImageWithFallback.
 * Uses a simple onError handler to swap to a local placeholder when image loading fails.
 */
function ImageWithFallback({ src, alt, className }: { src?: string; alt?: string; className?: string }) {
  return (
    <img
      src={src || "/images/placeholder.png"}
      alt={alt || ""}
      className={className}
      onError={(e) => {
        // swap to placeholder if original src fails
        (e.currentTarget as HTMLImageElement).src = "/images/placeholder.png";
      }}
    />
  );
}
import type { UserInfo, Review } from "../App";
import type { Product } from "../data/mockData";
import { getLevelInfo, getLevelProgress, getPointsToNextLevel, LEVELS } from "../data/levelSystem";
import { LevelBadge } from "./LevelBadge";
import { LevelSystemModal } from "./LevelSystemModal";
import { useState } from "react";

interface ProfilePageProps {
  userInfo: UserInfo;
  completedReviews?: Review[];
  userPoints?: number;
  userLevel?: number;
  onNavigateToApplications: () => void;
  onNavigateToFavorites: () => void;
  onNavigateToPointShop?: () => void;
  onNavigateToPointHistory?: () => void;
  onNavigateToMyItems?: () => void;
  onNavigateToMessages?: () => void;
  onEditReview?: (product: Product) => void;
  onNavigateToDashboard?: () => void;
  onNavigateToTerms?: () => void;
  onNavigateToPrivacy?: () => void;
  onNavigateToNotice?: () => void;
  onEditProfile?: () => void;
  onDeleteAccount?: () => void;
  accessToken?: string;
  onLogout: () => void;
}

export function ProfilePage({ 
  userInfo, 
  completedReviews = [], 
  userPoints = 0, 
  userLevel = 1, 
  onNavigateToApplications, 
  onNavigateToFavorites, 
  onNavigateToPointShop, 
  onNavigateToPointHistory,
  onNavigateToMyItems, 
  onNavigateToMessages,
  onEditReview, 
  onNavigateToDashboard,
  onNavigateToTerms,
  onNavigateToPrivacy,
  onNavigateToNotice,
  onEditProfile,
  onDeleteAccount,
  accessToken,
  onLogout 
}: ProfilePageProps) {
  const isBusinessUser = userInfo.userType === "business";
  const [isLevelSystemModalOpen, setIsLevelSystemModalOpen] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  if (isBusinessUser) {
    return (
      <div className="min-h-screen bg-[#fffef5] pb-20">
        {/* Header */}
  <div className="bg-[#6b8e6f] bg-gradient-to-br from-[#6b8e6f] to-[#8fa893] pt-8 pb-12">
          <div className="max-w-md mx-auto px-6">
            <Logo className="mb-6" variant="white" />
            <h1 className="text-white mb-2">
              사업자 프로필
            </h1>
            <p className="text-white opacity-90">
              내 체험단과 통계를 확인하세요
            </p>
          </div>
        </div>

        <div className="max-w-md mx-auto px-6 -mt-6">
          {/* Business Profile Card */}
          <div className="bg-white rounded-[1.5rem] p-6 mb-6 border-2 border-[#d4c5a0] shadow-lg">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#6b8e6f] to-[#8fa893] flex items-center justify-center">
                <Store size={32} className="text-white" />
              </div>
              <div className="flex-1">
                <h3 className="text-[#2d3e2d] mb-1">{userInfo.businessName || userInfo.name}</h3>
                <div className="inline-flex items-center gap-1.5 bg-[#6b8e6f] text-white px-3 py-1 rounded-full text-sm">
                  <Award size={14} />
                  <span>인증 사업자</span>
                </div>
              </div>
            </div>

            <div className="space-y-2 pt-4 border-t border-[#d4c5a0]">
              <div className="flex justify-between text-sm">
                <span className="text-[#9ca89d]">사업자 번호</span>
                <span className="text-[#2d3e2d]">{userInfo.businessNumber || "-"}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-[#9ca89d]">주소</span>
                <span className="text-[#2d3e2d]">{userInfo.businessAddress || "-"}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-[#9ca89d]">담당자</span>
                <span className="text-[#2d3e2d]">{userInfo.name}</span>
              </div>
            </div>
          </div>

          {/* Business Stats */}
          <div className="bg-white rounded-[1.5rem] p-6 mb-6 border-2 border-[#d4c5a0]">
            <h3 className="text-[#2d3e2d] mb-4">이번 달 통계</h3>
            
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center">
                <div className="text-[#f5a145] mb-1">2</div>
                <div className="text-sm text-[#9ca89d]">진행중</div>
              </div>
              <div className="text-center">
                <div className="text-[#6b8e6f] mb-1">89</div>
                <div className="text-sm text-[#9ca89d]">총 신청</div>
              </div>
              <div className="text-center">
                <div className="text-[#2d3e2d] mb-1">40</div>
                <div className="text-sm text-[#9ca89d]">받은 리뷰</div>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-[1.5rem] p-6 mb-6 border-2 border-[#d4c5a0]">
            <h3 className="text-[#2d3e2d] mb-4">빠른 메뉴</h3>
            
            <button 
              onClick={onNavigateToDashboard}
              className="w-full flex items-center justify-between p-4 bg-[#f5f0dc] rounded-[1rem] mb-3 hover:bg-[#ebe5cc] transition-colors"
            >
              <div className="flex items-center gap-3">
                <BarChart3 size={20} className="text-[#6b8e6f]" />
                <span className="text-[#2d3e2d]">통계 보기</span>
              </div>
              <ChevronRight size={20} className="text-[#6b8e6f]" />
            </button>

            <button 
              onClick={() => alert('가게 정보 수정 기능은 준비중입니다')}
              className="w-full flex items-center justify-between p-4 bg-[#f5f0dc] rounded-[1rem] mb-3 hover:bg-[#ebe5cc] transition-colors"
            >
              <div className="flex items-center gap-3">
                <Store size={20} className="text-[#6b8e6f]" />
                <span className="text-[#2d3e2d]">가게 정보 수정</span>
              </div>
              <ChevronRight size={20} className="text-[#6b8e6f]" />
            </button>

            <button 
              onClick={() => alert('설정 기능은 준비중입니다')}
              className="w-full flex items-center justify-between p-4 bg-[#f5f0dc] rounded-[1rem] hover:bg-[#ebe5cc] transition-colors"
            >
              <div className="flex items-center gap-3">
                <Settings size={20} className="text-[#6b8e6f]" />
                <span className="text-[#2d3e2d]">설정</span>
              </div>
              <ChevronRight size={20} className="text-[#6b8e6f]" />
            </button>

            <div className="border-t border-[#d4c5a0] my-3"></div>

            <button className="w-full flex items-center justify-between p-4 bg-[#f5f0dc] rounded-[1rem] hover:bg-[#ebe5cc] transition-colors" onClick={onLogout}>
              <div className="flex items-center gap-3">
                <LogOut size={20} className="text-[#6b8e6f]" />
                <span className="text-[#2d3e2d]">로그아웃</span>
              </div>
              <ChevronRight size={20} className="text-[#6b8e6f]" />
            </button>
          </div>

          {/* Performance */}
          <div className="bg-gradient-to-r from-[#6b8e6f] to-[#8fa893] rounded-[1.5rem] p-6 mb-6 text-white">
            <div className="flex items-start gap-4 mb-4">
              <div className="bg-white/20 rounded-full p-3">
                <TrendingUp size={24} />
              </div>
              <div className="flex-1">
                <h4 className="mb-2">고객 만족도</h4>
                <p className="text-sm opacity-90">평균 만족도가 높습니다!</p>
              </div>
            </div>
            <div className="bg-white/20 rounded-[1rem] p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm">종합 점수</span>
                <span>88/100</span>
              </div>
              <div className="w-full bg-white/20 rounded-full h-2 overflow-hidden">
                <div className="bg-white h-full rounded-full" style={{ width: '88%' }}></div>
              </div>
            </div>
          </div>

          {/* Recent Reviews */}
          <div className="mb-6">
            <h3 className="text-[#2d3e2d] mb-4">최근 받은 리뷰</h3>
            <div className="space-y-4">
              <div className="bg-white rounded-[1.5rem] p-4 border-2 border-[#d4c5a0]">
                <div className="flex items-start gap-3 mb-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#f5a145] to-[#e89535] flex items-center justify-center text-white">
                    김
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-sm text-[#2d3e2d]">김맛평</span>
                      <span className="text-xs text-[#9ca89d]">2025.11.08</span>
                    </div>
                    <p className="text-sm text-[#6b8e6f]">음식이 정말 맛있었어요. 재방문 의사 있습니다!</p>
                  </div>
                </div>
                <button className="w-full text-sm text-[#6b8e6f] text-left hover:text-[#5a7a5e]">
                  자세히 보기 →
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Reviewer Profile
  const currentLevel = getLevelInfo(userPoints);
  const progress = getLevelProgress(userPoints);
  const pointsToNext = getPointsToNextLevel(userPoints);
  const nextLevel = LEVELS[currentLevel.level];
  const [showLevelModal, setShowLevelModal] = useState(false);
  const ownedBadges = getOwnedBadges(userInfo.email);
  const darkMode = useDarkMode();

  return (
    <div className="min-h-screen bg-[#fafaf7] pb-20">
      {/* Header */}
  <div className="bg-gradient-to-br from-[#6b8e6f] via-[#7a9a7e] to-[#8fa893] pt-8 pb-14">
        <div className="max-w-md mx-auto px-6">
          <Logo className="mb-6" variant="white" />
          <h1 className="text-white mb-2">
            마이페이지
          </h1>
          <p className="text-white/80 text-sm">
            내 활동과 포인트를 확인하세요
          </p>
        </div>
      </div>

      <div className="max-w-md mx-auto px-6 -mt-8">
        {/* User Profile Card */}
        <div className="bg-white rounded-[1.5rem] p-6 mb-5 border border-gray-100 shadow-[0_4px_20px_rgba(0,0,0,0.06)]">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#f5a145] to-[#e89535] flex items-center justify-center shadow-lg shadow-[#f5a145]/20">
              <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                <circle cx="16" cy="12" r="6" fill="white" />
                <path d="M8 26c0-4.4 3.6-8 8-8s8 3.6 8 8" fill="white" />
              </svg>
            </div>
            <div className="flex-1">
              <h3 className="text-[#2d3e2d] text-lg font-bold mb-1">{userInfo.name}</h3>
              <LevelBadge level={userLevel} showName={true} />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4 pt-4 border-t border-gray-100">
            <div className="text-center">
              <div className="text-[#2d3e2d] text-lg font-bold mb-0.5">{completedReviews.length}</div>
              <div className="text-xs text-[#9ca89d]">리뷰</div>
            </div>
            <div className="text-center">
              <div className="text-[#2d3e2d] text-lg font-bold mb-0.5">0</div>
              <div className="text-xs text-[#9ca89d]">받은 좋아요</div>
            </div>
            <div className="text-center">
              <div className="text-[#f5a145] text-lg font-bold mb-0.5">{userPoints.toLocaleString()}P</div>
              <div className="text-xs text-[#9ca89d]">포인트</div>
            </div>
          </div>
        </div>

        {/* Owned Badges */}
        {ownedBadges.length > 0 && (
          <div className="bg-white rounded-[1.5rem] p-5 mb-5 border border-gray-100 shadow-sm">
            <h4 className="text-[#2d3e2d] text-sm font-semibold mb-3">🏅 내 배지</h4>
            <div className="flex flex-wrap gap-2">
              {ownedBadges.map((badge) => (
                <span
                  key={badge.id}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#fffbf0] border border-[#f5a145]/20 rounded-full text-sm"
                >
                  <span>{badge.icon}</span>
                  <span className="text-[#2d3e2d] font-medium">{badge.name}</span>
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Level Progress Dashboard */}
        <div 
          className="rounded-[1.5rem] p-6 mb-6 border-2 shadow-lg"
          style={{
            backgroundColor: currentLevel.bgColor,
            borderColor: currentLevel.color
          }}
        >
          <div className="flex items-start justify-between mb-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-3xl">{currentLevel.icon}</span>
                <div>
                  <h3 style={{ color: currentLevel.color }}>{currentLevel.name}</h3>
                  <p className="text-sm text-[#6b8e6f]">{currentLevel.description}</p>
                </div>
              </div>
            </div>
            <button className="text-sm text-[#6b8e6f] hover:text-[#5a7a5e]" onClick={() => setShowLevelModal(true)}>
              <Info size={16} />
            </button>
          </div>

          {/* Progress Bar */}
          {currentLevel.level < LEVELS.length && (
            <div className="mb-4">
              <div className="flex items-center justify-between mb-2 text-sm">
                <span className="text-[#6b8e6f]">다음 등급까지</span>
                <span style={{ color: currentLevel.color }}>
                  {pointsToNext}P 남음
                </span>
              </div>
              <div className="w-full bg-white rounded-full h-3 overflow-hidden border-2" style={{ borderColor: currentLevel.color }}>
                <div 
                  className="h-full rounded-full transition-all duration-500" 
                  style={{ 
                    width: `${progress}%`,
                    backgroundColor: currentLevel.color
                  }}
                />
              </div>
              {nextLevel && (
                <div className="flex items-center justify-between mt-2">
                  <span className="text-xs text-[#9ca89d]">
                    현재: {userPoints}P
                  </span>
                  <span className="text-xs" style={{ color: nextLevel.color }}>
                    {nextLevel.icon} {nextLevel.name}: {nextLevel.minPoints}P
                  </span>
                </div>
              )}
            </div>
          )}

          {/* Benefits */}
          <div className="bg-white/80 rounded-[1rem] p-4">
            <h4 className="text-sm mb-2" style={{ color: currentLevel.color }}>
              <Star size={14} className="inline mr-1" />
              현재 등급 혜택
            </h4>
            <ul className="space-y-1">
              {currentLevel.benefits.map((benefit, index) => (
                <li key={index} className="text-sm text-[#6b8e6f] flex items-start gap-2">
                  <span className="text-[#6b8e6f] mt-0.5">•</span>
                  <span>{benefit}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Point Actions */}
        <div className="grid grid-cols-2 gap-3 mb-5">
          <button 
            onClick={onNavigateToPointShop}
            className="bg-gradient-to-br from-[#f5a145] to-[#e89535] rounded-2xl p-5 text-white hover:opacity-90 transition-opacity shadow-md shadow-[#f5a145]/20"
          >
            <div className="flex flex-col items-center text-center">
              <div className="bg-white/20 rounded-xl p-3 mb-3">
                <ShoppingBag size={22} />
              </div>
              <h4 className="text-sm font-bold mb-0.5">포인트 샵</h4>
              <p className="text-[11px] opacity-80">혜택 구매하기</p>
            </div>
          </button>

          <button 
            onClick={onNavigateToPointHistory}
            className="bg-gradient-to-br from-[#6b8e6f] to-[#8fa893] rounded-2xl p-5 text-white hover:opacity-90 transition-opacity shadow-md shadow-[#6b8e6f]/20"
          >
            <div className="flex flex-col items-center text-center">
              <div className="bg-white/20 rounded-xl p-3 mb-3">
                <History size={22} />
              </div>
              <h4 className="text-sm font-bold mb-0.5">포인트 내역</h4>
              <p className="text-[11px] opacity-80">적립/사용 내역</p>
            </div>
          </button>
        </div>

        {/* ── 내 활동 그룹 ── */}
        <div className="bg-white rounded-[1.5rem] p-6 mb-4 border-2 border-[#d4c5a0]">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-7 h-7 rounded-full bg-[#6b8e6f]/10 flex items-center justify-center">
              <ClipboardList size={15} className="text-[#6b8e6f]" />
            </div>
            <h3 className="text-[#2d3e2d] text-[15px] font-semibold">내 활동</h3>
          </div>
          
          {onEditProfile && (
            <button className="w-full flex items-center justify-between p-4 bg-[#f5f0dc] rounded-[1rem] mb-2.5 hover:bg-[#ebe5cc] transition-colors" onClick={onEditProfile}>
              <div className="flex items-center gap-3">
                <Edit3 size={18} className="text-[#6b8e6f]" />
                <span className="text-[#2d3e2d] text-sm">프로필 수정</span>
              </div>
              <ChevronRight size={18} className="text-[#9ca89d]" />
            </button>
          )}

          {onNavigateToMyItems && (
            <button className="w-full flex items-center justify-between p-4 bg-[#f5f0dc] rounded-[1rem] mb-2.5 hover:bg-[#ebe5cc] transition-colors" onClick={onNavigateToMyItems}>
              <div className="flex items-center gap-3">
                <Package size={18} className="text-[#6b8e6f]" />
                <span className="text-[#2d3e2d] text-sm">내 아이템함</span>
                {ownedBadges.length > 0 && (
                  <span className="text-[10px] bg-[#f5a145] text-white px-1.5 py-0.5 rounded-full font-medium">{getActiveItems(userInfo.email).length}</span>
                )}
              </div>
              <ChevronRight size={18} className="text-[#9ca89d]" />
            </button>
          )}

          {onNavigateToMessages && (
            <button className="w-full flex items-center justify-between p-4 bg-[#f5f0dc] rounded-[1rem] mb-2.5 hover:bg-[#ebe5cc] transition-colors" onClick={onNavigateToMessages}>
              <div className="flex items-center gap-3">
                <Mail size={18} className="text-[#6b8e6f]" />
                <span className="text-[#2d3e2d] text-sm">쪽지함</span>
              </div>
              <ChevronRight size={18} className="text-[#9ca89d]" />
            </button>
          )}

          <button className="w-full flex items-center justify-between p-4 bg-[#f5f0dc] rounded-[1rem] mb-2.5 hover:bg-[#ebe5cc] transition-colors" onClick={onNavigateToApplications}>
            <div className="flex items-center gap-3">
              <ClipboardList size={18} className="text-[#6b8e6f]" />
              <span className="text-[#2d3e2d] text-sm">신청한 체험단</span>
            </div>
            <ChevronRight size={18} className="text-[#9ca89d]" />
          </button>

          <button className="w-full flex items-center justify-between p-4 bg-[#f5f0dc] rounded-[1rem] hover:bg-[#ebe5cc] transition-colors" onClick={onNavigateToFavorites}>
            <div className="flex items-center gap-3">
              <Heart size={18} className="text-[#6b8e6f]" />
              <span className="text-[#2d3e2d] text-sm">찜한 체험단</span>
            </div>
            <ChevronRight size={18} className="text-[#9ca89d]" />
          </button>
        </div>

        {/* ── 설정 그룹 ── */}
        <div className="bg-white rounded-[1.5rem] p-6 mb-4 border-2 border-[#d4c5a0]">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-7 h-7 rounded-full bg-[#6b8e6f]/10 flex items-center justify-center">
              <Settings size={15} className="text-[#6b8e6f]" />
            </div>
            <h3 className="text-[#2d3e2d] text-[15px] font-semibold">설정</h3>
          </div>

          {/* 다크모드 토글 */}
          <div className="w-full flex items-center justify-between p-4 bg-[#f5f0dc] rounded-[1rem] mb-2.5">
            <div className="flex items-center gap-3">
              {darkMode.isDark ? <Moon size={18} className="text-[#6b8e6f]" /> : <Sun size={18} className="text-[#6b8e6f]" />}
              <span className="text-[#2d3e2d] text-sm">{darkMode.isDark ? '다크모드' : '라이트모드'}</span>
            </div>
            <button
              onClick={darkMode.toggle}
              className={`relative w-11 h-6 rounded-full transition-colors ${darkMode.isDark ? 'bg-[#6b8e6f]' : 'bg-gray-300'}`}
            >
              <div className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${darkMode.isDark ? 'translate-x-5.5 left-0.5' : 'left-0.5'}`} 
                   style={{ transform: darkMode.isDark ? 'translateX(22px)' : 'translateX(0)' }} />
            </button>
          </div>

          <button className="w-full flex items-center justify-between p-4 bg-[#f5f0dc] rounded-[1rem] mb-2.5 hover:bg-[#ebe5cc] transition-colors" onClick={onLogout}>
            <div className="flex items-center gap-3">
              <LogOut size={18} className="text-[#6b8e6f]" />
              <span className="text-[#2d3e2d] text-sm">로그아웃</span>
            </div>
            <ChevronRight size={18} className="text-[#9ca89d]" />
          </button>

          <button className="w-full flex items-center justify-between p-4 rounded-[1rem] hover:bg-red-50/60 transition-colors" onClick={() => setShowDeleteModal(true)}>
            <div className="flex items-center gap-3">
              <span className="w-[18px] h-[18px] flex items-center justify-center text-red-400 text-sm">⚠</span>
              <span className="text-sm text-red-500">회원 탈퇴</span>
            </div>
            <ChevronRight size={16} className="text-red-300" />
          </button>
        </div>

        {/* ── 정보 그룹 ── */}
        <div className="bg-white rounded-[1.5rem] p-6 mb-6 border-2 border-[#d4c5a0]">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-7 h-7 rounded-full bg-[#6b8e6f]/10 flex items-center justify-center">
              <Info size={15} className="text-[#6b8e6f]" />
            </div>
            <h3 className="text-[#2d3e2d] text-[15px] font-semibold">정보</h3>
          </div>

          {onNavigateToNotice && (
            <button className="w-full flex items-center justify-between p-4 bg-[#f5f0dc] rounded-[1rem] mb-2.5 hover:bg-[#ebe5cc] transition-colors" onClick={onNavigateToNotice}>
              <div className="flex items-center gap-3">
                <Megaphone size={18} className="text-[#6b8e6f]" />
                <span className="text-[#2d3e2d] text-sm">공지사항</span>
              </div>
              <ChevronRight size={18} className="text-[#9ca89d]" />
            </button>
          )}

          <button className="w-full flex items-center justify-between p-4 bg-[#f5f0dc] rounded-[1rem] mb-2.5 hover:bg-[#ebe5cc] transition-colors" onClick={onNavigateToTerms}>
            <div className="flex items-center gap-3">
              <FileText size={18} className="text-[#6b8e6f]" />
              <span className="text-[#2d3e2d] text-sm">이용약관</span>
            </div>
            <ChevronRight size={18} className="text-[#9ca89d]" />
          </button>

          <button className="w-full flex items-center justify-between p-4 bg-[#f5f0dc] rounded-[1rem] hover:bg-[#ebe5cc] transition-colors" onClick={onNavigateToPrivacy}>
            <div className="flex items-center gap-3">
              <Shield size={18} className="text-[#6b8e6f]" />
              <span className="text-[#2d3e2d] text-sm">개인정보 처리방침</span>
            </div>
            <ChevronRight size={18} className="text-[#9ca89d]" />
          </button>

          <div className="mt-4 pt-3 border-t border-[#d4c5a0]/50 text-center">
            <span className="text-xs text-[#9ca89d]">앱 버전 1.2.0</span>
          </div>
        </div>

        {/* Excellence Recommendation */}
        <div className="bg-white rounded-[1.5rem] p-6 mb-5 border border-gray-100 shadow-sm">
          <div className="flex items-start gap-4">
            <div className="bg-gradient-to-br from-[#6b8e6f] to-[#8fa893] rounded-xl p-3 shadow-sm">
              <TrendingUp size={22} className="text-white" />
            </div>
            <div className="flex-1">
              <h4 className="text-[#2d3e2d] text-[15px] font-semibold mb-1">우수 평가단 등급</h4>
              <p className="text-sm text-[#6b8e6f]">
                솔직한 리뷰로 더 많은 체험 기회를 받아보세요
              </p>
            </div>
          </div>
          
          <div className="bg-[#f5f0dc]/60 rounded-xl p-4 mt-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-medium text-[#6b8e6f]">신뢰도 점수</span>
              <span className="text-sm font-bold text-[#2d3e2d]">92/100</span>
            </div>
            <div className="w-full bg-white rounded-full h-2 overflow-hidden">
              <div className="bg-gradient-to-r from-[#6b8e6f] to-[#8fa893] h-full rounded-full" style={{ width: '92%' }}></div>
            </div>
          </div>
        </div>

        {/* My Reviews */}
        <div className="mb-6">
          <h3 className="text-[#2d3e2d] text-[15px] font-semibold mb-4">내가 작성한 리뷰</h3>
          <div className="space-y-3">
            {completedReviews.length === 0 ? (
              <div className="text-center py-10 bg-white rounded-[1.5rem] border border-gray-100">
                <div className="text-3xl mb-2">📝</div>
                <p className="text-sm text-[#9ca89d]">작성한 리뷰가 없습니다</p>
              </div>
            ) : (
              completedReviews.map((review) => {
                // Format date
                const date = new Date(review.createdAt);
                const formattedDate = `${date.getFullYear()}.${String(date.getMonth() + 1).padStart(2, '0')}.${String(date.getDate()).padStart(2, '0')}`;
                
                // Find the matching product
                const reviewProduct: Product = {
                  id: review.productId,
                  name: review.productName,
                  image: review.productImage,
                  seller: "동네식당",
                  category: "korean",
                  location: "서울시 마포구",
                  reviewCount: 32,
                  description: review.pros || review.cons || review.improvements,
                  applicationDeadline: "12.20(금) - 12.25(수)",
                  requiredReviewers: 50,
                  currentApplicants: 38,
                  likeCount: 124,
                  distance: "0.5km",
                  calculatedDistance: undefined
                };
                
                return (
                  <div key={review.id} className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm">
                    <div className="flex gap-3.5">
                      <div className="w-[72px] h-[72px] rounded-xl overflow-hidden bg-gray-100 shrink-0">
                        <ImageWithFallback
                          src={review.productImage}
                          alt={review.productName}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-[#2d3e2d] text-sm font-semibold mb-1.5 truncate">{review.productName}</h4>
                        <p className="text-xs text-gray-500 line-clamp-2 leading-relaxed">
                          {review.pros && `장점: ${review.pros}`}
                          {review.cons && ` / 단점: ${review.cons}`}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-50">
                      <span className="text-[11px] text-[#9ca89d]">{formattedDate}</span>
                      <button 
                        className="text-xs font-medium text-[#6b8e6f] hover:text-[#5a7a5e] px-2.5 py-1 rounded-lg hover:bg-[#6b8e6f]/5 transition-colors" 
                        onClick={() => onEditReview && onEditReview(reviewProduct)}
                      >
                        수정하기
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>

      {/* Level System Modal */}
      <LevelSystemModal
        isOpen={showLevelModal}
        onClose={() => setShowLevelModal(false)}
        currentLevel={userLevel}
      />

      {/* Delete Account Modal */}
      <DeleteAccountModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={() => { setShowDeleteModal(false); onDeleteAccount ? onDeleteAccount() : onLogout(); }}
        accessToken={accessToken || ""}
        userEmail={userInfo.email}
      />
    </div>
  );
}