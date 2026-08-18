import { Search, X } from "lucide-react";
import { useState } from "react";

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export function SearchBar({ value, onChange, placeholder = "맛집, 체험단 검색" }: SearchBarProps) {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <div
      className={`flex items-center gap-2.5 bg-[#f3f4f6] rounded-[0.75rem] px-3.5 py-2.5 transition-all ${
        isFocused ? "bg-white ring-2 ring-[#1f2937]/10" : ""
      }`}
    >
      <Search size={18} className="text-[#9ca3af] shrink-0" />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        placeholder={placeholder}
        className="flex-1 bg-transparent text-[14px] text-[#1f2937] placeholder:text-[#9ca3af] outline-none"
      />
      {value && (
        <button
          onClick={() => onChange("")}
          className="shrink-0 w-5 h-5 flex items-center justify-center bg-[#d1d5db] rounded-full hover:bg-[#9ca3af] transition-colors"
        >
          <X size={12} className="text-white" />
        </button>
      )}
    </div>
  );
}
