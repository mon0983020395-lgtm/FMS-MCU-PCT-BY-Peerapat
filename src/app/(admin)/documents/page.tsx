import { requireSession, hasPermission } from "@/features/identity/server";
import { getDocuments, DOCUMENT_P } from "@/features/document/server";
import { DocumentClient } from "./_components/document-client";

export default async function DocumentPage() {
  const session = await requireSession();
  const initialItems = await getDocuments();
  const canManage = hasPermission(session, DOCUMENT_P.manage);
  const canApprove = hasPermission(session, DOCUMENT_P.approve);
  return (
    <DocumentClient
      initialItems={initialItems}
      canManage={canManage}
      canApprove={canApprove}
    />
  );
}
