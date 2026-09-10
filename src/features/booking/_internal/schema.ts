import { z } from "zod";

export const bookingSchema = z.object({
  id: z.string().uuid().optional(),
  facilityId: z.string().uuid("booking.facilityField"),
  purpose: z.string().min(1, "booking.purposeField"),
  startTime: z.string().or(z.date()),
  endTime: z.string().or(z.date()),
  status: z.enum(["PENDING", "APPROVED", "REJECTED"]).default("PENDING"),
});

export type BookingInput = z.infer<typeof bookingSchema>;

export interface BookingDto {
  id: string;
  facilityId: string;
  facilityName: string | null;
  reserverName: string | null;
  startTime: Date;
  endTime: Date;
  purpose: string;
  status: "PENDING" | "APPROVED" | "REJECTED";
  createdAt: Date;
  updatedAt: Date;
}
