"use server";

import { revalidatePath } from "next/cache";
import { runAction, type ActionResult } from "@/shared/lib/result";
import { requirePermission } from "@/features/identity/server";
import { PERSONNEL_P } from "./permissions";
import { personnelSchema, type PersonnelInput } from "./_internal/schema";
import { createPersonnel, updatePersonnel, deletePersonnel } from "./_internal/services";
import { getLocale } from "@/shared/lib/i18n/server";
import { zodErrorMap } from "@/shared/lib/i18n/zod-locale";

export async function savePersonnelAction(input: PersonnelInput): Promise<ActionResult<string>> {
  return runAction(async () => {
    const ctx = await requirePermission(PERSONNEL_P.manage);
    const parsed = personnelSchema.parse(input, { error: zodErrorMap(await getLocale()) });
    let resultId = "";
    if (parsed.id) {
      resultId = await updatePersonnel(ctx.tenantId, parsed.id, parsed);
    } else {
      resultId = await createPersonnel(ctx.tenantId, parsed);
    }
    revalidatePath("/personnel");
    return resultId;
  });
}

export async function deletePersonnelAction(id: string): Promise<ActionResult<void>> {
  return runAction(async () => {
    const ctx = await requirePermission(PERSONNEL_P.manage);
    await deletePersonnel(ctx.tenantId, id);
    revalidatePath("/personnel");
  });
}
