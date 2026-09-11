"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import {
  Leaf,
  Play,
  Pause,
  Volume2,
  VolumeX,
  Search,
  X,
  BookOpen,
  Globe,
  Award,
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface GuardHeroProps {
  tenantName: string;
  tenantNameEn?: string;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  selectedCategory: string;
  setSelectedCategory: (c: string) => void;
  categories: readonly string[];
  totalBooks?: number;
  onExploreClick?: () => void;
}

const VIDEO_SRC = "https://strvid.nyc3.cdn.digitaloceanspaces.com/motionsite/hero-bg-glass-ball-1_5mb.mp4";
const POSTER_SRC = "https://strvid.nyc3.cdn.digitaloceanspaces.com/motionitems/1785256134297-earth-gaurd-hero.webp";

export function GuardHero({
  tenantName,
  tenantNameEn,
  searchQuery,
  setSearchQuery,
  selectedCategory,
  setSelectedCategory,
  categories,
  totalBooks = 1200,
  onExploreClick,
}: GuardHeroProps) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const modalVideoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);
  const [mousePos, setMousePos] = useState({ x: -100, y: -100 });

  // Handle Video Play / Pause
  const togglePlay = useCallback(() => {
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
      setIsPlaying(false);
    } else {
      videoRef.current.play().catch(() => {});
      setIsPlaying(true);
    }
  }, [isPlaying]);

  // Handle Video Mute / Unmute
  const toggleMute = useCallback(() => {
    if (!videoRef.current) return;
    const nextMuted = !isMuted;
    videoRef.current.muted = nextMuted;
    setIsMuted(nextMuted);
  }, [isMuted]);

  // Handle Video Modal Open/Close
  const openVideoModal = () => {
    setIsVideoModalOpen(true);
    setTimeout(() => {
      if (modalVideoRef.current) {
        modalVideoRef.current.currentTime = 0;
        modalVideoRef.current.play().catch(() => {});
      }
    }, 150);
  };

  const closeVideoModal = () => {
    if (modalVideoRef.current) {
      modalVideoRef.current.pause();
    }
    setIsVideoModalOpen(false);
  };

  // Close modal on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isVideoModalOpen) {
        closeVideoModal();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isVideoModalOpen]);

  // Mouse Move for Parallax and Spotlight
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setMousePos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  const handleMouseLeave = () => {
    setMousePos({ x: -100, y: -100 });
  };

  // Subtle Canvas Particles & Mouse Spotlight
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;
    let width = (canvas.width = canvas.offsetWidth);
    let height = (canvas.height = canvas.offsetHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = canvas.offsetWidth;
      height = canvas.height = canvas.offsetHeight;
    };
    window.addEventListener("resize", handleResize);

    // Generate lightweight bio-green dust particles
    const particleCount = 28;
    const particles = Array.from({ length: particleCount }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      radius: Math.random() * 2 + 0.8,
      speedX: (Math.random() - 0.5) * 0.4,
      speedY: -Math.random() * 0.4 - 0.2,
      opacity: Math.random() * 0.6 + 0.2,
      pulseSpeed: Math.random() * 0.02 + 0.01,
    }));

    let spotlightX = width / 2;
    let spotlightY = height / 2;

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // Smooth lerp to mouse position
      if (mousePos.x > 0 && mousePos.y > 0) {
        spotlightX += (mousePos.x - spotlightX) * 0.06;
        spotlightY += (mousePos.y - spotlightY) * 0.06;

        // Draw soft ambient spotlight over video
        const radial = ctx.createRadialGradient(
          spotlightX,
          spotlightY,
          10,
          spotlightX,
          spotlightY,
          260
        );
        radial.addColorStop(0, "rgba(134, 208, 40, 0.12)");
        radial.addColorStop(0.5, "rgba(134, 208, 40, 0.03)");
        radial.addColorStop(1, "transparent");
        ctx.fillStyle = radial;
        ctx.fillRect(0, 0, width, height);
      }

      // Draw and update glowing green bio-particles
      particles.forEach((p) => {
        p.x += p.speedX;
        p.y += p.speedY;
        p.opacity += Math.sin(Date.now() * p.pulseSpeed * 0.05) * 0.005;

        // Wrap around
        if (p.y < 0) {
          p.y = height + 10;
          p.x = Math.random() * width;
        }
        if (p.x < 0) p.x = width;
        if (p.x > width) p.x = 0;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(134, 208, 40, ${Math.max(0.1, Math.min(0.8, p.opacity))})`;
        ctx.shadowColor = "rgba(134, 208, 40, 0.6)";
        ctx.shadowBlur = 6;
        ctx.fill();
        ctx.shadowBlur = 0;
      });

      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", handleResize);
    };
  }, [mousePos]);

  const scrollToCatalog = () => {
    if (onExploreClick) {
      onExploreClick();
    } else {
      const el = document.getElementById("portal-catalog");
      if (el) {
        el.scrollIntoView({ behavior: "smooth" });
      }
    }
  };

  return (
    <>
      {/* ═══════════════════════════════════════════════════════════════
          EARTHGUARD HERO SECTION
          ═══════════════════════════════════════════════════════════════ */}
      <section
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        className="relative w-full min-h-[90vh] lg:min-h-[94vh] flex flex-col justify-between overflow-hidden bg-[#0b191e] text-white selection:bg-[#86d028] selection:text-[#0b191e]"
      >
        {/* Layer 1: Looping Atmospheric Glass Sphere Video */}
        <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
          <video
            ref={videoRef}
            src={VIDEO_SRC}
            poster={POSTER_SRC}
            autoPlay
            loop
            muted={isMuted}
            playsInline
            className="absolute inset-0 w-full h-full object-cover scale-105 transition-transform duration-1000 ease-out"
          />
          {/* Layer 2: Multi-Layer Atmospheric Overlay for Visual Depth & Contrast */}
          <div className="absolute inset-0 guard-video-overlay pointer-events-none z-1" />
        </div>

        {/* Layer 3: Interactive Particle Canvas */}
        <canvas
          ref={canvasRef}
          className="absolute inset-0 w-full h-full pointer-events-none z-2"
        />

        {/* ─────────────────────────────────────────────────────────────
            MAIN HERO CONTENT CONTAINER
            ───────────────────────────────────────────────────────────── */}
        <div className="relative z-10 container mx-auto max-w-[1440px] px-6 sm:px-8 lg:px-12 pt-16 sm:pt-20 lg:pt-24 pb-10 flex-1 flex flex-col justify-center">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 items-center">
            
            {/* LEFT TYPOGRAPHY COLUMN (Span 6) */}
            <div className="lg:col-span-6 xl:col-span-6 space-y-6">
              
              {/* Tagline Badge with Green Pill Bar */}
              <div className="inline-flex items-center gap-3">
                <span className="w-8 h-[2.5px] bg-[#86d028] rounded-full shadow-[0_0_10px_rgba(134,208,40,0.8)]" />
                <span className="text-xs sm:text-sm font-bold tracking-[0.2em] text-[#86d028] uppercase font-guard-sans">
                  SUSTAINABILITY & WISDOM • {tenantNameEn || "MCU PHICHIT"}
                </span>
              </div>

              {/* Dual Headline (EarthGuard Signature Style) */}
              <div className="space-y-1">
                <h1 className="font-guard-heading font-extrabold text-4xl sm:text-6xl xl:text-[68px] leading-[1.05] uppercase tracking-tight text-white guard-hero-title-shadow">
                  BUILDING TOMORROW.
                </h1>
                <div className="font-guard-serif italic font-normal text-[#86d028] guard-text-glow text-5xl sm:text-7xl xl:text-[76px] leading-[1.05] tracking-normal inline-block">
                  Protecting Today.
                </div>
              </div>

              {/* Subtitle / Paragraph */}
              <p className="text-white/80 text-base sm:text-lg font-normal max-w-xl leading-relaxed">
                ศูนย์รวมคลังหนังสืออิเล็กทรอนิกส์ ตำราวิชาการ งานวิจัย และองค์ความรู้ที่ผ่านการคัดสรรโดย {tenantName} เพื่อส่งเสริมการเรียนรู้ตลอดชีวิตและสร้างสรรค์คุณค่าสู่สังคม
              </p>

              {/* Button Action Group */}
              <div className="flex flex-wrap items-center gap-4 pt-2">
                {/* Primary CTA: Explore Solutions */}
                <button
                  type="button"
                  onClick={scrollToCatalog}
                  className="bg-[#86d028] hover:bg-[#76b821] text-[#0b191e] font-extrabold text-xs sm:text-sm tracking-widest uppercase px-7 py-4 rounded-full flex items-center gap-3 transition-all duration-300 transform hover:scale-[1.03] active:scale-95 shadow-lg shadow-[#86d028]/30 hover:shadow-[#86d028]/50 cursor-pointer"
                >
                  <Leaf className="w-4 h-4 text-[#0b191e]" />
                  <span>สำรวจคลังความรู้</span>
                </button>

                {/* Secondary CTA: Watch Video Documentary */}
                <button
                  type="button"
                  onClick={openVideoModal}
                  className="guard-glass-button text-white font-semibold text-xs sm:text-sm tracking-widest uppercase px-7 py-4 rounded-full flex items-center gap-3 transition-all duration-300 hover:border-white/60 hover:text-white cursor-pointer"
                >
                  <span className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center border border-white/20">
                    <Play className="w-3 h-3 fill-current ml-0.5 text-[#86d028]" />
                  </span>
                  <span>ชมวิดีทัศน์แนะนำ</span>
                </button>
              </div>

              {/* Integrated Sleek Glass Search Bar */}
              <div className="pt-4 max-w-xl">
                <div className="relative group flex items-center bg-white/[0.05] backdrop-blur-xl border border-white/15 rounded-full shadow-2xl hover:border-[#86d028]/60 focus-within:border-[#86d028] focus-within:ring-2 focus-within:ring-[#86d028]/25 transition-all duration-300 p-1.5">
                  <div className="pl-4 text-white/50 group-hover:text-[#86d028] transition-colors">
                    <Search className="w-5 h-5" />
                  </div>
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="ค้นหาชื่อตำรา, งานวิจัย, พระไตรปิฎก, หรือคำสำคัญ..."
                    className="w-full bg-transparent px-3 py-2 text-sm text-white placeholder:text-white/40 outline-none font-sans"
                  />
                  {searchQuery && (
                    <button
                      type="button"
                      onClick={() => setSearchQuery("")}
                      className="p-1.5 text-white/50 hover:text-white mr-1 transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                  <Button
                    type="button"
                    onClick={scrollToCatalog}
                    size="sm"
                    className="bg-[#86d028] hover:bg-[#76b821] text-[#0b191e] font-bold rounded-full px-5 text-xs uppercase tracking-wider shrink-0 transition-transform hover:scale-105"
                  >
                    ค้นหา
                  </Button>
                </div>

                {/* Quick Category Chips */}
                <div className="flex items-center gap-2 overflow-x-auto py-3 px-1 scrollbar-none">
                  {categories.map((cat) => (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => setSelectedCategory(cat)}
                      className={`text-xs px-3.5 py-1.5 rounded-full font-medium transition-all duration-200 transform hover:scale-105 shrink-0 ${
                        selectedCategory === cat
                          ? "bg-[#86d028] text-[#0b191e] font-bold shadow-md shadow-[#86d028]/20"
                          : "bg-white/[0.04] border border-white/10 text-white/70 hover:text-white hover:border-[#86d028]/40 hover:bg-white/[0.08]"
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

            </div>

            {/* CENTER CLEAR SPACER (Span 2) - Preserves view for central rotating 3D glass planet */}
            <div className="hidden lg:block lg:col-span-2 xl:col-span-2" aria-hidden="true" />

            {/* RIGHT STATS COLUMN (Span 4) */}
            <div className="lg:col-span-4 xl:col-span-4 flex flex-col justify-center items-start lg:items-end gap-4">
              
              {/* Stat Card 1: Books & Resources */}
              <div className="guard-glass-card w-full max-w-xs p-5 rounded-2xl transition-all duration-300 transform hover:-translate-y-1 group">
                <div className="flex items-center justify-between">
                  <div className="text-3xl sm:text-4xl font-extrabold text-white font-guard-heading tracking-tight">
                    {totalBooks.toLocaleString()}+
                  </div>
                  <div className="w-10 h-10 rounded-xl bg-[#86d028]/10 border border-[#86d028]/20 flex items-center justify-center text-[#86d028] group-hover:scale-110 transition-transform">
                    <BookOpen className="w-5 h-5" />
                  </div>
                </div>
                <div className="mt-2 text-xs font-bold tracking-widest text-[#86d028] uppercase font-guard-sans">
                  ตำราและงานวิจัยในคลัง
                </div>
                <div className="text-[11px] text-white/50 mt-0.5">
                  Academic Books & Theses
                </div>
              </div>

              {/* Stat Card 2: 100% Open Access */}
              <div className="guard-glass-card w-full max-w-xs p-5 rounded-2xl transition-all duration-300 transform hover:-translate-y-1 group">
                <div className="flex items-center justify-between">
                  <div className="text-3xl sm:text-4xl font-extrabold text-[#86d028] font-guard-heading tracking-tight flex items-center gap-1">
                    100%
                  </div>
                  <div className="w-10 h-10 rounded-xl bg-[#86d028]/10 border border-[#86d028]/20 flex items-center justify-center text-[#86d028] group-hover:scale-110 transition-transform">
                    <Globe className="w-5 h-5" />
                  </div>
                </div>
                <div className="mt-2 text-xs font-bold tracking-widest text-[#86d028] uppercase font-guard-sans">
                  เข้าถึงฟรีตลอด 24 ชั่วโมง
                </div>
                <div className="text-[11px] text-white/50 mt-0.5">
                  Universal Digital Access
                </div>
              </div>

              {/* Stat Card 3: Satisfaction Index */}
              <div className="guard-glass-card w-full max-w-xs p-5 rounded-2xl transition-all duration-300 transform hover:-translate-y-1 group">
                <div className="flex items-center justify-between">
                  <div className="text-3xl sm:text-4xl font-extrabold text-white font-guard-heading tracking-tight flex items-center gap-1.5">
                    4.9 <span className="text-[#86d028] text-2xl">★</span>
                  </div>
                  <div className="w-10 h-10 rounded-xl bg-[#86d028]/10 border border-[#86d028]/20 flex items-center justify-center text-[#86d028] group-hover:scale-110 transition-transform">
                    <Award className="w-5 h-5" />
                  </div>
                </div>
                <div className="mt-2 text-xs font-bold tracking-widest text-[#86d028] uppercase font-guard-sans">
                  ดัชนีความพึงพอใจผู้อ่าน
                </div>
                <div className="text-[11px] text-white/50 mt-0.5">
                  Reader Satisfaction Score
                </div>
              </div>

            </div>

          </div>
        </div>

        {/* ─────────────────────────────────────────────────────────────
            BOTTOM CONTROLS BAR (EarthGuard Signature Footer Bar)
            ───────────────────────────────────────────────────────────── */}
        <div className="relative z-20 w-full border-t border-white/10 bg-[#0b191e]/60 backdrop-blur-md py-4 px-6 sm:px-8 lg:px-12">
          <div className="container mx-auto max-w-[1440px] flex items-center justify-between gap-4">
            
            {/* Left: Video Audio & Play Controls */}
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={toggleMute}
                aria-label={isMuted ? "Unmute Background Video" : "Mute Background Video"}
                className="w-9 h-9 rounded-full bg-white/5 border border-white/15 flex items-center justify-center text-white/70 hover:text-[#86d028] hover:border-[#86d028]/50 hover:bg-white/10 transition-all cursor-pointer"
                title={isMuted ? "เปิดเสียงวิดีโอ" : "ปิดเสียงวิดีโอ"}
              >
                {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4 text-[#86d028]" />}
              </button>

              <button
                type="button"
                onClick={togglePlay}
                aria-label={isPlaying ? "Pause Background Video" : "Play Background Video"}
                className="w-9 h-9 rounded-full bg-white/5 border border-white/15 flex items-center justify-center text-white/70 hover:text-[#86d028] hover:border-[#86d028]/50 hover:bg-white/10 transition-all cursor-pointer"
                title={isPlaying ? "หยุดวิดีโอชั่วคราว" : "เล่นวิดีโอต่อ"}
              >
                {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 text-[#86d028] ml-0.5" />}
              </button>

              <span className="text-[11px] font-mono text-white/40 hidden sm:inline-block pl-2">
                ATMOSPHERIC VIDEO ENGINE • {isPlaying ? "ACTIVE" : "PAUSED"}
              </span>
            </div>

            {/* Center: Animated Mouse Scroll Indicator */}
            <button
              type="button"
              onClick={scrollToCatalog}
              className="flex items-center gap-2 text-white/60 hover:text-[#86d028] transition-colors group cursor-pointer"
            >
              <div className="w-5 h-8 rounded-full border-2 border-white/30 group-hover:border-[#86d028] flex items-start justify-center p-1 transition-colors">
                <div className="w-1 h-2 rounded-full bg-[#86d028] animate-bounce" />
              </div>
              <span className="text-[10px] sm:text-[11px] font-bold tracking-widest uppercase hidden md:inline">
                SCROLL DOWN
              </span>
            </button>

            {/* Right: System OS Tag */}
            <div className="text-right">
              <span className="text-[10px] sm:text-[11px] font-medium tracking-widest text-white/40 uppercase font-mono">
                EARTHGUARD ECO-OS v2.4 • {tenantNameEn || "MCU PHICHIT"}
              </span>
            </div>

          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════
          VIDEO DOCUMENTARY MODAL POPUP
          ═══════════════════════════════════════════════════════════════ */}
      {isVideoModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-xl p-4 sm:p-8 animate-in fade-in duration-200">
          <div
            className="relative w-full max-w-4xl bg-[#0b191e] border border-white/20 rounded-2xl overflow-hidden shadow-2xl flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-white/[0.02]">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 rounded-full bg-[#86d028] animate-pulse" />
                <h3 className="text-sm sm:text-base font-bold text-white font-guard-sans tracking-wide">
                  EarthGuard & Academic Knowledge Platform — วิดีทัศน์แนะนำโครงการ
                </h3>
              </div>
              <button
                type="button"
                onClick={closeVideoModal}
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white/70 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Video Player */}
            <div className="relative aspect-video w-full bg-black">
              <video
                ref={modalVideoRef}
                src={VIDEO_SRC}
                controls
                autoPlay
                playsInline
                className="w-full h-full object-contain"
              />
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-3 bg-white/[0.03] border-t border-white/10 flex items-center justify-between text-xs text-white/60">
              <span>วิทยาลัยสงฆ์พิจิตร • ส่วนงานห้องสมุดและสารสนเทศ</span>
              <button
                type="button"
                onClick={closeVideoModal}
                className="text-[#86d028] hover:underline font-medium cursor-pointer"
              >
                ปิดหน้าต่าง
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
