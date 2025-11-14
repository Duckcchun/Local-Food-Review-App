import { ArrowLeft } from "lucide-react";

interface PrivacyPageProps {
  onBack: () => void;
}

export function PrivacyPage({ onBack }: PrivacyPageProps) {
  return (
    <div className="min-h-screen bg-[#fffef5] pb-24">
      <div className="sticky top-0 bg-white border-b-2 border-[#d4c5a0] z-10">
        <div className="max-w-md mx-auto px-6 py-4 flex items-center justify-between">
          <button onClick={onBack} className="text-[#2d3e2d] hover:text-[#6b8e6f] transition-colors">
            <ArrowLeft size={24} />
          </button>
          <h4 className="text-[#2d3e2d]">개인정보 처리방침</h4>
          <div className="w-6" />
        </div>
      </div>

      <div className="max-w-md mx-auto px-6 py-6">
        <div className="bg-white rounded-[1.5rem] p-6 border-2 border-[#d4c5a0] space-y-4 text-sm text-[#2d3e2d]">
          <p>밥터뷰(이하 "회사")는 이용자의 개인정보를 중요시하며, 관련 법령을 준수합니다.</p>
          <h3 className="text-base font-semibold">1. 수집하는 개인정보 항목</h3>
          <ul className="list-disc pl-5 space-y-1">
            <li>필수: 이메일, 비밀번호, 이름, 연락처</li>
            <li>사업자 이용 시: 상호, 사업자번호, 주소 등</li>
          </ul>
          <h3 className="text-base font-semibold">2. 개인정보의 이용 목적</h3>
          <ul className="list-disc pl-5 space-y-1">
            <li>회원 관리, 서비스 제공, 체험단 운영 및 리뷰 관리</li>
            <li>고지사항 전달 및 고객문의 대응</li>
          </ul>
          <h3 className="text-base font-semibold">3. 보관 및 파기</h3>
          <p>관련 법령에 따른 보관 기간 경과 또는 처리 목적 달성 시 지체 없이 파기합니다.</p>
          <h3 className="text-base font-semibold">4. 제3자 제공 및 위탁</h3>
          <p>법령에 특별한 규정이 있는 경우를 제외하고, 동의 없이 제3자에게 제공하지 않습니다.</p>
          <p className="text-xs text-[#9ca89d]">본 문서는 샘플 방침입니다. 실제 서비스 운영에 맞춰 전문 법률 검토를 권장합니다.</p>
        </div>
      </div>
    </div>
  );
}
