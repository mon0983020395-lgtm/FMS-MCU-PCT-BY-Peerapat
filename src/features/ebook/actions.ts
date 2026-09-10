"use server";

import { revalidatePath } from "next/cache";
import { runAction, type ActionResult } from "@/shared/lib/result";
import { requirePermission } from "@/features/identity/server";
import { EBOOK_P } from "./permissions";
import { ebookSchema, type EbookInput } from "./_internal/schema";
import { saveEbook, deleteEbook } from "./_internal/services";
import { getLocale } from "@/shared/lib/i18n/server";
import { zodErrorMap } from "@/shared/lib/i18n/zod-locale";

export async function saveEbookAction(input: EbookInput): Promise<ActionResult<string>> {
  return runAction(async () => {
    const ctx = await requirePermission(EBOOK_P.manage);
    const parsed = ebookSchema.parse(input, { errorMap: zodErrorMap(await getLocale()) } as any);
    const result = await saveEbook(ctx.tenantId, parsed);
    revalidatePath("/ebooks");
    return result.id;
  });
}

export async function deleteEbookAction(id: string): Promise<ActionResult<void>> {
  return runAction(async () => {
    const ctx = await requirePermission(EBOOK_P.manage);
    await deleteEbook(ctx.tenantId, id);
    revalidatePath("/ebooks");
  });
}
