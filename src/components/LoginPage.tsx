import { useState } from "react";
import { Mail, Lock, ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import type { UserInfo } from "../App";
import { SocialLoginButtons } from "./SocialLoginButtons";
import { requestJson } from "../utils/request";

interface LoginPageProps {
  onBack: () => void;
  onLoginComplete: (userData: UserInfo, accessToken: string) => void;
  onSwitchToSignup: () => void;
}

export function LoginPage({ onBack, onLoginComplete, onSwitchToSignup }: LoginPageProps) {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.email || !formData.password) {
      toast.error("이메일과 비밀번호를 입력해주세요");
      return;
    }

    if (isLoading) return;
    setIsLoading(true);

    try {
      const { response, data } = await requestJson<{ email: string; password: string }, any>({
        path: "/signin",
        method: "POST",
        body: { email: formData.email, password: formData.password },
        timeoutMs: 12000,
      });

      if (!response.ok) {
        const message =
          data?.error === 'USER_NOT_FOUND' || response.status === 404
            ? '해당 이메일의 계정을 찾을 수 없습니다'
            : data?.error === 'INVALID_CREDENTIALS' || response.status === 401
            ? '이메일 또는 비밀번호가 올바르지 않습니다'
            : data?.error || '로그인에 실패했습니다';
        toast.error(message);
        return;
      }

      if (!data?.user?.email || !data?.accessToken) {
        toast.error('인증에 실패했습니다. 다시 시도해주세요');
        return;
      }

      toast.success(data.message || '로그인 성공!');

      const userData: UserInfo = {
        name: data.user.name,
        email: data.user.email,
        phone: data.user.phone,
        userType: data.user.userType,
        businessName: data.user.businessName || undefined,
        businessNumber: data.user.businessNumber || undefined,
        businessAddress: data.user.businessAddress || undefined,
      };

      onLoginComplete(userData, data.accessToken);
    } catch (error: any) {
      if (error?.name === "AbortError") {
        toast.warning("요청 시간이 초과되었습니다.");
      } else {
        toast.error("서버 연결에 실패했습니다");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#fffef5] flex flex-col">
      {/* Header */}
      <div className="px-5 pt-14 pb-8">
        <div className="max-w-md mx-auto">
          <button onClick={onBack} className="text-gray-800 mb-8 -ml-1 active:opacity-50">
            <ArrowLeft size={22} />
          </button>
          <h1 className="text-2xl font-bold text-gray-900 mb-1.5">로그인</h1>
          <p className="text-sm text-gray-500">밥터뷰에 오신 것을 환영합니다</p>
        </div>
      </div>

      {/* Form */}
      <div className="flex-1 max-w-md mx-auto w-full px-5">
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Email */}
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1.5">이메일</label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="example@email.com"
                className="w-full pl-11 pr-4 py-3.5 rounded-xl border border-gray-200 bg-white text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-[#6b8e6f] focus:ring-1 focus:ring-[#6b8e6f] transition-all"
                disabled={isLoading}
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1.5">비밀번호</label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                placeholder="비밀번호를 입력하세요"
                className="w-full pl-11 pr-4 py-3.5 rounded-xl border border-gray-200 bg-white text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-[#6b8e6f] focus:ring-1 focus:ring-[#6b8e6f] transition-all"
                disabled={isLoading}
              />
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full h-[52px] bg-[#f5a145] text-white rounded-xl font-semibold text-base hover:bg-[#e89535] active:scale-[0.98] transition-all disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {isLoading && (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            )}
            {isLoading ? "로그인 중..." : "로그인"}
          </button>

          {/* Divider */}
          <div className="flex items-center gap-3 my-2">
            <div className="flex-1 h-px bg-gray-100" />
            <span className="text-xs text-gray-400">또는</span>
            <div className="flex-1 h-px bg-gray-100" />
          </div>

          {/* Signup button */}
          <button
            type="button"
            onClick={onSwitchToSignup}
            className="w-full h-[52px] border border-gray-200 text-gray-700 rounded-xl font-semibold text-base hover:bg-gray-50 active:scale-[0.98] transition-all"
          >
            회원가입
          </button>

          {/* Social Login */}
          <SocialLoginButtons action="로그인" />
        </form>

        {/* Bottom text */}
        <p className="text-center text-xs text-gray-400 mt-8 pb-10">
          처음이신가요? 회원가입하고 다양한 체험단에 참여하세요!
        </p>
      </div>
    </div>
  );
}
