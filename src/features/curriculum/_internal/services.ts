import { prisma } from "@/shared/lib/infra/prisma";
import type { CurriculumDto, CurriculumInput } from "./schema";

export async function findCurriculums(tenantId: string): Promise<CurriculumDto[]> {
  const rows = await prisma.curriculum.findMany({
    where: { tenantId },
    orderBy: { code: "asc" },
  });
  return rows.map((r) => ({
    id: r.id,
    code: r.code,
    nameTh: r.nameTh,
    nameEn: r.nameEn,
    degreeType: r.degreeType,
    totalCredits: r.totalCredits,
    description: r.description,
    isActive: r.isActive,
    createdAt: r.createdAt,
    updatedAt: r.updatedAt,
  }));
}

export async function createCurriculum(tenantId: string, input: CurriculumInput): Promise<string> {
  const created = await prisma.curriculum.create({
    data: {
      tenantId,
      code: input.code,
      nameTh: input.nameTh,
      nameEn: input.nameEn,
      degreeType: input.degreeType,
      totalCredits: input.totalCredits,
      description: input.description || null,
      isActive: input.isActive,
    },
  });
  return created.id;
}

export async function updateCurriculum(tenantId: string, id: string, input: CurriculumInput): Promise<string> {
  const existing = await prisma.curriculum.findUnique({ where: { id } });
  if (!existing || existing.tenantId !== tenantId) throw new Error("Not found");
  
  const updated = await prisma.curriculum.update({
    where: { id },
    data: { 
      code: input.code,
      nameTh: input.nameTh,
      nameEn: input.nameEn,
      degreeType: input.degreeType,
      totalCredits: input.totalCredits,
      description: input.description || null,
      isActive: input.isActive,
    },
  });
  return updated.id;
}

export async function deleteCurriculum(tenantId: string, id: string): Promise<void> {
  const existing = await prisma.curriculum.findUnique({ where: { id } });
  if (!existing || existing.tenantId !== tenantId) throw new Error("Not found");
  await prisma.curriculum.delete({ where: { id } });
}
