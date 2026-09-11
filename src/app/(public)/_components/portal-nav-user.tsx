"use client";

import Link from "next/link";
import { signOut } from "next-auth/react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import {
  LayoutDashboard,
  BookOpen,
  Newspaper,
  Users,
  Calendar,
  Settings,
  User,
  LogOut,
  ChevronDown,
  ShieldCheck,
} from "lucide-react";

interface PortalNavUserProps {
  user: {
    name?: string | null;
    email?: string | null;
    image?: string | null;
  } | null;
}

export function PortalNavUser({ user }: PortalNavUserProps) {
  if (!user) {
    return (
      <Button asChild size="sm" className="rounded-full px-5 font-medium shadow-sm">
        <Link href="/login">เข้าสู่ระบบ</Link>
      </Button>
    );
  }

  const name = user.name || user.email || "ผู้ใช้งาน";
  const initials = name.trim().charAt(0).toUpperCase() || "U";

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          className="flex items-center gap-2.5 p-1 sm:px-2.5 sm:py-1.5 rounded-full border border-border/80 bg-card hover:bg-muted/80 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary shadow-sm group"
        >
          {/* Avatar circle */}
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-primary to-primary/70 text-primary-foreground flex items-center justify-center font-bold text-sm shadow-inner overflow-hidden shrink-0">
            {user.image ? (
              <img src={user.image} alt={name} className="w-full h-full object-cover" />
            ) : (
              <span>{initials}</span>
            )}
          </div>

          {/* User Name (hidden on small mobile) */}
          <div className="hidden sm:flex flex-col text-left pr-1">
            <span className="text-xs font-semibold text-foreground leading-tight line-clamp-1 max-w-[120px]">
              {name}
            </span>
            <span className="text-[10px] text-muted-foreground leading-tight flex items-center gap-0.5">
              <ShieldCheck className="w-3 h-3 text-primary" /> บุคลากร
            </span>
          </div>

          <ChevronDown className="w-3.5 h-3.5 text-muted-foreground group-hover:text-foreground transition-colors shrink-0" />
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent className="w-60" align="end" sideOffset={8}>
        {/* User profile header in dropdown */}
        <DropdownMenuLabel className="font-normal p-3 pb-2">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-sm shrink-0">
              {user.image ? (
                <img src={user.image} alt={name} className="w-full h-full rounded-full object-cover" />
              ) : (
                <span>{initials}</span>
              )}
            </div>
            <div className="flex flex-col space-y-0.5 overflow-hidden">
              <p className="text-sm font-semibold leading-none truncate text-foreground">{name}</p>
              {user.email && (
                <p className="text-xs text-muted-foreground truncate">{user.email}</p>
              )}
            </div>
          </div>
        </DropdownMenuLabel>

        <DropdownMenuSeparator />

        {/* Management Options */}
        <DropdownMenuGroup>
          <DropdownMenuItem asChild>
            <Link href="/dashboard" className="cursor-pointer gap-2.5 py-2">
              <LayoutDashboard className="w-4 h-4 text-primary" />
              <span>แดชบอร์ดผู้ดูแล (Dashboard)</span>
            </Link>
          </DropdownMenuItem>

          <DropdownMenuItem asChild>
            <Link href="/ebooks" className="cursor-pointer gap-2.5 py-2">
              <BookOpen className="w-4 h-4 text-muted-foreground" />
              <span>จัดการคลัง E-Book</span>
            </Link>
          </DropdownMenuItem>

          <DropdownMenuItem asChild>
            <Link href="/news" className="cursor-pointer gap-2.5 py-2">
              <Newspaper className="w-4 h-4 text-muted-foreground" />
              <span>จัดการข่าวสารและประกาศ</span>
            </Link>
          </DropdownMenuItem>

          <DropdownMenuItem asChild>
            <Link href="/personnel" className="cursor-pointer gap-2.5 py-2">
              <Users className="w-4 h-4 text-muted-foreground" />
              <span>จัดการข้อมูลบุคลากร</span>
            </Link>
          </DropdownMenuItem>

          <DropdownMenuItem asChild>
            <Link href="/bookings" className="cursor-pointer gap-2.5 py-2">
              <Calendar className="w-4 h-4 text-muted-foreground" />
              <span>ระบบจองสถานที่ / ห้องค้นคว้า</span>
            </Link>
          </DropdownMenuItem>
        </DropdownMenuGroup>

        <DropdownMenuSeparator />

        {/* Account & Settings */}
        <DropdownMenuGroup>
          <DropdownMenuItem asChild>
            <Link href="/me" className="cursor-pointer gap-2.5 py-2">
              <User className="w-4 h-4 text-muted-foreground" />
              <span>โปรไฟล์ของฉัน</span>
            </Link>
          </DropdownMenuItem>

          <DropdownMenuItem asChild>
            <Link href="/settings" className="cursor-pointer gap-2.5 py-2">
              <Settings className="w-4 h-4 text-muted-foreground" />
              <span>ตั้งค่าองค์กรและเว็บไซต์</span>
            </Link>
          </DropdownMenuItem>
        </DropdownMenuGroup>

        <DropdownMenuSeparator />

        {/* Logout Option */}
        <DropdownMenuItem
          className="cursor-pointer text-destructive focus:text-destructive focus:bg-destructive/10 gap-2.5 py-2"
          onClick={() => signOut({ callbackUrl: "/" })}
        >
          <LogOut className="w-4 h-4" />
          <span>ออกจากระบบ</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
