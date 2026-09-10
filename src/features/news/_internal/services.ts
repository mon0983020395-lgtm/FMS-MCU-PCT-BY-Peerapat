import { prisma } from "@/shared/lib/infra/prisma";
import type { AnnouncementDto, AnnouncementInput } from "./schema";

export async function findAnnouncements(tenantId: string): Promise<AnnouncementDto[]> {
  const rows = await prisma.announcement.findMany({
    where: { tenantId },
    orderBy: { createdAt: "desc" },
    include: { author: { select: { name: true } } },
  });
  return rows.map((r: any) => ({
    id: r.id,
    title: r.title,
    content: r.content,
    isPublished: r.isPublished,
    publishedAt: r.publishedAt,
    authorName: r.author ? r.author.name : null,
    createdAt: r.createdAt,
    updatedAt: r.updatedAt,
  }));
}

export async function createAnnouncement(tenantId: string, actorId: string, input: AnnouncementInput): Promise<string> {
  const publishedAt = input.isPublished ? new Date() : null;
  const created = await prisma.announcement.create({
    data: {
      tenantId,
      authorId: actorId,
      title: input.title,
      content: input.content,
      isPublished: input.isPublished,
      publishedAt,
    },
  });
  return created.id;
}

export async function updateAnnouncement(tenantId: string, id: string, input: AnnouncementInput): Promise<string> {
  const existing = await prisma.announcement.findUnique({ where: { id } });
  if (!existing || existing.tenantId !== tenantId) throw new Error("Not found");
  
  const publishedAt = input.isPublished && !existing.isPublished ? new Date() : existing.publishedAt;
  
  const updated = await prisma.announcement.update({
    where: { id },
    data: { 
      title: input.title,
      content: input.content,
      isPublished: input.isPublished,
      publishedAt 
    },
  });
  return updated.id;
}

export async function deleteAnnouncement(tenantId: string, id: string): Promise<void> {
  const existing = await prisma.announcement.findUnique({ where: { id } });
  if (!existing || existing.tenantId !== tenantId) throw new Error("Not found");
  await prisma.announcement.delete({ where: { id } });
}
