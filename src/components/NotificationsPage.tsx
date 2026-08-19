import { ChevronLeft, CheckCircle, XCircle, MessageSquare, Bell, Star } from "lucide-react";
import { Logo } from "./Logo";
import type { Notification } from "../App";

interface NotificationsPageProps {
  notifications: Notification[];
  onBack: () => void;
  onMarkAsRead: (id: string) => void;
}

export function NotificationsPage({ notifications, onBack, onMarkAsRead }: NotificationsPageProps) {
  const unreadCount = notifications.filter(n => !n.read).length;

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "selection":
        return { icon: CheckCircle, color: "text-[#6b8e6f]", bg: "bg-green-100" };
      case "rejection":
        return { icon: XCircle, color: "text-[#9ca89d]", bg: "bg-gray-100" };
      case "review-request":
        return { icon: MessageSquare, color: "text-[#f5a145]", bg: "bg-orange-100" };
      case "review-received":
        return { icon: Star, color: "text-[#f5a145]", bg: "bg-yellow-100" };
      case "application":
        return { icon: Bell, color: "text-[#6b8e6f]", bg: "bg-blue-100" };
      default:
        return { icon: Bell, color: "text-[#6b8e6f]", bg: "bg-gray-100" };
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return "방금 전";
    if (diffMins < 60) return `${diffMins}분 전`;
    if (diffHours < 24) return `${diffHours}시간 전`;
    if (diffDays < 7) return `${diffDays}일 전`;
    
    return `${date.getFullYear()}.${String(date.getMonth() + 1).padStart(2, '0')}.${String(date.getDate()).padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen bg-[#fafaf7] pb-6">
      {/* Header */}
  <div className="bg-gradient-to-br from-[#6b8e6f] via-[#7a9a7e] to-[#8fa893] pt-8 pb-14">
        <div className="max-w-md mx-auto px-6">
          <button onClick={onBack} className="mb-6 w-9 h-9 flex items-center justify-center rounded-full bg-white/15 hover:bg-white/25 transition-colors">
            <ChevronLeft size={20} className="text-white" />
          </button>
          <Logo className="mb-6" variant="white" />
          <div className="flex items-center justify-between">
            <h1 className="text-white">알림</h1>
            {unreadCount > 0 && (
              <span className="bg-white/20 backdrop-blur-sm text-white px-3 py-1 rounded-full text-xs font-medium">
                {unreadCount}개의 새 알림
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-md mx-auto px-5 -mt-8">
        {/* Notifications List */}
        <div className="space-y-2.5">
          {notifications.length === 0 ? (
            <div className="bg-white rounded-2xl p-12 text-center border border-gray-100 shadow-sm">
              <div className="w-16 h-16 mx-auto mb-4 bg-gray-50 rounded-2xl flex items-center justify-center">
                <Bell size={28} className="text-gray-300" />
              </div>
              <p className="text-gray-600 font-medium mb-1">알림이 없습니다</p>
              <p className="text-sm text-gray-400">
                새로운 소식이 있으면 여기에 표시됩니다
              </p>
            </div>
          ) : (
            notifications
              .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
              .map((notification) => {
                const { icon: Icon, color, bg } = getNotificationIcon(notification.type);
                
                return (
                  <div
                    key={notification.id}
                    onClick={() => !notification.read && onMarkAsRead(notification.id)}
                    className={`bg-white rounded-2xl overflow-hidden border transition-all cursor-pointer hover:shadow-md ${
                      notification.read
                        ? "border-gray-100 opacity-65"
                        : "border-gray-100 shadow-sm"
                    }`}
                  >
                    <div className="flex">
                      {/* Left color indicator for unread */}
                      <div className={`w-[3px] shrink-0 rounded-l-2xl ${notification.read ? "bg-transparent" : "bg-[#f5a145]"}`} />
                      
                      <div className="flex-1 p-4 flex gap-3.5">
                        {/* Icon */}
                        <div className={`w-10 h-10 rounded-xl ${bg} flex items-center justify-center shrink-0`}>
                          <Icon size={20} className={color} />
                        </div>

                        {/* Content */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2 mb-1">
                            <h3 className={`text-sm leading-tight ${notification.read ? "text-gray-600" : "text-gray-900 font-semibold"}`}>{notification.title}</h3>
                            {!notification.read && (
                              <span className="w-2 h-2 bg-[#f5a145] rounded-full shrink-0 mt-1.5"></span>
                            )}
                          </div>
                          <p className="text-xs text-gray-500 mb-2 leading-relaxed line-clamp-2">
                            {notification.message}
                          </p>
                          {notification.productName && (
                            <div className="bg-gray-50 rounded-lg px-3 py-2 mb-2 inline-flex items-center gap-1.5">
                              <span className="text-[11px]">📦</span>
                              <span className="text-xs text-gray-600 font-medium">{notification.productName}</span>
                            </div>
                          )}
                          <p className="text-[11px] text-gray-400">
                            {formatDate(notification.createdAt)}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })
          )}
        </div>
      </div>
    </div>
  );
}
