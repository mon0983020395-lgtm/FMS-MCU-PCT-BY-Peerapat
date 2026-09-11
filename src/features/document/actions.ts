"use server";

import { revalidatePath } from "next/cache";
import { runAction, type ActionResult } from "@/shared/lib/result";
import { requirePermission } from "@/features/identity/server";
import { DOCUMENT_P } from "./permissions";
import { documentSchema, type DocumentInput } from "./_internal/schema";
import { createDocument, updateDocument, deleteDocument } from "./_internal/services";
import { getLocale } from "@/shared/lib/i18n/server";
import { zodErrorMap } from "@/shared/lib/i18n/zod-locale";

export async function saveDocumentAction(input: DocumentInput): Promise<ActionResult<string>> {
  return runAction(async () => {
    const ctx = await requirePermission(DOCUMENT_P.manage);
    const parsed = documentSchema.parse(input, { error: zodErrorMap(await getLocale()) });
    let resultId = "";
    if (parsed.id) {
      resultId = await updateDocument(ctx.tenantId, parsed.id, parsed);
    } else {
      resultId = await createDocument(ctx.tenantId, ctx.userId, parsed);
    }
    revalidatePath("/documents");
    return resultId;
  });
}

export async function deleteDocumentAction(id: string): Promise<ActionResult<void>> {
  return runAction(async () => {
    const ctx = await requirePermission(DOCUMENT_P.manage);
    await deleteDocument(ctx.tenantId, id);
    revalidatePath("/documents");
  });
}
