import Link from "next/link";
import { resolveTenantSettings } from "@/features/identity/server";
import { auth } from "@/features/identity/server";
import { Button } from "@/components/ui/button";
import { MapPin, Phone, Mail, Facebook, MessageCircle, ExternalLink, BookOpen, Newspaper, Users, Home } from "lucide-react";

export default async function PublicLayout({ children }: { children: React.ReactNode }) {
  const session = await auth().catch(() => null);
  
  const settings = await resolveTenantSettings();
  const tenantName = settings?.nameTh || settings?.nameEn || "Faculty Web Platform";
  const logoUrl = settings?.logoUrl || null;

  // Footer data from settings
  const footerAbout = settings?.footerAbout || "ศูนย์รวมข้อมูลข่าวสาร บริการจองสถานที่ ระบบจัดการเอกสาร และห้องสมุดดิจิทัล (E-Book) เพื่อสนับสนุนการศึกษา วิจัย และการบริการวิชาการ";
  const footerAddress = settings?.footerAddress;
  const footerPhone = settings?.footerPhone;
  const footerEmail = settings?.footerEmail;
  const footerFacebook = settings?.footerFacebook;
  const footerLine = settings?.footerLine;
  const footerCopyright = settings?.footerCopyright || `© ${new Date().getFullYear()} ${tenantName}. สงวนลิขสิทธิ์ทั้งหมด`;

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      {/* Header */}
      <header className="border-b bg-card/95 backdrop-blur sticky top-0 z-50 shadow-sm">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 group">
            {logoUrl ? (
              <img src={logoUrl} alt="Logo" className="h-9 w-auto object-contain transition-transform group-hover:scale-105" />
            ) : (
              <div className="h-9 w-9 bg-primary text-primary-foreground rounded-lg flex items-center justify-center font-bold shadow-sm">
                FW
              </div>
            )}
            <div className="flex flex-col">
              <span className="font-bold text-base sm:text-lg leading-tight group-hover:text-primary transition-colors">{tenantName}</span>
              {settings?.nameEn && <span className="text-xs text-muted-foreground hidden sm:block">{settings.nameEn}</span>}
            </div>
          </Link>

          <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
            <Link href="/" className="text-muted-foreground hover:text-primary transition-colors flex items-center gap-1.5">
              <Home className="w-4 h-4" />
              หน้าหลัก
            </Link>
            <Link href="/news" className="text-muted-foreground hover:text-primary transition-colors flex items-center gap-1.5">
              <Newspaper className="w-4 h-4" />
              ข่าวสาร
            </Link>
            <Link href="/ebooks" className="text-muted-foreground hover:text-primary transition-colors flex items-center gap-1.5">
              <BookOpen className="w-4 h-4" />
              คลัง E-Book
            </Link>
            <Link href="/personnel" className="text-muted-foreground hover:text-primary transition-colors flex items-center gap-1.5">
              <Users className="w-4 h-4" />
              บุคลากร
            </Link>
          </nav>

          <div className="flex items-center gap-3">
            {session ? (
              <Button asChild variant="outline" size="sm" className="gap-2">
                <Link href="/dashboard">
                  <span>แดชบอร์ด</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </Link>
              </Button>
            ) : (
              <Button asChild size="sm">
                <Link href="/login">เข้าสู่ระบบ</Link>
              </Button>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col">
        {children}
      </main>

      {/* Modern Enhanced Footer */}
      <footer className="border-t bg-card text-card-foreground mt-auto">
        <div className="container mx-auto px-4 py-12">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-12">
            
            {/* Column 1: Organization Branding & About */}
            <div className="md:col-span-5 space-y-4">
              <div className="flex items-center gap-3">
                {logoUrl ? (
                  <img src={logoUrl} alt="Logo" className="h-10 w-auto object-contain" />
                ) : (
                  <div className="h-10 w-10 bg-primary text-primary-foreground rounded-lg flex items-center justify-center font-bold">
                    FW
                  </div>
                )}
                <div>
                  <h3 className="font-bold text-lg leading-tight">{tenantName}</h3>
                  {settings?.nameEn && <p className="text-xs text-muted-foreground">{settings.nameEn}</p>}
                </div>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {footerAbout}
              </p>
              
              {/* Social Media Links */}
              {(footerFacebook || footerLine) && (
                <div className="flex items-center gap-3 pt-2">
                  {footerFacebook && (
                    <a
                      href={footerFacebook.startsWith("http") ? footerFacebook : `https://${footerFacebook}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center w-9 h-9 rounded-full bg-primary/10 text-primary hover:bg-primary hover:text-primary-foreground transition-colors"
                      title="Facebook"
                      aria-label="Facebook"
                    >
                      <Facebook className="w-4 h-4" />
                    </a>
                  )}
                  {footerLine && (
                    <a
                      href={footerLine.startsWith("http") ? footerLine : `https://line.me/ti/p/${footerLine.replace(/^@/, "")}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center w-9 h-9 rounded-full bg-emerald-500/10 text-emerald-600 hover:bg-emerald-600 hover:text-white transition-colors"
                      title="LINE"
                      aria-label="LINE"
                    >
                      <MessageCircle className="w-4 h-4" />
                    </a>
                  )}
                </div>
              )}
            </div>

            {/* Column 2: Quick Links */}
            <div className="md:col-span-3 space-y-3">
              <h4 className="font-semibold text-sm uppercase tracking-wider text-foreground">ลิงก์ด่วน</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <Link href="/" className="hover:text-primary transition-colors flex items-center gap-2">
                    <span className="text-primary">•</span> หน้าหลัก
                  </Link>
                </li>
                <li>
                  <Link href="/news" className="hover:text-primary transition-colors flex items-center gap-2">
                    <span className="text-primary">•</span> ข่าวสารและประกาศ
                  </Link>
                </li>
                <li>
                  <Link href="/ebooks" className="hover:text-primary transition-colors flex items-center gap-2">
                    <span className="text-primary">•</span> คลังหนังสือ E-Book
                  </Link>
                </li>
                <li>
                  <Link href="/personnel" className="hover:text-primary transition-colors flex items-center gap-2">
                    <span className="text-primary">•</span> ทำเนียบบุคลากร
                  </Link>
                </li>
                <li>
                  <Link href={session ? "/dashboard" : "/login"} className="hover:text-primary transition-colors flex items-center gap-2">
                    <span className="text-primary">•</span> {session ? "ระบบจัดการ (Dashboard)" : "เข้าสู่ระบบบุคลากร"}
                  </Link>
                </li>
              </ul>
            </div>

            {/* Column 3: Contact Info */}
            <div className="md:col-span-4 space-y-3">
              <h4 className="font-semibold text-sm uppercase tracking-wider text-foreground">ข้อมูลติดต่อ</h4>
              <ul className="space-y-2.5 text-sm text-muted-foreground">
                {footerAddress && (
                  <li className="flex items-start gap-2.5">
                    <MapPin className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                    <span className="leading-snug">{footerAddress}</span>
                  </li>
                )}
                {footerPhone && (
                  <li className="flex items-center gap-2.5">
                    <Phone className="w-4 h-4 text-primary shrink-0" />
                    <a href={`tel:${footerPhone}`} className="hover:text-foreground transition-colors">
                      {footerPhone}
                    </a>
                  </li>
                )}
                {footerEmail && (
                  <li className="flex items-center gap-2.5">
                    <Mail className="w-4 h-4 text-primary shrink-0" />
                    <a href={`mailto:${footerEmail}`} className="hover:text-foreground transition-colors">
                      {footerEmail}
                    </a>
                  </li>
                )}
                {footerLine && (
                  <li className="flex items-center gap-2.5">
                    <MessageCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>LINE: {footerLine}</span>
                  </li>
                )}
                {!footerAddress && !footerPhone && !footerEmail && !footerLine && (
                  <li className="text-xs text-muted-foreground italic">
                    (สามารถกำหนดข้อมูลติดต่อได้ที่หน้า ตั้งค่าองค์กร ในระบบ Admin)
                  </li>
                )}
              </ul>
            </div>

          </div>

          {/* Bottom Bar: Copyright */}
          <div className="border-t border-border/50 mt-10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-muted-foreground">
            <p>{footerCopyright}</p>
            <div className="flex items-center gap-4">
              <Link href="/privacy" className="hover:text-foreground transition-colors">นโยบายความเป็นส่วนตัว</Link>
              <span>•</span>
              <Link href="/terms" className="hover:text-foreground transition-colors">เงื่อนไขการใช้งาน</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
