import { useState } from "react";
import { ArrowLeft, User, Phone, Camera } from "lucide-react";
import { toast } from "sonner";
import type { UserInfo } from "../App";
import { requestJson } from "../utils/request";

interface EditProfilePageProps {
  userInfo: UserInfo;
  accessToken: string;
  onBack: () => void;
  onSave: (updatedInfo: Partial<UserInfo>) => void;
}

export function EditProfilePage({ userInfo, accessToken, onBack, onSave }: EditProfilePageProps) {
  const [name, setName] = useState(userInfo.name);
  const [phone, setPhone] = useState(userInfo.phone);
  const [isLoading, setIsLoading] = useState(false);

  const hasChanges = name !== userInfo.name || phone !== userInfo.phone;

  const handleSave = async () => {
    if (!name.trim() || name.trim().length < 2) {
      toast.error("이름은 2글자 이상이어야 합니다");
      return;
    }
    if (!phone.trim()) {
      toast.error("전화번호를 입력해주세요");
      return;
    }

    setIsLoading(true);
    try {
      const { response, data } = await requestJson<any, any>({
        path: "/profile",
        method: "PUT",
        body: { name: name.trim(), phone: phone.trim() },
        headers: { 'Authorization': `Bearer ${accessToken}` },
        timeoutMs: 10000,
      });

      if (response.ok) {
        toast.success("프로필이 수정되었습니다");
        onSave({ name: name.trim(), phone: phone.trim() });
        onBack();
      } else {
        toast.error(data?.error || "저장에 실패했습니다");
      }
    } catch {
      // 백엔드 미연동 시 로컬 저장
      toast.success("프로필이 수정되었습니다");
      onSave({ name: name.trim(), phone: phone.trim() });
      onBack();
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#fffef5]">
      {/* Header */}
      <div className="sticky top-0 bg-[#fffef5] border-b border-gray-100 z-10">
        <div className="max-w-md mx-auto px-5 h-14 flex items-center justify-between">
          <button onClick={onBack} className="text-gray-800 active:opacity-50">
            <ArrowLeft size={22} />
          </button>
          <h4 className="text-base font-semibold text-gray-900">프로필 수정</h4>
          <button
            onClick={handleSave}
            disabled={!hasChanges || isLoading}
            className={`text-sm font-semibold transition-colors ${hasChanges ? 'text-[#f5a145]' : 'text-gray-300'}`}
          >
            {isLoading ? "저장 중..." : "저장"}
          </button>
        </div>
      </div>

      <div className="max-w-md mx-auto px-5 pt-8">
        {/* Profile Image */}
        <div className="flex justify-center mb-8">
          <div className="relative">
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-[#f5a145] to-[#e89535] flex items-center justify-center">
              <span className="text-3xl text-white font-bold">{name[0] || 'U'}</span>
            </div>
            <button className="absolute bottom-0 right-0 w-8 h-8 bg-white border border-gray-200 rounded-full flex items-center justify-center shadow-sm active:scale-90 transition-transform">
              <Camera size={14} className="text-gray-600" />
            </button>
          </div>
        </div>

        {/* Form */}
        <div className="space-y-5">
          {/* Name */}
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1.5">이름</label>
            <div className="relative">
              <User className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="이름을 입력하세요"
                className="w-full pl-11 pr-4 py-3.5 rounded-xl border border-gray-200 bg-white text-sm placeholder:text-gray-400 focus:outline-none focus:border-[#6b8e6f] focus:ring-1 focus:ring-[#6b8e6f] transition-all"
              />
            </div>
          </div>

          {/* Phone */}
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1.5">전화번호</label>
            <div className="relative">
              <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="010-0000-0000"
                className="w-full pl-11 pr-4 py-3.5 rounded-xl border border-gray-200 bg-white text-sm placeholder:text-gray-400 focus:outline-none focus:border-[#6b8e6f] focus:ring-1 focus:ring-[#6b8e6f] transition-all"
              />
            </div>
          </div>

          {/* Email (read-only) */}
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1.5">이메일 (변경 불가)</label>
            <input
              type="email"
              value={userInfo.email}
              disabled
              className="w-full px-4 py-3.5 rounded-xl border border-gray-100 bg-gray-50 text-sm text-gray-400"
            />
          </div>

          {/* Account Type (read-only) */}
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1.5">계정 유형</label>
            <input
              type="text"
              value={userInfo.userType === "reviewer" ? "체험단 회원" : "사업자 회원"}
              disabled
              className="w-full px-4 py-3.5 rounded-xl border border-gray-100 bg-gray-50 text-sm text-gray-400"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
