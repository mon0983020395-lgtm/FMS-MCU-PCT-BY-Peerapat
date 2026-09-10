import { z } from "zod";

export const curriculumSchema = z.object({
  id: z.string().uuid().optional(),
  code: z.string().min(1, "curriculum.codeField"),
  nameTh: z.string().min(1, "curriculum.nameThField"),
  nameEn: z.string().min(1, "curriculum.nameEnField"),
  degreeType: z.string().min(1, "curriculum.degreeTypeField"),
  totalCredits: z.number().int().min(1, "curriculum.totalCreditsField"),
  description: z.string().optional(),
  isActive: z.boolean().default(true),
});

export type CurriculumInput = z.infer<typeof curriculumSchema>;

export interface CurriculumDto {
  id: string;
  code: string;
  nameTh: string;
  nameEn: string;
  degreeType: string;
  totalCredits: number;
  description: string | null;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}
