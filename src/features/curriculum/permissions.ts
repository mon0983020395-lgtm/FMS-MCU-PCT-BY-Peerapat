import type { PermissionDef } from "@/shared/lib/permission-def";

export const CURRICULUM_P = {
  read: "curriculum:read",
  manage: "curriculum:manage",
} as const;

export const CURRICULUM_PERMISSIONS: readonly PermissionDef[] = [
  { code: CURRICULUM_P.read, module: "curriculum", action: "read" },
  { code: CURRICULUM_P.manage, module: "curriculum", action: "manage" },
];
