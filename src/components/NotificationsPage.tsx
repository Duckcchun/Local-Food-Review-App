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
    <div className="min-h-screen bg-[#fffef5] pb-6">
      {/* Header */}
  <div className="bg-linear-to-br from-[#6b8e6f] to-[#8fa893] pt-8 pb-12">
        <div className="max-w-md mx-auto px-6">
          <button onClick={onBack} className="mb-6 text-white hover:opacity-80">
            <ChevronLeft size={24} />
          </button>
          <Logo className="mb-6" variant="white" />
          <div className="flex items-center justify-between">
            <h1 className="text-white">알림</h1>
            {unreadCount > 0 && (
              <span className="bg-[#f5a145] text-white px-3 py-1 rounded-full text-sm">
                {unreadCount}개의 새 알림
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-md mx-auto px-6 -mt-6">
        {/* Notifications List */}
        <div className="space-y-3">
          {notifications.length === 0 ? (
            <div className="bg-white rounded-[1.5rem] p-12 text-center border-2 border-[#d4c5a0]">
              <Bell size={48} className="mx-auto mb-4 text-[#d4c5a0]" />
              <p className="text-[#9ca89d] mb-2">알림이 없습니다</p>
              <p className="text-sm text-[#9ca89d]">
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
                    className={`bg-white rounded-[1.5rem] p-5 border-2 transition-all ${
                      notification.read
                        ? "border-[#d4c5a0] opacity-70"
                        : "border-[#f5a145] shadow-md"
                    } cursor-pointer hover:shadow-lg`}
                  >
                    <div className="flex gap-4">
                      {/* Icon */}
                      <div className={`w-12 h-12 rounded-full ${bg} flex items-center justify-center shrink-0`}>
                        <Icon size={24} className={color} />
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2 mb-1">
                          <h3 className="text-[#2d3e2d]">{notification.title}</h3>
                          {!notification.read && (
                            <span className="w-2 h-2 bg-[#f5a145] rounded-full shrink-0 mt-2"></span>
                          )}
                        </div>
                        <p className="text-sm text-[#6b8e6f] mb-2 leading-relaxed">
                          {notification.message}
                        </p>
                        {notification.productName && (
                          <div className="bg-[#f5f0dc] rounded-[0.75rem] px-3 py-2 mb-2">
                            <p className="text-sm text-[#6b8e6f]">
                              📦 {notification.productName}
                            </p>
                          </div>
                        )}
                        <p className="text-xs text-[#9ca89d]">
                          {formatDate(notification.createdAt)}
                        </p>
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
