import { useState } from "react";
import { ArrowLeft, User, Store, Mail, Lock, Phone, Building } from "lucide-react";
import { Logo } from "./Logo";
import { SocialLoginButtons } from "./SocialLoginButtons";
import { toast } from "sonner";
import type { UserInfo } from "../App";
import { requestJson } from "../utils/request";

interface SignupPageProps {
  onBack: () => void;
  onSignupComplete: (userData: UserInfo, accessToken?: string) => void;
  onSwitchToLogin: () => void;
}

type UserType = "reviewer" | "business" | null;

export function SignupPage({ onBack, onSignupComplete, onSwitchToLogin }: SignupPageProps) {
  const [userType, setUserType] = useState<UserType>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "", email: "", password: "", passwordConfirm: "",
    phone: "", businessName: "", businessNumber: "", businessAddress: ""
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!formData.name || !formData.email || !formData.password || !formData.phone) {
      toast.error("필수 정보를 모두 입력해주세요"); return;
    }
    if (formData.password !== formData.passwordConfirm) {
      toast.error("비밀번호가 일치하지 않습니다"); return;
    }
    if (userType === "business" && (!formData.businessName || !formData.businessNumber)) {
      toast.error("사업자 정보를 모두 입력해주세요"); return;
    }
    if (isLoading) return;
    setIsLoading(true);

    try {
      const { response, data } = await requestJson<any, any>({
        path: "/signup", method: "POST",
        body: { email: formData.email, password: formData.password, name: formData.name, phone: formData.phone, userType, businessName: formData.businessName || null, businessNumber: formData.businessNumber || null, businessAddress: formData.businessAddress || null },
        timeoutMs: 15000,
      });
      if (!response.ok) { toast.error(data.error || "회원가입에 실패했습니다"); return; }
      toast.success(data.message || "회원가입이 완료되었습니다!");

      // Auto login
      try {
        const { response: lr, data: ld } = await requestJson<any, any>({
          path: "/signin", method: "POST",
          body: { email: formData.email, password: formData.password }, timeoutMs: 10000,
        });
        if (lr.ok && ld?.accessToken) {
          const userData: UserInfo = { name: ld.user.name, email: ld.user.email, phone: ld.user.phone, userType: ld.user.userType, businessName: ld.user.businessName, businessNumber: ld.user.businessNumber, businessAddress: ld.user.businessAddress };
          onSignupComplete(userData, ld.accessToken); return;
        }
      } catch {}
      // Fallback: no auto login
      const userData: UserInfo = { name: formData.name, email: formData.email, phone: formData.phone, userType: userType || "reviewer" };
      onSignupComplete(userData);
    } catch (error: any) {
      if (error?.name === "AbortError") toast.warning("요청 시간 초과");
      else toast.error("서버 연결에 실패했습니다");
    } finally { setIsLoading(false); }
  };

  // ─── 첫 화면: 웰컴 페이지 ───
  if (userType === null) {
    return (
      <div className="min-h-screen bg-white flex flex-col">
        {/* Hero */}
        <div className="flex-1 flex flex-col items-center justify-center px-8 pt-20 pb-10">
          <Logo className="mb-8 scale-125" />
          <h1 className="text-2xl font-bold text-gray-900 text-center mb-2">
            우리동네 맛집을<br/>솔직하게 평가해요
          </h1>
          <p className="text-sm text-gray-500 text-center max-w-xs">
            중소 사업자를 응원하고 숨겨진 맛집을 발굴하는<br/>맛 평가 플랫폼
          </p>
        </div>

        {/* CTA Section */}
        <div className="max-w-md mx-auto w-full px-6 pb-10">
          {/* 로그인 (주 버튼) */}
          <button
            onClick={onSwitchToLogin}
            className="w-full h-[52px] bg-gray-900 text-white rounded-xl font-semibold text-[15px] hover:bg-gray-800 active:scale-[0.98] transition-all mb-3"
          >
            로그인
          </button>

          {/* 회원가입 (보조 버튼) */}
          <div className="flex gap-2 mb-2">
            <button
              onClick={() => setUserType("reviewer")}
              className="flex-1 h-[48px] border border-gray-200 text-gray-700 rounded-xl font-medium text-sm hover:bg-gray-50 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
            >
              <User size={16} />
              체험단 가입
            </button>
            <button
              onClick={() => setUserType("business")}
              className="flex-1 h-[48px] border border-gray-200 text-gray-700 rounded-xl font-medium text-sm hover:bg-gray-50 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
            >
              <Store size={16} />
              사업자 가입
            </button>
          </div>

          {/* 소셜 로그인 */}
          <SocialLoginButtons action="로그인" />
        </div>
      </div>
    );
  }

  // ─── 회원가입 폼 ───
  return (
    <div className="min-h-screen bg-white pb-28">
      {/* Header */}
      <div className="sticky top-0 bg-white border-b border-gray-100 z-10">
        <div className="max-w-md mx-auto px-5 h-14 flex items-center justify-between">
          <button onClick={() => setUserType(null)} className="text-gray-800 active:opacity-50">
            <ArrowLeft size={22} />
          </button>
          <h4 className="text-[15px] font-semibold text-gray-900">
            {userType === "reviewer" ? "체험단 회원가입" : "사업자 회원가입"}
          </h4>
          <div className="w-6" />
        </div>
      </div>

      <div className="max-w-md mx-auto px-5 pt-6">
        {/* Icon + Title */}
        <div className="text-center mb-6">
          <div className={`inline-flex items-center justify-center w-14 h-14 rounded-full mb-3 ${userType === "reviewer" ? "bg-orange-100" : "bg-emerald-100"}`}>
            {userType === "reviewer" ? <User size={24} className="text-orange-600" /> : <Store size={24} className="text-emerald-700" />}
          </div>
          <h2 className="text-lg font-bold text-gray-900">
            {userType === "reviewer" ? "체험단으로 시작하기" : "사업자로 시작하기"}
          </h2>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <FormInput icon={User} label="이름" value={formData.name} onChange={v => handleInputChange("name", v)} placeholder="이름을 입력하세요" />
          <FormInput icon={Mail} label="이메일" type="email" value={formData.email} onChange={v => handleInputChange("email", v)} placeholder="example@email.com" />
          <FormInput icon={Phone} label="전화번호" type="tel" value={formData.phone} onChange={v => handleInputChange("phone", v)} placeholder="010-0000-0000" />
          <FormInput icon={Lock} label="비밀번호" type="password" value={formData.password} onChange={v => handleInputChange("password", v)} placeholder="6자 이상 입력" />
          <FormInput icon={Lock} label="비밀번호 확인" type="password" value={formData.passwordConfirm} onChange={v => handleInputChange("passwordConfirm", v)} placeholder="비밀번호를 다시 입력" />

          {userType === "business" && (
            <>
              <div className="pt-2 border-t border-gray-100">
                <p className="text-xs font-medium text-gray-500 mb-3">사업자 정보</p>
              </div>
              <FormInput icon={Store} label="상호명" value={formData.businessName} onChange={v => handleInputChange("businessName", v)} placeholder="상호명을 입력하세요" />
              <FormInput icon={Building} label="사업자 등록번호" value={formData.businessNumber} onChange={v => handleInputChange("businessNumber", v)} placeholder="000-00-00000" />
              <FormInput icon={Building} label="사업장 주소 (선택)" value={formData.businessAddress} onChange={v => handleInputChange("businessAddress", v)} placeholder="사업장 주소를 입력하세요" required={false} />
            </>
          )}

          {/* Terms */}
          <p className="text-[11px] text-gray-400 text-center pt-2">
            가입 시 이용약관 및 개인정보 처리방침에 동의합니다.
          </p>
        </form>
      </div>

      {/* Bottom CTA */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 z-20 pb-[env(safe-area-inset-bottom)]">
        <div className="max-w-md mx-auto px-5 py-3">
          <button
            onClick={handleSubmit}
            disabled={isLoading}
            className="w-full h-[52px] bg-gray-900 text-white rounded-xl font-semibold text-[15px] hover:bg-gray-800 active:scale-[0.98] transition-all disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {isLoading && <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />}
            {isLoading ? "회원가입 중..." : "회원가입 완료"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Helper: Form Input Component ───
function FormInput({ icon: Icon, label, type = "text", value, onChange, placeholder, required = true }: {
  icon: any; label: string; type?: string; value: string; onChange: (v: string) => void; placeholder: string; required?: boolean;
}) {
  return (
    <div>
      <label className="block text-xs font-medium text-gray-600 mb-1.5">
        {label} {required && <span className="text-orange-400">*</span>}
      </label>
      <div className="relative">
        <Icon className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="w-full pl-11 pr-4 py-3.5 rounded-xl border border-gray-200 bg-white text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-gray-900 focus:ring-1 focus:ring-gray-900 transition-all"
        />
      </div>
    </div>
  );
}
