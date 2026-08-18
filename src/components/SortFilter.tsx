import { useState, useRef, useEffect } from "react";
import { ChevronDown, Check } from "lucide-react";
import { SORT_OPTIONS, getSortOption } from "../utils/sortUtils";
import type { SortOption } from "../utils/sortUtils";

interface SortFilterProps {
  selectedSort: SortOption;
  onSelectSort: (sortId: SortOption) => void;
  resultCount?: number;
}

export function SortFilter({ selectedSort, onSelectSort }: SortFilterProps) {
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

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1 text-[13px] text-gray-500 hover:text-gray-700 transition-colors"
      >
        <span>{currentSort.name}</span>
        <ChevronDown size={14} className={`transition-transform ${isOpen ? "rotate-180" : ""}`} />
      </button>

      {isOpen && (
        <div className="absolute top-full right-0 mt-2 w-44 bg-white rounded-xl shadow-lg border border-gray-100 z-50 overflow-hidden py-1">
          {SORT_OPTIONS.map((option) => {
            const isSelected = option.id === selectedSort;
            return (
              <button
                key={option.id}
                onClick={() => { onSelectSort(option.id); setIsOpen(false); }}
                className={`w-full flex items-center gap-2 px-3.5 py-2.5 text-left transition-colors ${isSelected ? "bg-gray-50" : "hover:bg-gray-50"}`}
              >
                <span className="text-sm">{option.icon}</span>
                <span className={`flex-1 text-[13px] ${isSelected ? "font-semibold text-gray-900" : "text-gray-600"}`}>{option.name}</span>
                {isSelected && <Check size={14} className="text-emerald-600 shrink-0" />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
