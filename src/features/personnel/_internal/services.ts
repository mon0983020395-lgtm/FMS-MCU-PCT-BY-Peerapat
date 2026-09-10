import { prisma } from "@/shared/lib/infra/prisma";
import type { PersonnelDto, PersonnelInput } from "./schema";

export async function findPersonnels(tenantId: string): Promise<PersonnelDto[]> {
  const rows = await prisma.personnel.findMany({
    where: { tenantId },
    orderBy: [{ isActive: "desc" }, { firstName: "asc" }],
  });
  return rows.map((r) => ({
    id: r.id,
    firstName: r.firstName,
    lastName: r.lastName,
    position: r.position,
    department: r.department,
    email: r.email,
    phone: r.phone,
    isActive: r.isActive,
    createdAt: r.createdAt,
    updatedAt: r.updatedAt,
  }));
}

export async function createPersonnel(tenantId: string, input: PersonnelInput): Promise<string> {
  const created = await prisma.personnel.create({
    data: {
      tenantId,
      firstName: input.firstName,
      lastName: input.lastName,
      position: input.position || null,
      department: input.department || null,
      email: input.email || null,
      phone: input.phone || null,
      isActive: input.isActive,
    },
  });
  return created.id;
}

export async function updatePersonnel(tenantId: string, id: string, input: PersonnelInput): Promise<string> {
  const existing = await prisma.personnel.findUnique({ where: { id } });
  if (!existing || existing.tenantId !== tenantId) throw new Error("Not found");
  
  const updated = await prisma.personnel.update({
    where: { id },
    data: { 
      firstName: input.firstName,
      lastName: input.lastName,
      position: input.position || null,
      department: input.department || null,
      email: input.email || null,
      phone: input.phone || null,
      isActive: input.isActive,
    },
  });
  return updated.id;
}

export async function deletePersonnel(tenantId: string, id: string): Promise<void> {
  const existing = await prisma.personnel.findUnique({ where: { id } });
  if (!existing || existing.tenantId !== tenantId) throw new Error("Not found");
  await prisma.personnel.delete({ where: { id } });
}
