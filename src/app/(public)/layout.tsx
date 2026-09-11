import Link from "next/link";
import { getTenantSettings } from "@/features/identity/server";
import { auth } from "@/features/identity/server";
import { Button } from "@/components/ui/button";

export default async function PublicLayout({ children }: { children: React.ReactNode }) {
  const session = await auth().catch(() => null);
  
  // We need to fetch settings for the default tenant.
  // In a single-tenant setup, tenant is likely "default" or handled by getTenantSettings
  // Wait, getTenantSettings needs tenantId. If we don't know it, we might just use a hardcoded or fallback string.
  // Let's assume tenantId is "default" for now if not logged in.
  let tenantName = "Faculty Web Platform";
  let logoUrl = null;
  try {
    const settings = await getTenantSettings("default");
    if (settings) {
      tenantName = settings.nameTh || settings.nameEn || tenantName;
      logoUrl = settings.logoUrl;
    }
  } catch (e) {
    // ignore
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Header */}
      <header className="border-b bg-card sticky top-0 z-50">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            {logoUrl ? (
              <img src={logoUrl} alt="Logo" className="h-8 w-auto object-contain" />
            ) : (
              <div className="h-8 w-8 bg-primary text-primary-foreground rounded-md flex items-center justify-center font-bold">
                FW
              </div>
            )}
            <span className="font-bold text-lg hidden sm:block">{tenantName}</span>
          </Link>

          <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
            <Link href="/" className="text-muted-foreground hover:text-foreground transition-colors">
              หน้าหลัก
            </Link>
            <Link href="/news" className="text-muted-foreground hover:text-foreground transition-colors">
              ข่าวสาร
            </Link>
            <Link href="/ebooks" className="text-muted-foreground hover:text-foreground transition-colors">
              คลัง E-Book
            </Link>
          </nav>

          <div className="flex items-center gap-4">
            {session ? (
              <Button asChild variant="outline">
                <Link href="/dashboard">Dashboard</Link>
              </Button>
            ) : (
              <Button asChild>
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

      {/* Footer */}
      <footer className="border-t bg-card mt-auto py-8">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          &copy; {new Date().getFullYear()} {tenantName}. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
