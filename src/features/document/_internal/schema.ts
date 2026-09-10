import { z } from "zod";

export const documentSchema = z.object({
  id: z.string().uuid().optional(),
  docType: z.string().min(1, "document.docTypeField"),
  title: z.string().min(1, "document.titleField"),
  remarks: z.string().optional(),
  status: z.enum(["PENDING", "APPROVED", "REJECTED"]).default("PENDING"),
});

export type DocumentInput = z.infer<typeof documentSchema>;

export interface DocumentDto {
  id: string;
  docType: string;
  title: string;
  status: "PENDING" | "APPROVED" | "REJECTED";
  remarks: string | null;
  requesterName: string | null;
  createdAt: Date;
  updatedAt: Date;
}
