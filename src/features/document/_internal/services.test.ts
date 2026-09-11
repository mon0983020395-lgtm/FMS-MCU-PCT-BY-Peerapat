import { describe, it, expect, vi, beforeEach } from "vitest";
import {
  findDocuments,
  createDocument,
  updateDocument,
  deleteDocument,
} from "./services";
import { prisma } from "@/shared/lib/infra/prisma";

// Mock the global Prisma instance
vi.mock("@/shared/lib/infra/prisma", () => ({
  prisma: {
    docRequest: {
      findMany: vi.fn(),
      findUnique: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
    },
  },
}));

describe("Document Services", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("findDocuments", () => {
    it("should return mapped DocumentDto array", async () => {
      const mockRows = [
        {
          id: "1",
          docType: "Leave",
          title: "Sick Leave",
          remarks: "Fever",
          status: "PENDING",
          requesterId: "user-1",
          requester: { name: "Alice" },
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];

      // @ts-ignore
      prisma.docRequest.findMany.mockResolvedValue(mockRows);

      const result = await findDocuments("tenant-1", "user-1", true);

      expect(prisma.docRequest.findMany).toHaveBeenCalled();
      expect(result).toHaveLength(1);
    });
  });

  describe("updateDocument", () => {
    it("should update a document correctly", async () => {
      const input = {
        docType: "Leave",
        title: "Sick Leave",
        remarks: "Fever",
        status: "APPROVED" as const,
      };

      // @ts-ignore
      prisma.docRequest.findUnique.mockResolvedValue({ id: "1", tenantId: "tenant-1" });
      // @ts-ignore
      prisma.docRequest.update.mockResolvedValue({ id: "1" });

      await updateDocument("tenant-1", "1", input);

      expect(prisma.docRequest.update).toHaveBeenCalled();
    });
  });

  describe("deleteDocument", () => {
    it("should delete a document correctly", async () => {
      // @ts-ignore
      prisma.docRequest.findUnique.mockResolvedValue({ id: "1", tenantId: "tenant-1" });
      // @ts-ignore
      prisma.docRequest.delete.mockResolvedValue({ id: "1" });

      await deleteDocument("tenant-1", "1");

      expect(prisma.docRequest.delete).toHaveBeenCalled();
    });
  });
});
