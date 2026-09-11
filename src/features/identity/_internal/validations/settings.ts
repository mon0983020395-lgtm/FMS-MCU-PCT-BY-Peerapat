import { z } from "zod";
import { PALETTE_IDS } from "@/shared/lib/palette";

export const updateSettingsSchema = z.object({
  nameTh: z.string().trim().min(1).max(255),
  nameEn: z.string().trim().min(1).max(255),
  logoUrl: z.string().trim().max(500).or(z.literal("")).default(""),
  palette: z.enum(PALETTE_IDS),
  footerAbout: z.string().trim().max(1000).optional().default(""),
  footerAddress: z.string().trim().max(500).optional().default(""),
  footerPhone: z.string().trim().max(100).optional().default(""),
  footerEmail: z.string().trim().max(255).optional().default(""),
  footerFacebook: z.string().trim().max(500).optional().default(""),
  footerLine: z.string().trim().max(255).optional().default(""),
  footerCopyright: z.string().trim().max(500).optional().default(""),
});
export const updateProfileSchema = z.object({ name: z.string().trim().min(1).max(255), locale: z.enum(["th", "en"]) });
export type UpdateSettingsInput = z.infer<typeof updateSettingsSchema>;
export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;
