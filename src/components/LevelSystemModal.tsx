import { X, Star } from "lucide-react";
import { LEVELS } from "../data/levelSystem";

interface LevelSystemModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentLevel: number;
}

export function LevelSystemModal({ isOpen, onClose, currentLevel }: LevelSystemModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div 
        className="bg-white rounded-[1.5rem] max-w-2xl w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-[#6b8e6f] to-[#8fa893] rounded-t-[1.5rem] px-6 py-5 flex items-center justify-between">
          <div>
            <h2 className="text-white mb-1">평가단 등급 시스템</h2>
            <p className="text-sm text-white/90">리뷰 활동으로 등급을 올리세요!</p>
          </div>
          <button 
            onClick={onClose}
            className="text-white hover:bg-white/20 p-2 rounded-full transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          {LEVELS.map((level) => {
            const isCurrent = level.level === currentLevel;
            
            return (
              <div
                key={level.level}
                className={`rounded-[1.5rem] p-5 border-2 transition-all ${
                  isCurrent 
                    ? 'shadow-lg ring-2 ring-offset-2' 
                    : ''
                }`}
                style={{
                  backgroundColor: level.bgColor,
                  borderColor: level.color,
                  boxShadow: isCurrent ? `0 0 0 4px ${level.color}` : undefined
                }}
              >
                <div className="flex items-start gap-4 mb-4">
                  <span className="text-4xl">{level.icon}</span>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 style={{ color: level.color }}>
                        {level.name}
                      </h3>
                      {isCurrent && (
                        <span 
                          className="text-xs px-2 py-1 rounded-full text-white"
                          style={{ backgroundColor: level.color }}
                        >
                          현재 등급
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-[#6b8e6f] mb-2">
                      {level.description}
                    </p>
                    <div className="flex items-center gap-2 text-sm">
                      <span className="text-[#9ca89d]">필요 포인트:</span>
                      <span style={{ color: level.color }}>
                        {level.minPoints === 0 
                          ? `0P 시작` 
                          : level.maxPoints === Infinity
                            ? `${level.minPoints}P 이상`
                            : `${level.minPoints}P ~ ${level.maxPoints}P`
                        }
                      </span>
                    </div>
                  </div>
                </div>

                {/* Benefits */}
                <div className="bg-white/80 rounded-[1rem] p-4">
                  <h4 
                    className="text-sm mb-2 flex items-center gap-1"
                    style={{ color: level.color }}
                  >
                    <Star size={14} />
                    등급 혜택
                  </h4>
                  <ul className="space-y-1.5">
                    {level.benefits.map((benefit, index) => (
                      <li 
                        key={index} 
                        className="text-sm text-[#6b8e6f] flex items-start gap-2"
                      >
                        <span className="mt-0.5" style={{ color: level.color }}>✓</span>
                        <span>{benefit}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-[#f5f0dc] rounded-b-[1.5rem] px-6 py-4 border-t-2 border-[#d4c5a0]">
          <div className="flex items-start gap-3">
            <span className="text-2xl">💡</span>
            <div className="flex-1 text-sm text-[#6b8e6f]">
              <p className="mb-1">
                <span className="font-medium text-[#2d3e2d]">포인트 적립 방법:</span>
              </p>
              <ul className="space-y-1">
                <li>• 리뷰 작성: 기본 50P + 등급별 보너스</li>
                <li>• 사진 첨부 리뷰: 추가 20P</li>
                <li>• 우수 리뷰 선정: 추가 100P</li>
                <li>• 연속 활동: 보너스 포인트</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
