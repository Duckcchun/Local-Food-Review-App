import { useState } from 'react';
import { Bell, X } from 'lucide-react';
import { useNotificationPermission } from '../../hooks/useRealtimeNotifications';

/**
 * Banner that prompts the user to enable browser notifications.
 * Only shows when permission is 'default' (not yet asked).
 * Dismissible and remembers dismissal via localStorage.
 */
export function NotificationPermissionBanner() {
  const { permission, request, isSupported } = useNotificationPermission();
  const [dismissed, setDismissed] = useState(() => {
    try {
      return localStorage.getItem('notif-banner-dismissed') === 'true';
    } catch { return false; }
  });
  const [requesting, setRequesting] = useState(false);

  // Don't show if not supported, already granted/denied, or dismissed
  if (!isSupported || permission !== 'default' || dismissed) {
    return null;
  }

  const handleEnable = async () => {
    setRequesting(true);
    await request();
    setRequesting(false);
    handleDismiss();
  };

  const handleDismiss = () => {
    setDismissed(true);
    try { localStorage.setItem('notif-banner-dismissed', 'true'); } catch {}
  };

  return (
    <div className="max-w-md mx-auto px-6 mb-4">
      <div className="bg-gradient-to-r from-[#6b8e6f]/10 to-[#f5a145]/10 border-2 border-[#d4c5a0] rounded-2xl p-4 flex items-start gap-3">
        <div className="w-10 h-10 rounded-full bg-[#fff4e0] flex items-center justify-center shrink-0">
          <Bell size={20} className="text-[#f5a145]" />
        </div>

        <div className="flex-1 min-w-0">
          <h4 className="text-sm font-bold text-[#2d3e2d] mb-1">
            알림을 놓치지 마세요!
          </h4>
          <p className="text-xs text-[#6b8e6f] mb-3">
            체험단 선정 결과, 새 리뷰 요청 등을 실시간으로 받아보세요.
          </p>
          <button
            onClick={handleEnable}
            disabled={requesting}
            className="text-xs font-medium bg-[#6b8e6f] text-white px-4 py-2 rounded-xl hover:bg-[#5a7a5e] transition-colors disabled:opacity-50"
          >
            {requesting ? '설정 중...' : '알림 허용하기'}
          </button>
        </div>

        <button
          onClick={handleDismiss}
          className="text-[#9ca89d] hover:text-[#6b8e6f] transition-colors shrink-0"
          aria-label="닫기"
        >
          <X size={18} />
        </button>
      </div>
    </div>
  );
}
