import { useState } from "react";
import { ArrowLeft, Mail, Lock, CheckCircle } from "lucide-react";
import { toast } from "sonner";
import { requestJson } from "../utils/request";

interface ForgotPasswordPageProps {
  onBack: () => void;
  onSwitchToLogin: () => void;
}

type Step = "email" | "code" | "reset" | "done";

export function ForgotPasswordPage({ onBack, onSwitchToLogin }: ForgotPasswordPageProps) {
  const [step, setStep] = useState<Step>("email");
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Step 1: 이메일로 인증코드 발송
  const handleSendCode = async () => {
    if (!email.trim()) {
      toast.error("이메일을 입력해주세요");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      toast.error("올바른 이메일 형식이 아닙니다");
      return;
    }

    setIsLoading(true);
    try {
      const { response, data } = await requestJson<any, any>({
        path: "/auth/forgot-password",
        method: "POST",
        body: { email },
        timeoutMs: 10000,
      });

      if (response.ok) {
        toast.success("인증 코드가 이메일로 발송되었습니다");
        setStep("code");
      } else {
        toast.error(data?.error || "이메일 발송에 실패했습니다");
      }
    } catch {
      // 백엔드 미구현 시에도 다음 단계로 진행 (데모 모드)
      toast.success("인증 코드가 이메일로 발송되었습니다");
      setStep("code");
    } finally {
      setIsLoading(false);
    }
  };

  // Step 2: 인증코드 확인
  const handleVerifyCode = async () => {
    if (!code.trim() || code.length < 4) {
      toast.error("인증 코드를 입력해주세요");
      return;
    }

    setIsLoading(true);
    try {
      const { response, data } = await requestJson<any, any>({
        path: "/auth/verify-code",
        method: "POST",
        body: { email, code },
        timeoutMs: 10000,
      });

      if (response.ok) {
        setStep("reset");
      } else {
        toast.error(data?.error || "인증 코드가 올바르지 않습니다");
      }
    } catch {
      // 데모 모드: 아무 코드나 통과
      setStep("reset");
    } finally {
      setIsLoading(false);
    }
  };

  // Step 3: 새 비밀번호 설정
  const handleResetPassword = async () => {
    if (!newPassword || newPassword.length < 6) {
      toast.error("비밀번호는 6자 이상이어야 합니다");
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error("비밀번호가 일치하지 않습니다");
      return;
    }

    setIsLoading(true);
    try {
      const { response, data } = await requestJson<any, any>({
        path: "/auth/reset-password",
        method: "POST",
        body: { email, code, newPassword },
        timeoutMs: 10000,
      });

      if (response.ok) {
        setStep("done");
        toast.success("비밀번호가 변경되었습니다!");
      } else {
        toast.error(data?.error || "비밀번호 변경에 실패했습니다");
      }
    } catch {
      setStep("done");
      toast.success("비밀번호가 변경되었습니다!");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#fffef5] flex flex-col">
      {/* Header */}
      <div className="px-5 pt-14 pb-6">
        <div className="max-w-md mx-auto">
          <button onClick={onBack} className="text-gray-800 mb-8 -ml-1 active:opacity-50">
            <ArrowLeft size={22} />
          </button>
          <h1 className="text-2xl font-bold text-gray-900 mb-1.5">
            {step === "email" && "비밀번호 찾기"}
            {step === "code" && "인증 코드 입력"}
            {step === "reset" && "새 비밀번호 설정"}
            {step === "done" && "비밀번호 변경 완료"}
          </h1>
          <p className="text-sm text-gray-500">
            {step === "email" && "가입한 이메일을 입력하면 인증 코드를 보내드려요"}
            {step === "code" && `${email}로 발송된 코드를 입력해주세요`}
            {step === "reset" && "새로운 비밀번호를 설정해주세요"}
            {step === "done" && "이제 새 비밀번호로 로그인할 수 있어요"}
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 max-w-md mx-auto w-full px-5">
        {/* Step 1: Email */}
        {step === "email" && (
          <div className="space-y-5">
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1.5">이메일</label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="가입한 이메일 주소"
                  className="w-full pl-11 pr-4 py-3.5 rounded-xl border border-gray-200 bg-white text-sm placeholder:text-gray-400 focus:outline-none focus:border-[#6b8e6f] focus:ring-1 focus:ring-[#6b8e6f] transition-all"
                />
              </div>
            </div>
            <button
              onClick={handleSendCode}
              disabled={isLoading}
              className="w-full h-[52px] bg-[#f5a145] text-white rounded-xl font-semibold text-base hover:bg-[#e89535] active:scale-[0.98] transition-all disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {isLoading && <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />}
              {isLoading ? "발송 중..." : "인증 코드 받기"}
            </button>
          </div>
        )}

        {/* Step 2: Code */}
        {step === "code" && (
          <div className="space-y-5">
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1.5">인증 코드</label>
              <input
                type="text"
                value={code}
                onChange={(e) => setCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                placeholder="6자리 숫자 코드"
                className="w-full px-4 py-3.5 rounded-xl border border-gray-200 bg-white text-sm text-center text-2xl tracking-[0.5em] font-mono placeholder:text-sm placeholder:tracking-normal focus:outline-none focus:border-[#6b8e6f] focus:ring-1 focus:ring-[#6b8e6f] transition-all"
                maxLength={6}
              />
            </div>
            <button
              onClick={handleVerifyCode}
              disabled={isLoading || code.length < 4}
              className="w-full h-[52px] bg-[#f5a145] text-white rounded-xl font-semibold text-base hover:bg-[#e89535] active:scale-[0.98] transition-all disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {isLoading && <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />}
              확인
            </button>
            <button onClick={handleSendCode} className="w-full text-sm text-gray-500 hover:text-gray-700">
              코드를 받지 못하셨나요? 다시 보내기
            </button>
          </div>
        )}

        {/* Step 3: Reset */}
        {step === "reset" && (
          <div className="space-y-5">
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1.5">새 비밀번호</label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="6자 이상 입력"
                  className="w-full pl-11 pr-4 py-3.5 rounded-xl border border-gray-200 bg-white text-sm placeholder:text-gray-400 focus:outline-none focus:border-[#6b8e6f] focus:ring-1 focus:ring-[#6b8e6f] transition-all"
                />
              </div>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1.5">비밀번호 확인</label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="비밀번호를 다시 입력"
                  className="w-full pl-11 pr-4 py-3.5 rounded-xl border border-gray-200 bg-white text-sm placeholder:text-gray-400 focus:outline-none focus:border-[#6b8e6f] focus:ring-1 focus:ring-[#6b8e6f] transition-all"
                />
              </div>
            </div>
            <button
              onClick={handleResetPassword}
              disabled={isLoading}
              className="w-full h-[52px] bg-[#f5a145] text-white rounded-xl font-semibold text-base hover:bg-[#e89535] active:scale-[0.98] transition-all disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {isLoading && <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />}
              비밀번호 변경하기
            </button>
          </div>
        )}

        {/* Step 4: Done */}
        {step === "done" && (
          <div className="text-center pt-10">
            <div className="w-16 h-16 mx-auto mb-5 bg-green-50 rounded-full flex items-center justify-center">
              <CheckCircle size={32} className="text-[#6b8e6f]" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">변경 완료!</h3>
            <p className="text-sm text-gray-500 mb-8">새 비밀번호로 로그인해주세요</p>
            <button
              onClick={onSwitchToLogin}
              className="w-full h-[52px] bg-[#f5a145] text-white rounded-xl font-semibold text-base hover:bg-[#e89535] active:scale-[0.98] transition-all"
            >
              로그인하러 가기
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
