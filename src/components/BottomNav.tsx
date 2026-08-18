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
        className="flex-1 flex flex-col items-center justify-center gap-0.5 py-2 active:opacity-60 transition-opacity"
      >
        <Icon
          size={24}
          fill={isActive ? "#1f2937" : "none"}
          stroke={isActive ? "#1f2937" : "#9ca3af"}
          strokeWidth={isActive ? 2 : 1.8}
        />
        <span className={`text-[10px] leading-tight ${
          isActive ? "font-bold text-gray-900" : "font-medium text-gray-400"
        }`}>
          {label}
        </span>
      </button>
    );
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50 pb-[env(safe-area-inset-bottom)]">
      <div className="max-w-md mx-auto h-14 flex items-stretch">
        <NavButton tab="home" icon={Home} label="홈" />
        {!isBusiness && (
          <NavButton tab="review" icon={FileText} label="리뷰" />
        )}
        <NavButton tab="profile" icon={User} label="MY" />
      </div>
    </nav>
  );
}
