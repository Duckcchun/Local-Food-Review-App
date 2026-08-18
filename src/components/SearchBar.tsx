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
    <div className={`flex items-center gap-2.5 bg-gray-100 rounded-xl px-3.5 py-2.5 transition-all ${isFocused ? "bg-white ring-1 ring-gray-900" : ""}`}>
      <Search size={18} className="text-gray-400 shrink-0" />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        placeholder={placeholder}
        className="flex-1 bg-transparent text-sm text-gray-900 placeholder:text-gray-400 outline-none"
      />
      {value && (
        <button onClick={() => onChange("")} className="shrink-0 w-5 h-5 flex items-center justify-center bg-gray-300 rounded-full">
          <X size={12} className="text-white" />
        </button>
      )}
    </div>
  );
}
