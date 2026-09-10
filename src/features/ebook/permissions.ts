import type { PermissionDef } from "@/shared/lib/permission-def";

export const EBOOK_P = {
  read: "ebook:read",
  manage: "ebook:manage",
} as const;

export const EBOOK_PERMISSIONS: readonly PermissionDef[] = [
  { code: EBOOK_P.read, module: "ebook", action: "read" },
  { code: EBOOK_P.manage, module: "ebook", action: "manage" },
];
