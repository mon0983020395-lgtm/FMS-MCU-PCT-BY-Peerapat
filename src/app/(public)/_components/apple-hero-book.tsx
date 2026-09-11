"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Sparkles,
  BookOpen,
  ArrowRight,
  Star,
  ChevronRight,
  BookMarked,
  RotateCcw,
  Volume2,
  Check,
  Search,
  Flame,
  Zap,
} from "lucide-react";

interface AppleHeroBookProps {
  tenantName: string;
  tenantNameEn: string;
  onExploreClick?: () => void;
  onSearchSubmit?: (query: string) => void;
}

export function AppleHeroBook({
  tenantName,
  tenantNameEn,
  onExploreClick,
  onSearchSubmit,
}: AppleHeroBookProps) {
  // Book animation state: starts slightly closed then unfolds in Apple style
  const [isOpen, setIsOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [localSearch, setLocalSearch] = useState("");

  // Auto-open book gracefully shortly after mount to replicate MacBook lid opening
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsOpen(true);
    }, 600);
    return () => clearTimeout(timer);
  }, []);

  const totalPages = 3;

  const pageContents = [
    {
      chapter: "บทที่ 1: ปรัชญาแห่งการอ่านเชิงวิชาการ",
      subtitle: "The Art of Intentional Reading & Lifelong Wisdom",
      quote: "ปัญญาประดุจแสงประทีปส่องทาง นำพาการศึกษาและงานวิจัยสู่ประโยชน์สุขของสังคม",
      author: "คณาจารย์ผู้ทรงคุณวุฒิ วิทยาลัยสงฆ์พิจิตร",
      keyInsight: "การบูรณาการหลักพุทธธรรมกับการจัดการความรู้ดิจิทัล เพื่อสร้างสรรค์นวัตกรรมสังคม",
      stats: "280 หน้า • อ่านจบเฉลี่ย 4.5 ชม.",
    },
    {
      chapter: "บทที่ 2: นวัตกรรมดิจิทัลกับการศึกษาสมัยใหม่",
      subtitle: "Digital Literacy & AI in Contemporary Higher Education",
      quote: "เทคโนโลยีคือเครื่องมือ ปัญญาและคุณธรรมคือทิศทางในการขับเคลื่อนอนาคต",
      author: "ศูนย์นวัตกรรมและเทคโนโลยีสารสนเทศ",
      keyInsight: "การประยุกต์ใช้ AI ในการวิเคราะห์งานวิจัยอย่างมีจริยธรรมและถูกต้องตามมาตรฐานวิชาการ",
      stats: "320 หน้า • อ่านจบเฉลี่ย 5.0 ชม.",
    },
    {
      chapter: "บทที่ 3: งานวิจัยและวิทยานิพนธ์เพื่อการพัฒนาท้องถิ่น",
      subtitle: "Applied Research & Community Development",
      quote: "จากตำราสู่การปฏิบัติจริง ยกระดับคุณภาพชีวิตและภูมิปัญญาท้องถิ่นอย่างยั่งยืน",
      author: "สำนักวิจัยและบริการวิชาการ วิทยาลัยสงฆ์พิจิตร",
      keyInsight: "สังเคราะห์บทเรียนและข้อเสนอแนะเชิงนโยบายเพื่อการพัฒนาจังหวัดพิจิตรและภาคเหนือตอนล่าง",
      stats: "245 หน้า • อ่านจบเฉลี่ย 3.8 ชม.",
    },
  ];

  const activeContent = pageContents[currentPage - 1];

  return (
    <section className="relative w-full bg-[#000000] text-white overflow-hidden pt-16 pb-20 md:pt-24 md:pb-32 selection:bg-primary selection:text-white">
      {/* 1. Cinematic Ambient Lighting (Apple Hero Lighting) */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-gradient-to-b from-primary/20 via-blue-500/10 to-transparent rounded-full blur-[140px] pointer-events-none -z-0" />
      <div className="absolute top-1/4 right-10 w-[450px] h-[350px] bg-amber-500/10 rounded-full blur-[120px] pointer-events-none -z-0" />
      <div className="absolute bottom-10 left-10 w-[450px] h-[350px] bg-emerald-500/5 rounded-full blur-[120px] pointer-events-none -z-0" />

      {/* Subtle Grid Background */}
      <div
        className="absolute inset-0 opacity-[0.04] pointer-events-none"
        style={{
          backgroundImage: `linear-gradient(to right, #ffffff 1px, transparent 1px), linear-gradient(to bottom, #ffffff 1px, transparent 1px)`,
          backgroundSize: "64px 64px",
        }}
      />

      <div className="container mx-auto px-4 max-w-6xl relative z-10">
        
        {/* Top Eyebrow Tag (Apple Style) */}
        <div className="text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/[0.08] border border-white/[0.15] backdrop-blur-md shadow-inner text-xs md:text-sm font-medium tracking-wider text-neutral-300">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>{tenantName} • NEXT-GEN DIGITAL ARCHIVE</span>
          </div>

          {/* Majestic Hero Headline (Apple MacBook Pro Shimmer) */}
          <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-extrabold tracking-tight leading-[1.05] max-w-5xl mx-auto">
            <span className="block bg-gradient-to-b from-white via-neutral-100 to-neutral-400 bg-clip-text text-transparent">
              ก้าวล้ำ. ลุ่มลึก.
            </span>
            <span className="block text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-neutral-200 via-primary-foreground to-neutral-400 bg-clip-text text-transparent mt-2">
              เปิดมิติใหม่แห่งปัญญา สู่อนาคตการศึกษาดิจิทัล
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-base sm:text-lg md:text-xl text-neutral-400 max-w-2xl mx-auto font-light leading-relaxed">
            คลังหนังสืออิเล็กทรอนิกส์ ตำราวิชาการ และงานวิจัยคัดสรรที่ทรงพลังที่สุด เปิดให้อ่านและสืบค้นแบบไร้รอยต่อตลอด 24 ชั่วโมง
          </p>

          {/* Apple Style CTAs */}
          <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
            <Button
              size="lg"
              onClick={onExploreClick}
              className="rounded-full px-8 py-6 text-base font-semibold bg-white text-black hover:bg-neutral-200 hover:text-black shadow-[0_0_30px_rgba(255,255,255,0.25)] transition-all hover:scale-105"
            >
              <BookOpen className="w-5 h-5 mr-2" />
              เปิดอ่านคลังหนังสือ (Explore E-Books)
            </Button>
            
            <button
              type="button"
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center gap-2 text-sm md:text-base font-medium text-neutral-300 hover:text-white px-5 py-3 rounded-full bg-white/[0.05] border border-white/10 hover:bg-white/[0.1] transition-all"
            >
              <span>{isOpen ? "ปิดหนังสือ (Close)" : "เปิดหนังสือ 3D (Open)"}</span>
              <ChevronRight className="w-4 h-4 text-neutral-400" />
            </button>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* 2. CENTERPIECE: APPLE MACBOOK-STYLE 3D INTERACTIVE UNFOLDING BOOK         */}
        {/* ========================================================================= */}
        <div className="mt-12 md:mt-16 flex flex-col items-center justify-center">
          
          {/* 3D Perspective Stage */}
          <div
            className="relative w-full max-w-4xl py-6 flex items-center justify-center select-none"
            style={{ perspective: "1500px" }}
          >
            {/* Ambient Base Glow (Backlight emanating from open book) */}
            <div
              className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[350px] rounded-full blur-[90px] transition-all duration-1000 pointer-events-none ${
                isOpen
                  ? "bg-gradient-to-tr from-amber-500/25 via-primary/20 to-blue-500/20 opacity-100 scale-110"
                  : "bg-white/5 opacity-40 scale-75"
              }`}
            />

            {/* 3D Book Container */}
            <div
              className="relative transition-transform duration-700 ease-out"
              style={{
                transformStyle: "preserve-3d",
                transform: "rotateX(14deg) rotateY(-2deg)",
              }}
            >
              {/* THE BOOK PHYSICAL BODY */}
              <div
                className="relative flex items-center justify-center"
                style={{
                  width: "min(92vw, 760px)",
                  height: "min(60vw, 440px)",
                  transformStyle: "preserve-3d",
                }}
              >
                {/* 1. LEFT SIDE: BOOK BACK COVER & BASE (Lies flat on desk) */}
                <div
                  className="absolute inset-0 rounded-2xl bg-gradient-to-br from-[#121215] via-[#1a1a20] to-[#0c0c0e] border border-white/10 shadow-[0_30px_70px_rgba(0,0,0,0.9)] overflow-hidden flex"
                  style={{
                    transform: "translateZ(-12px)",
                  }}
                >
                  {/* Left Page Thickness Simulation (Paper stack) */}
                  <div className="w-1/2 h-full border-r border-neutral-800/80 bg-gradient-to-r from-neutral-900 to-[#1e1e24] p-6 md:p-8 flex flex-col justify-between relative overflow-hidden">
                    
                    {/* Subtle page watermark */}
                    <div className="absolute right-4 bottom-4 opacity-5 pointer-events-none">
                      <BookMarked className="w-48 h-48" />
                    </div>

                    {/* Left Page Header */}
                    <div className="space-y-2 border-b border-white/10 pb-4">
                      <div className="flex items-center justify-between text-xs text-neutral-400">
                        <span className="font-semibold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
                          <Flame className="w-3.5 h-3.5" /> CURATOR&apos;S CHOICE
                        </span>
                        <span className="font-mono text-[11px]">VOL. 2026</span>
                      </div>
                      <h3 className="font-bold text-lg md:text-xl text-white tracking-tight leading-snug">
                        {tenantName}
                      </h3>
                      <p className="text-xs text-neutral-400 font-light">
                        {tenantNameEn}
                      </p>
                    </div>

                    {/* Left Page Body Content */}
                    <div className="space-y-3 text-xs md:text-sm text-neutral-300 leading-relaxed font-light py-2">
                      <p className="italic text-neutral-400 border-l-2 border-primary/60 pl-3">
                        &ldquo;{activeContent.quote}&rdquo;
                      </p>
                      <p className="text-neutral-400 text-xs">
                        — {activeContent.author}
                      </p>
                    </div>

                    {/* Left Page Footer Navigation */}
                    <div className="pt-4 border-t border-white/10 flex items-center justify-between text-xs text-neutral-400">
                      <div className="flex items-center gap-1.5">
                        <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                        <span>หน้า {currentPage} จาก {totalPages}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() => setCurrentPage((p) => (p > 1 ? p - 1 : totalPages))}
                          className="px-2.5 py-1 rounded bg-white/5 hover:bg-white/10 text-white transition-colors"
                          title="หน้าก่อนหน้า"
                        >
                          ‹
                        </button>
                        <button
                          type="button"
                          onClick={() => setCurrentPage((p) => (p < totalPages ? p + 1 : 1))}
                          className="px-2.5 py-1 rounded bg-white/5 hover:bg-white/10 text-white transition-colors"
                          title="หน้าถัดไป"
                        >
                          ›
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* 2. RIGHT SIDE: THE "RETINA DIGITAL READER" PAGE */}
                  <div className="w-1/2 h-full bg-gradient-to-br from-[#18181f] via-[#141418] to-[#0d0d10] p-6 md:p-8 flex flex-col justify-between relative overflow-hidden">
                    
                    {/* Glowing Accent Top Bar (MacBook Screen Bar) */}
                    <div className="flex items-center justify-between pb-3 border-b border-white/[0.08]">
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-primary/20 text-primary border border-primary/30 uppercase tracking-wider">
                          E-BOOK PREVIEW
                        </span>
                        <span className="text-[11px] text-neutral-400 font-mono hidden sm:inline">
                          4.9 ★ RATING
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => setIsPlayingAudio(!isPlayingAudio)}
                          className={`p-1.5 rounded-full transition-colors ${
                            isPlayingAudio ? "bg-amber-500 text-black" : "bg-white/10 text-neutral-300 hover:text-white"
                          }`}
                          title="อ่านออกเสียง AI Audio"
                        >
                          <Volume2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    {/* Active Chapter Details */}
                    <div className="space-y-3 py-2">
                      <div className="text-[11px] font-semibold text-amber-400 uppercase tracking-wide">
                        {activeContent.chapter}
                      </div>
                      <h4 className="text-sm md:text-base font-bold text-white leading-snug">
                        {activeContent.subtitle}
                      </h4>
                      <p className="text-xs md:text-sm text-neutral-300 leading-relaxed font-light">
                        {activeContent.keyInsight}
                      </p>

                      <div className="p-2.5 rounded-xl bg-white/[0.04] border border-white/[0.08] text-xs text-neutral-300 flex items-center justify-between">
                        <span>{activeContent.stats}</span>
                        <span className="text-emerald-400 font-medium">พร้อมอ่านฉบับเต็ม</span>
                      </div>
                    </div>

                    {/* Right Page Footer CTA */}
                    <div className="pt-3 border-t border-white/[0.08] flex items-center justify-between gap-2">
                      <button
                        type="button"
                        onClick={onExploreClick}
                        className="text-xs text-primary hover:text-primary-foreground font-semibold flex items-center gap-1 transition-colors"
                      >
                        เข้าสู่ห้องสมุดเต็มเล่ม <ArrowRight className="w-3.5 h-3.5" />
                      </button>

                      <Button
                        size="sm"
                        onClick={() => setCurrentPage((p) => (p < totalPages ? p + 1 : 1))}
                        className="rounded-full text-xs px-3 h-7 bg-white/10 hover:bg-white/20 text-white border border-white/20"
                      >
                        พลิกหน้าถัดไป ➔
                      </Button>
                    </div>
                  </div>
                </div>

                {/* 3. THE BOOK SPINE (Middle folding crease) */}
                <div
                  className="absolute top-0 bottom-0 left-1/2 -translate-x-1/2 w-3 bg-gradient-to-r from-black/60 via-amber-500/20 to-black/60 pointer-events-none z-20"
                  style={{ transform: "translateZ(2px)" }}
                />

                {/* 4. THE FRONT COVER (Unfolds in 3D perspective like a MacBook lid!) */}
                <div
                  className="absolute top-0 bottom-0 left-0 w-1/2 rounded-l-2xl transition-transform duration-1000 ease-[cubic-bezier(0.16,1,0.3,1)] origin-left cursor-pointer z-30"
                  onClick={() => setIsOpen(!isOpen)}
                  style={{
                    transformStyle: "preserve-3d",
                    transform: isOpen ? "rotateY(-165deg)" : "rotateY(0deg)",
                  }}
                >
                  {/* FRONT COVER OUTSIDE (Visible when book is closed) */}
                  <div
                    className="absolute inset-0 rounded-l-2xl bg-gradient-to-br from-[#1f1913] via-[#2d2217] to-[#120f0b] border-2 border-amber-600/40 p-6 md:p-8 flex flex-col justify-between shadow-[0_20px_50px_rgba(0,0,0,0.9)] overflow-hidden"
                    style={{
                      backfaceVisibility: "hidden",
                    }}
                  >
                    {/* Golden Foil Stamped Border */}
                    <div className="absolute inset-2 rounded-xl border border-amber-500/30 pointer-events-none" />
                    
                    {/* Subtle Leather grain overlay */}
                    <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#d4af37_1px,transparent_1px)] [background-size:12px_12px] pointer-events-none" />

                    <div className="relative z-10 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-extrabold uppercase tracking-widest text-amber-300/90 border border-amber-400/40 px-2.5 py-0.5 rounded-full bg-amber-950/40">
                          MCU DIGITAL EDITION
                        </span>
                        <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                      </div>
                      
                      <div className="pt-8 space-y-1">
                        <h2 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-amber-100 tracking-tight leading-tight">
                          พระไตรปิฎก และตำราวิชาการ
                        </h2>
                        <p className="text-xs text-amber-300/80 font-serif">
                          พุทธศาสตร์ประยุกต์และการจัดการศึกษายุคดิจิทัล
                        </p>
                      </div>
                    </div>

                    <div className="relative z-10 pt-6 border-t border-amber-500/20 flex items-center justify-between text-xs text-amber-200/80">
                      <span>{tenantName}</span>
                      <span className="underline underline-offset-4 text-amber-300 font-semibold">
                        แตะเพื่อเปิดอ่าน ➔
                      </span>
                    </div>
                  </div>

                  {/* FRONT COVER INSIDE (Visible when book is opened) */}
                  <div
                    className="absolute inset-0 rounded-r-2xl bg-gradient-to-br from-[#1a1714] to-[#0e0c0a] border border-amber-500/20 p-6 flex flex-col justify-between"
                    style={{
                      backfaceVisibility: "hidden",
                      transform: "rotateY(180deg)",
                    }}
                  >
                    <div className="text-center pt-8 space-y-2 opacity-60">
                      <BookMarked className="w-12 h-12 text-amber-400 mx-auto" />
                      <p className="text-[11px] font-mono tracking-widest text-amber-200">
                        OFFICIAL ACADEMIC ARCHIVE
                      </p>
                    </div>
                    <div className="text-center text-[10px] text-neutral-500">
                      แตะเพื่อปิดเล่ม
                    </div>
                  </div>
                </div>

              </div>

              {/* Floor Pedestal & Reflection (Apple Product Stage) */}
              <div
                className="w-full h-8 mx-auto -mt-2 bg-gradient-to-b from-black/80 to-transparent blur-md rounded-full pointer-events-none"
                style={{ width: "min(90vw, 720px)" }}
              />

            </div>
          </div>

          {/* Interactive State Bar below Book */}
          <div className="mt-4 flex items-center justify-center gap-4 text-xs text-neutral-400">
            <span className="flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5 text-amber-400" />
              <span>โหมดจำลอง 3 มิติ: แตะที่หน้าปกหรือปุ่มเพื่อเปิด/ปิดหนังสือ</span>
            </span>
            <span>•</span>
            <button
              type="button"
              onClick={() => {
                setCurrentPage(1);
                setIsOpen(true);
              }}
              className="text-neutral-300 hover:text-white flex items-center gap-1 hover:underline"
            >
              <RotateCcw className="w-3 h-3" /> รีเซ็ตหน้าแรก
            </button>
          </div>

        </div>

        {/* ========================================================================= */}
        {/* 3. APPLE-STYLE 3-PILLAR SPEC SHEET RIBBON                                */}
        {/* ========================================================================= */}
        <div className="mt-16 md:mt-24 pt-12 border-t border-white/10 grid grid-cols-1 md:grid-cols-3 gap-8 text-center md:text-left">
          
          <div className="space-y-2 p-4 rounded-2xl bg-white/[0.02] border border-white/[0.06]">
            <div className="text-3xl sm:text-4xl md:text-5xl font-extrabold bg-gradient-to-b from-white to-neutral-400 bg-clip-text text-transparent">
              1,500+ เล่ม
            </div>
            <h4 className="text-sm font-semibold text-white">คลังหนังสือและตำรามาตรฐาน มจร.</h4>
            <p className="text-xs text-neutral-400 font-light leading-relaxed">
              ครอบคลุมทั้งพระพุทธศาสนา ปรัชญา การบริหาร การศึกษา นวัตกรรม และงานวิจัยร่วมสมัย
            </p>
          </div>

          <div className="space-y-2 p-4 rounded-2xl bg-white/[0.02] border border-white/[0.06]">
            <div className="text-3xl sm:text-4xl md:text-5xl font-extrabold bg-gradient-to-b from-white to-neutral-400 bg-clip-text text-transparent">
              100% ดิจิทัล
            </div>
            <h4 className="text-sm font-semibold text-white">เปิดอ่านฟรี 24 ชั่วโมง ทุกอุปกรณ์</h4>
            <p className="text-xs text-neutral-400 font-light leading-relaxed">
              เข้าถึงตำราและสื่อการสอนได้ทันทีผ่านคอมพิวเตอร์ สมาร์ตโฟน และแท็บเล็ต โดยไม่มีค่าใช้จ่าย
            </p>
          </div>

          <div className="space-y-2 p-4 rounded-2xl bg-white/[0.02] border border-white/[0.06]">
            <div className="text-3xl sm:text-4xl md:text-5xl font-extrabold bg-gradient-to-b from-white to-neutral-400 bg-clip-text text-transparent">
              3x สปีดค้นคว้า
            </div>
            <h4 className="text-sm font-semibold text-white">สรุปสาระสำคัญ (Key Takeaways)</h4>
            <p className="text-xs text-neutral-400 font-light leading-relaxed">
              มีบทวิเคราะห์และสรุปประเด็นหลักให้ในทุกเล่ม ช่วยให้นิสิตจับใจความได้ในเวลาเพียง 15 นาที
            </p>
          </div>

        </div>

        {/* ========================================================================= */}
        {/* 4. INTEGRATED SEARCH BAR INTO CATALOG                                     */}
        {/* ========================================================================= */}
        <div className="mt-12 max-w-2xl mx-auto">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (onSearchSubmit) onSearchSubmit(localSearch);
              if (onExploreClick) onExploreClick();
            }}
            className="relative flex items-center bg-white/[0.07] border border-white/[0.15] rounded-full p-2 shadow-2xl focus-within:ring-2 focus-within:ring-primary focus-within:border-transparent transition-all"
          >
            <div className="pl-4 text-neutral-400">
              <Search className="w-5 h-5 text-amber-400" />
            </div>
            <input
              type="text"
              value={localSearch}
              onChange={(e) => setLocalSearch(e.target.value)}
              placeholder="ค้นหาชื่อหนังสือ, ผู้แต่ง, หมวดหมู่, หรือหัวข้องานวิจัย..."
              className="w-full bg-transparent px-3 py-2 text-sm md:text-base outline-none text-white placeholder:text-neutral-400"
            />
            <Button
              type="submit"
              size="sm"
              className="rounded-full px-6 bg-white text-black hover:bg-neutral-200 font-medium shrink-0"
            >
              ค้นหาในคลัง
            </Button>
          </form>
        </div>

      </div>
    </section>
  );
}
