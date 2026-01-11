interface LogoProps {
  className?: string;
}

export const Logo = ({ className = "w-8 h-8" }: LogoProps) => {
  return (
    <svg
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <defs>
        {/* Primary gradient - infrastructure feel */}
        <linearGradient id="coreGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="hsl(152, 60%, 55%)" />
          <stop offset="50%" stopColor="hsl(152, 60%, 45%)" />
          <stop offset="100%" stopColor="hsl(152, 70%, 35%)" />
        </linearGradient>
        
        {/* Server rack gradient */}
        <linearGradient id="serverGradient" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="hsl(220, 20%, 25%)" />
          <stop offset="100%" stopColor="hsl(220, 20%, 15%)" />
        </linearGradient>
        
        {/* Active status light */}
        <radialGradient id="statusGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="hsl(152, 80%, 60%)" />
          <stop offset="70%" stopColor="hsl(152, 70%, 45%)" />
          <stop offset="100%" stopColor="hsl(152, 60%, 35%)" />
        </radialGradient>
        
        {/* Shield gradient */}
        <linearGradient id="shieldGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="hsl(152, 60%, 50%)" />
          <stop offset="100%" stopColor="hsl(152, 70%, 40%)" />
        </linearGradient>
        
        {/* Metallic sheen */}
        <linearGradient id="sheen" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="white" stopOpacity="0" />
          <stop offset="50%" stopColor="white" stopOpacity="0.25" />
          <stop offset="100%" stopColor="white" stopOpacity="0" />
        </linearGradient>
        
        {/* Drop shadow */}
        <filter id="dropShadow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="1" stdDeviation="1.5" floodColor="hsl(152, 60%, 30%)" floodOpacity="0.5" />
        </filter>
        
        {/* Outer glow for active elements */}
        <filter id="statusGlowFilter" x="-100%" y="-100%" width="300%" height="300%">
          <feGaussianBlur in="SourceGraphic" stdDeviation="1" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>
      
      {/* Background - hexagonal shape for infrastructure feel */}
      <path
        d="M24 2L44 14V34L24 46L4 34V14L24 2Z"
        fill="hsl(220, 18%, 10%)"
        stroke="hsl(152, 50%, 40%)"
        strokeWidth="1.5"
        strokeOpacity="0.4"
      />
      
      {/* Inner hexagon border */}
      <path
        d="M24 6L40 16V32L24 42L8 32V16L24 6Z"
        fill="none"
        stroke="hsl(152, 50%, 35%)"
        strokeWidth="0.5"
        strokeOpacity="0.3"
      />
      
      {/* Central server/infrastructure block */}
      <g filter="url(#dropShadow)">
        {/* Main server block */}
        <rect
          x="14"
          y="14"
          width="20"
          height="20"
          rx="2"
          fill="url(#serverGradient)"
          stroke="hsl(152, 50%, 45%)"
          strokeWidth="1"
        />
        
        {/* Server unit 1 */}
        <rect x="16" y="16" width="16" height="5" rx="1" fill="hsl(220, 20%, 20%)" />
        <circle cx="19" cy="18.5" r="1.2" fill="url(#statusGlow)" filter="url(#statusGlowFilter)">
          <animate 
            attributeName="opacity" 
            values="1;0.6;1" 
            dur="2s" 
            repeatCount="indefinite"
          />
        </circle>
        <rect x="22" y="17" width="8" height="1" rx="0.5" fill="hsl(152, 40%, 35%)" opacity="0.6" />
        <rect x="22" y="19" width="6" height="1" rx="0.5" fill="hsl(152, 40%, 30%)" opacity="0.4" />
        
        {/* Server unit 2 */}
        <rect x="16" y="22" width="16" height="5" rx="1" fill="hsl(220, 20%, 18%)" />
        <circle cx="19" cy="24.5" r="1.2" fill="url(#statusGlow)" filter="url(#statusGlowFilter)">
          <animate 
            attributeName="opacity" 
            values="0.6;1;0.6" 
            dur="2.5s" 
            repeatCount="indefinite"
          />
        </circle>
        <rect x="22" y="23" width="8" height="1" rx="0.5" fill="hsl(152, 40%, 35%)" opacity="0.6" />
        <rect x="22" y="25" width="5" height="1" rx="0.5" fill="hsl(152, 40%, 30%)" opacity="0.4" />
        
        {/* Server unit 3 */}
        <rect x="16" y="28" width="16" height="5" rx="1" fill="hsl(220, 20%, 16%)" />
        <circle cx="19" cy="30.5" r="1.2" fill="url(#statusGlow)" filter="url(#statusGlowFilter)">
          <animate 
            attributeName="opacity" 
            values="1;0.7;1" 
            dur="1.8s" 
            repeatCount="indefinite"
          />
        </circle>
        <rect x="22" y="29" width="8" height="1" rx="0.5" fill="hsl(152, 40%, 35%)" opacity="0.6" />
        <rect x="22" y="31" width="7" height="1" rx="0.5" fill="hsl(152, 40%, 30%)" opacity="0.4" />
      </g>
      
      {/* Shield overlay - protection symbol */}
      <path
        d="M24 10L32 13V20C32 25 28 29 24 31C20 29 16 25 16 20V13L24 10Z"
        fill="url(#shieldGradient)"
        fillOpacity="0.15"
        stroke="hsl(152, 60%, 50%)"
        strokeWidth="1"
        strokeOpacity="0.5"
      />
      
      {/* Checkmark inside shield - operations verified */}
      <path
        d="M21 19L23 21L27 17"
        stroke="hsl(152, 70%, 55%)"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
      
      {/* Connection nodes - representing network/infrastructure */}
      <g opacity="0.8">
        {/* Top node */}
        <circle cx="24" cy="8" r="2" fill="hsl(152, 60%, 45%)" />
        <circle cx="24" cy="8" r="1" fill="hsl(152, 70%, 60%)" />
        
        {/* Left node */}
        <circle cx="10" cy="24" r="2" fill="hsl(152, 60%, 45%)" />
        <circle cx="10" cy="24" r="1" fill="hsl(152, 70%, 60%)" />
        
        {/* Right node */}
        <circle cx="38" cy="24" r="2" fill="hsl(152, 60%, 45%)" />
        <circle cx="38" cy="24" r="1" fill="hsl(152, 70%, 60%)" />
        
        {/* Bottom node */}
        <circle cx="24" cy="40" r="2" fill="hsl(152, 60%, 45%)" />
        <circle cx="24" cy="40" r="1" fill="hsl(152, 70%, 60%)" />
      </g>
      
      {/* Data flow lines */}
      <g stroke="hsl(152, 60%, 50%)" strokeWidth="0.75" opacity="0.5">
        <line x1="24" y1="10" x2="24" y2="14" />
        <line x1="12" y1="24" x2="14" y2="24" />
        <line x1="34" y1="24" x2="36" y2="24" />
        <line x1="24" y1="34" x2="24" y2="38" />
      </g>
      
      {/* Animated data pulses */}
      <g opacity="0.8">
        <circle cx="24" cy="12" r="1" fill="hsl(152, 70%, 55%)">
          <animate 
            attributeName="cy" 
            values="10;14;10" 
            dur="1.5s" 
            repeatCount="indefinite"
          />
          <animate 
            attributeName="opacity" 
            values="0.8;0.3;0.8" 
            dur="1.5s" 
            repeatCount="indefinite"
          />
        </circle>
        <circle cx="36" cy="24" r="1" fill="hsl(152, 70%, 55%)">
          <animate 
            attributeName="cx" 
            values="38;34;38" 
            dur="2s" 
            repeatCount="indefinite"
          />
          <animate 
            attributeName="opacity" 
            values="0.8;0.3;0.8" 
            dur="2s" 
            repeatCount="indefinite"
          />
        </circle>
      </g>
      
      {/* Highlight arc */}
      <path
        d="M10 12 A16 16 0 0 1 38 12"
        stroke="url(#sheen)"
        strokeWidth="1.5"
        fill="none"
        strokeLinecap="round"
      />
    </svg>
  );
};
