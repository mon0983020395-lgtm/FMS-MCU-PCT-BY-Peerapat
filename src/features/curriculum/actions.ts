"use server";

import { revalidatePath } from "next/cache";
import { runAction, type ActionResult } from "@/shared/lib/result";
import { requirePermission } from "@/features/identity/server";
import { CURRICULUM_P } from "./permissions";
import { curriculumSchema, type CurriculumInput } from "./_internal/schema";
import { createCurriculum, updateCurriculum, deleteCurriculum } from "./_internal/services";
import { getLocale } from "@/shared/lib/i18n/server";
import { zodErrorMap } from "@/shared/lib/i18n/zod-locale";

export async function saveCurriculumAction(input: CurriculumInput): Promise<ActionResult<string>> {
  return runAction(async () => {
    const ctx = await requirePermission(CURRICULUM_P.manage);
    const parsed = curriculumSchema.parse(input, { error: zodErrorMap(await getLocale()) });
    let resultId = "";
    if (parsed.id) {
      resultId = await updateCurriculum(ctx.tenantId, parsed.id, parsed);
    } else {
      resultId = await createCurriculum(ctx.tenantId, parsed);
    }
    revalidatePath("/curriculums");
    return resultId;
  });
}

export async function deleteCurriculumAction(id: string): Promise<ActionResult<void>> {
  return runAction(async () => {
    const ctx = await requirePermission(CURRICULUM_P.manage);
    await deleteCurriculum(ctx.tenantId, id);
    revalidatePath("/curriculums");
  });
}
