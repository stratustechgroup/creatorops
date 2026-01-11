import { useEffect, useRef, useState } from "react";
import { useScroll } from "framer-motion";

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  opacity: number;
}

export const NetworkFlow = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const animationRef = useRef<number>();
  const { scrollYProgress } = useScroll();
  const scrollRef = useRef(0);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  // Update scroll value for animation
  useEffect(() => {
    const unsubscribe = scrollYProgress.on("change", (v) => {
      scrollRef.current = v;
    });
    return () => unsubscribe();
  }, [scrollYProgress]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resizeCanvas = () => {
      const dpr = window.devicePixelRatio || 1;
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;
      ctx.scale(dpr, dpr);
      setDimensions({ width: window.innerWidth, height: window.innerHeight });
    };

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    // Initialize particles
    const particleCount = 60;
    particlesRef.current = Array.from({ length: particleCount }, () => ({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      vx: (Math.random() - 0.5) * 0.3,
      vy: (Math.random() - 0.5) * 0.3,
      size: Math.random() * 3 + 2,
      opacity: Math.random() * 0.6 + 0.4,
    }));

    const animate = () => {
      if (!ctx || !canvas) return;

      const width = window.innerWidth;
      const height = window.innerHeight;

      ctx.clearRect(0, 0, width, height);

      const scroll = scrollRef.current;

      // Determine if dark or light mode based on background
      const isDark = document.documentElement.classList.contains("dark") || 
                     !document.documentElement.classList.contains("light");
      
      // Colors based on theme
      const particleColor = isDark ? "74, 222, 128" : "34, 197, 94"; // Green shades
      const lineColor = isDark ? "74, 222, 128" : "34, 197, 94";

      // Update and draw particles
      particlesRef.current.forEach((particle, i) => {
        // Add subtle scroll-based movement
        const scrollInfluence = Math.sin(scroll * Math.PI * 2 + i * 0.5) * 0.5;
        particle.x += particle.vx + scrollInfluence;
        particle.y += particle.vy + scroll * 0.5;

        // Wrap around edges
        if (particle.x > width) particle.x = 0;
        if (particle.x < 0) particle.x = width;
        if (particle.y > height) particle.y = 0;
        if (particle.y < 0) particle.y = height;

        // Pulsing opacity based on scroll
        const pulseOpacity = particle.opacity * (0.6 + Math.sin(scroll * Math.PI * 4 + i) * 0.4);

        // Draw particle glow
        const gradient = ctx.createRadialGradient(
          particle.x, particle.y, 0,
          particle.x, particle.y, particle.size * 4
        );
        gradient.addColorStop(0, `rgba(${particleColor}, ${pulseOpacity * 0.8})`);
        gradient.addColorStop(0.5, `rgba(${particleColor}, ${pulseOpacity * 0.3})`);
        gradient.addColorStop(1, `rgba(${particleColor}, 0)`);
        
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size * 4, 0, Math.PI * 2);
        ctx.fillStyle = gradient;
        ctx.fill();

        // Draw solid center
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${particleColor}, ${pulseOpacity})`;
        ctx.fill();

        // Draw connections to nearby particles
        particlesRef.current.slice(i + 1).forEach((other) => {
          const dx = particle.x - other.x;
          const dy = particle.y - other.y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < 180) {
            const connectionOpacity = (1 - distance / 180) * 0.4 * (0.5 + scroll * 0.5);
            ctx.beginPath();
            ctx.moveTo(particle.x, particle.y);
            ctx.lineTo(other.x, other.y);
            ctx.strokeStyle = `rgba(${lineColor}, ${connectionOpacity})`;
            ctx.lineWidth = 1;
            ctx.stroke();
          }
        });
      });

      // Draw flowing energy dots along curves
      const time = Date.now() * 0.001;
      for (let i = 0; i < 8; i++) {
        const t = (time * 0.3 + i * 0.125) % 1;
        const x = width * 0.2 + Math.sin(t * Math.PI * 2 + i) * width * 0.3 + width * 0.3 * t;
        const y = height * t;
        
        const energyGradient = ctx.createRadialGradient(x, y, 0, x, y, 20);
        energyGradient.addColorStop(0, `rgba(${particleColor}, 0.8)`);
        energyGradient.addColorStop(0.5, `rgba(${particleColor}, 0.3)`);
        energyGradient.addColorStop(1, `rgba(${particleColor}, 0)`);
        
        ctx.beginPath();
        ctx.arc(x, y, 20, 0, Math.PI * 2);
        ctx.fillStyle = energyGradient;
        ctx.fill();
      }

      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener("resize", resizeCanvas);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-[1]"
      style={{ opacity: 0.7 }}
    />
  );
};
