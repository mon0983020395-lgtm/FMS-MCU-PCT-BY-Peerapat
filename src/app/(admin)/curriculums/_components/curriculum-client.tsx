"use client";

import { useState, useTransition } from "react";
import { Plus, Edit2, Trash2, BookOpen, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import { useT } from "@/shared/lib/i18n/client";
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
} from "@/shared/components/liyon";
import { Button } from "@/components/ui/button";
import type { CurriculumDto } from "@/features/curriculum";
import {
  saveCurriculumAction,
  deleteCurriculumAction,
} from "@/features/curriculum/actions";

interface Props {
  initialItems: CurriculumDto[];
  canManage: boolean;
}

export function CurriculumClient({ initialItems, canManage }: Props) {
  const t = useT();
  const [items, setItems] = useState<CurriculumDto[]>(initialItems);
  const [isPending, startTransition] = useTransition();

  const [modalOpen, setModalOpen] = useState(false);
  const [deleteConfirmItem, setDeleteConfirmItem] = useState<CurriculumDto | null>(null);
  const [editingItem, setEditingItem] = useState<CurriculumDto | null>(null);
  
  const [formCode, setFormCode] = useState("");
  const [formNameTh, setFormNameTh] = useState("");
  const [formNameEn, setFormNameEn] = useState("");
  const [formDegreeType, setFormDegreeType] = useState("");
  const [formTotalCredits, setFormTotalCredits] = useState<number>(0);
  const [formDescription, setFormDescription] = useState("");
  const [formActive, setFormActive] = useState(true);

  const openCreateDialog = () => {
    setEditingItem(null);
    setFormCode("");
    setFormNameTh("");
    setFormNameEn("");
    setFormDegreeType("Bachelor");
    setFormTotalCredits(120);
    setFormDescription("");
    setFormActive(true);
    setModalOpen(true);
  };

  const openEditDialog = (item: CurriculumDto) => {
    setEditingItem(item);
    setFormCode(item.code);
    setFormNameTh(item.nameTh);
    setFormNameEn(item.nameEn);
    setFormDegreeType(item.degreeType);
    setFormTotalCredits(item.totalCredits);
    setFormDescription(item.description || "");
    setFormActive(item.isActive);
    setModalOpen(true);
  };

  const handleSave = () => {
    if (!formCode.trim() || !formNameTh.trim() || !formNameEn.trim() || !formDegreeType.trim() || formTotalCredits <= 0) {
      toast.error(t("error.validation"));
      return;
    }

    startTransition(async () => {
      const res = await saveCurriculumAction({
        id: editingItem?.id,
        code: formCode.trim(),
        nameTh: formNameTh.trim(),
        nameEn: formNameEn.trim(),
        degreeType: formDegreeType.trim(),
        totalCredits: formTotalCredits,
        description: formDescription.trim() || undefined,
        isActive: formActive,
      });
      if (res.ok) {
        toast.success(editingItem ? t("curriculum.updateSuccess") : t("curriculum.createSuccess"));
        setModalOpen(false);
        window.location.reload();
      } else {
        toast.error(t("common.error"));
      }
    });
  };

  const handleDelete = (item: CurriculumDto) => {
    startTransition(async () => {
      const res = await deleteCurriculumAction(item.id);
      if (res.ok) {
        toast.success(t("curriculum.deleteSuccess"));
        setDeleteConfirmItem(null);
        window.location.reload();
      } else {
        toast.error(t("common.error"));
      }
    });
  };

  const columns: DataTableColumn<CurriculumDto>[] = [
    {
      key: "code",
      header: t("curriculum.codeField"),
      render: (row) => <span className="font-medium text-foreground">{row.code}</span>,
    },
    {
      key: "nameTh",
      header: t("curriculum.nameThField"),
      render: (row) => <span>{row.nameTh}</span>,
    },
    {
      key: "degreeType",
      header: t("curriculum.degreeTypeField"),
      render: (row) => <span className="text-muted-foreground">{row.degreeType}</span>,
    },
    {
      key: "totalCredits",
      header: t("curriculum.totalCreditsField"),
      render: (row) => <span>{row.totalCredits}</span>,
    },
    {
      key: "status",
      header: t("curriculum.statusField"),
      render: (row) => (
        // @ts-ignore
        <StatusPill tone={row.isActive ? "positive" : "neutral"}>
          {row.isActive ? t("status.active") : t("status.inactive")}
        </StatusPill>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">{t("curriculum.title")}</h1>
          <p className="text-sm text-muted-foreground">{t("curriculum.subtitle")}</p>
        </div>
        {canManage && (
          <Button onClick={openCreateDialog} className="gap-2">
            <Plus className="h-4 w-4" />
            {t("curriculum.create")}
          </Button>
        )}
      </div>

      <LiyonCard>
        {/* @ts-ignore */}
        <DataTable<CurriculumDto>
          state={items.length === 0 ? "empty" : "data"}
          rows={items}
          columns={columns}
          getRowId={(row) => row.id}
          renderRowMenu={
            canManage
              ? (row) => (
                  <>
                    {/* @ts-ignore */}
                    <RowMenuItem onSelect={() => openEditDialog(row)} icon={<Edit2 className="h-4 w-4" />}>
                      {t("curriculum.edit")}
                    </RowMenuItem>
                    {/* @ts-ignore */}
                    <RowMenuItem onSelect={() => setDeleteConfirmItem(row)} danger icon={<Trash2 className="h-4 w-4" />}>
                      {t("curriculum.delete")}
                    </RowMenuItem>
                  </>
                )
              : undefined
          }
          empty={{
            icon: <BookOpen className="h-10 w-10 text-muted-foreground/50" />,
            title: t("curriculum.empty"),
            description: t("curriculum.subtitle"),
          }}
          error={{
            icon: <AlertCircle className="h-10 w-10 text-danger" />,
            title: t("common.error"),
          }}
        />
      </LiyonCard>

      {/* @ts-ignore */}
      <LiyonDialog open={modalOpen} onOpenChange={setModalOpen}>
        <LiyonDialogHeader
          title={editingItem ? t("curriculum.edit") : t("curriculum.create")}
          description={t("curriculum.subtitle")}
        />
        <LiyonDialogBody>
          <div className="grid gap-4 py-4 md:grid-cols-2">
            <div className="col-span-2">
              <label className="text-sm font-medium">{t("curriculum.codeField")}</label>
              <input
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                value={formCode}
                onChange={(e) => setFormCode(e.target.value)}
              />
            </div>
            <div className="col-span-2">
              <label className="text-sm font-medium">{t("curriculum.nameThField")}</label>
              <input
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                value={formNameTh}
                onChange={(e) => setFormNameTh(e.target.value)}
              />
            </div>
            <div className="col-span-2">
              <label className="text-sm font-medium">{t("curriculum.nameEnField")}</label>
              <input
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                value={formNameEn}
                onChange={(e) => setFormNameEn(e.target.value)}
              />
            </div>
            <div className="col-span-1">
              <label className="text-sm font-medium">{t("curriculum.degreeTypeField")}</label>
              <select
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                value={formDegreeType}
                onChange={(e) => setFormDegreeType(e.target.value)}
              >
                <option value="Bachelor">Bachelor</option>
                <option value="Master">Master</option>
                <option value="Doctorate">Doctorate</option>
              </select>
            </div>
            <div className="col-span-1">
              <label className="text-sm font-medium">{t("curriculum.totalCreditsField")}</label>
              <input
                type="number"
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                value={formTotalCredits}
                onChange={(e) => setFormTotalCredits(Number(e.target.value))}
              />
            </div>
            <div className="col-span-2">
              <label className="text-sm font-medium">{t("curriculum.descriptionField")}</label>
              <textarea
                className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                value={formDescription}
                onChange={(e) => setFormDescription(e.target.value)}
              />
            </div>
            <div className="col-span-2 flex items-center space-x-2 mt-2">
              <input
                type="checkbox"
                checked={formActive}
                onChange={(e) => setFormActive(e.target.checked)}
              />
              <label className="text-sm font-medium">{t("status.active")}</label>
            </div>
          </div>
        </LiyonDialogBody>
        <LiyonDialogFooter>
          <Button variant="outline" onClick={() => setModalOpen(false)} disabled={isPending}>
            {t("sample.cancel")}
          </Button>
          <Button onClick={handleSave} disabled={isPending}>
            {t("sample.save")}
          </Button>
        </LiyonDialogFooter>
      </LiyonDialog>

      {/* @ts-ignore */}
      <LiyonDialog open={!!deleteConfirmItem} onOpenChange={(open: boolean) => !open && setDeleteConfirmItem(null)}>
        <LiyonDialogHeader
          title={t("curriculum.delete")}
          description={t("curriculum.deleteConfirm")}
        />
        <LiyonDialogBody>
          <p className="text-sm text-muted-foreground">
            {deleteConfirmItem?.code} - {deleteConfirmItem?.nameTh}
          </p>
        </LiyonDialogBody>
        <LiyonDialogFooter>
          <Button variant="outline" onClick={() => setDeleteConfirmItem(null)} disabled={isPending}>
            {t("sample.cancel")}
          </Button>
          <Button
            variant="destructive"
            onClick={() => deleteConfirmItem && handleDelete(deleteConfirmItem)}
            disabled={isPending}
          >
            {t("curriculum.delete")}
          </Button>
        </LiyonDialogFooter>
      </LiyonDialog>
    </div>
  );
}
