"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Search,
  Sparkles,
  BookOpen,
  Bookmark,
  Star,
  Award,
  ArrowRight,
  Clock,
  FileText,
  CheckCircle2,
  ExternalLink,
  Layers,
  Compass,
  Eye,
  Download,
  X,
  SlidersHorizontal,
  ChevronRight,
  GraduationCap,
  Calendar,
  Share2,
  BookCheck,
} from "lucide-react";
import type { TenantSettings } from "@/features/identity";

export interface BookItem {
  id: string;
  title: string;
  author: string;
  publisher?: string;
  category: string;
  publishDate?: string;
  pages: number;
  readTime: string;
  rating: number;
  reviewCount: number;
  description: string;
  coverGradient: string;
  coverImageUrl?: string | null;
  fileUrl?: string | null;
  featured?: boolean;
  trending?: boolean;
  keyTakeaways?: string[];
}

export interface NewsItem {
  id: string;
  title: string;
  content: string;
  category?: string;
  publishedAt?: string;
  authorName?: string | null;
}

interface RebookPortalViewProps {
  settings: TenantSettings | null;
  initialBooks: BookItem[];
  initialNews: NewsItem[];
}

const CATEGORIES = [
  "ทั้งหมด",
  "พุทธศาสตร์และปรัชญา",
  "การบริหารและการจัดการ",
  "เทคโนโลยีดิจิทัล",
  "วิจัยและวิทยานิพนธ์",
  "การศึกษาและภาษา",
];

const TABS = [
  { id: "all", label: "ทั้งหมด (All)" },
  { id: "featured", label: "🌟 แนะนำพิเศษ (Curator's Choice)" },
  { id: "trending", label: "🔥 ยอดนิยม (Trending)" },
  { id: "research", label: "🎓 วิจัยและวิทยานิพนธ์ (Research)" },
];

export function RebookPortalView({ settings, initialBooks, initialNews }: RebookPortalViewProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("ทั้งหมด");
  const [selectedTab, setSelectedTab] = useState("all");
  const [activeBookModal, setActiveBookModal] = useState<BookItem | null>(null);

  const tenantName = settings?.nameTh || "วิทยาลัยสงฆ์พิจิตร";
  const tenantNameEn = settings?.nameEn || "Faculty Web Platform";

  // Filter books based on search, category, and tab
  const filteredBooks = useMemo(() => {
    return initialBooks.filter((book) => {
      const matchSearch =
        searchQuery.trim() === "" ||
        book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        book.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
        book.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        book.description.toLowerCase().includes(searchQuery.toLowerCase());

      const matchCategory =
        selectedCategory === "ทั้งหมด" || book.category.includes(selectedCategory) || selectedCategory.includes(book.category);

      let matchTab = true;
      if (selectedTab === "featured") matchTab = !!book.featured;
      else if (selectedTab === "trending") matchTab = !!book.trending;
      else if (selectedTab === "research") matchTab = book.category.includes("วิจัย") || book.category.includes("วิทยานิพนธ์");

      return matchSearch && matchCategory && matchTab;
    });
  }, [initialBooks, searchQuery, selectedCategory, selectedTab]);

  // Spotlight Book (First featured or top rated book)
  const spotlightBook = useMemo(() => {
    return initialBooks.find((b) => b.featured) || initialBooks[0];
  }, [initialBooks]);

  return (
    <div className="flex flex-col w-full bg-[#fbfbfa] dark:bg-background text-foreground transition-colors">
      
      {/* 1. HERO SECTION (ReBook Editorial Minimalist Style) */}
      <section className="relative overflow-hidden pt-12 pb-16 md:pt-20 md:pb-24 px-4 border-b border-border/40 bg-gradient-to-b from-primary/5 via-background to-background">
        {/* Subtle decorative background circles */}
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl pointer-events-none -z-10" />
        <div className="absolute top-1/3 left-10 w-72 h-72 bg-amber-500/5 rounded-full blur-3xl pointer-events-none -z-10" />

        <div className="container mx-auto max-w-5xl text-center space-y-6">
          
          {/* ReBook Eyebrow Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-primary/10 text-primary border border-primary/20 text-xs font-semibold tracking-wide uppercase shadow-sm">
            <Sparkles className="w-3.5 h-3.5" />
            <span>REBOOK CURATION PLATFORM • {tenantName}</span>
          </div>

          {/* Main Headline */}
          <div className="space-y-3">
            <h1 className="text-3xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-foreground leading-[1.15]">
              คัดสรรความรู้ <span className="text-primary underline decoration-primary/30 decoration-wavy decoration-2">สู่การอ่าน</span> ที่เปี่ยมความหมาย
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground font-light max-w-2xl mx-auto">
              Curated Academic Wisdom for Intentional & Lifelong Reading
            </p>
          </div>

          <p className="text-sm md:text-base text-muted-foreground/90 max-w-2xl mx-auto leading-relaxed">
            ศูนย์รวมคลังหนังสืออิเล็กทรอนิกส์ ตำราวิชาการ งานวิจัย และองค์ความรู้ที่ผ่านการคัดสรรโดยคณาจารย์ {tenantName} เพื่อให้นิสิตและผู้แสวงหาความรู้เข้าถึงได้ทุกที่ ทุกเวลา
          </p>

          {/* ReBook Signature Interactive Search Bar */}
          <div className="pt-4 max-w-2xl mx-auto">
            <div className="relative flex items-center bg-card border border-border/80 rounded-full shadow-lg p-1.5 focus-within:ring-2 focus-within:ring-primary/30 transition-all">
              <div className="pl-4 text-muted-foreground">
                <Search className="w-5 h-5 text-primary" />
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="ค้นหาชื่อหนังสือ, ผู้แต่ง, คำสำคัญ, หรือหัวข้อวิชาการ..."
                className="w-full bg-transparent px-3 py-2 text-sm md:text-base outline-none placeholder:text-muted-foreground/70"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  className="p-1.5 text-muted-foreground hover:text-foreground mr-1"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
              <Button size="sm" className="rounded-full px-5 font-medium shrink-0">
                ค้นหา
              </Button>
            </div>
          </div>

          {/* Quick Category Chips Slider */}
          <div className="flex items-center justify-center gap-2 overflow-x-auto py-2 px-1 max-w-4xl mx-auto scrollbar-none">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`text-xs md:text-sm px-3.5 py-1.5 rounded-full font-medium transition-all shrink-0 ${
                  selectedCategory === cat
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "bg-card border border-border/60 text-muted-foreground hover:text-foreground hover:border-border"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Curated Stats Row */}
          <div className="pt-6 grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-3xl mx-auto text-left">
            <div className="p-3.5 rounded-2xl bg-card/60 border border-border/50 backdrop-blur">
              <div className="text-2xl font-bold text-foreground">1,200+</div>
              <div className="text-xs text-muted-foreground">หนังสือและตำราในคลัง</div>
            </div>
            <div className="p-3.5 rounded-2xl bg-card/60 border border-border/50 backdrop-blur">
              <div className="text-2xl font-bold text-primary flex items-center gap-1">
                4.9 <Star className="w-4 h-4 fill-primary" />
              </div>
              <div className="text-xs text-muted-foreground">ดัชนีความพึงพอใจผู้อ่าน</div>
            </div>
            <div className="p-3.5 rounded-2xl bg-card/60 border border-border/50 backdrop-blur">
              <div className="text-2xl font-bold text-foreground">100%</div>
              <div className="text-xs text-muted-foreground">เปิดอ่านออนไลน์ฟรี 24 ชม.</div>
            </div>
            <div className="p-3.5 rounded-2xl bg-card/60 border border-border/50 backdrop-blur">
              <div className="text-2xl font-bold text-foreground">6 คลังวิชา</div>
              <div className="text-xs text-muted-foreground">ครอบคลุมทุกหมวดหมู่</div>
            </div>
          </div>

        </div>
      </section>

      {/* 2. CURATOR'S SPOTLIGHT / BOOK OF THE MONTH (ReBook Highlight Card) */}
      {spotlightBook && (
        <section className="py-12 md:py-16 px-4">
          <div className="container mx-auto max-w-5xl">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <Award className="w-5 h-5 text-amber-500" />
                <h2 className="text-xl md:text-2xl font-bold text-foreground">
                  หนังสือคัดสรรประจำเดือน (Curator&apos;s Spotlight)
                </h2>
              </div>
              <span className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">
                EDITOR&apos;S CHOICE
              </span>
            </div>

            <div className="rounded-3xl bg-card border border-border/80 shadow-md hover:shadow-lg transition-shadow overflow-hidden grid grid-cols-1 md:grid-cols-12 gap-6 p-6 md:p-8">
              
              {/* Book 3D Cover Spine Container */}
              <div className="md:col-span-4 flex items-center justify-center">
                <div
                  className={`relative w-48 h-64 md:w-56 md:h-76 rounded-r-xl rounded-l-sm shadow-2xl p-5 flex flex-col justify-between text-white transition-transform duration-300 hover:scale-[1.02] cursor-pointer group ${spotlightBook.coverGradient}`}
                  onClick={() => setActiveBookModal(spotlightBook)}
                >
                  {/* Book spine lighting overlay */}
                  <div className="absolute top-0 left-0 bottom-0 w-4 bg-gradient-to-r from-black/40 via-white/15 to-transparent rounded-l-sm pointer-events-none" />
                  
                  {/* Bookmark ribbon tag */}
                  <div className="absolute -top-1 right-5 bg-amber-400 text-amber-950 px-2 py-1 rounded-b text-[10px] font-extrabold tracking-wider shadow">
                    BESTSELLER
                  </div>

                  <div className="space-y-1 z-10">
                    <span className="text-[10px] uppercase tracking-wider font-bold bg-white/20 backdrop-blur px-2 py-0.5 rounded-full inline-block">
                      {spotlightBook.category}
                    </span>
                    <h3 className="font-bold text-lg md:text-xl leading-snug line-clamp-3 group-hover:underline">
                      {spotlightBook.title}
                    </h3>
                  </div>

                  <div className="z-10 pt-4 border-t border-white/20">
                    <p className="text-xs font-light text-white/80 line-clamp-1">{spotlightBook.author}</p>
                    <div className="flex items-center justify-between text-[11px] text-white/90 pt-1">
                      <span>{spotlightBook.pages} หน้า</span>
                      <span className="flex items-center gap-0.5">
                        <Star className="w-3 h-3 fill-amber-300 text-amber-300" />
                        {spotlightBook.rating}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Book Details & Curated Insights */}
              <div className="md:col-span-8 flex flex-col justify-between space-y-4">
                <div className="space-y-3">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-full bg-primary/10 text-primary text-xs font-semibold">
                      {spotlightBook.category}
                    </span>
                    <span className="text-xs text-muted-foreground flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" /> ใช้เวลาอ่าน ~{spotlightBook.readTime}
                    </span>
                    <span className="text-xs text-muted-foreground flex items-center gap-1">
                      <FileText className="w-3.5 h-3.5" /> {spotlightBook.pages} หน้า
                    </span>
                  </div>

                  <h3 className="text-2xl md:text-3xl font-extrabold text-foreground leading-tight">
                    {spotlightBook.title}
                  </h3>

                  <p className="text-sm font-medium text-primary">
                    ผู้แต่ง: {spotlightBook.author} {spotlightBook.publisher && `• สำนักพิมพ์: ${spotlightBook.publisher}`}
                  </p>

                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {spotlightBook.description}
                  </p>

                  {/* Key Takeaways */}
                  {spotlightBook.keyTakeaways && spotlightBook.keyTakeaways.length > 0 && (
                    <div className="pt-2 space-y-1.5">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                        ประเด็นสำคัญที่น่าสนใจ (Key Takeaways):
                      </h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {spotlightBook.keyTakeaways.map((point, idx) => (
                          <div key={idx} className="flex items-start gap-2 text-xs text-foreground/90">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                            <span>{point}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div className="flex flex-wrap items-center gap-3 pt-4 border-t border-border/50">
                  <Button
                    onClick={() => setActiveBookModal(spotlightBook)}
                    className="gap-2 rounded-full px-6 shadow-sm"
                  >
                    <BookOpen className="w-4 h-4" />
                    อ่านเล่มนี้ (Read Online)
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setActiveBookModal(spotlightBook)}
                    className="rounded-full gap-1.5"
                  >
                    ดูสารบัญและบทวิเคราะห์ <ChevronRight className="w-4 h-4" />
                  </Button>
                </div>

              </div>

            </div>
          </div>
        </section>
      )}

      {/* 3. CURATED CATALOG / COLLECTION GRID */}
      <section className="py-12 md:py-16 px-4 bg-background">
        <div className="container mx-auto max-w-5xl space-y-8">
          
          {/* Section Header & Tab Controls */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-border/50 pb-4">
            <div>
              <div className="flex items-center gap-2 text-primary font-semibold text-xs tracking-wider uppercase">
                <Compass className="w-4 h-4" />
                <span>EXPLORE ARCHIVE</span>
              </div>
              <h2 className="text-2xl md:text-3xl font-extrabold text-foreground mt-1">
                คลังหนังสือและบทความคัดสรร ({filteredBooks.length} เล่ม)
              </h2>
            </div>

            {/* Filter Tabs */}
            <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none pb-1">
              {TABS.map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setSelectedTab(tab.id)}
                  className={`text-xs md:text-sm px-3.5 py-1.5 rounded-full font-medium transition-all shrink-0 ${
                    selectedTab === tab.id
                      ? "bg-foreground text-background shadow-sm"
                      : "bg-muted/60 text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Book Cards Grid */}
          {filteredBooks.length === 0 ? (
            <div className="text-center py-16 px-4 rounded-2xl border border-dashed border-border bg-card/50 space-y-3">
              <BookOpen className="w-10 h-10 text-muted-foreground mx-auto" />
              <h3 className="font-semibold text-lg">ไม่พบหนังสือที่ตรงกับเงื่อนไขการค้นหา</h3>
              <p className="text-sm text-muted-foreground">ลองเปลี่ยนคำค้นหา หรือเลือกหมวดหมู่อื่นเพื่อค้นพบเล่มใหม่</p>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setSearchQuery("");
                  setSelectedCategory("ทั้งหมด");
                  setSelectedTab("all");
                }}
              >
                ล้างตัวกรองทั้งหมด
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredBooks.map((book) => (
                <div
                  key={book.id}
                  className="group rounded-2xl bg-card border border-border/70 hover:border-primary/50 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col overflow-hidden"
                >
                  {/* Card Book Cover Header */}
                  <div
                    className={`relative h-48 p-4 flex flex-col justify-between text-white cursor-pointer ${book.coverGradient}`}
                    onClick={() => setActiveBookModal(book)}
                  >
                    {/* Spine shading */}
                    <div className="absolute top-0 left-0 bottom-0 w-3 bg-gradient-to-r from-black/40 via-white/10 to-transparent pointer-events-none" />

                    <div className="flex items-center justify-between z-10">
                      <span className="text-[10px] font-bold uppercase tracking-wider bg-black/25 backdrop-blur px-2 py-0.5 rounded-full">
                        {book.category}
                      </span>
                      <span className="text-[11px] font-semibold flex items-center gap-1 bg-black/25 backdrop-blur px-2 py-0.5 rounded-full">
                        <Star className="w-3 h-3 fill-amber-300 text-amber-300" />
                        {book.rating}
                      </span>
                    </div>

                    <div className="z-10 space-y-1">
                      <h3 className="font-bold text-base leading-snug line-clamp-2 group-hover:underline">
                        {book.title}
                      </h3>
                      <p className="text-xs text-white/85 line-clamp-1 font-light">
                        {book.author}
                      </p>
                    </div>
                  </div>

                  {/* Card Body */}
                  <div className="p-4 flex-1 flex flex-col justify-between space-y-4">
                    <p className="text-xs text-muted-foreground line-clamp-3 leading-relaxed">
                      {book.description}
                    </p>

                    <div className="space-y-3 pt-2 border-t border-border/40">
                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <span>{book.pages} หน้า</span>
                        <span>อ่าน ~{book.readTime}</span>
                        <span>{book.reviewCount} ผู้อ่าน</span>
                      </div>

                      <div className="flex items-center gap-2">
                        <Button
                          size="sm"
                          className="flex-1 rounded-full text-xs gap-1.5"
                          onClick={() => setActiveBookModal(book)}
                        >
                          <BookOpen className="w-3.5 h-3.5" />
                          อ่านออนไลน์
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="rounded-full text-xs"
                          onClick={() => setActiveBookModal(book)}
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

        </div>
      </section>

      {/* 4. INTENTIONAL READING PILLARS (Kretya UI Principles) */}
      <section className="py-16 md:py-20 px-4 bg-muted/30 border-y border-border/50">
        <div className="container mx-auto max-w-5xl space-y-10">
          
          <div className="text-center space-y-2 max-w-2xl mx-auto">
            <span className="text-xs font-bold uppercase tracking-wider text-primary">
              ✦ INTENTIONAL CURATION PHILOSOPHY
            </span>
            <h2 className="text-2xl md:text-3xl font-extrabold text-foreground">
              ทำไมต้องคลังหนังสือและแหล่งเรียนรู้ของเรา?
            </h2>
            <p className="text-sm text-muted-foreground">
              คัดกรองเนื้อหาอย่างมีเป้าหมาย เพื่อให้ทุกนาทีแห่งการอ่านสร้างมูลค่าทางปัญญาอย่างแท้จริง
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            
            <div className="p-6 rounded-2xl bg-card border border-border/70 space-y-3 shadow-sm hover:border-primary/40 transition-colors">
              <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                <Bookmark className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-base text-foreground">Curated Selection</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                คัดกรองตำราและหนังสือโดยคณาจารย์ผู้ทรงคุณวุฒิ เพื่อให้มั่นใจในความถูกต้องทางวิชาการและการนำไปใช้ประโยชน์
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-card border border-border/70 space-y-3 shadow-sm hover:border-primary/40 transition-colors">
              <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                <Layers className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-base text-foreground">Key Takeaways</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                สรุปแก่นความคิดและประเด็นสำคัญในรูปแบบที่ย่อยง่าย ประหยัดเวลาในการค้นคว้าวิจัยและทำความเข้าใจ
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-card border border-border/70 space-y-3 shadow-sm hover:border-primary/40 transition-colors">
              <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                <BookCheck className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-base text-foreground">Multi-Device Access</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                รองรับการอ่านบนทุกอุปกรณ์อย่างลื่นไหล ทั้งมือถือ แท็บเล็ต และคอมพิวเตอร์ ไม่มีข้อจำกัดด้านสถานที่
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-card border border-border/70 space-y-3 shadow-sm hover:border-primary/40 transition-colors">
              <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                <GraduationCap className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-base text-foreground">Curriculum Aligned</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                สอดคล้องกับหลักสูตรการเรียนการสอน เชื่อมโยงรายวิชา และมีเอกสารประกอบการสอนที่ครบครัน
              </p>
            </div>

          </div>

        </div>
      </section>

      {/* 5. ACADEMIC NEWS & ANNOUNCEMENTS */}
      {initialNews && initialNews.length > 0 && (
        <section className="py-16 md:py-20 px-4">
          <div className="container mx-auto max-w-5xl space-y-8">
            <div className="flex items-center justify-between border-b border-border/50 pb-4">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-primary">
                  ANNOUNCEMENTS & UPDATES
                </span>
                <h2 className="text-2xl md:text-3xl font-extrabold text-foreground mt-1">
                  ข่าวสารและประกาศวิชาการล่าสุด
                </h2>
              </div>
              <Button asChild variant="outline" size="sm" className="rounded-full">
                <Link href="/news">ดูข่าวทั้งหมด <ArrowRight className="w-4 h-4 ml-1.5" /></Link>
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {initialNews.slice(0, 3).map((item) => (
                <div
                  key={item.id}
                  className="rounded-2xl bg-card border border-border/70 p-5 space-y-3 hover:border-primary/50 transition-colors flex flex-col justify-between"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span className="px-2 py-0.5 rounded-md bg-muted font-medium text-foreground">
                        {item.category || "ข่าวประชาสัมพันธ์"}
                      </span>
                      {item.publishedAt && (
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {new Date(item.publishedAt).toLocaleDateString("th-TH", {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                          })}
                        </span>
                      )}
                    </div>
                    <h3 className="font-bold text-base line-clamp-2 text-foreground hover:text-primary transition-colors">
                      {item.title}
                    </h3>
                    <p className="text-xs text-muted-foreground line-clamp-3 leading-relaxed">
                      {item.content}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-border/40 flex items-center justify-between text-xs">
                    <span className="text-muted-foreground">{item.authorName || tenantName}</span>
                    <Link href="/news" className="text-primary font-medium hover:underline flex items-center gap-1">
                      อ่านต่อ <ChevronRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 6. CALL TO ACTION (ReBook Modern Dark Banner) */}
      <section className="py-12 px-4">
        <div className="container mx-auto max-w-5xl">
          <div className="rounded-3xl bg-gradient-to-br from-foreground to-foreground/90 text-background p-8 md:p-12 text-center space-y-6 shadow-xl relative overflow-hidden">
            <div className="absolute -top-24 -right-24 w-64 h-64 bg-primary/20 rounded-full blur-3xl pointer-events-none" />
            
            <div className="space-y-3 max-w-2xl mx-auto">
              <span className="text-xs font-bold uppercase tracking-widest text-primary">
                ✦ START YOUR INTENTIONAL READING
              </span>
              <h2 className="text-2xl sm:text-4xl font-extrabold text-background leading-tight">
                พร้อมเปิดรับสาระความรู้ใหม่ๆ ผ่านคลัง E-Book หรือยัง?
              </h2>
              <p className="text-sm text-background/80 font-light max-w-lg mx-auto">
                เข้าถึงตำรา เอกสารการสอน และงานวิจัยของ {tenantName} ได้ตลอดเวลา ไม่ว่าจะเพื่อการศึกษาหรือการทำงาน
              </p>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
              <Button
                asChild
                size="lg"
                className="rounded-full px-8 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold shadow"
              >
                <Link href="/ebooks">
                  เข้าสู่คลังหนังสือ E-Book <ArrowRight className="w-4 h-4 ml-2" />
                </Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="rounded-full px-6 border-background/30 text-background hover:bg-background/10"
              >
                <Link href="/login">
                  เข้าสู่ระบบบุคลากร
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* 7. INTERACTIVE BOOK DETAIL / READER MODAL */}
      {activeBookModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-card text-card-foreground rounded-3xl border border-border shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 md:p-8 relative space-y-6">
            
            {/* Close Button */}
            <button
              type="button"
              onClick={() => setActiveBookModal(null)}
              className="absolute top-5 right-5 p-2 rounded-full bg-muted/80 hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Modal Header with Mini Book Spine */}
            <div className="flex flex-col sm:flex-row gap-6 items-start">
              <div
                className={`w-32 h-44 shrink-0 rounded-r-lg rounded-l-xs p-3 text-white flex flex-col justify-between shadow-lg relative ${activeBookModal.coverGradient}`}
              >
                <div className="absolute top-0 left-0 bottom-0 w-2.5 bg-black/30 pointer-events-none" />
                <span className="text-[9px] uppercase tracking-wider font-bold bg-black/30 px-1.5 py-0.5 rounded">
                  {activeBookModal.category}
                </span>
                <div>
                  <h4 className="font-bold text-xs line-clamp-3 leading-snug">{activeBookModal.title}</h4>
                  <p className="text-[10px] text-white/80 line-clamp-1 mt-1">{activeBookModal.author}</p>
                </div>
              </div>

              <div className="space-y-2 flex-1">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-full bg-primary/10 text-primary text-xs font-semibold">
                    {activeBookModal.category}
                  </span>
                  <div className="flex items-center gap-1 text-xs font-bold text-amber-500">
                    <Star className="w-3.5 h-3.5 fill-amber-500" />
                    <span>{activeBookModal.rating} ({activeBookModal.reviewCount} รีวิว)</span>
                  </div>
                </div>

                <h3 className="text-xl md:text-2xl font-bold leading-tight">
                  {activeBookModal.title}
                </h3>
                
                <p className="text-xs md:text-sm text-primary font-medium">
                  ผู้แต่ง: {activeBookModal.author}
                </p>

                {activeBookModal.publisher && (
                  <p className="text-xs text-muted-foreground">
                    สำนักพิมพ์: {activeBookModal.publisher}
                  </p>
                )}

                <div className="flex items-center gap-4 text-xs text-muted-foreground pt-1">
                  <span>{activeBookModal.pages} หน้า</span>
                  <span>•</span>
                  <span>ประมาณ {activeBookModal.readTime}</span>
                </div>
              </div>
            </div>

            {/* Synopsis / Description */}
            <div className="space-y-2 pt-2 border-t border-border/50">
              <h4 className="font-bold text-sm text-foreground">สาระสำคัญโดยสรุป (Executive Summary)</h4>
              <p className="text-xs md:text-sm text-muted-foreground leading-relaxed">
                {activeBookModal.description}
              </p>
            </div>

            {/* Key Takeaways */}
            {activeBookModal.keyTakeaways && activeBookModal.keyTakeaways.length > 0 && (
              <div className="space-y-2 pt-2 border-t border-border/50">
                <h4 className="font-bold text-sm text-foreground">จุดเด่นและประเด็นสำคัญ (Key Insights)</h4>
                <ul className="space-y-1.5 text-xs text-muted-foreground">
                  {activeBookModal.keyTakeaways.map((item, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Modal Actions */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-border/50">
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="rounded-full gap-1.5 text-xs"
                  onClick={() => {
                    navigator.clipboard.writeText(window.location.href);
                    alert("คัดลอกลิงก์หนังสือแล้ว");
                  }}
                >
                  <Share2 className="w-3.5 h-3.5" />
                  แชร์ลิงก์
                </Button>
              </div>

              <div className="flex items-center gap-2">
                {activeBookModal.fileUrl ? (
                  <Button asChild size="sm" className="rounded-full gap-1.5">
                    <a href={activeBookModal.fileUrl} target="_blank" rel="noopener noreferrer">
                      <Download className="w-3.5 h-3.5" />
                      ดาวน์โหลด / เปิดอ่าน PDF
                    </a>
                  </Button>
                ) : (
                  <Button asChild size="sm" className="rounded-full gap-1.5">
                    <Link href="/ebooks">
                      <BookOpen className="w-3.5 h-3.5" />
                      อ่านฉบับเต็มในคลัง E-Book
                    </Link>
                  </Button>
                )}
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
