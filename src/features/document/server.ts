import "server-only";
import { requirePermission } from "@/features/identity/server";
import { findDocuments as internalFind } from "./_internal/services";
import { DOCUMENT_P } from "./permissions";

export { DOCUMENT_P, DOCUMENT_PERMISSIONS } from "./permissions";
export type { DocumentDto } from "./_internal/schema";

export async function getDocuments() {
  const ctx = await requirePermission(DOCUMENT_P.read);
  return internalFind(ctx.tenantId);
}
