import { requireSession, hasPermission } from "@/features/identity/server";
import { getCurriculums, CURRICULUM_P } from "@/features/curriculum/server";
import { CurriculumClient } from "./_components/curriculum-client";

export default async function CurriculumPage() {
  const session = await requireSession();
  const initialItems = await getCurriculums();
  const canManage = hasPermission(session, CURRICULUM_P.manage);
  return (
    <CurriculumClient
      initialItems={initialItems}
      canManage={canManage}
    />
  );
}
