import { WifiOff, RefreshCw } from 'lucide-react';

interface NetworkErrorProps {
  onRetry?: () => void;
  message?: string;
}

/**
 * Network error display component.
 * Used when API calls fail or when the user is offline.
 */
export function NetworkError({ onRetry, message }: NetworkErrorProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
      <div className="w-16 h-16 mb-4 bg-[#f0f9f4] rounded-full flex items-center justify-center">
        <WifiOff className="w-8 h-8 text-[#6b8e6f]" />
      </div>

      <h3 className="text-lg font-bold text-[#2d3e2d] mb-2">
        네트워크 연결 오류
      </h3>

      <p className="text-sm text-[#6b8e6f] mb-6 max-w-xs">
        {message || "인터넷 연결을 확인하고 다시 시도해주세요."}
      </p>

      {onRetry && (
        <button
          onClick={onRetry}
          className="flex items-center gap-2 py-2.5 px-5 bg-[#6b8e6f] text-white rounded-xl font-medium hover:bg-[#5a7a5e] transition-colors"
        >
          <RefreshCw size={16} />
          다시 시도
        </button>
      )}
    </div>
  );
}
