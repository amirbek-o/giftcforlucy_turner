import React, { useEffect, useRef } from 'react';

export const StardustBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize);

    // Subtle organic stardust particles
    const particleCount = Math.min(55, Math.floor((width * height) / 26000));
    const particles = Array.from({ length: particleCount }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      radius: Math.random() * 1.6 + 0.5,
      vx: (Math.random() - 0.5) * 0.18,
      vy: -Math.random() * 0.22 - 0.04,
      alpha: Math.random() * 0.45 + 0.12,
      phase: Math.random() * Math.PI * 2,
      gold: Math.random() > 0.65,
    }));

    const render = (time: number) => {
      ctx.clearRect(0, 0, width, height);

      for (const p of particles) {
        p.x += p.vx;
        p.y += p.vy;

        if (p.y < -10) p.y = height + 10;
        if (p.x < -10) p.x = width + 10;
        if (p.x > width + 10) p.x = -10;

        const twinkle =
          p.alpha * (0.65 + 0.35 * Math.sin(time * 0.0015 + p.phase));

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = p.gold
          ? `rgba(212, 175, 55, ${twinkle})`
          : `rgba(232, 220, 196, ${twinkle})`;
        ctx.fill();
      }

      animationFrameId = requestAnimationFrame(render);
    };

    animationFrameId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <div
      className="fixed inset-0 pointer-events-none z-0 overflow-hidden"
      aria-hidden="true"
    >
      {/* Subtle architectural dot-matrix pattern */}
      <div
        className="absolute inset-0 opacity-[0.14]"
        style={{
          backgroundImage:
            'radial-gradient(rgba(232, 220, 196, 0.55) 1px, transparent 1px)',
          backgroundSize: '32px 32px',
        }}
      />

      {/* Ambient warm canopy radial glow */}
      <div
        className="absolute -top-48 left-1/2 -translate-x-1/2 w-[960px] h-[520px] rounded-full opacity-25 blur-3xl"
        style={{
          background:
            'radial-gradient(circle, rgba(212, 175, 55, 0.28) 0%, rgba(45, 90, 64, 0.18) 55%, transparent 100%)',
        }}
      />

      {/* Floating stardust canvas */}
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />

      {/* Soft bottom mist/fog gradient */}
      <div className="absolute inset-x-0 bottom-0 h-44 bg-gradient-to-t from-[#162C1F]/90 via-[#1F3D2B]/40 to-transparent" />
    </div>
  );
};
