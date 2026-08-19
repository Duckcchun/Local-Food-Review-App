import { Home, FileText, User } from "lucide-react";

interface BottomNavProps {
  activeTab: "home" | "review" | "profile";
  onTabChange: (tab: "home" | "review" | "profile") => void;
  userType?: "reviewer" | "business";
}

export function BottomNav({ activeTab, onTabChange, userType }: BottomNavProps) {
  const isBusiness = userType === "business";

  const NavButton = ({ tab, icon: Icon, label }: { tab: "home" | "review" | "profile"; icon: typeof Home; label: string }) => {
    const isActive = activeTab === tab;
    return (
      <button
        onClick={() => onTabChange(tab)}
        className="flex-1 flex flex-col items-center justify-center gap-1 py-2.5 relative active:scale-95 transition-all duration-150"
      >
        {isActive && (
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-[3px] rounded-full bg-[#6b8e6f]" />
        )}
        <div className={`p-1.5 rounded-xl transition-colors duration-200 ${isActive ? 'bg-[#6b8e6f]/10' : ''}`}>
          <Icon
            size={22}
            fill={isActive ? "#6b8e6f" : "none"}
            stroke={isActive ? "#6b8e6f" : "#9ca3af"}
            strokeWidth={isActive ? 2.2 : 1.8}
          />
        </div>
        <span className={`text-[10px] leading-tight transition-colors duration-200 ${isActive ? "font-bold text-[#6b8e6f]" : "font-medium text-gray-400"}`}>
          {label}
        </span>
      </button>
    );
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md border-t border-gray-100 z-50 pb-[env(safe-area-inset-bottom)] shadow-[0_-2px_10px_rgba(0,0,0,0.04)]">
      <div className="max-w-md mx-auto h-16 flex items-stretch">
        <NavButton tab="home" icon={Home} label="홈" />
        {!isBusiness && <NavButton tab="review" icon={FileText} label="리뷰" />}
        <NavButton tab="profile" icon={User} label="MY" />
      </div>
    </nav>
  );
}
