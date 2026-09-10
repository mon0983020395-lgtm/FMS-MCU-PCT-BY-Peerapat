import "server-only";
import { requirePermission } from "@/features/identity/server";
import { findAnnouncements as internalFind } from "./_internal/services";
import { NEWS_P } from "./permissions";

export { NEWS_P, NEWS_PERMISSIONS } from "./permissions";

export async function getAnnouncements() {
  const ctx = await requirePermission(NEWS_P.read);
  return internalFind(ctx.tenantId);
}
