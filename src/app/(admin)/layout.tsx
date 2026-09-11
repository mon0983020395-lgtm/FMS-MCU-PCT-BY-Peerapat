import { resolveTenantSettings } from "@/features/identity/server";
import { AdminLayoutClient } from "./_components/admin-layout-client";
import { auth } from "@/features/identity/server";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const settings = await resolveTenantSettings();
  const tenantName = settings?.nameTh || settings?.nameEn || null;
  const logoUrl = settings?.logoUrl || null;

  return (
    <AdminLayoutClient brandNameStr={tenantName} brandLogo={logoUrl}>
      {children}
    </AdminLayoutClient>
  );
}
