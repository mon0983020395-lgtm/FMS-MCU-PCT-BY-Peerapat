import { resolveTenantSettings } from "@/features/identity/server";
import { prisma } from "@/shared/lib/infra/prisma";
import { RebookPortalView, type BookItem, type NewsItem } from "./_components/rebook-portal-view";

const COVER_GRADIENTS = [
  "bg-gradient-to-br from-amber-700 via-amber-800 to-stone-900",
  "bg-gradient-to-br from-rose-700 via-rose-800 to-stone-900",
  "bg-gradient-to-br from-emerald-700 via-emerald-800 to-stone-900",
  "bg-gradient-to-br from-blue-700 via-blue-800 to-stone-900",
  "bg-gradient-to-br from-indigo-700 via-indigo-800 to-stone-900",
  "bg-gradient-to-br from-purple-700 via-purple-800 to-stone-900",
  "bg-gradient-to-br from-teal-700 via-teal-800 to-stone-900",
  "bg-gradient-to-br from-cyan-700 via-cyan-800 to-stone-900",
];

const DEFAULT_CURATED_BOOKS: BookItem[] = [
  {
    id: "curated-1",
    title: "พุทธเศรษฐศาสตร์และการจัดการเชิงสร้างสรรค์ในยุคดิจิทัล",
    author: "พระมหาพีระพัฒน์ ปภสฺสโร, ดร. / คณาจารย์วิทยาลัยสงฆ์พิจิตร",
    publisher: "สำนักพิมพ์วิทยาลัยสงฆ์พิจิตร มจร.",
    category: "พุทธศาสตร์และปรัชญา",
    publishDate: "2026",
    pages: 320,
    readTime: "5.5 ชม.",
    rating: 4.95,
    reviewCount: 148,
    featured: true,
    trending: true,
    coverGradient: COVER_GRADIENTS[0],
    description:
      "การบูรณาการหลักพุทธธรรมเข้ากับการบริหารจัดการองค์กรสมัยใหม่ สร้างสมดุลระหว่างความเจริญทางวัตถุกับคุณธรรม จริยธรรมในการดำเนินงานยุคปัญญาประดิษฐ์และนวัตกรรมดิจิทัล",
    keyTakeaways: [
      "หลักการบริหารตามหลักสัมมาอาชีวะและธรรมาภิบาล",
      "การเชื่อมโยงปรัชญาเศรษฐกิจพอเพียงกับเทคโนโลยีสารสนเทศ",
      "กลยุทธ์การตัดสินใจเพื่อความยั่งยืนขององค์กรและชุมชน",
      "การพัฒนาภาวะผู้นำที่มีสติและเมตตาธรรมในการทำงานร่วมกัน",
    ],
  },
  {
    id: "curated-2",
    title: "ระเบียบวิธีวิจัยทางสังคมศาสตร์และพระพุทธศาสนาประยุกต์",
    author: "รศ.ดร.สุรพล สุยะพรหม และคณะ",
    publisher: "โรงพิมพ์มหาจุฬาลงกรณราชวิทยาลัย",
    category: "วิจัยและวิทยานิพนธ์",
    publishDate: "2025",
    pages: 280,
    readTime: "4.5 ชม.",
    rating: 4.88,
    reviewCount: 96,
    featured: false,
    trending: true,
    coverGradient: COVER_GRADIENTS[1],
    description:
      "คู่มือกระบวนการวิจัยเชิงปริมาณ เชิงคุณภาพ และการวิจัยเชิงผสานวิธีสำหรับการศึกษาวิจัยทางสังคมศาสตร์และพุทธศาสตร์ประยุกต์อย่างเป็นระบบและได้มาตรฐานสากล",
    keyTakeaways: [
      "การตั้งโจทย์วิจัยและกรอบแนวคิดทฤษฎีทางพุทธศาสตร์",
      "การออกแบบเครื่องมือวิจัยและการตรวจสอบความเที่ยงตรง",
      "การวิเคราะห์ข้อมูลทางสถิติและการสังเคราะห์เนื้อหาเชิงคุณภาพ",
    ],
  },
  {
    id: "curated-3",
    title: "การบริหารจัดการองค์การและทรัพยากรมนุษย์ร่วมสมัย",
    author: "ดร.กฤษฎา บุญชัย",
    publisher: "สำนักพิมพ์วิชาการบริหาร",
    category: "การบริหารและการจัดการ",
    publishDate: "2025",
    pages: 310,
    readTime: "5 ชม.",
    rating: 4.85,
    reviewCount: 112,
    featured: false,
    trending: true,
    coverGradient: COVER_GRADIENTS[2],
    description:
      "แนวคิดและเครื่องมือในการบริหารคนและองค์กรในยุคที่มีการเปลี่ยนแปลงอย่างรวดเร็ว (BANI World) การสร้างวัฒนธรรมองค์กรแห่งการเรียนรู้ และการรักษาบุคลากรศักยภาพสูง",
    keyTakeaways: [
      "ทักษะผู้นำแห่งอนาคต (Future Leadership Capabilities)",
      "การบริหารความหลากหลายในที่ทำงาน (Diversity & Inclusion)",
      "การประเมินผลงานแบบ OKRs ร่วมกับ KPIs สมัยใหม่",
    ],
  },
  {
    id: "curated-4",
    title: "เทคโนโลยีปัญญาประดิษฐ์กับการพัฒนานวัตกรรมการศึกษา",
    author: "ผศ.ดร.อานนท์ ภาคภูมิ",
    publisher: "ศูนย์นวัตกรรมการศึกษาดิจิทัล",
    category: "เทคโนโลยีดิจิทัล",
    publishDate: "2026",
    pages: 250,
    readTime: "4 ชม.",
    rating: 4.92,
    reviewCount: 184,
    featured: true,
    trending: true,
    coverGradient: COVER_GRADIENTS[3],
    description:
      "เจาะลึกบทบาทของ Generative AI, Large Language Models และระบบอัตโนมัติในการพลิกโฉมการจัดการเรียนการสอน การวัดประเมินผล และการสร้างแหล่งเรียนรู้เฉพาะบุคคล",
    keyTakeaways: [
      "การนำ AI Agents มาช่วยสอนและสนับสนุนงานวิชาการ",
      "จริยธรรมในการใช้ AI ทางการศึกษาและการป้องกันการคัดลอกผลงาน",
      "การออกแบบ Prompt Engineering สำหรับงานวิจัยและการสอน",
    ],
  },
  {
    id: "curated-5",
    title: "ปรัชญาและจริยศาสตร์เพื่อการพัฒนาคุณภาพชีวิต",
    author: "รศ.ดร.สมเกียรติ สิทธิสร",
    publisher: "สำนักพิมพ์วิชาการ มจร.",
    category: "พุทธศาสตร์และปรัชญา",
    publishDate: "2024",
    pages: 210,
    readTime: "3.5 ชม.",
    rating: 4.9,
    reviewCount: 78,
    featured: false,
    trending: false,
    coverGradient: COVER_GRADIENTS[4],
    description:
      "การศึกษาเปรียบเทียบปรัชญาตะวันออกและตะวันตก การนำหลักคุณธรรม จริยธรรม และสมาธิภาวนามาประยุกต์ใช้เพื่อเสริมสร้างสุขภาพจิตและความสุขในการดำเนินชีวิตประจำวัน",
    keyTakeaways: [
      "หลักอริยสัจ 4 กับการวิเคราะห์และแก้ไขปัญหาชีวิต",
      "การสร้างภูมิคุ้มกันทางใจในยุคข้อมูลข่าวสารท่วมท้น",
      "สันติวิธีและการอยู่ร่วมกันอย่างเกื้อกูลในสังคม",
    ],
  },
  {
    id: "curated-6",
    title: "สถิติและการวิเคราะห์ข้อมูลเพื่องานวิจัยทางการศึกษา",
    author: "ผศ.ดร.นพดล เกษมสุข",
    publisher: "สำนักวิจัยวิทยาลัยสงฆ์พิจิตร",
    category: "วิจัยและวิทยานิพนธ์",
    publishDate: "2025",
    pages: 295,
    readTime: "5 ชม.",
    rating: 4.86,
    reviewCount: 92,
    featured: false,
    trending: false,
    coverGradient: COVER_GRADIENTS[5],
    description:
      "เทคนิคการเลือกใช้สถิติพรรณนาและสถิติอ้างอิง การใช้โปรแกรมคอมพิวเตอร์เพื่อวิเคราะห์ข้อมูลเชิงปริมาณ และการแปลผลการวิจัยเพื่อตอบสมมติฐานทางวิชาการอย่างถูกต้อง",
    keyTakeaways: [
      "หลักการทดสอบสมมติฐาน (Hypothesis Testing)",
      "การวิเคราะห์ถดถอยพหุคูณ (Multiple Regression Analysis)",
      "การตรวจสอบข้อตกลงเบื้องต้นทางสถิติ",
    ],
  },
];

const DEFAULT_NEWS: NewsItem[] = [
  {
    id: "news-1",
    title: "วิทยาลัยสงฆ์พิจิตรเปิดรับบทความวิชาการและงานวิจัยเพื่อตีพิมพ์ในวารสาร มจร พิจิตร",
    content: "ขอเชิญคณาจารย์ นักวิจัย นิสิตระดับบัณฑิตศึกษา และผู้สนใจ ส่งบทความวิจัยและบทความวิชาการเพื่อตีพิมพ์เผยแพร่ในวารสารวิชาการ โดยมีผู้ทรงคุณวุฒิตรวจประเมินตามมาตรฐาน TCI",
    category: "วิชาการและวิจัย",
    publishedAt: new Date().toISOString(),
  },
  {
    id: "news-2",
    title: "ขอเชิญร่วมโครงการสัมมนาวิชาการระดับชาติ ประจำปีการศึกษา 2569",
    content: "หัวข้อ 'นวัตกรรมพุทธศาสตร์กับการพัฒนาสังคมและเศรษฐกิจดิจิทัลอย่างยั่งยืน' พบกับการบรรยายพิเศษจากผู้ทรงคุณวุฒิระดับประเทศ และการนำเสนอผลงานวิจัยของคณาจารย์",
    category: "สัมมนาและประชุม",
    publishedAt: new Date(Date.now() - 86400000 * 2).toISOString(),
  },
  {
    id: "news-3",
    title: "เปิดให้บริการคลังหนังสือดิจิทัล E-Book และระบบจองห้องค้นคว้ากลุ่มย่อยรูปแบบใหม่",
    content: "ห้องสมุดและศูนย์สารสนเทศเปิดให้บริการระบบยืมอ่านหนังสืออิเล็กทรอนิกส์ออนไลน์ และระบบจองห้องศึกษารายกลุ่มผ่านระบบเว็บ เพื่ออำนวยความสะดวกแก่นิสิตตลอด 24 ชั่วโมง",
    category: "บริการนิสิต",
    publishedAt: new Date(Date.now() - 86400000 * 5).toISOString(),
  },
];

export default async function PortalHomePage() {
  const settings = await resolveTenantSettings();

  // Try to query real ebooks from DB if tenantId is available
  let dbBooks: BookItem[] = [];
  let dbNews: NewsItem[] = [];

  try {
    const rawEbooks = await prisma.ebook.findMany({
      where: { isActive: true },
      orderBy: { createdAt: "desc" },
      take: 10,
    });

    if (rawEbooks.length > 0) {
      dbBooks = rawEbooks.map((b, idx) => ({
        id: b.id,
        title: b.title,
        author: b.author || "คณาจารย์ผู้ทรงคุณวุฒิ",
        publisher: b.publisher || undefined,
        category: b.category || "ทั่วไป",
        publishDate: b.publishDate ? b.publishDate.getFullYear().toString() : undefined,
        pages: 200 + (idx * 30) % 150,
        readTime: `${3 + (idx % 3)} ชม.`,
        rating: 4.8 + (idx % 3) * 0.05,
        reviewCount: 40 + idx * 15,
        description: b.description || "หนังสือและสื่อการเรียนรู้ทางวิชาการเพื่อการศึกษาและค้นคว้าด้วยตนเอง",
        coverGradient: COVER_GRADIENTS[idx % COVER_GRADIENTS.length],
        coverImageUrl: b.coverImageUrl,
        fileUrl: b.fileUrl,
        featured: idx === 0,
        trending: idx < 3,
      }));
    }
  } catch (e) {
    // DB query fallback
  }

  try {
    const rawAnnouncements = await prisma.announcement.findMany({
      where: { isPublished: true },
      orderBy: { createdAt: "desc" },
      include: { author: { select: { name: true } } },
      take: 3,
    });

    if (rawAnnouncements.length > 0) {
      dbNews = rawAnnouncements.map((a) => ({
        id: a.id,
        title: a.title,
        content: a.content,
        category: "ข่าวประกาศ",
        publishedAt: a.publishedAt ? a.publishedAt.toISOString() : a.createdAt.toISOString(),
        authorName: a.author?.name || null,
      }));
    }
  } catch (e) {
    // DB query fallback
  }

  // Combine DB books with curated books, avoiding duplicates
  const allBooks = dbBooks.length > 0 ? [...dbBooks, ...DEFAULT_CURATED_BOOKS] : DEFAULT_CURATED_BOOKS;
  const allNews = dbNews.length > 0 ? dbNews : DEFAULT_NEWS;

  return (
    <RebookPortalView
      settings={settings}
      initialBooks={allBooks}
      initialNews={allNews}
    />
  );
}
