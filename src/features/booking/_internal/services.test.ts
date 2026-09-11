import { describe, it, expect, vi, beforeEach } from "vitest";
import {
  findBookings,
  getFacilities,
  createBooking,
  updateBooking,
  deleteBooking,
} from "./services";
import { prisma } from "@/shared/lib/infra/prisma";

// Mock the global Prisma instance
vi.mock("@/shared/lib/infra/prisma", () => ({
  prisma: {
    booking: {
      findMany: vi.fn(),
      findUnique: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
    },
    facility: {
      findMany: vi.fn(),
    },
  },
}));

describe("Booking Services", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("findBookings", () => {
    it("should return mapped BookingDto array", async () => {
      const mockRows = [
        {
          id: "1",
          facilityId: "fac-1",
          facility: { name: "Room A" },
          reserver: { name: "John Doe" },
          startTime: new Date("2026-09-10T10:00:00Z"),
          endTime: new Date("2026-09-10T11:00:00Z"),
          purpose: "Meeting",
          status: "PENDING",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];

      // @ts-ignore
      prisma.booking.findMany.mockResolvedValue(mockRows);

      const result = await findBookings("tenant-1");

      expect(prisma.booking.findMany).toHaveBeenCalledWith({
        where: { tenantId: "tenant-1" },
        orderBy: { startTime: "desc" },
        include: {
          facility: { select: { name: true } },
          reserver: { select: { name: true } },
        },
      });

      expect(result).toHaveLength(1);
    });
  });

  describe("updateBooking", () => {
    it("should update a booking correctly", async () => {
      const input = {
        facilityId: "fac-1",
        purpose: "Meeting Updated",
        startTime: new Date("2026-09-10T10:00:00Z"),
        endTime: new Date("2026-09-10T11:00:00Z"),
        status: "APPROVED" as const,
      };

      // @ts-ignore
      prisma.booking.findUnique.mockResolvedValue({ id: "1", tenantId: "tenant-1" });
      // @ts-ignore
      prisma.booking.update.mockResolvedValue({ id: "1" });

      await updateBooking("tenant-1", "1", input);

      expect(prisma.booking.update).toHaveBeenCalled();
    });
  });

  describe("deleteBooking", () => {
    it("should delete a booking correctly", async () => {
      // @ts-ignore
      prisma.booking.findUnique.mockResolvedValue({ id: "1", tenantId: "tenant-1" });
      // @ts-ignore
      prisma.booking.delete.mockResolvedValue({ id: "1" });

      await deleteBooking("tenant-1", "1");

      expect(prisma.booking.delete).toHaveBeenCalled();
    });
  });
});
