"use server";

import { revalidatePath } from "next/cache";
import { runAction, type ActionResult } from "@/shared/lib/result";
import { requirePermission } from "@/features/identity/server";
import { BOOKING_P } from "./permissions";
import { bookingSchema, type BookingInput } from "./_internal/schema";
import { createBooking, updateBooking, deleteBooking } from "./_internal/services";
import { getLocale } from "@/shared/lib/i18n/server";
import { zodErrorMap } from "@/shared/lib/i18n/zod-locale";

export async function saveBookingAction(input: BookingInput): Promise<ActionResult<string>> {
  return runAction(async () => {
    const ctx = await requirePermission(BOOKING_P.manage);
    const parsed = bookingSchema.parse(input, { errorMap: zodErrorMap(await getLocale()) } as any);
    let resultId = "";
    if (parsed.id) {
      resultId = await updateBooking(ctx.tenantId, parsed.id, parsed);
    } else {
      resultId = await createBooking(ctx.tenantId, ctx.userId, parsed);
    }
    revalidatePath("/bookings");
    return resultId;
  });
}

export async function deleteBookingAction(id: string): Promise<ActionResult<void>> {
  return runAction(async () => {
    const ctx = await requirePermission(BOOKING_P.manage);
    await deleteBooking(ctx.tenantId, id);
    revalidatePath("/bookings");
  });
}
