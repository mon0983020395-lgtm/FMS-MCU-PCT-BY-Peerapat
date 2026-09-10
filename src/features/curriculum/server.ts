import "server-only";
import { requirePermission } from "@/features/identity/server";
import { findCurriculums as internalFind } from "./_internal/services";
import { CURRICULUM_P } from "./permissions";

export { CURRICULUM_P, CURRICULUM_PERMISSIONS } from "./permissions";

export async function getCurriculums() {
  const ctx = await requirePermission(CURRICULUM_P.read);
  return internalFind(ctx.tenantId);
}
