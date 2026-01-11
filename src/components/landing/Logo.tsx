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
        {/* Main gradient for the cloud */}
        <linearGradient id="cloudGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="hsl(152, 60%, 50%)" />
          <stop offset="50%" stopColor="hsl(152, 60%, 40%)" />
          <stop offset="100%" stopColor="hsl(152, 70%, 35%)" />
        </linearGradient>
        
        {/* Metallic sheen */}
        <linearGradient id="sheen" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="white" stopOpacity="0" />
          <stop offset="50%" stopColor="white" stopOpacity="0.3" />
          <stop offset="100%" stopColor="white" stopOpacity="0" />
        </linearGradient>
        
        {/* Cube face gradients */}
        <linearGradient id="cubeTop" x1="0%" y1="100%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="hsl(152, 60%, 55%)" />
          <stop offset="100%" stopColor="hsl(152, 70%, 65%)" />
        </linearGradient>
        
        <linearGradient id="cubeFront" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="hsl(152, 60%, 45%)" />
          <stop offset="100%" stopColor="hsl(152, 60%, 35%)" />
        </linearGradient>
        
        <linearGradient id="cubeRight" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="hsl(152, 55%, 38%)" />
          <stop offset="100%" stopColor="hsl(152, 60%, 28%)" />
        </linearGradient>
        
        {/* Inner glow */}
        <radialGradient id="innerGlow" cx="50%" cy="30%" r="60%">
          <stop offset="0%" stopColor="hsl(152, 70%, 60%)" stopOpacity="0.4" />
          <stop offset="100%" stopColor="hsl(152, 60%, 40%)" stopOpacity="0" />
        </radialGradient>
        
        {/* Drop shadow filter */}
        <filter id="dropShadow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="2" stdDeviation="2" floodColor="hsl(152, 60%, 30%)" floodOpacity="0.4" />
        </filter>
        
        {/* Outer glow */}
        <filter id="outerGlow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur in="SourceAlpha" stdDeviation="2" result="blur" />
          <feFlood floodColor="hsl(152, 60%, 50%)" floodOpacity="0.6" />
          <feComposite in2="blur" operator="in" />
          <feMerge>
            <feMergeNode />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>
      
      {/* Background circle with subtle gradient */}
      <circle 
        cx="24" 
        cy="24" 
        r="22" 
        fill="hsl(220, 18%, 8%)" 
        stroke="hsl(152, 60%, 40%)"
        strokeWidth="1.5"
        strokeOpacity="0.3"
      />
      
      {/* Subtle inner pattern - hex grid hint */}
      <g opacity="0.1">
        <path d="M12 20L16 18L20 20L20 24L16 26L12 24Z" stroke="hsl(152, 60%, 50%)" strokeWidth="0.5" fill="none" />
        <path d="M28 20L32 18L36 20L36 24L32 26L28 24Z" stroke="hsl(152, 60%, 50%)" strokeWidth="0.5" fill="none" />
        <path d="M20 28L24 26L28 28L28 32L24 34L20 32Z" stroke="hsl(152, 60%, 50%)" strokeWidth="0.5" fill="none" />
      </g>
      
      {/* Main isometric cube cluster - representing Minecraft blocks in cloud */}
      <g filter="url(#dropShadow)">
        {/* Large main cube */}
        {/* Front face */}
        <path 
          d="M16 22L24 26L24 36L16 32Z" 
          fill="url(#cubeFront)"
        />
        {/* Top face */}
        <path 
          d="M16 22L24 18L32 22L24 26Z" 
          fill="url(#cubeTop)"
        />
        {/* Right face */}
        <path 
          d="M24 26L32 22L32 32L24 36Z" 
          fill="url(#cubeRight)"
        />
        
        {/* Pixel detail on front - Minecraft grass block style */}
        <rect x="17" y="23" width="3" height="2" fill="hsl(152, 70%, 55%)" opacity="0.5" />
        <rect x="21" y="25" width="2" height="3" fill="hsl(152, 50%, 35%)" opacity="0.4" />
        <rect x="18" y="28" width="2" height="2" fill="hsl(152, 60%, 50%)" opacity="0.3" />
        
        {/* Pixel detail on right face */}
        <rect x="26" y="24" width="2" height="2" fill="hsl(152, 50%, 40%)" opacity="0.4" />
        <rect x="28" y="27" width="2" height="3" fill="hsl(152, 60%, 32%)" opacity="0.3" />
      </g>
      
      {/* Floating small cube - top left */}
      <g transform="translate(8, 10)" filter="url(#outerGlow)">
        <path d="M0 4L4 2L8 4L4 6Z" fill="hsl(152, 60%, 58%)" />
        <path d="M0 4L4 6L4 10L0 8Z" fill="hsl(152, 60%, 45%)" />
        <path d="M4 6L8 4L8 8L4 10Z" fill="hsl(152, 55%, 38%)" />
      </g>
      
      {/* Floating small cube - top right */}
      <g transform="translate(32, 8)">
        <path d="M0 3L3 1.5L6 3L3 4.5Z" fill="hsl(152, 60%, 55%)" />
        <path d="M0 3L3 4.5L3 7.5L0 6Z" fill="hsl(152, 60%, 42%)" />
        <path d="M3 4.5L6 3L6 6L3 7.5Z" fill="hsl(152, 55%, 35%)" />
      </g>
      
      {/* Cloud wisps - stylized */}
      <g opacity="0.6">
        <ellipse cx="10" cy="28" rx="4" ry="2" fill="hsl(220, 15%, 20%)" />
        <ellipse cx="38" cy="26" rx="3" ry="1.5" fill="hsl(220, 15%, 18%)" />
        <ellipse cx="14" cy="36" rx="5" ry="2" fill="hsl(220, 15%, 16%)" />
        <ellipse cx="34" cy="35" rx="4" ry="1.5" fill="hsl(220, 15%, 17%)" />
      </g>
      
      {/* Creator/recording indicator - subtle play button */}
      <g transform="translate(30, 30)">
        <circle cx="4" cy="4" r="5" fill="hsl(0, 0%, 10%)" opacity="0.8" />
        <circle cx="4" cy="4" r="4" fill="hsl(0, 70%, 55%)" />
        <circle cx="4" cy="4" r="3" fill="hsl(0, 75%, 60%)" />
        {/* Recording dot shine */}
        <circle cx="3" cy="3" r="1.2" fill="hsl(0, 70%, 75%)" />
        {/* Pulse ring */}
        <circle 
          cx="4" 
          cy="4" 
          r="5" 
          fill="none" 
          stroke="hsl(0, 70%, 50%)" 
          strokeWidth="1"
          opacity="0.5"
        >
          <animate 
            attributeName="r" 
            values="4;7;4" 
            dur="2s" 
            repeatCount="indefinite"
          />
          <animate 
            attributeName="opacity" 
            values="0.5;0;0.5" 
            dur="2s" 
            repeatCount="indefinite"
          />
        </circle>
      </g>
      
      {/* Data stream particles */}
      <g opacity="0.7">
        <circle cx="18" cy="38" r="1" fill="hsl(152, 60%, 50%)">
          <animate 
            attributeName="cy" 
            values="38;34;38" 
            dur="1.5s" 
            repeatCount="indefinite"
          />
          <animate 
            attributeName="opacity" 
            values="0.7;0.3;0.7" 
            dur="1.5s" 
            repeatCount="indefinite"
          />
        </circle>
        <circle cx="26" cy="40" r="0.8" fill="hsl(152, 60%, 45%)">
          <animate 
            attributeName="cy" 
            values="40;36;40" 
            dur="2s" 
            repeatCount="indefinite"
          />
          <animate 
            attributeName="opacity" 
            values="0.6;0.2;0.6" 
            dur="2s" 
            repeatCount="indefinite"
          />
        </circle>
      </g>
      
      {/* Highlight arc on circle edge */}
      <path
        d="M8 16 A18 18 0 0 1 32 8"
        stroke="url(#sheen)"
        strokeWidth="2"
        fill="none"
        strokeLinecap="round"
      />
      
      {/* Center glow overlay */}
      <circle cx="24" cy="24" r="18" fill="url(#innerGlow)" />
    </svg>
  );
};
