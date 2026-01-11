import { useEffect, useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

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
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight * 5; // Cover full scroll height
    };

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    // Initialize particles
    const particleCount = 80;
    particlesRef.current = Array.from({ length: particleCount }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 0.5,
      vy: (Math.random() - 0.5) * 0.5 + 0.3, // Slight downward drift
      size: Math.random() * 2 + 1,
      opacity: Math.random() * 0.5 + 0.2,
    }));

    const animate = () => {
      if (!ctx || !canvas) return;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const scroll = scrollRef.current;
      const scrollOffset = scroll * canvas.height * 0.8;

      // Get primary color from CSS
      const primaryColor = getComputedStyle(document.documentElement)
        .getPropertyValue("--primary")
        .trim();
      
      // Parse HSL values
      const hslMatch = primaryColor.match(/(\d+)\s+(\d+)%\s+(\d+)%/);
      const h = hslMatch ? hslMatch[1] : "152";
      const s = hslMatch ? hslMatch[2] : "60";
      const l = hslMatch ? hslMatch[3] : "45";

      // Update and draw particles
      particlesRef.current.forEach((particle, i) => {
        // Add scroll-based movement
        particle.y += particle.vy + scroll * 2;
        particle.x += particle.vx + Math.sin(scroll * Math.PI * 2 + i) * 0.5;

        // Wrap around
        if (particle.y > canvas.height) particle.y = 0;
        if (particle.y < 0) particle.y = canvas.height;
        if (particle.x > canvas.width) particle.x = 0;
        if (particle.x < 0) particle.x = canvas.width;

        // Draw particle with pulsing opacity based on scroll
        const pulseOpacity = particle.opacity * (0.7 + Math.sin(scroll * Math.PI * 4 + i) * 0.3);
        ctx.beginPath();
        ctx.arc(particle.x, particle.y - scrollOffset, particle.size, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(${h}, ${s}%, ${l}%, ${pulseOpacity})`;
        ctx.fill();

        // Draw connections to nearby particles
        particlesRef.current.slice(i + 1).forEach((other) => {
          const dx = particle.x - other.x;
          const dy = particle.y - other.y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < 150) {
            const connectionOpacity = (1 - distance / 150) * 0.15 * (0.5 + scroll * 0.5);
            ctx.beginPath();
            ctx.moveTo(particle.x, particle.y - scrollOffset);
            ctx.lineTo(other.x, other.y - scrollOffset);
            ctx.strokeStyle = `hsla(${h}, ${s}%, ${l}%, ${connectionOpacity})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        });
      });

      // Draw flowing energy lines along the center
      const centerX = canvas.width / 2;
      const flowIntensity = Math.sin(scroll * Math.PI * 3) * 0.5 + 0.5;
      
      for (let i = 0; i < 5; i++) {
        const yOffset = (scroll * canvas.height + i * 200) % canvas.height;
        const xWave = Math.sin(yOffset * 0.01 + i) * 100;
        
        ctx.beginPath();
        ctx.arc(centerX + xWave, yOffset, 3 + flowIntensity * 2, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(${h}, ${s}%, ${l}%, ${0.3 + flowIntensity * 0.4})`;
        ctx.fill();
        
        // Trailing glow
        const gradient = ctx.createRadialGradient(
          centerX + xWave, yOffset, 0,
          centerX + xWave, yOffset, 30 + flowIntensity * 20
        );
        gradient.addColorStop(0, `hsla(${h}, ${s}%, ${l}%, ${0.2 * flowIntensity})`);
        gradient.addColorStop(1, `hsla(${h}, ${s}%, ${l}%, 0)`);
        ctx.fillStyle = gradient;
        ctx.fillRect(centerX + xWave - 50, yOffset - 50, 100, 100);
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
      className="fixed inset-0 pointer-events-none z-0"
      style={{ opacity: 0.6 }}
    />
  );
};
