import type { LucideIcon } from "lucide-react";

interface EmptyStateProps {
  /** Lucide icon component OR emoji string */
  icon?: LucideIcon | string;
  title: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
}

export function EmptyState({ icon, title, description, actionLabel, onAction }: EmptyStateProps) {
  return (
    <div className="text-center py-16 px-4">
      <div className="w-20 h-20 mx-auto mb-5 bg-gray-50 rounded-2xl flex items-center justify-center">
        {typeof icon === "string" ? (
          <span className="text-3xl">{icon}</span>
        ) : icon ? (
          (() => {
            const Icon = icon;
            return <Icon size={36} className="text-gray-300" />;
          })()
        ) : (
          <span className="text-3xl">📭</span>
        )}
      </div>
      <h3 className="text-base font-semibold text-gray-800 mb-2">{title}</h3>
      {description && (
        <p className="text-sm text-gray-400 mb-6 max-w-[240px] mx-auto leading-relaxed">{description}</p>
      )}
      {actionLabel && onAction && (
        <button
          onClick={onAction}
          className="inline-flex items-center gap-1.5 bg-[#f5a145] text-white text-sm font-medium px-6 py-2.5 rounded-xl hover:bg-[#e89535] active:scale-[0.98] transition-all shadow-sm"
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
}
