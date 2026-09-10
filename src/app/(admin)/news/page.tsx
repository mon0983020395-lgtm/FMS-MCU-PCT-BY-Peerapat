import { requireSession, hasPermission } from "@/features/identity/server";
import { getAnnouncements, NEWS_P } from "@/features/news/server";
import { NewsClient } from "./_components/news-client";

export default async function NewsPage() {
  const session = await requireSession();
  const initialItems = await getAnnouncements();
  const canManage = hasPermission(session, NEWS_P.manage);
  return (
    <NewsClient
      initialItems={initialItems}
      canManage={canManage}
    />
  );
}
