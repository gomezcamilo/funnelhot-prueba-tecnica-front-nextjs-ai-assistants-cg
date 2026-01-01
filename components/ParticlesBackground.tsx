'use client';

import { useEffect, useRef } from 'react';

interface Particle {
  x: number;
  y: number;
  size: number;
  speedY: number;
  opacity: number;
  color: string;
}

export function ParticlesBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let particles: Particle[] = [];

    const colors = [
      'rgba(34, 211, 238, ', // cyan/primary
      'rgba(139, 92, 246, ', // purple/accent
      'rgba(255, 255, 255, ', // white
    ];

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    const createParticle = (): Particle => ({
      x: Math.random() * canvas.width,
      y: canvas.height + 10,
      size: Math.random() * 2 + 0.5,
      speedY: Math.random() * 0.8 + 0.3,
      opacity: Math.random() * 0.5 + 0.1,
      color: colors[Math.floor(Math.random() * colors.length)],
    });

    const initParticles = () => {
      const particleCount = Math.floor((canvas.width * canvas.height) / 25000);
      particles = [];
      for (let i = 0; i < particleCount; i++) {
        const particle = createParticle();
        particle.y = Math.random() * canvas.height;
        particles.push(particle);
      }
    };

    const drawParticle = (particle: Particle) => {
      ctx.beginPath();
      ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
      ctx.fillStyle = `${particle.color}${particle.opacity})`;
      ctx.fill();

      // Glow effect
      ctx.beginPath();
      ctx.arc(particle.x, particle.y, particle.size * 2, 0, Math.PI * 2);
      const gradient = ctx.createRadialGradient(
        particle.x, particle.y, 0,
        particle.x, particle.y, particle.size * 2
      );
      gradient.addColorStop(0, `${particle.color}${particle.opacity * 0.3})`);
      gradient.addColorStop(1, `${particle.color}0)`);
      ctx.fillStyle = gradient;
      ctx.fill();
    };

    const updateParticle = (particle: Particle) => {
      particle.y -= particle.speedY;

      // Slight horizontal drift
      particle.x += Math.sin(particle.y * 0.01) * 0.2;

      // Reset particle when it goes off screen
      if (particle.y < -10) {
        particle.y = canvas.height + 10;
        particle.x = Math.random() * canvas.width;
        particle.opacity = Math.random() * 0.5 + 0.1;
      }

      // Fade in/out based on position
      const fadeZone = canvas.height * 0.1;
      if (particle.y > canvas.height - fadeZone) {
        particle.opacity = ((canvas.height - particle.y) / fadeZone) * 0.5;
      } else if (particle.y < fadeZone) {
        particle.opacity = (particle.y / fadeZone) * 0.5;
      }
    };

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particles.forEach((particle) => {
        updateParticle(particle);
        drawParticle(particle);
      });

      animationFrameId = requestAnimationFrame(animate);
    };

    resizeCanvas();
    initParticles();
    animate();

    window.addEventListener('resize', () => {
      resizeCanvas();
      initParticles();
    });

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', resizeCanvas);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0"
      style={{ background: 'linear-gradient(to top, hsl(222 47% 4%), hsl(222 47% 6%), hsl(222 47% 8%))' }}
    />
  );
}
