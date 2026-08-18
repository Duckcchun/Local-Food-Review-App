import { Download, RefreshCw, WifiOff, X } from 'lucide-react';
import { usePWA } from '../../hooks/usePWA';

/**
 * PWA UI prompts component.
 * Renders three things:
 * 1. Install banner (when A2HS is available)
 * 2. Update banner (when new version is detected)
 * 3. Offline indicator (when network is lost)
 */
export function PWAPrompts() {
  const { canInstall, hasUpdate, isOffline, install, applyUpdate, dismissInstall } = usePWA();

  return (
    <>
      {/* Offline Indicator */}
      {isOffline && (
        <div className="fixed top-0 left-0 right-0 z-[100] bg-gray-900 text-white py-2 px-4 flex items-center justify-center gap-2 text-[12px] font-medium">
          <WifiOff size={14} />
          <span>오프라인 상태입니다</span>
        </div>
      )}

      {/* Update Banner */}
      {hasUpdate && (
        <div className="fixed bottom-20 left-4 right-4 z-[90] max-w-md mx-auto">
          <div className="bg-gray-900 text-white rounded-2xl p-4 flex items-center gap-3 shadow-xl">
            <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center shrink-0">
              <RefreshCw size={20} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[13px] font-semibold">새 버전이 있어요</p>
              <p className="text-[11px] text-gray-400">업데이트하면 최신 기능을 사용할 수 있습니다</p>
            </div>
            <button
              onClick={applyUpdate}
              className="shrink-0 bg-white text-gray-900 text-[12px] font-bold px-3.5 py-2 rounded-xl active:scale-95 transition-transform"
            >
              업데이트
            </button>
          </div>
        </div>
      )}

      {/* Install Banner */}
      {canInstall && !hasUpdate && (
        <div className="fixed bottom-20 left-4 right-4 z-[90] max-w-md mx-auto">
          <div className="bg-white border border-gray-200 rounded-2xl p-4 flex items-center gap-3 shadow-lg">
            <div className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center shrink-0">
              <Download size={20} className="text-gray-700" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[13px] font-semibold text-gray-900">홈 화면에 추가</p>
              <p className="text-[11px] text-gray-500">앱처럼 빠르게 접근할 수 있어요</p>
            </div>
            <button
              onClick={install}
              className="shrink-0 bg-gray-900 text-white text-[12px] font-bold px-3.5 py-2 rounded-xl active:scale-95 transition-transform"
            >
              설치
            </button>
            <button
              onClick={dismissInstall}
              className="shrink-0 text-gray-400 p-1"
              aria-label="닫기"
            >
              <X size={16} />
            </button>
          </div>
        </div>
      )}
    </>
  );
}
