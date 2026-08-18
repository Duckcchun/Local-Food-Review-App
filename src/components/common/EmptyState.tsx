import { type LucideIcon } from 'lucide-react';

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
}

/**
 * Empty state component for when there's no data to display.
 * Used in lists, favorites, applications, etc.
 */
export function EmptyState({ icon: Icon, title, description, actionLabel, onAction }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
      <div className="w-16 h-16 mb-4 bg-[#f0f9f4] rounded-full flex items-center justify-center">
        <Icon className="w-8 h-8 text-[#9ca89d]" />
      </div>

      <h3 className="text-lg font-bold text-[#2d3e2d] mb-2">
        {title}
      </h3>

      {description && (
        <p className="text-sm text-[#6b8e6f] mb-6 max-w-xs">
          {description}
        </p>
      )}

      {actionLabel && onAction && (
        <button
          onClick={onAction}
          className="py-2.5 px-5 bg-[#6b8e6f] text-white rounded-xl font-medium hover:bg-[#5a7a5e] transition-colors"
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
}
