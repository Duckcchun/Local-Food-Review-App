import { Search, X, Clock, TrendingUp } from "lucide-react";
import { useState, useEffect, useRef } from "react";

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  onSearch?: (query: string) => void;
}

const HISTORY_KEY = 'searchHistory';
const MAX_HISTORY = 8;

function getHistory(): string[] {
  try { return JSON.parse(localStorage.getItem(HISTORY_KEY) || '[]'); } catch { return []; }
}

function saveHistory(history: string[]) {
  try { localStorage.setItem(HISTORY_KEY, JSON.stringify(history.slice(0, MAX_HISTORY))); } catch {}
}

export function SearchBar({ value, onChange, placeholder = "맛집, 체험단 검색", onSearch }: SearchBarProps) {
  const [isFocused, setIsFocused] = useState(false);
  const [history, setHistory] = useState<string[]>(getHistory);
  const [showDropdown, setShowDropdown] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // 포커스 시 드롭다운 표시
  useEffect(() => {
    if (isFocused && !value && history.length > 0) {
      setShowDropdown(true);
    } else {
      setShowDropdown(false);
    }
  }, [isFocused, value, history.length]);

  // 외부 클릭 시 닫기
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const handleSubmit = (query: string) => {
    if (!query.trim()) return;
    const trimmed = query.trim();
    // 히스토리에 추가 (중복 제거)
    const newHistory = [trimmed, ...history.filter(h => h !== trimmed)].slice(0, MAX_HISTORY);
    setHistory(newHistory);
    saveHistory(newHistory);
    onChange(trimmed);
    setShowDropdown(false);
    onSearch?.(trimmed);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSubmit(value);
    }
  };

  const handleHistoryClick = (query: string) => {
    onChange(query);
    handleSubmit(query);
  };

  const handleDeleteHistory = (query: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const newHistory = history.filter(h => h !== query);
    setHistory(newHistory);
    saveHistory(newHistory);
  };

  const handleClearAll = () => {
    setHistory([]);
    saveHistory([]);
  };

  return (
    <div ref={containerRef} className="relative">
      {/* 입력 필드 */}
      <div className={`flex items-center gap-2.5 bg-gray-100 rounded-xl px-3.5 py-2.5 transition-all ${isFocused ? "bg-white ring-1 ring-[#6b8e6f]" : ""}`}>
        <Search size={18} className="text-gray-400 shrink-0" />
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setTimeout(() => setIsFocused(false), 200)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className="flex-1 bg-transparent text-sm text-gray-900 placeholder:text-gray-400 outline-none"
        />
        {value && (
          <button onClick={() => onChange("")} className="shrink-0 w-5 h-5 flex items-center justify-center bg-gray-300 rounded-full">
            <X size={12} className="text-white" />
          </button>
        )}
      </div>

      {/* 검색 히스토리 드롭다운 */}
      {showDropdown && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-lg border border-gray-100 z-50 overflow-hidden">
          <div className="flex items-center justify-between px-4 py-2.5 border-b border-gray-50">
            <span className="text-xs font-medium text-gray-500 flex items-center gap-1">
              <Clock size={12} /> 최근 검색
            </span>
            <button onClick={handleClearAll} className="text-xs text-gray-400 hover:text-gray-600">
              전체 삭제
            </button>
          </div>
          <div className="py-1">
            {history.map((query, i) => (
              <button
                key={i}
                onClick={() => handleHistoryClick(query)}
                className="w-full flex items-center justify-between px-4 py-2.5 hover:bg-gray-50 transition-colors"
              >
                <span className="text-sm text-gray-700">{query}</span>
                <button
                  onClick={(e) => handleDeleteHistory(query, e)}
                  className="text-gray-300 hover:text-gray-500 p-0.5"
                >
                  <X size={14} />
                </button>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
