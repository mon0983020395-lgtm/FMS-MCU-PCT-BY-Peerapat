import { prisma } from "@/shared/lib/infra/prisma";
import type { DocumentDto, DocumentInput } from "./schema";

export async function findDocuments(tenantId: string): Promise<DocumentDto[]> {
  const rows = await prisma.docRequest.findMany({
    where: { tenantId },
    orderBy: { createdAt: "desc" },
    include: { requester: { select: { name: true } } }
  });
  return rows.map((r: any) => ({
    id: r.id,
    docType: r.docType,
    title: r.title,
    status: r.status,
    remarks: r.remarks,
    requesterName: r.requester?.name || null,
    createdAt: r.createdAt,
    updatedAt: r.updatedAt,
  }));
}

export async function createDocument(tenantId: string, userId: string, input: DocumentInput): Promise<string> {
  const created = await prisma.docRequest.create({
    data: {
      tenantId,
      requesterId: userId,
      docType: input.docType,
      title: input.title,
      remarks: input.remarks || null,
      status: input.status,
    },
  });
  return created.id;
}

export async function updateDocument(tenantId: string, id: string, input: DocumentInput): Promise<string> {
  const existing = await prisma.docRequest.findUnique({ where: { id } });
  if (!existing || existing.tenantId !== tenantId) throw new Error("Not found");
  
  const updated = await prisma.docRequest.update({
    where: { id },
    data: { 
      docType: input.docType,
      title: input.title,
      remarks: input.remarks || null,
      status: input.status,
    },
  });
  return updated.id;
}

export async function deleteDocument(tenantId: string, id: string): Promise<void> {
  const existing = await prisma.docRequest.findUnique({ where: { id } });
  if (!existing || existing.tenantId !== tenantId) throw new Error("Not found");
  await prisma.docRequest.delete({ where: { id } });
}
