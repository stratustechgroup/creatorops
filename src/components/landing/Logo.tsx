interface LogoProps {
  className?: string;
}

export const Logo = ({ className = "w-8 h-8" }: LogoProps) => {
  return (
    <svg
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Base cube - dark */}
      <rect x="4" y="8" width="16" height="16" rx="1" fill="hsl(220, 18%, 12%)" />
      
      {/* Top face - lighter */}
      <path
        d="M4 9L12 4L28 4L28 8L20 8L20 24L4 24L4 9Z"
        fill="hsl(220, 15%, 18%)"
      />
      
      {/* Right face - medium */}
      <path
        d="M20 8L28 4V20L20 24V8Z"
        fill="hsl(220, 15%, 15%)"
      />
      
      {/* Glowing emerald blocks */}
      <rect x="6" y="10" width="4" height="4" rx="0.5" fill="hsl(152, 60%, 45%)" />
      <rect x="12" y="14" width="4" height="4" rx="0.5" fill="hsl(152, 60%, 40%)" />
      <rect x="8" y="18" width="4" height="4" rx="0.5" fill="hsl(152, 60%, 35%)" />
      
      {/* Data stream lines */}
      <path
        d="M22 10L26 8"
        stroke="hsl(152, 60%, 50%)"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <path
        d="M22 14L26 12"
        stroke="hsl(152, 60%, 45%)"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <path
        d="M22 18L26 16"
        stroke="hsl(152, 60%, 40%)"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      
      {/* Glow effect overlay */}
      <rect
        x="6"
        y="10"
        width="4"
        height="4"
        rx="0.5"
        fill="hsl(152, 60%, 50%)"
        fillOpacity="0.3"
        filter="blur(2px)"
      />
    </svg>
  );
};
