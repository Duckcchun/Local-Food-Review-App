import { Home, FileText, User } from "lucide-react";

interface BottomNavProps {
  activeTab: "home" | "review" | "profile";
  onTabChange: (tab: "home" | "review" | "profile") => void;
  userType?: "reviewer" | "business";
}

export function BottomNav({ activeTab, onTabChange, userType }: BottomNavProps) {
  const isBusiness = userType === "business";

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t-2 border-[#6b8e6f] rounded-t-[2rem] shadow-lg z-50">
      <div className="max-w-md mx-auto px-6 py-4">
        <div className={`flex items-center ${isBusiness ? 'justify-around' : 'justify-around'}`}>
          <button
            onClick={() => onTabChange("home")}
            className={`flex flex-col items-center gap-1.5 transition-colors ${
              activeTab === "home" ? "text-[#6b8e6f]" : "text-[#9ca89d]"
            }`}
          >
            <Home size={24} fill={activeTab === "home" ? "#6b8e6f" : "none"} />
            <span className="text-sm">홈</span>
          </button>
          
          {!isBusiness && (
            <button
              onClick={() => onTabChange("review")}
              className={`flex flex-col items-center gap-1.5 transition-colors ${
                activeTab === "review" ? "text-[#6b8e6f]" : "text-[#9ca89d]"
              }`}
            >
              <FileText size={24} fill={activeTab === "review" ? "#6b8e6f" : "none"} />
              <span className="text-sm">리뷰 작성</span>
            </button>
          )}
          
          <button
            onClick={() => onTabChange("profile")}
            className={`flex flex-col items-center gap-1.5 transition-colors ${
              activeTab === "profile" ? "text-[#6b8e6f]" : "text-[#9ca89d]"
            }`}
          >
            <User size={24} fill={activeTab === "profile" ? "#6b8e6f" : "none"} />
            <span className="text-sm">내 페이지</span>
          </button>
        </div>
      </div>
    </nav>
  );
}