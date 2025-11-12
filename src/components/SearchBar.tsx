import { Search, X } from "lucide-react";
import { useState } from "react";

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export function SearchBar({ value, onChange, placeholder = "제품명, 가게명으로 검색..." }: SearchBarProps) {
  const [isFocused, setIsFocused] = useState(false);

  const handleClear = () => {
    onChange("");
  };

  return (
    <div 
      className={`relative flex items-center gap-3 bg-white rounded-[1rem] px-4 py-3 border-2 transition-all ${
        isFocused 
          ? "border-[#6b8e6f] shadow-md" 
          : "border-[#d4c5a0]"
      }`}
    >
      <Search 
        size={20} 
        className={`shrink-0 transition-colors ${
          isFocused ? "text-[#6b8e6f]" : "text-[#9ca89d]"
        }`}
      />
      
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        placeholder={placeholder}
        className="flex-1 bg-transparent text-[#2d3e2d] placeholder:text-[#9ca89d] outline-none"
      />
      
      {value && (
        <button
          onClick={handleClear}
          className="shrink-0 text-[#9ca89d] hover:text-[#6b8e6f] transition-colors p-1 hover:bg-[#f5f0dc] rounded-full"
        >
          <X size={18} />
        </button>
      )}
    </div>
  );
}
