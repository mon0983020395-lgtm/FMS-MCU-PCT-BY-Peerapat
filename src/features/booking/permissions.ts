import type { PermissionDef } from "@/shared/lib/permission-def";

export const BOOKING_P = {
  read: "booking:read",
  manage: "booking:manage",
} as const;

export const BOOKING_PERMISSIONS: readonly PermissionDef[] = [
  { code: BOOKING_P.read, module: "booking", action: "read" },
  { code: BOOKING_P.manage, module: "booking", action: "manage" },
];
