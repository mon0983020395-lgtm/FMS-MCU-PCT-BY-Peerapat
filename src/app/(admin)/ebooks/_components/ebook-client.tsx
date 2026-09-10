"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { useT } from "@/shared/lib/i18n/client";
import { DataTable, type DataTableColumn, StatusPill, RowMenuItem, LiyonDialog, LiyonDialogHeader, LiyonDialogBody, LiyonDialogFooter, LiyonField, LiyonSwitchRow } from "@/shared/components/liyon";
import { Button } from "@/components/ui/button";
import { saveEbookAction, deleteEbookAction } from "@/features/ebook/actions";
import type { EbookDto } from "@/features/ebook/server";
import { Book, Plus, Edit2, Trash2 } from "lucide-react";
import { toast } from "sonner";

function emptyForm() {
  return {
    id: "",
    title: "",
    author: "",
    publisher: "",
    category: "",
    publishDate: "",
    description: "",
    coverImageUrl: "",
    fileUrl: "",
    isActive: true,
  };
}

export function EbookClient({ initialData, canManage }: { initialData: EbookDto[]; canManage: boolean }) {
  const t = useT();
  const router = useRouter();
  const [data, setData] = useState(initialData);
  const [isPending, startTransition] = useTransition();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [form, setForm] = useState(emptyForm());
  const [formErrors, setFormErrors] = useState<Record<string, string[]>>({});
  const [deleteConfirmItem, setDeleteConfirmItem] = useState<EbookDto | null>(null);

  const handleSave = () => {
    startTransition(async () => {
      setFormErrors({});
      const res = await saveEbookAction({
        id: form.id || undefined,
        title: form.title,
        author: form.author || undefined,
        publisher: form.publisher || undefined,
        category: form.category || undefined,
        publishDate: form.publishDate || undefined,
        description: form.description || undefined,
        coverImageUrl: form.coverImageUrl || undefined,
        fileUrl: form.fileUrl || undefined,
        isActive: form.isActive,
      });
      if (res.ok) {
        toast.success(form.id ? t("ebook.updateSuccess") : t("ebook.createSuccess"));
        setDialogOpen(false);
        router.refresh();
      } else if (res.error?.fieldErrors) {
        setFormErrors(res.error.fieldErrors);
      } else {
        toast.error(res.error?.message || "Error");
      }
    });
  };

  const handleDelete = (id: string) => {
    startTransition(async () => {
      const res = await deleteEbookAction(id);
      if (res.ok) {
        toast.success(t("ebook.deleteSuccess"));
        setDeleteConfirmItem(null);
        router.refresh();
      } else {
        toast.error(res.error?.message || "Error");
      }
    });
  };

  const openCreateDialog = () => {
    setForm(emptyForm());
    setFormErrors({});
    setDialogOpen(true);
  };

  const openEditDialog = (row: EbookDto) => {
    setForm({
      id: row.id,
      title: row.title,
      author: row.author || "",
      publisher: row.publisher || "",
      category: row.category || "",
      publishDate: row.publishDate ? row.publishDate.split("T")[0] : "",
      description: row.description || "",
      coverImageUrl: row.coverImageUrl || "",
      fileUrl: row.fileUrl || "",
      isActive: row.isActive,
    });
    setFormErrors({});
    setDialogOpen(true);
  };

  const columns: DataTableColumn<EbookDto>[] = [
    {
      key: "title",
      header: t("ebook.titleField"),
      render: (row) => (
        <div className="flex flex-col">
          <span className="font-medium text-slate-900">{row.title}</span>
          {row.author && <span className="text-xs text-slate-500">{row.author}</span>}
        </div>
      ),
    },
    {
      key: "category",
      header: t("ebook.categoryField"),
      render: (row) => <span className="text-sm">{row.category || "-"}</span>,
    },
    {
      key: "publishDate",
      header: t("ebook.publishDateField"),
      render: (row) => (
        <span className="text-sm">
          {row.publishDate ? new Date(row.publishDate).toLocaleDateString() : "-"}
        </span>
      ),
    },
    {
      key: "status",
      header: t("ebook.statusField"),
      render: (row) => (
        <StatusPill tone={row.isActive ? "ok" : "off"}>
          {row.isActive ? t("common.active") : t("common.inactive")}
        </StatusPill>
      ),
    },
  ];

  return (
    <>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">{t("ebook.title")}</h1>
          <p className="text-slate-500 mt-1">{t("ebook.subtitle")}</p>
        </div>
      </div>
      <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
        {canManage && (
          <div className="p-4 border-b border-slate-200 flex justify-end bg-slate-50/50">
            <Button onClick={openCreateDialog}>
              <Plus className="w-4 h-4 mr-2" />
              {t("ebook.create")}
            </Button>
          </div>
        )}
        {/* @ts-ignore */}
        <DataTable
          columns={columns}
          rows={data}
          getRowId={(r) => r.id}
          state={data.length > 0 ? "data" : "empty"}
          empty={{
            icon: <Book className="w-10 h-10 text-slate-300" />,
            title: t("ebook.empty"),
          }}
          renderRowMenu={
            canManage
              ? (row) => (
                  <>
                    {/* @ts-ignore */}
                    <RowMenuItem onSelect={() => openEditDialog(row)} icon={<Edit2 className="h-4 w-4" />}>
                      {t("ebook.edit")}
                    </RowMenuItem>
                    {/* @ts-ignore */}
                    <RowMenuItem onSelect={() => setDeleteConfirmItem(row)} danger icon={<Trash2 className="h-4 w-4" />}>
                      {t("ebook.delete")}
                    </RowMenuItem>
                  </>
                )
              : undefined
          }
        />
      </div>

      <LiyonDialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <LiyonDialogHeader title={form.id ? t("ebook.edit") : t("ebook.create")} description={t("ebook.subtitle")} />
        <LiyonDialogBody className="space-y-4">
          <LiyonField
            label={t("ebook.titleField")}
            error={formErrors.title?.join(", ")}
          >
            <input
              className="liyon-input"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              placeholder={t("ebook.titleField")}
            />
          </LiyonField>
          <div className="grid grid-cols-2 gap-4">
            <LiyonField label={t("ebook.authorField")}>
              <input
                className="liyon-input"
                value={form.author}
                onChange={(e) => setForm({ ...form, author: e.target.value })}
              />
            </LiyonField>
            <LiyonField label={t("ebook.publisherField")}>
              <input
                className="liyon-input"
                value={form.publisher}
                onChange={(e) => setForm({ ...form, publisher: e.target.value })}
              />
            </LiyonField>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <LiyonField label={t("ebook.categoryField")}>
              <input
                className="liyon-input"
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
              />
            </LiyonField>
            <LiyonField label={t("ebook.publishDateField")}>
              <input
                type="date"
                className="liyon-input"
                value={form.publishDate}
                onChange={(e) => setForm({ ...form, publishDate: e.target.value })}
              />
            </LiyonField>
          </div>
          <LiyonField label="Cover Image URL">
            <input
              className="liyon-input"
              value={form.coverImageUrl}
              onChange={(e) => setForm({ ...form, coverImageUrl: e.target.value })}
            />
          </LiyonField>
          <LiyonField label="File URL (PDF/EPUB)">
            <input
              className="liyon-input"
              value={form.fileUrl}
              onChange={(e) => setForm({ ...form, fileUrl: e.target.value })}
            />
          </LiyonField>
          <LiyonSwitchRow
            id="ebook-status-switch"
            label={t("ebook.statusField")}
            description="Active status"
            checked={form.isActive}
            onCheckedChange={(checked: boolean) => setForm({ ...form, isActive: checked })}
          />
        </LiyonDialogBody>
        <LiyonDialogFooter>
          <Button variant="outline" onClick={() => setDialogOpen(false)} disabled={isPending}>{t("common.cancel")}</Button>
          <Button onClick={handleSave} disabled={isPending}>{t("common.save")}</Button>
        </LiyonDialogFooter>
      </LiyonDialog>

      <LiyonDialog open={!!deleteConfirmItem} onOpenChange={(open: boolean) => !open && setDeleteConfirmItem(null)}>
        <LiyonDialogHeader title={t("ebook.delete")} description={t("ebook.deleteConfirm")} />
        <LiyonDialogFooter>
          <Button variant="outline" onClick={() => setDeleteConfirmItem(null)} disabled={isPending}>{t("common.cancel")}</Button>
          <Button variant="destructive" disabled={isPending} onClick={() => deleteConfirmItem && handleDelete(deleteConfirmItem.id)}>
            {t("common.confirm")}
          </Button>
        </LiyonDialogFooter>
      </LiyonDialog>
    </>
  );
}
