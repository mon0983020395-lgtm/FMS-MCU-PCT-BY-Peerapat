import type { PermissionDef } from "@/shared/lib/permission-def";

export const DOCUMENT_P = {
  read: "document:read",
  manage: "document:manage",
  approve: "document:approve",
} as const;

export const DOCUMENT_PERMISSIONS: readonly PermissionDef[] = [
  { code: DOCUMENT_P.read, module: "document", action: "read" },
  { code: DOCUMENT_P.manage, module: "document", action: "manage" },
  { code: DOCUMENT_P.approve, module: "document", action: "approve" },
];
