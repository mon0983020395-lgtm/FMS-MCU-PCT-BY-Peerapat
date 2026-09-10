import { requireSession, hasPermission } from "@/features/identity/server";
import { getPersonnels, PERSONNEL_P } from "@/features/personnel/server";
import { PersonnelClient } from "./_components/personnel-client";

export default async function PersonnelPage() {
  const session = await requireSession();
  const initialItems = await getPersonnels();
  const canManage = hasPermission(session, PERSONNEL_P.manage);
  return (
    <PersonnelClient
      initialItems={initialItems}
      canManage={canManage}
    />
  );
}
