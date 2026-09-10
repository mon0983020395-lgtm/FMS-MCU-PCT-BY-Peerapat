import { z } from "zod";

export const personnelSchema = z.object({
  id: z.string().uuid().optional(),
  firstName: z.string().min(1, "personnel.firstNameField"),
  lastName: z.string().min(1, "personnel.lastNameField"),
  position: z.string().optional(),
  department: z.string().optional(),
  email: z.string().email().optional().or(z.literal("")),
  phone: z.string().optional(),
  isActive: z.boolean().default(true),
});

export type PersonnelInput = z.infer<typeof personnelSchema>;

export interface PersonnelDto {
  id: string;
  firstName: string;
  lastName: string;
  position: string | null;
  department: string | null;
  email: string | null;
  phone: string | null;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}
