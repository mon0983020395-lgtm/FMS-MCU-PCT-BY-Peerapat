import "server-only";
import { requirePermission } from "@/features/identity/server";
import { findPersonnels as internalFind } from "./_internal/services";
import { PERSONNEL_P } from "./permissions";

export { PERSONNEL_P, PERSONNEL_PERMISSIONS } from "./permissions";

export async function getPersonnels() {
  const ctx = await requirePermission(PERSONNEL_P.read);
  return internalFind(ctx.tenantId);
}
