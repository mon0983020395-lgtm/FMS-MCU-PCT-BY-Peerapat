"use client";

import { useState, useTransition } from "react";
import { Plus, Edit2, Trash2, Layers, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import { useT, useLocale } from "@/shared/lib/i18n/client";
import { formatDate } from "@/shared/lib/format";
import {
  LiyonCard,
  DataTable,
  StatusPill,
  LiyonDialog,
  LiyonDialogHeader,
  LiyonDialogBody,
  LiyonDialogFooter,
  RowMenuItem,
  type DataTableColumn,
  LiyonField,
  LiyonSwitchRow,
} from "@/shared/components/liyon";
import { Button } from "@/components/ui/button";
import type { AnnouncementDto } from "@/features/news";
import {
  saveAnnouncementAction,
  deleteAnnouncementAction,
} from "@/features/news/actions";

interface Props {
  initialItems: AnnouncementDto[];
  canManage: boolean;
}

export function NewsClient({ initialItems, canManage }: Props) {
  const t = useT();
  const locale = useLocale();
  const [isPending, startTransition] = useTransition();

  const [modalOpen, setModalOpen] = useState(false);
  const [deleteConfirmItem, setDeleteConfirmItem] = useState<AnnouncementDto | null>(null);
  const [editingItem, setEditingItem] = useState<AnnouncementDto | null>(null);
  
  const [formTitle, setFormTitle] = useState("");
  const [formContent, setFormContent] = useState("");
  const [formPublished, setFormPublished] = useState(false);

  const openCreateDialog = () => {
    setEditingItem(null);
    setFormTitle("");
    setFormContent("");
    setFormPublished(false);
    setModalOpen(true);
  };

  const openEditDialog = (item: AnnouncementDto) => {
    setEditingItem(item);
    setFormTitle(item.title);
    setFormContent(item.content);
    setFormPublished(item.isPublished);
    setModalOpen(true);
  };

  const handleSave = () => {
    if (!formTitle.trim() || !formContent.trim()) {
      toast.error(t("error.validation"));
      return;
    }

    startTransition(async () => {
      const res = await saveAnnouncementAction({
        id: editingItem?.id,
        title: formTitle.trim(),
        content: formContent.trim(),
        isPublished: formPublished,
      });
      if (res.ok) {
        toast.success(editingItem ? t("news.updateSuccess") : t("news.createSuccess"));
        setModalOpen(false);
        window.location.reload(); // Quick refresh
      } else {
        toast.error(t("common.error"));
      }
    });
  };

  const handleDelete = (item: AnnouncementDto) => {
    startTransition(async () => {
      const res = await deleteAnnouncementAction(item.id);
      if (res.ok) {
        toast.success(t("news.deleteSuccess"));
        setDeleteConfirmItem(null);
        window.location.reload();
      } else {
        toast.error(t("common.error"));
      }
    });
  };

  const columns: DataTableColumn<AnnouncementDto>[] = [
    {
      key: "title",
      header: t("news.titleField"),
      render: (row) => <span className="font-medium text-foreground">{row.title}</span>,
    },
    {
      key: "status",
      header: t("news.statusField"),
      render: (row) => (
        <StatusPill tone={row.isPublished ? "ok" : "off"}>
          {row.isPublished ? t("news.published") : t("news.draft")}
        </StatusPill>
      ),
    },
    {
      key: "createdAt",
      header: t("common.actions"),
      className: "nowrap text-muted-foreground text-xs",
      render: (row) => <span>{formatDate(new Date(row.createdAt), locale)}</span>,
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">{t("news.title")}</h1>
          <p className="text-sm text-muted-foreground">{t("news.subtitle")}</p>
        </div>
        {canManage && (
          <Button onClick={openCreateDialog} className="gap-2">
            <Plus className="h-4 w-4" />
            {t("news.create")}
          </Button>
        )}
      </div>

      <LiyonCard>
        <DataTable<AnnouncementDto>
          state={initialItems.length === 0 ? "empty" : "data"}
          rows={initialItems}
          columns={columns}
          getRowId={(row) => row.id}
          headHeading={t("news.title")}
          renderRowMenu={
            canManage
              ? (row) => (
                  <>
                    <RowMenuItem onSelect={() => openEditDialog(row)} icon={<Edit2 className="h-4 w-4" />}>
                      {t("news.edit")}
                    </RowMenuItem>
                    <RowMenuItem onSelect={() => setDeleteConfirmItem(row)} danger icon={<Trash2 className="h-4 w-4" />}>
                      {t("news.delete")}
                    </RowMenuItem>
                  </>
                )
              : undefined
          }
          empty={{
            icon: <Layers className="h-10 w-10 text-muted-foreground/50" />,
            title: t("news.empty"),
            description: t("news.subtitle"),
          }}
          error={{
            icon: <AlertCircle className="h-10 w-10 text-danger" />,
            title: t("common.error"),
          }}
        />
      </LiyonCard>

      <LiyonDialog open={modalOpen} onOpenChange={setModalOpen}>
        <LiyonDialogHeader
          title={editingItem ? t("news.edit") : t("news.create")}
          description={t("news.subtitle")}
        />
        <LiyonDialogBody>
          <div className="space-y-4 py-2">
            <LiyonField label={t("news.titleField")}>
              <input
                className="liyon-input"
                value={formTitle}
                onChange={(e) => setFormTitle(e.target.value)}
              />
            </LiyonField>
            <LiyonField label={t("news.contentField")}>
              <textarea
                className="liyon-input min-h-[80px]"
                value={formContent}
                onChange={(e) => setFormContent(e.target.value)}
              />
            </LiyonField>
            <LiyonSwitchRow
              id="news-published-switch"
              label={`${t("news.statusField")} - ${t("news.published")}`}
              description={t("news.statusField")}
              checked={formPublished}
              onCheckedChange={setFormPublished}
            />
          </div>
        </LiyonDialogBody>
        <LiyonDialogFooter>
          <Button variant="outline" onClick={() => setModalOpen(false)} disabled={isPending}>
            {t("common.cancel")}
          </Button>
          <Button onClick={handleSave} disabled={isPending}>
            {t("common.save")}
          </Button>
        </LiyonDialogFooter>
      </LiyonDialog>

      <LiyonDialog open={!!deleteConfirmItem} onOpenChange={(open: boolean) => !open && setDeleteConfirmItem(null)}>
        <LiyonDialogHeader
          title={t("news.delete")}
          description={t("news.deleteConfirm")}
        />
        <LiyonDialogBody>
          <p className="text-sm text-muted-foreground">
            {deleteConfirmItem?.title}
          </p>
        </LiyonDialogBody>
        <LiyonDialogFooter>
          <Button variant="outline" onClick={() => setDeleteConfirmItem(null)} disabled={isPending}>
            {t("common.cancel")}
          </Button>
          <Button
            variant="destructive"
            onClick={() => deleteConfirmItem && handleDelete(deleteConfirmItem)}
            disabled={isPending}
          >
            {t("news.delete")}
          </Button>
        </LiyonDialogFooter>
      </LiyonDialog>
    </div>
  );
}
