import { requireSession, hasPermission } from "@/features/identity/server";
import { EBOOK_P } from "@/features/ebook/permissions";
import { listEbooks } from "@/features/ebook/server";
import { EbookClient } from "./_components/ebook-client";
import { redirect } from "next/navigation";

export const metadata = { title: "E-Books | VibeCore" };

export default async function EbooksPage() {
  const session = await requireSession();
  if (!hasPermission(session, EBOOK_P.read)) redirect("/dashboard");

  const data = await listEbooks(session.tenantId);

  return (
    <div className="p-4 md:p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
      <EbookClient initialData={data} canManage={hasPermission(session, EBOOK_P.manage)} />
    </div>
  );
}
