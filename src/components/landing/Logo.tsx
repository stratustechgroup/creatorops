interface LogoProps {
  className?: string;
}

export const Logo = ({ className = "w-8 h-8" }: LogoProps) => {
  return (
    <svg
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Cloud base shape */}
      <path
        d="M8 28C4.68629 28 2 25.3137 2 22C2 19.2 3.9 16.9 6.5 16.2C6.5 16.1 6.5 16.1 6.5 16C6.5 12.1 9.6 9 13.5 9C15.3 9 16.9 9.7 18.1 10.8C19.5 8.5 22.1 7 25 7C29.4 7 33 10.6 33 15C33 15.3 33 15.7 32.9 16C35.8 16.5 38 19 38 22C38 25.3 35.3 28 32 28H8Z"
        fill="hsl(220, 15%, 12%)"
        stroke="hsl(152, 60%, 45%)"
        strokeWidth="1"
        strokeOpacity="0.3"
      />
      
      {/* Inner cloud highlight */}
      <path
        d="M10 26C7.79 26 6 24.21 6 22C6 20.1 7.35 18.5 9.15 18.1C9.05 17.75 9 17.38 9 17C9 14.24 11.24 12 14 12C15.05 12 16.03 12.32 16.84 12.87C18.03 11.12 20.06 10 22.35 10C26.08 10 29.1 13.02 29.1 16.75C29.1 17.02 29.08 17.28 29.04 17.54C31.32 17.88 33 19.82 33 22.15C33 24.65 31.02 26.68 28.54 26.77"
        fill="hsl(220, 18%, 15%)"
      />
      
      {/* Blocky cube 1 - main */}
      <g>
        <rect x="14" y="16" width="8" height="8" fill="hsl(152, 60%, 40%)" />
        <rect x="14" y="16" width="8" height="8" fill="url(#cubeGradient1)" />
        {/* Top face */}
        <path d="M14 16L18 13L26 13L22 16H14Z" fill="hsl(152, 60%, 50%)" />
        {/* Right face */}
        <path d="M22 16L26 13V21L22 24V16Z" fill="hsl(152, 60%, 35%)" />
        {/* Pixel details */}
        <rect x="15" y="17" width="2" height="2" fill="hsl(152, 60%, 55%)" fillOpacity="0.6" />
        <rect x="19" y="19" width="2" height="2" fill="hsl(152, 60%, 30%)" fillOpacity="0.5" />
      </g>
      
      {/* Blocky cube 2 - small accent */}
      <g>
        <rect x="24" y="20" width="5" height="5" fill="hsl(152, 60%, 35%)" />
        <path d="M24 20L26.5 18L31.5 18L29 20H24Z" fill="hsl(152, 60%, 45%)" />
        <path d="M29 20L31.5 18V23L29 25V20Z" fill="hsl(152, 60%, 28%)" />
      </g>
      
      {/* Play/record indicator - creator symbol */}
      <circle cx="11" cy="21" r="3" fill="hsl(0, 70%, 50%)" />
      <circle cx="11" cy="21" r="2" fill="hsl(0, 70%, 60%)" />
      <circle cx="10.5" cy="20.5" r="0.8" fill="hsl(0, 70%, 75%)" />
      
      {/* Data stream / connection lines */}
      <path
        d="M18 24L18 28"
        stroke="hsl(152, 60%, 45%)"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeDasharray="2 2"
      />
      <path
        d="M26 25L26 28"
        stroke="hsl(152, 60%, 40%)"
        strokeWidth="1"
        strokeLinecap="round"
        strokeDasharray="2 2"
      />
      
      {/* Subtle glow effect */}
      <defs>
        <linearGradient id="cubeGradient1" x1="14" y1="16" x2="22" y2="24" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="hsl(152, 70%, 60%)" stopOpacity="0.3" />
          <stop offset="100%" stopColor="hsl(152, 60%, 30%)" stopOpacity="0" />
        </linearGradient>
        <filter id="glow">
          <feGaussianBlur stdDeviation="1" result="coloredBlur" />
          <feMerge>
            <feMergeNode in="coloredBlur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>
    </svg>
  );
};
