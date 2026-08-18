import { useState } from "react";
import { Mail, Lock, ArrowLeft } from "lucide-react";
import { Logo } from "./Logo";
import { toast } from "sonner";
import type { UserInfo } from "../App";
import { publicAnonKey } from "../utils/supabase/info";
import { requestJson } from "../utils/request";

interface LoginPageProps {
  onBack: () => void;
  onLoginComplete: (userData: UserInfo, accessToken: string) => void;
  onSwitchToSignup: () => void;
}

export function LoginPage({ onBack, onLoginComplete, onSwitchToSignup }: LoginPageProps) {
  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });
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

      // Explicitly handle cases where 계정이 없음/비밀번호 불일치 등
      if (!response.ok) {
        // HTTP 404 or backend provided error means account not found or invalid
        const message =
          data?.error === 'USER_NOT_FOUND' || response.status === 404
            ? '해당 이메일의 계정을 찾을 수 없습니다'
            : data?.error === 'INVALID_CREDENTIALS' || response.status === 401
            ? '이메일 또는 비밀번호가 올바르지 않습니다'
            : data?.error?.includes?.('non-JSON response')
            ? '서버가 응답하지 않습니다. 나중에 다시 시도해주세요'
            : data?.error || '로그인에 실패했습니다';
        toast.error(message);
        return;
      }

      // Validate presence of user object and token
      if (!data?.user || !data?.user?.email) {
        toast.error('계정 정보를 찾을 수 없습니다');
        return;
      }
      if (!data?.accessToken) {
        toast.error('인증 토큰이 없습니다. 다시 시도해주세요');
        return;
      }

      toast.success(data.message || '로그인 성공!');

      // Convert backend user data to UserInfo format
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
      // If request was intentionally aborted (timeout or navigation), avoid noisy error
      if (error?.name === "AbortError") {
        toast.warning("요청이 시간 초과되었습니다. 네트워크 상태를 확인해주세요.");
      } else {
        console.error("Login error:", error);
        toast.error("서버 연결에 실패했습니다");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="pt-14 pb-10 px-6">
        <div className="max-w-md mx-auto">
          <button onClick={onBack} className="text-gray-800 mb-8 hover:opacity-70 -ml-1">
            <ArrowLeft size={22} />
          </button>

          <h1 className="text-[26px] font-bold text-gray-900 mb-2">
            로그인
          </h1>
          <p className="text-[15px] text-gray-500">
            밥터뷰에 오신 것을 환영합니다
          </p>
        </div>
      </div>

      {/* Form */}
      <div className="max-w-md mx-auto px-6">
        <div className="bg-white">
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email */}
            <div>
              <label className="block text-[13px] font-medium text-gray-700 mb-1.5">
                이메일
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="example@email.com"
                  className="w-full pl-11 pr-4 py-3 rounded-xl border border-gray-200 bg-white text-[14px] focus:outline-none focus:ring-2 focus:ring-gray-900/10 focus:border-gray-300 transition-all"
                  disabled={isLoading}
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-[13px] font-medium text-gray-700 mb-1.5">
                비밀번호
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder="비밀번호를 입력하세요"
                  className="w-full pl-11 pr-4 py-3 rounded-xl border border-gray-200 bg-white text-[14px] focus:outline-none focus:ring-2 focus:ring-gray-900/10 focus:border-gray-300 transition-all"
                  disabled={isLoading}
                />
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full h-[52px] bg-gray-900 text-white rounded-xl font-semibold text-[15px] hover:bg-gray-800 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {isLoading && (
                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
                </svg>
              )}
              {isLoading ? "로그인 중..." : "로그인"}
            </button>

            {/* Divider */}
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-white text-gray-400">또는</span>
              </div>
            </div>

            {/* Switch to Signup */}
            <button
              type="button"
              onClick={onSwitchToSignup}
              className="w-full h-[52px] border border-gray-200 text-gray-700 rounded-xl font-semibold text-[15px] hover:bg-gray-50 transition-colors"
            >
              회원가입
            </button>
          </form>
        </div>

        {/* Info */}
        <div className="mt-6 text-center">
          <p className="text-sm text-[#9ca89d]">
            처음이신가요? 회원가입하고 다양한 체험단에 참여하세요!
          </p>
        </div>
      </div>
    </div>
  );
}