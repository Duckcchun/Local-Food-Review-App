import { getLevelBadgeProps } from "../data/levelSystem";

interface LevelBadgeProps {
  level: number;
  size?: "sm" | "md" | "lg";
  showName?: boolean;
}

export function LevelBadge({ level, size = "md", showName = false }: LevelBadgeProps) {
  const badge = getLevelBadgeProps(level);
  
  const sizeClasses = {
    sm: "text-xs px-2 py-1",
    md: "text-sm px-3 py-1.5",
    lg: "text-base px-4 py-2"
  };
  
  const iconSizes = {
    sm: "text-sm",
    md: "text-base",
    lg: "text-lg"
  };
  
  return (
    <div
      className={`inline-flex items-center gap-1.5 rounded-full ${sizeClasses[size]}`}
      style={{
        backgroundColor: badge.bgColor,
        color: badge.color,
        border: `1.5px solid ${badge.color}`
      }}
    >
      <span className={iconSizes[size]}>{badge.icon}</span>
      {showName && (
        <span className="font-medium">{badge.name}</span>
      )}
      {!showName && (
        <span className="font-medium">Lv.{level}</span>
      )}
    </div>
  );
}
