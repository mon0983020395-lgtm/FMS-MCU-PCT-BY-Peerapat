import "server-only";
import { requirePermission } from "@/features/identity/server";
import { findBookings as internalFind, getFacilities as internalFacilities } from "./_internal/services";
import { BOOKING_P } from "./permissions";

export { BOOKING_P, BOOKING_PERMISSIONS } from "./permissions";
export type { BookingDto } from "./_internal/schema";

export async function getBookings() {
  const ctx = await requirePermission(BOOKING_P.read);
  return internalFind(ctx.tenantId);
}

export async function getActiveFacilities() {
  const ctx = await requirePermission(BOOKING_P.read);
  return internalFacilities(ctx.tenantId);
}
