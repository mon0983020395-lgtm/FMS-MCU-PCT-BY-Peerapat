"use client";
import { useState, useTransition, useRef } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { LiyonCard, LiyonField, PalettePicker } from "@/shared/components/liyon";
import { useT } from "@/shared/lib/i18n/client";
import type { PaletteId } from "@/shared/lib/palette";
import type { TenantSettings } from "@/features/identity";
import { updateSettingsAction } from "@/features/identity/actions";
import { Upload } from "lucide-react";

export function SettingsForm({ initial }: { initial: TenantSettings }) {
  const t = useT();
  const router = useRouter();
  const [form, setForm] = useState({
    nameTh: initial.nameTh,
    nameEn: initial.nameEn,
    logoUrl: initial.logoUrl ?? "",
    palette: initial.palette as PaletteId,
    footerAbout: initial.footerAbout ?? "",
    footerAddress: initial.footerAddress ?? "",
    footerPhone: initial.footerPhone ?? "",
    footerEmail: initial.footerEmail ?? "",
    footerFacebook: initial.footerFacebook ?? "",
    footerLine: initial.footerLine ?? "",
    footerCopyright: initial.footerCopyright ?? "",
  });
  const [errors, setErrors] = useState<Record<string, string[]>>({});
  const [pending, start] = useTransition();
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  function save() {
    start(async () => {
      const r = await updateSettingsAction(form);
      if (!r.ok) { setErrors(r.error.fieldErrors ?? {}); if (!r.error.fieldErrors) toast.error(t(`error.${r.error.code}`)); return; }
      setErrors({});
      toast.success(t("settings.saveOk"));
      router.refresh();
    });
  }

  async function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error(t("error.validation")); // Could be better error message, but using existing generic one
      return;
    }

    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) throw new Error("Upload failed");

      const data = await res.json();
      setForm({ ...form, logoUrl: data.url });
      toast.success(t("common.success"));
    } catch (error) {
      console.error(error);
      toast.error(t("common.error"));
    } finally {
      setUploading(false);
      // Reset input
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  }

  return (
    <>
      <header className="ph"><h1>{t("settings.title")}</h1></header>
      <div className="set-cards">
        <LiyonCard>
          <h2>{t("settings.orgTitle")}</h2>
          <div className="fields">
            <LiyonField label={t("settings.nameTh")} htmlFor="s-name-th" error={errors.nameTh?.[0]}><input id="s-name-th" value={form.nameTh} onChange={(e) => setForm({ ...form, nameTh: e.target.value })} /></LiyonField>
            <LiyonField label={t("settings.nameEn")} htmlFor="s-name-en" error={errors.nameEn?.[0]}><input id="s-name-en" value={form.nameEn} onChange={(e) => setForm({ ...form, nameEn: e.target.value })} /></LiyonField>
            <LiyonField label={t("settings.logoUrl")} htmlFor="s-logo" hint={t("common.optional")} error={errors.logoUrl?.[0]}>
              <div className="flex gap-2">
                <input id="s-logo" type="text" value={form.logoUrl} onChange={(e) => setForm({ ...form, logoUrl: e.target.value })} className="flex-1" />
                <Button 
                  type="button" 
                  variant="outline" 
                  className="shrink-0"
                  disabled={uploading}
                  onClick={() => fileInputRef.current?.click()}
                >
                  <Upload className="w-4 h-4 mr-2" />
                  Upload
                </Button>
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  className="hidden" 
                  accept="image/*" 
                  onChange={handleFileUpload}
                />
              </div>
            </LiyonField>
          </div>
        </LiyonCard>

        <LiyonCard>
          <h2>{t("settings.footerTitle")}</h2>
          <p className="text-sm text-muted-foreground mb-4">{t("settings.footerDesc")}</p>
          <div className="fields">
            <LiyonField label={t("settings.footerAbout")} htmlFor="s-footer-about" hint={t("common.optional")}>
              <textarea
                id="s-footer-about"
                rows={3}
                value={form.footerAbout}
                onChange={(e) => setForm({ ...form, footerAbout: e.target.value })}
                placeholder="คำอธิบายสรุปเกี่ยวกับองค์กร/คณะ ที่จะนำไปแสดงในส่วนท้ายเว็บไซต์..."
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
              />
            </LiyonField>

            <LiyonField label={t("settings.footerAddress")} htmlFor="s-footer-address" hint={t("common.optional")}>
              <textarea
                id="s-footer-address"
                rows={2}
                value={form.footerAddress}
                onChange={(e) => setForm({ ...form, footerAddress: e.target.value })}
                placeholder="เช่น 123 อาคารเรียนรวม วิทยาลัยสงฆ์พิจิตร อ.เมือง จ.พิจิตร 66000"
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
              />
            </LiyonField>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <LiyonField label={t("settings.footerPhone")} htmlFor="s-footer-phone" hint={t("common.optional")}>
                <input
                  id="s-footer-phone"
                  type="text"
                  value={form.footerPhone}
                  onChange={(e) => setForm({ ...form, footerPhone: e.target.value })}
                  placeholder="เช่น 056-123456"
                />
              </LiyonField>

              <LiyonField label={t("settings.footerEmail")} htmlFor="s-footer-email" hint={t("common.optional")}>
                <input
                  id="s-footer-email"
                  type="email"
                  value={form.footerEmail}
                  onChange={(e) => setForm({ ...form, footerEmail: e.target.value })}
                  placeholder="เช่น contact@fms-mcu.ac.th"
                />
              </LiyonField>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <LiyonField label={t("settings.footerFacebook")} htmlFor="s-footer-facebook" hint={t("common.optional")}>
                <input
                  id="s-footer-facebook"
                  type="text"
                  value={form.footerFacebook}
                  onChange={(e) => setForm({ ...form, footerFacebook: e.target.value })}
                  placeholder="เช่น https://facebook.com/..."
                />
              </LiyonField>

              <LiyonField label={t("settings.footerLine")} htmlFor="s-footer-line" hint={t("common.optional")}>
                <input
                  id="s-footer-line"
                  type="text"
                  value={form.footerLine}
                  onChange={(e) => setForm({ ...form, footerLine: e.target.value })}
                  placeholder="เช่น @fms-mcu หรือ https://line.me/..."
                />
              </LiyonField>
            </div>

            <LiyonField label={t("settings.footerCopyright")} htmlFor="s-footer-copyright" hint={t("common.optional")}>
              <input
                id="s-footer-copyright"
                type="text"
                value={form.footerCopyright}
                onChange={(e) => setForm({ ...form, footerCopyright: e.target.value })}
                placeholder="เว้นว่างไว้เพื่อใช้ข้อความลิขสิทธิ์เริ่มต้นอัตโนมัติ"
              />
            </LiyonField>
          </div>
        </LiyonCard>

        <LiyonCard>
          <h2>{t("settings.brandTitle")}</h2>
          <p>{t("settings.brandDesc")}</p>
          <PalettePicker value={form.palette} onChange={(p) => setForm({ ...form, palette: p })} label={t("settings.paletteLabel")} />
          {form.palette === "coral" && <p className="warn" role="note">{t("settings.coralWarn")}</p>}
        </LiyonCard>
        <div className="savebar"><Button type="button" onClick={save} disabled={pending || uploading}>{t("common.save")}</Button></div>
      </div>
    </>
  );
}
