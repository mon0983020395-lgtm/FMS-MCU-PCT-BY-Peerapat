"use client";

import { BookOpen, Sparkles, GraduationCap, Bookmark, Library } from "lucide-react";

interface FloatingElementsProps {
  mouseOffset: { x: number; y: number };
}

export function FloatingElements({ mouseOffset }: FloatingElementsProps) {
  // Parallax offsets calculation (small subtle dampening)
  const offsetX1 = mouseOffset.x * 0.035;
  const offsetY1 = mouseOffset.y * 0.035;

  const offsetX2 = -mouseOffset.x * 0.025;
  const offsetY2 = -mouseOffset.y * 0.025;

  const offsetX3 = mouseOffset.x * 0.045;
  const offsetY3 = -mouseOffset.y * 0.045;

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none -z-10" aria-hidden="true">
      {/* 1. Floating Book Icon - Top Left */}
      <div
        className="absolute top-12 left-[8%] transition-transform duration-700 ease-out opacity-25 dark:opacity-15 hidden sm:block animate-bounce [animation-duration:8s]"
        style={{
          transform: `translate3d(${offsetX1}px, ${offsetY1}px, 0)`,
        }}
      >
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-primary/20 to-amber-500/20 backdrop-blur-sm border border-primary/20 flex items-center justify-center text-primary shadow-sm">
          <BookOpen className="w-6 h-6" />
        </div>
      </div>

      {/* 2. Floating Graduation Cap - Top Right */}
      <div
        className="absolute top-20 right-[10%] transition-transform duration-700 ease-out opacity-25 dark:opacity-15 hidden md:block animate-bounce [animation-duration:10s]"
        style={{
          transform: `translate3d(${offsetX2}px, ${offsetY2}px, 0)`,
        }}
      >
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-indigo-500/20 to-primary/20 backdrop-blur-sm border border-indigo-500/20 flex items-center justify-center text-indigo-600 dark:text-indigo-400 shadow-sm">
          <GraduationCap className="w-7 h-7" />
        </div>
      </div>

      {/* 3. Floating Sparkles - Middle Left */}
      <div
        className="absolute top-[48%] left-[4%] transition-transform duration-700 ease-out opacity-30 dark:opacity-20 hidden lg:block animate-pulse [animation-duration:5s]"
        style={{
          transform: `translate3d(${offsetX3}px, ${offsetY3}px, 0)`,
        }}
      >
        <div className="w-9 h-9 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-500 shadow-xs">
          <Sparkles className="w-4 h-4" />
        </div>
      </div>

      {/* 4. Floating Bookmark - Middle Right */}
      <div
        className="absolute top-[52%] right-[5%] transition-transform duration-700 ease-out opacity-30 dark:opacity-20 hidden lg:block animate-bounce [animation-duration:9s]"
        style={{
          transform: `translate3d(${offsetX1}px, ${offsetY2}px, 0)`,
        }}
      >
        <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary shadow-xs">
          <Bookmark className="w-5 h-5" />
        </div>
      </div>

      {/* 5. Subtle Academic Library Symbol - Bottom Center Background */}
      <div
        className="absolute bottom-6 left-[18%] transition-transform duration-1000 ease-out opacity-15 dark:opacity-10 hidden xl:block"
        style={{
          transform: `translate3d(${offsetX2 * 0.5}px, ${offsetY1 * 0.5}px, 0)`,
        }}
      >
        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
          <Library className="w-5 h-5" />
        </div>
      </div>
    </div>
  );
}
