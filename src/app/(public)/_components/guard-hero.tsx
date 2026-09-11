"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import {
  BookOpen,
  Play,
  Search,
  X,
  Globe,
  Award,
  Sparkles,
  Layers,
  Cpu,
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

const MODAL_VIDEO_SRC = "https://strvid.nyc3.cdn.digitaloceanspaces.com/motionsite/hero-bg-glass-ball-1_5mb.mp4";
const BOOK_BG_IMAGE = "/futuristic-open-book.jpg";

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
  const modalVideoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const heroRef = useRef<HTMLDivElement | null>(null);

  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);
  const [mousePos, setMousePos] = useState({ x: -100, y: -100 });
  const [parallaxOffset, setParallaxOffset] = useState({ x: 0, y: 0 });

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

  // Mouse Move for Parallax and Spotlight (Smooth, gentle damping)
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setMousePos({ x, y });

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    setParallaxOffset({
      x: ((x - centerX) / centerX) * 4,
      y: ((y - centerY) / centerY) * 4,
    });
  };

  const handleMouseLeave = () => {
    setMousePos({ x: -100, y: -100 });
    setParallaxOffset({ x: 0, y: 0 });
  };

  // Interactive Particle Canvas with Dynamic Palette Color Reading
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

    // Read active brand color from computed style
    const getBrandColor = () => {
      if (typeof window === "undefined") return { r: 5, g: 86, b: 202 };
      const style = getComputedStyle(document.documentElement);
      const brand = style.getPropertyValue("--brand").trim() || style.getPropertyValue("--primary").trim() || "#0556CA";

      // Parse hex or rgb
      if (brand.startsWith("#")) {
        const hex = brand.replace("#", "");
        if (hex.length === 6) {
          return {
            r: parseInt(hex.substring(0, 2), 16),
            g: parseInt(hex.substring(2, 4), 16),
            b: parseInt(hex.substring(4, 6), 16),
          };
        }
      }
      return { r: 61, g: 130, b: 232 };
    };

    const brandRgb = getBrandColor();

    let spotlightX = width / 2;
    let spotlightY = height / 2;

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // Smooth, gentle ambient spotlight following cursor (subtle and calm)
      if (mousePos.x > 0 && mousePos.y > 0) {
        spotlightX += (mousePos.x - spotlightX) * 0.03;
        spotlightY += (mousePos.y - spotlightY) * 0.03;

        const radial = ctx.createRadialGradient(
          spotlightX,
          spotlightY,
          10,
          spotlightX,
          spotlightY,
          300
        );
        radial.addColorStop(0, `rgba(${brandRgb.r}, ${brandRgb.g}, ${brandRgb.b}, 0.12)`);
        radial.addColorStop(0.5, `rgba(${brandRgb.r}, ${brandRgb.g}, ${brandRgb.b}, 0.03)`);
        radial.addColorStop(1, "transparent");
        ctx.fillStyle = radial;
        ctx.fillRect(0, 0, width, height);
      }

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
          FUTURISTIC GUARD HERO SECTION (Dynamic Palette & Futuristic Open Book)
          ═══════════════════════════════════════════════════════════════ */}
      <section
        ref={heroRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        className="relative w-full min-h-[92vh] lg:min-h-[96vh] flex flex-col justify-between overflow-hidden bg-[#070c14] text-white selection:bg-primary selection:text-primary-foreground"
      >
        {/* Layer 1: Futuristic Open Book Background Visual with Floating Motion, Mouse Parallax & Dynamic Light Effects */}
        <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
          {/* Main Book Visual with subtle futuristic floating motion */}
          <div
            className="absolute inset-0 w-full h-full bg-cover bg-center transition-transform duration-700 ease-out animate-float-futuristic"
            style={{
              backgroundImage: `url(${BOOK_BG_IMAGE})`,
              transform: `scale(1.04) translate(${parallaxOffset.x * -0.25}px, ${parallaxOffset.y * -0.25}px)`,
            }}
          />

          {/* Layer 1.1: Multi-Layer Atmospheric Overlay for Cinematic Contrast */}
          <div className="absolute inset-0 guard-video-overlay pointer-events-none z-1" />

          {/* Layer 1.2: Breathing Pulsing Holographic Core Aura Behind Book */}
          <div
            className="absolute top-1/2 right-[12%] sm:right-[18%] lg:right-[24%] -translate-y-1/2 w-[520px] sm:w-[620px] h-[520px] sm:h-[620px] rounded-full pointer-events-none blur-[95px] opacity-70 animate-book-glow-breathe z-1"
            style={{
              background: "radial-gradient(circle, var(--brand-glow, rgba(61, 130, 232, 0.75)) 0%, var(--brand, rgba(5, 86, 202, 0.35)) 45%, transparent 72%)",
            }}
          />

          {/* Layer 1.3: Hologram Shimmer Highlight Overlay across Book */}
          <div
            className="absolute top-1/2 right-[10%] sm:right-[16%] lg:right-[20%] -translate-y-1/2 w-[600px] h-[440px] rounded-[50px] pointer-events-none opacity-50 mix-blend-color-dodge animate-hologram-shimmer z-1"
            style={{
              background: "radial-gradient(ellipse at 48% 52%, var(--brand-light, #38bdf8) 0%, transparent 65%)",
            }}
          />

          {/* Layer 1.4: Dynamic Shifting Light Sweep Beam across Book Pages */}
          <div className="absolute top-1/2 right-[8%] sm:right-[14%] lg:right-[18%] -translate-y-1/2 w-[650px] h-[480px] overflow-hidden pointer-events-none mix-blend-screen opacity-75 z-1">
            <div
              className="absolute -inset-full bg-gradient-to-r from-transparent via-[var(--brand-light,rgba(120,200,255,0.45))] to-transparent transform -rotate-12 animate-book-light-sweep"
            />
          </div>

          {/* Layer 1.5: Interactive Parallax Mouse Flare on Book Surface */}
          <div
            className="absolute top-1/2 right-[14%] sm:right-[20%] lg:right-[24%] -translate-y-1/2 w-[380px] h-[280px] rounded-full pointer-events-none blur-[60px] opacity-30 mix-blend-screen transition-transform duration-500 ease-out z-1"
            style={{
              background: "radial-gradient(circle, var(--brand-light, #70b8ff) 0%, transparent 70%)",
              transform: `translate(${parallaxOffset.x * 1.5}px, ${parallaxOffset.y * 1.5}px)`,
            }}
          />
        </div>

        {/* Ambient Mouse Spotlight Canvas (Clean, zero particles/glyphs) */}
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
              
              {/* Tagline Badge Linked with Active System Palette */}
              <div className="inline-flex items-center gap-3">
                <span
                  className="w-8 h-[2.5px] rounded-full bg-primary"
                  style={{
                    boxShadow: "0 0 12px var(--brand-glow, rgba(61, 130, 232, 0.8))",
                  }}
                />
                <span className="text-xs sm:text-sm font-bold tracking-[0.2em] text-primary uppercase font-guard-sans flex items-center gap-2">
                  <Cpu className="w-3.5 h-3.5 text-primary animate-pulse" />
                  KNOWLEDGE FOR TOMORROW • {tenantNameEn || "MCU PHICHIT"}
                </span>
              </div>

              {/* Dual Headline (EarthGuard Signature Style linked with Theme Colors) */}
              <div className="space-y-1">
                <h1 className="font-guard-heading font-extrabold text-4xl sm:text-6xl xl:text-[68px] leading-[1.05] uppercase tracking-tight text-white guard-hero-title-shadow">
                  BUILDING TOMORROW.
                </h1>
                <div className="font-guard-serif italic font-normal text-primary guard-text-glow text-5xl sm:text-7xl xl:text-[76px] leading-[1.05] tracking-normal inline-block">
                  Protecting Today.
                </div>
              </div>

              {/* Subtitle / Paragraph */}
              <p className="text-white/80 text-base sm:text-lg font-normal max-w-xl leading-relaxed">
                ศูนย์รวมคลังหนังสืออิเล็กทรอนิกส์ ตำราวิชาการ งานวิจัย และองค์ความรู้ที่ผ่านการคัดสรรโดย {tenantName} เพื่อส่งเสริมการเรียนรู้ตลอดชีวิตและสร้างสรรค์คุณค่าสู่สังคม
              </p>

              {/* Button Action Group */}
              <div className="flex flex-wrap items-center gap-4 pt-2">
                {/* Primary CTA: Explore Solutions (Linked with Theme Palette) */}
                <button
                  type="button"
                  onClick={scrollToCatalog}
                  className="bg-primary hover:bg-primary/90 text-primary-foreground font-extrabold text-xs sm:text-sm tracking-widest uppercase px-7 py-4 rounded-full flex items-center gap-3 transition-all duration-300 transform hover:scale-[1.03] active:scale-95 shadow-lg shadow-primary/30 hover:shadow-primary/50 cursor-pointer"
                >
                  <BookOpen className="w-4 h-4 text-primary-foreground" />
                  <span>สำรวจคลังความรู้</span>
                </button>

                {/* Secondary CTA: Watch Video Documentary */}
                <button
                  type="button"
                  onClick={openVideoModal}
                  className="guard-glass-button text-white font-semibold text-xs sm:text-sm tracking-widest uppercase px-7 py-4 rounded-full flex items-center gap-3 transition-all duration-300 hover:border-white/60 hover:text-white cursor-pointer"
                >
                  <span className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center border border-white/20">
                    <Play className="w-3 h-3 fill-current ml-0.5 text-primary" />
                  </span>
                  <span>ชมวิดีทัศน์แนะนำ</span>
                </button>
              </div>

              {/* Integrated Sleek Glass Search Bar */}
              <div className="pt-4 max-w-xl">
                <div className="relative group flex items-center bg-white/[0.05] backdrop-blur-xl border border-white/15 rounded-full shadow-2xl hover:border-primary/60 focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/25 transition-all duration-300 p-1.5">
                  <div className="pl-4 text-white/50 group-hover:text-primary transition-colors">
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
                    className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold rounded-full px-5 text-xs uppercase tracking-wider shrink-0 transition-transform hover:scale-105"
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
                          ? "bg-primary text-primary-foreground font-bold shadow-md shadow-primary/25"
                          : "bg-white/[0.04] border border-white/10 text-white/70 hover:text-white hover:border-primary/40 hover:bg-white/[0.08]"
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

            </div>

            {/* CENTER CLEAR SPACER (Span 2) - Preserves view for central floating holographic open book */}
            <div className="hidden lg:block lg:col-span-2 xl:col-span-2" aria-hidden="true" />

            {/* RIGHT STATS COLUMN (Span 4) */}
            <div className="lg:col-span-4 xl:col-span-4 flex flex-col justify-center items-start lg:items-end gap-4">
              
              {/* Stat Card 1: Books & Resources */}
              <div className="guard-glass-card w-full max-w-xs p-5 rounded-2xl transition-all duration-300 transform hover:-translate-y-1 group">
                <div className="flex items-center justify-between">
                  <div className="text-3xl sm:text-4xl font-extrabold text-white font-guard-heading tracking-tight">
                    {totalBooks.toLocaleString()}+
                  </div>
                  <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                    <BookOpen className="w-5 h-5" />
                  </div>
                </div>
                <div className="mt-2 text-xs font-bold tracking-widest text-primary uppercase font-guard-sans">
                  ตำราและงานวิจัยในคลัง
                </div>
                <div className="text-[11px] text-white/50 mt-0.5">
                  Academic Books & Theses
                </div>
              </div>

              {/* Stat Card 2: 100% Open Access */}
              <div className="guard-glass-card w-full max-w-xs p-5 rounded-2xl transition-all duration-300 transform hover:-translate-y-1 group">
                <div className="flex items-center justify-between">
                  <div className="text-3xl sm:text-4xl font-extrabold text-primary font-guard-heading tracking-tight flex items-center gap-1">
                    100%
                  </div>
                  <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                    <Globe className="w-5 h-5" />
                  </div>
                </div>
                <div className="mt-2 text-xs font-bold tracking-widest text-primary uppercase font-guard-sans">
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
                    4.9 <span className="text-primary text-2xl">★</span>
                  </div>
                  <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                    <Award className="w-5 h-5" />
                  </div>
                </div>
                <div className="mt-2 text-xs font-bold tracking-widest text-primary uppercase font-guard-sans">
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
            BOTTOM CONTROLS BAR (Futuristic Knowledge OS Status Bar)
            ───────────────────────────────────────────────────────────── */}
        <div className="relative z-20 w-full border-t border-white/10 bg-[#070c14]/70 backdrop-blur-md py-4 px-6 sm:px-8 lg:px-12">
          <div className="container mx-auto max-w-[1440px] flex items-center justify-between gap-4">
            
            {/* Left: Futuristic Knowledge Engine Status Indicator */}
            <div className="flex items-center gap-2.5">
              <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
              <span className="text-[11px] font-mono text-white/50 tracking-wider">
                HOLOGRAPHIC KNOWLEDGE ENGINE • ACTIVE
              </span>
            </div>

            {/* Center: Animated Mouse Scroll Indicator */}
            <button
              type="button"
              onClick={scrollToCatalog}
              className="flex items-center gap-2 text-white/60 hover:text-primary transition-colors group cursor-pointer"
            >
              <div className="w-5 h-8 rounded-full border-2 border-white/30 group-hover:border-primary flex items-start justify-center p-1 transition-colors">
                <div className="w-1 h-2 rounded-full bg-primary animate-bounce" />
              </div>
              <span className="text-[10px] sm:text-[11px] font-bold tracking-widest uppercase hidden md:inline">
                SCROLL DOWN
              </span>
            </button>

            {/* Right: System OS Tag */}
            <div className="text-right">
              <span className="text-[10px] sm:text-[11px] font-medium tracking-widest text-white/40 uppercase font-mono">
                FMS MCU-PCT CORE • KNOWLEDGE OS v2.5
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
            className="relative w-full max-w-4xl bg-[#070c14] border border-white/20 rounded-2xl overflow-hidden shadow-2xl flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-white/[0.02]">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 rounded-full bg-primary animate-pulse" />
                <h3 className="text-sm sm:text-base font-bold text-white font-guard-sans tracking-wide">
                  Academic Knowledge Platform — วิดีทัศน์แนะนำคลังปัญญา
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
                src={MODAL_VIDEO_SRC}
                controls
                autoPlay
                playsInline
                className="w-full h-full object-contain"
              />
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-3 bg-white/[0.03] border-t border-white/10 flex items-center justify-between text-xs text-white/60">
              <span>{tenantName} • ส่วนงานห้องสมุดและสารสนเทศ</span>
              <button
                type="button"
                onClick={closeVideoModal}
                className="text-primary hover:underline font-medium cursor-pointer"
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
