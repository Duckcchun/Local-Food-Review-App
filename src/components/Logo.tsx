import React from 'react'; // React import 추가

export function Logo({ className = "", variant = "orange" }: { className?: string; variant?: "orange" | "green" | "white" }) {
  const color = variant === "white" ? "#ffffff" : variant === "green" ? "#6b8e6f" : "#f5a145";
  const textColor = variant === "white" ? "#ffffff" : variant === "green" ? "#6b8e6f" : "#f5a145";
  
  const logoText = "밥터뷰"; // 텍스트 변수 추가

  return (
    <div className={`flex flex-row items-center gap-2 group ${className}`} style={{ display: 'flex', flexDirection: 'row' }}>
      <svg 
        width="48" 
        height="48" 
        viewBox="0 0 48 48"
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
        className="transition-transform duration-300 group-hover:scale-110 group-hover:rotate-12"
      >
        {/* Dumpling body */}
        <ellipse 
          cx="24" 
          cy="28" 
          rx="18" 
          ry="16" 
          fill={color}
          className="transition-all duration-300"
        />
        {/* Face */}
        <circle cx="18" cy="26" r="2" fill="#2d3e2d" className="animate-float" style={{ animationDelay: '0s' }} />
        <circle cx="30" cy="26" r="2" fill="#2d3e2d" className="animate-float" style={{ animationDelay: '0.1s' }} />
        {/* Smile */}
        <path 
          d="M 18 30 Q 24 34 30 30" 
          stroke="#2d3e2d" 
          strokeWidth="2" 
          fill="none" 
          strokeLinecap="round"
          className="transition-all duration-300 group-hover:scale-110"
        />
        {/* Top knot with bounce */}
        <circle 
          cx="28" 
          cy="14" 
          r="4" 
          fill={color}
          className="transition-all duration-300 animate-float"
          style={{ animationDelay: '0.2s' }}
        />
        {/* Decorative sparkles on hover */}
        <g className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <circle cx="10" cy="18" r="1.5" fill={color} className="animate-ping" style={{ animationDuration: '1.5s' }} />
          <circle cx="38" cy="22" r="1.5" fill={color} className="animate-ping" style={{ animationDuration: '1.8s', animationDelay: '0.3s' }} />
          <circle cx="20" cy="12" r="1.5" fill={color} className="animate-ping" style={{ animationDuration: '2s', animationDelay: '0.6s' }} />
        </g>
      </svg>
      <span 
        className="transition-all duration-300 group-hover:scale-105" // gradient-text 클래스 제거
        style={{

          color: variant === 'white' ? textColor : 'transparent',
          background: variant === 'white' ? 'none' : `linear-gradient(135deg, ${color} 0%, ${textColor} 100%)`,

          
          backgroundColor: 'transparent',

          
          WebkitBackgroundClip: variant === 'white' ? 'unset' : 'text',
          WebkitTextFillColor: variant === 'white' ? 'unset' : 'transparent',
          backgroundClip: variant === 'white' ? 'unset' : 'text',
          
          
          fontSize: '2.10rem', 
          fontWeight: 900, 
          
          letterSpacing: '-0.025em', 
          whiteSpace: 'nowrap' 
        }}
      >
        {logoText}
      </span>
    </div>
  );
}