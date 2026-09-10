"use server";

import { revalidatePath } from "next/cache";
import { runAction, type ActionResult } from "@/shared/lib/result";
import { requirePermission } from "@/features/identity/server";
import { NEWS_P } from "./permissions";
import { announcementSchema, type AnnouncementInput } from "./_internal/schema";
import { createAnnouncement, updateAnnouncement, deleteAnnouncement } from "./_internal/services";
import { getLocale } from "@/shared/lib/i18n/server";
import { zodErrorMap } from "@/shared/lib/i18n/zod-locale";

export async function saveAnnouncementAction(input: AnnouncementInput): Promise<ActionResult<string>> {
  return runAction(async () => {
    const ctx = await requirePermission(NEWS_P.manage);
    const parsed = announcementSchema.parse(input, { errorMap: zodErrorMap(await getLocale()) } as any);
    let resultId = "";
    if (parsed.id) {
      resultId = await updateAnnouncement(ctx.tenantId, parsed.id, parsed);
    } else {
      resultId = await createAnnouncement(ctx.tenantId, ctx.userId, parsed);
    }
    revalidatePath("/news");
    return resultId;
  });
}

export async function deleteAnnouncementAction(id: string): Promise<ActionResult<void>> {
  return runAction(async () => {
    const ctx = await requirePermission(NEWS_P.manage);
    await deleteAnnouncement(ctx.tenantId, id);
    revalidatePath("/news");
  });
}
