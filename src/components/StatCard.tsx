import { TrendingUp, TrendingDown } from "lucide-react";

interface StatCardProps {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  suffix?: string;
  trend?: number; // percentage change
  color: string;
  bgColor: string;
}

export function StatCard({ icon, label, value, suffix, trend, color, bgColor }: StatCardProps) {
  const hasTrend = trend !== undefined;
  const isPositive = trend && trend > 0;
  const isNegative = trend && trend < 0;

  return (
    <div className="bg-white rounded-[1.5rem] p-5 border-2 border-[#d4c5a0]">
      <div className="flex items-start justify-between mb-3">
        <div
          className="w-12 h-12 rounded-[1rem] flex items-center justify-center"
          style={{ backgroundColor: bgColor }}
        >
          <div style={{ color }}>{icon}</div>
        </div>
        
        {hasTrend && (
          <div
            className={`flex items-center gap-1 text-sm px-2 py-1 rounded-full ${
              isPositive
                ? "bg-[#d4edda] text-[#155724]"
                : isNegative
                ? "bg-[#f8d7da] text-[#721c24]"
                : "bg-[#f5f0dc] text-[#6b8e6f]"
            }`}
          >
            {isPositive && <TrendingUp size={14} />}
            {isNegative && <TrendingDown size={14} />}
            <span>{Math.abs(trend)}%</span>
          </div>
        )}
      </div>

      <div className="mb-1">
        <span className="text-2xl text-[#2d3e2d] font-medium">{value}</span>
        {suffix && <span className="text-[#9ca89d] ml-1">{suffix}</span>}
      </div>
      
      <div className="text-sm text-[#6b8e6f]">{label}</div>
    </div>
  );
}
