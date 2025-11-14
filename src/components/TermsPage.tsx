import { ArrowLeft } from "lucide-react";

interface TermsPageProps {
  onBack: () => void;
}

export function TermsPage({ onBack }: TermsPageProps) {
  return (
    <div className="min-h-screen bg-[#fffef5] pb-24">
      <div className="sticky top-0 bg-white border-b-2 border-[#d4c5a0] z-10">
        <div className="max-w-md mx-auto px-6 py-4 flex items-center justify-between">
          <button onClick={onBack} className="text-[#2d3e2d] hover:text-[#6b8e6f] transition-colors">
            <ArrowLeft size={24} />
          </button>
          <h4 className="text-[#2d3e2d]">이용약관</h4>
          <div className="w-6" />
        </div>
      </div>

      <div className="max-w-md mx-auto px-6 py-6">
        <div className="bg-white rounded-[1.5rem] p-6 border-2 border-[#d4c5a0] space-y-4 text-sm text-[#2d3e2d]">
          <p>본 약관은 밥터뷰 서비스(이하 "서비스")의 이용과 관련하여, 회사와 이용자 간의 권리, 의무 및 책임 사항을 규정합니다.</p>
          <h3 className="text-base font-semibold">1. 목적</h3>
          <p>서비스의 제공 및 이용 조건을 정함을 목적으로 합니다.</p>
          <h3 className="text-base font-semibold">2. 정의</h3>
          <p>사업자: 체험단을 등록·운영하는 사용자, 리뷰어: 체험단에 신청하여 리뷰를 작성하는 사용자</p>
          <h3 className="text-base font-semibold">3. 서비스의 제공</h3>
          <ul className="list-disc pl-5 space-y-1">
            <li>체험단 등록·신청·승인/거절·리뷰 작성 기능</li>
            <li>알림/포인트/즐겨찾기 등 부가 기능</li>
          </ul>
          <h3 className="text-base font-semibold">4. 이용자의 의무</h3>
          <ul className="list-disc pl-5 space-y-1">
            <li>허위 정보 또는 타인의 권리를 침해하는 콘텐츠를 게재하지 않습니다.</li>
            <li>서비스 이용 시 관련 법령 및 본 약관을 준수합니다.</li>
          </ul>
          <h3 className="text-base font-semibold">5. 면책</h3>
          <p>불가항력 또는 이용자의 귀책사유로 인해 발생한 손해에 대해 회사는 책임을 지지 않습니다.</p>
          <p className="text-xs text-[#9ca89d]">본 문서는 샘플 약관입니다. 실제 서비스 운영에 맞춰 전문 법률 검토를 권장합니다.</p>
        </div>
      </div>
    </div>
  );
}
