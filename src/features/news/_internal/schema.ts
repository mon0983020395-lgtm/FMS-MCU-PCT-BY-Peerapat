import { z } from "zod";

export const announcementSchema = z.object({
  id: z.string().uuid().optional(),
  title: z.string().min(1, "news.titleField"),
  content: z.string().min(1, "news.contentField"),
  isPublished: z.boolean().default(false),
});

export type AnnouncementInput = z.infer<typeof announcementSchema>;

export interface AnnouncementDto {
  id: string;
  title: string;
  content: string;
  isPublished: boolean;
  publishedAt: Date | null;
  authorName: string | null;
  createdAt: Date;
  updatedAt: Date;
}
