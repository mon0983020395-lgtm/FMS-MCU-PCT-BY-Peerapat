import { z } from "zod";

export const ebookSchema = z.object({
  id: z.string().uuid().optional(),
  title: z.string().min(1, "ebook.titleField"),
  author: z.string().optional(),
  publisher: z.string().optional(),
  category: z.string().optional(),
  publishDate: z.string().optional(),
  description: z.string().optional(),
  coverImageUrl: z.string().optional(),
  fileUrl: z.string().optional(),
  isActive: z.boolean().default(true),
});

export type EbookInput = z.infer<typeof ebookSchema>;

export interface EbookDto {
  id: string;
  title: string;
  author: string | null;
  publisher: string | null;
  category: string | null;
  publishDate: string | null;
  description: string | null;
  coverImageUrl: string | null;
  fileUrl: string | null;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}
