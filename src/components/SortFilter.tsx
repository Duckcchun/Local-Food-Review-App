import { useState, useRef, useEffect } from "react";
import { ChevronDown, Check } from "lucide-react";
import { SORT_OPTIONS, getSortOption } from "../utils/sortUtils";
import type { SortOption } from "../utils/sortUtils";

interface SortFilterProps {
  selectedSort: SortOption;
  onSelectSort: (sortId: SortOption) => void;
  resultCount?: number;
}

export function SortFilter({ selectedSort, onSelectSort, resultCount }: SortFilterProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const currentSort = getSortOption(selectedSort);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  const handleSelect = (sortId: SortOption) => {
    onSelectSort(sortId);
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Trigger */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1 text-[13px] text-[#6b7280] hover:text-[#374151] transition-colors"
      >
        <span>{currentSort.name}</span>
        <ChevronDown size={14} className={`transition-transform ${isOpen ? "rotate-180" : ""}`} />
      </button>

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute top-full right-0 mt-2 w-44 bg-white rounded-[0.75rem] shadow-lg border border-[#f3f4f6] z-50 overflow-hidden py-1">
          {SORT_OPTIONS.map((option) => {
            const isSelected = option.id === selectedSort;
            return (
              <button
                key={option.id}
                onClick={() => handleSelect(option.id)}
                className={`w-full flex items-center gap-2 px-3.5 py-2.5 text-left transition-colors ${
                  isSelected ? "bg-[#f9fafb]" : "hover:bg-[#f9fafb]"
                }`}
              >
                <span className="text-sm">{option.icon}</span>
                <span className={`flex-1 text-[13px] ${isSelected ? "font-semibold text-[#1f2937]" : "text-[#4b5563]"}`}>
                  {option.name}
                </span>
                {isSelected && <Check size={14} className="text-emerald-600 shrink-0" />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
