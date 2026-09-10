import { prisma } from "@/shared/lib/infra/prisma";
import type { EbookInput, EbookDto } from "./schema";

export async function listEbooks(tenantId: string): Promise<EbookDto[]> {
  const data = await prisma.ebook.findMany({
    where: { tenantId },
    orderBy: { createdAt: "desc" },
  });
  return data.map((d) => ({
    ...d,
    publishDate: d.publishDate ? d.publishDate.toISOString() : null,
  }));
}

export async function saveEbook(tenantId: string, input: EbookInput): Promise<EbookDto> {
  const data = {
    title: input.title,
    author: input.author || null,
    publisher: input.publisher || null,
    category: input.category || null,
    publishDate: input.publishDate ? new Date(input.publishDate) : null,
    description: input.description || null,
    coverImageUrl: input.coverImageUrl || null,
    fileUrl: input.fileUrl || null,
    isActive: input.isActive,
  };

  let result;
  if (input.id) {
    result = await prisma.ebook.update({
      where: { id: input.id, tenantId },
      data,
    });
  } else {
    result = await prisma.ebook.create({
      data: {
        tenantId,
        ...data,
      },
    });
  }

  return {
    ...result,
    publishDate: result.publishDate ? result.publishDate.toISOString() : null,
  };
}

export async function deleteEbook(tenantId: string, id: string): Promise<void> {
  await prisma.ebook.delete({
    where: { id, tenantId },
  });
}
