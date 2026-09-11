import { prisma } from "@/shared/lib/infra/prisma";
import type { BookingDto, BookingInput } from "./schema";

export async function findBookings(tenantId: string): Promise<BookingDto[]> {
  const rows = await prisma.booking.findMany({
    where: { tenantId },
    orderBy: { startTime: "desc" },
    include: { facility: { select: { name: true } }, reserver: { select: { name: true } } }
  });
  return rows.map((r) => ({
    id: r.id,
    facilityId: r.facilityId,
    facilityName: r.facility?.name || null,
    reserverName: r.reserver?.name || null,
    startTime: r.startTime,
    endTime: r.endTime,
    purpose: r.purpose,
    status: r.status,
    createdAt: r.createdAt,
    updatedAt: r.updatedAt,
  }));
}

export async function createBooking(tenantId: string, userId: string, input: BookingInput): Promise<string> {
  const created = await prisma.booking.create({
    data: {
      tenantId,
      reserverId: userId,
      facilityId: input.facilityId,
      startTime: new Date(input.startTime),
      endTime: new Date(input.endTime),
      purpose: input.purpose,
      status: input.status,
    },
  });
  return created.id;
}

export async function updateBooking(tenantId: string, id: string, input: BookingInput): Promise<string> {
  const existing = await prisma.booking.findUnique({ where: { id } });
  if (!existing || existing.tenantId !== tenantId) throw new Error("Not found");
  
  const updated = await prisma.booking.update({
    where: { id },
    data: { 
      facilityId: input.facilityId,
      startTime: new Date(input.startTime),
      endTime: new Date(input.endTime),
      purpose: input.purpose,
      status: input.status,
    },
  });
  return updated.id;
}

export async function deleteBooking(tenantId: string, id: string): Promise<void> {
  const existing = await prisma.booking.findUnique({ where: { id } });
  if (!existing || existing.tenantId !== tenantId) throw new Error("Not found");
  await prisma.booking.delete({ where: { id } });
}

export async function getFacilities(tenantId: string) {
  return prisma.facility.findMany({
    where: { tenantId, isActive: true },
    orderBy: { name: "asc" }
  });
}
