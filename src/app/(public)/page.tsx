import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, BookOpen, Newspaper, Users } from "lucide-react";

export default function PortalHomePage() {
  return (
    <div className="flex flex-col w-full">
      {/* Hero Section */}
      <section className="bg-primary/5 py-20 px-4 text-center">
        <div className="container mx-auto max-w-4xl space-y-6">
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-foreground">
            ยินดีต้อนรับสู่ <span className="text-primary">Faculty Web Platform</span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            ศูนย์รวมข้อมูลข่าวสาร บริการจองสถานที่ ระบบจัดการเอกสาร และห้องสมุดดิจิทัล (E-Book) สำหรับนักศึกษาและบุคลากร
          </p>
          <div className="flex items-center justify-center gap-4 pt-6">
            <Button asChild size="lg">
              <Link href="/news">
                ดูข่าวสารล่าสุด <ArrowRight className="ml-2 w-4 h-4" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link href="/ebooks">
                ห้องสมุด E-Book
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Feature Highlights */}
      <section className="py-20 px-4 bg-background">
        <div className="container mx-auto max-w-5xl">
          <div className="grid md:grid-cols-3 gap-8">
            <div className="p-6 rounded-2xl bg-card border shadow-sm text-center space-y-4">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto text-primary">
                <Newspaper className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-xl">ข่าวสารและประกาศ</h3>
              <p className="text-muted-foreground text-sm">
                ติดตามข่าวสารอัปเดตใหม่ๆ ประกาศสำคัญจากทางคณะ และกิจกรรมที่กำลังจะเกิดขึ้น
              </p>
            </div>
            <div className="p-6 rounded-2xl bg-card border shadow-sm text-center space-y-4">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto text-primary">
                <BookOpen className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-xl">คลัง E-Book</h3>
              <p className="text-muted-foreground text-sm">
                แหล่งรวบรวมหนังสืออิเล็กทรอนิกส์ ตำราเรียน และบทความวิชาการ สำหรับอ่านและค้นคว้าด้วยตนเอง
              </p>
            </div>
            <div className="p-6 rounded-2xl bg-card border shadow-sm text-center space-y-4">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto text-primary">
                <Users className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-xl">ทำเนียบบุคลากร</h3>
              <p className="text-muted-foreground text-sm">
                ข้อมูลการติดต่อ คณาจารย์ และเจ้าหน้าที่สายสนับสนุนของคณะ
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
