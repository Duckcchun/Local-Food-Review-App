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

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  const handleSelect = (sortId: SortOption) => {
    onSelectSort(sortId);
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Sort Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 bg-white rounded-[1rem] px-4 py-2.5 border-2 border-[#d4c5a0] hover:border-[#6b8e6f] transition-all w-full"
      >
        <span className="text-lg">{currentSort.icon}</span>
        <div className="flex-1 text-left">
          <div className="text-sm text-[#2d3e2d] font-medium">{currentSort.name}</div>
          {resultCount !== undefined && (
            <div className="text-xs text-[#9ca89d]">{resultCount}개 체험단</div>
          )}
        </div>
        <ChevronDown
          size={18}
          className={`text-[#6b8e6f] transition-transform ${isOpen ? "rotate-180" : ""}`}
        />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-[1rem] border-2 border-[#d4c5a0] shadow-lg z-50 overflow-hidden">
          {SORT_OPTIONS.map((option) => {
            const isSelected = option.id === selectedSort;
            
            return (
              <button
                key={option.id}
                onClick={() => handleSelect(option.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 transition-colors ${
                  isSelected
                    ? "bg-[#f5f0dc] border-l-4 border-l-[#6b8e6f]"
                    : "hover:bg-[#fffef5] border-l-4 border-l-transparent"
                }`}
              >
                <span className="text-2xl">{option.icon}</span>
                <div className="flex-1 text-left">
                  <div className="text-sm text-[#2d3e2d] font-medium">{option.name}</div>
                  <div className="text-xs text-[#9ca89d]">{option.description}</div>
                </div>
                {isSelected && (
                  <Check size={20} className="text-[#6b8e6f] shrink-0" />
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
