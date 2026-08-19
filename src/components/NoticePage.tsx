import { useState } from "react";
import { ArrowLeft, ChevronRight, Megaphone, Pin } from "lucide-react";

interface Notice {
  id: string;
  title: string;
  content: string;
  date: string;
  pinned?: boolean;
  category: "update" | "event" | "notice";
}

interface NoticePageProps {
  onBack: () => void;
}

// 기본 공지사항 데이터 (나중에 백엔드 연동 가능)
const NOTICES: Notice[] = [
  {
    id: "1",
    title: "밥터뷰 서비스 오픈!",
    content: "안녕하세요, 밥터뷰입니다!\n\n우리동네 맛집 체험단 플랫폼 '밥터뷰'가 정식 오픈했습니다.\n\n체험단에 신청하고, 솔직한 리뷰를 남기고, 포인트를 적립해보세요!\n\n많은 이용 부탁드립니다. 🍽️",
    date: "2026.08.18",
    pinned: true,
    category: "notice",
  },
  {
    id: "2",
    title: "포인트 시스템 안내",
    content: "리뷰 작성 시 포인트가 적립됩니다.\n\n• 기본 리뷰: 500P\n• 사진 포함 리뷰: +보너스\n• 레벨업 시 적립 배율 증가\n\n적립된 포인트는 포인트샵에서 다양한 혜택으로 교환할 수 있습니다.",
    date: "2026.08.18",
    pinned: false,
    category: "notice",
  },
  {
    id: "3",
    title: "소셜 로그인 기능 추가",
    content: "카카오 로그인이 추가되었습니다!\n\n이제 카카오 계정으로 간편하게 로그인할 수 있습니다.\n구글 로그인도 곧 지원 예정입니다.",
    date: "2026.08.18",
    pinned: false,
    category: "update",
  },
  {
    id: "4",
    title: "체험단 이용 가이드",
    content: "체험단 이용 방법을 안내드립니다.\n\n1. 홈에서 원하는 체험단을 찾아 신청하기\n2. 사업자가 선정하면 알림으로 안내\n3. 제품을 체험한 후 솔직한 리뷰 작성\n4. 포인트 적립!\n\n리뷰는 장점, 단점, 개선점으로 나눠 작성하면 더 좋습니다.",
    date: "2026.08.17",
    pinned: false,
    category: "notice",
  },
];

const categoryStyle = {
  update: { label: "업데이트", color: "bg-blue-50 text-blue-600" },
  event: { label: "이벤트", color: "bg-orange-50 text-[#f5a145]" },
  notice: { label: "공지", color: "bg-[#6b8e6f]/10 text-[#6b8e6f]" },
};

export function NoticePage({ onBack }: NoticePageProps) {
  const [selectedNotice, setSelectedNotice] = useState<Notice | null>(null);

  // 상세 보기
  if (selectedNotice) {
    const style = categoryStyle[selectedNotice.category];
    return (
      <div className="min-h-screen bg-[#fffef5]">
        <div className="sticky top-0 bg-[#fffef5] border-b border-gray-100 z-10">
          <div className="max-w-md mx-auto px-5 h-14 flex items-center gap-3">
            <button onClick={() => setSelectedNotice(null)} className="text-gray-800 active:opacity-50">
              <ArrowLeft size={22} />
            </button>
            <h4 className="text-base font-semibold text-gray-900">공지사항</h4>
          </div>
        </div>

        <div className="max-w-md mx-auto px-5 py-6">
          <span className={`inline-block text-xs font-medium px-2.5 py-1 rounded-full mb-3 ${style.color}`}>
            {style.label}
          </span>
          <h2 className="text-lg font-bold text-gray-900 mb-2">{selectedNotice.title}</h2>
          <p className="text-sm text-gray-400 mb-6">{selectedNotice.date}</p>
          <div className="text-sm text-gray-700 leading-relaxed whitespace-pre-line">
            {selectedNotice.content}
          </div>
        </div>
      </div>
    );
  }

  // 목록
  return (
    <div className="min-h-screen bg-[#fffef5] pb-20">
      <div className="bg-gradient-to-br from-[#6b8e6f] to-[#8fa893] pt-8 pb-12">
        <div className="max-w-md mx-auto px-6">
          <button onClick={onBack} className="text-white mb-6 hover:opacity-80">
            <ArrowLeft size={22} />
          </button>
          <h1 className="text-white text-xl font-bold mb-1 flex items-center gap-2">
            <Megaphone size={22} /> 공지사항
          </h1>
          <p className="text-white/80 text-sm">밥터뷰의 새 소식을 확인하세요</p>
        </div>
      </div>

      <div className="max-w-md mx-auto px-6 -mt-6 space-y-2">
        {NOTICES.map(notice => {
          const style = categoryStyle[notice.category];
          return (
            <button
              key={notice.id}
              onClick={() => setSelectedNotice(notice)}
              className="w-full bg-white rounded-2xl p-4 border-2 border-[#d4c5a0] text-left hover:border-[#6b8e6f] transition-colors"
            >
              <div className="flex items-start gap-3">
                {notice.pinned && <Pin size={14} className="text-[#f5a145] shrink-0 mt-1" />}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${style.color}`}>
                      {style.label}
                    </span>
                    <span className="text-[11px] text-gray-400">{notice.date}</span>
                  </div>
                  <h3 className="text-sm font-semibold text-gray-900 truncate">{notice.title}</h3>
                </div>
                <ChevronRight size={16} className="text-gray-300 shrink-0 mt-1" />
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
