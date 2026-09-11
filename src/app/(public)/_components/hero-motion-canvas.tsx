"use client";

import { useEffect, useRef } from "react";

interface HeroMotionCanvasProps {
  mousePos: { x: number; y: number };
}

export function HeroMotionCanvas({ mousePos }: HeroMotionCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Check for reduced motion preference
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let animationFrameId: number;
    let isVisible = true;
    let width = (canvas.width = canvas.offsetWidth);
    let height = (canvas.height = canvas.offsetHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = canvas.offsetWidth;
      height = canvas.height = canvas.offsetHeight;
    };

    window.addEventListener("resize", handleResize);

    // Pause when out of viewport to save battery & CPU
    const observer = new IntersectionObserver(
      ([entry]) => {
        isVisible = entry.isIntersecting;
      },
      { threshold: 0.05 }
    );
    observer.observe(canvas);

    // Aurora orbs configuration
    const orbs = [
      { x: width * 0.2, y: height * 0.3, radius: 180, vx: 0.3, vy: 0.2, color: "rgba(236, 72, 153, 0.14)" }, // Rose/Pink
      { x: width * 0.75, y: height * 0.4, radius: 240, vx: -0.25, vy: 0.15, color: "rgba(245, 158, 11, 0.12)" }, // Amber/Gold
      { x: width * 0.5, y: height * 0.7, radius: 200, vx: 0.2, vy: -0.25, color: "rgba(99, 102, 241, 0.10)" }, // Indigo
      { x: width * 0.85, y: height * 0.8, radius: 160, vx: -0.2, vy: -0.2, color: "rgba(217, 70, 239, 0.12)" }, // Fuchsia
    ];

    // Floating knowledge particles
    const particleCount = 28;
    const particles = Array.from({ length: particleCount }).map(() => ({
      x: Math.random() * width,
      y: Math.random() * height,
      size: Math.random() * 2.5 + 1,
      speedY: -(Math.random() * 0.35 + 0.15),
      speedX: (Math.random() - 0.5) * 0.2,
      opacity: Math.random() * 0.5 + 0.2,
      pulseSpeed: Math.random() * 0.02 + 0.01,
      pulseVal: Math.random() * Math.PI,
    }));

    // Target mouse coordinates with smooth spring inertia (lerp)
    let currentMouseX = width / 2;
    let currentMouseY = height / 2;

    const render = () => {
      if (!isVisible) {
        animationFrameId = requestAnimationFrame(render);
        return;
      }

      ctx.clearRect(0, 0, width, height);

      // Lerp mouse position for smooth trailing spotlight
      currentMouseX += (mousePos.x - currentMouseX) * 0.06;
      currentMouseY += (mousePos.y - currentMouseY) * 0.06;

      // 1. Draw smooth fluid aurora orbs
      orbs.forEach((orb) => {
        if (!prefersReducedMotion) {
          orb.x += orb.vx;
          orb.y += orb.vy;

          if (orb.x < -orb.radius) orb.x = width + orb.radius;
          if (orb.x > width + orb.radius) orb.x = -orb.radius;
          if (orb.y < -orb.radius) orb.y = height + orb.radius;
          if (orb.y > height + orb.radius) orb.y = -orb.radius;
        }

        const gradient = ctx.createRadialGradient(orb.x, orb.y, 0, orb.x, orb.y, orb.radius);
        gradient.addColorStop(0, orb.color);
        gradient.addColorStop(1, "rgba(255, 255, 255, 0)");

        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(orb.x, orb.y, orb.radius, 0, Math.PI * 2);
        ctx.fill();
      });

      // 2. Draw subtle mouse cursor glow spotlight
      if (mousePos.x > 0 && mousePos.y > 0) {
        const spotlightGradient = ctx.createRadialGradient(
          currentMouseX,
          currentMouseY,
          0,
          currentMouseX,
          currentMouseY,
          260
        );
        spotlightGradient.addColorStop(0, "rgba(244, 114, 182, 0.16)"); // Soft pink/primary spotlight
        spotlightGradient.addColorStop(0.5, "rgba(251, 191, 36, 0.06)"); // Soft amber hint
        spotlightGradient.addColorStop(1, "rgba(255, 255, 255, 0)");

        ctx.fillStyle = spotlightGradient;
        ctx.beginPath();
        ctx.arc(currentMouseX, currentMouseY, 260, 0, Math.PI * 2);
        ctx.fill();
      }

      // 3. Draw gently drifting knowledge particles
      particles.forEach((p) => {
        if (!prefersReducedMotion) {
          p.y += p.speedY;
          p.x += p.speedX;
          p.pulseVal += p.pulseSpeed;

          // Wrap around screen
          if (p.y < 0) {
            p.y = height + 10;
            p.x = Math.random() * width;
          }
          if (p.x < 0) p.x = width;
          if (p.x > width) p.x = 0;
        }

        const alpha = p.opacity * (0.6 + 0.4 * Math.sin(p.pulseVal));
        ctx.fillStyle = `rgba(236, 72, 153, ${alpha})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", handleResize);
      observer.disconnect();
    };
  }, [mousePos]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none -z-10"
      aria-hidden="true"
    />
  );
}
