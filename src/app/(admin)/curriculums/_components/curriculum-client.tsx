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
  LiyonField,
  LiyonSwitchRow,
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
  const [isPending, startTransition] = useTransition();

  const [modalOpen, setModalOpen] = useState(false);
  const [deleteConfirmItem, setDeleteConfirmItem] = useState<CurriculumDto | null>(null);
  const [editingItem, setEditingItem] = useState<CurriculumDto | null>(null);
  
  const [formCode, setFormCode] = useState("");
  const [formNameTh, setFormNameTh] = useState("");
  const [formNameEn, setFormNameEn] = useState("");
  const [formDegreeType, setFormDegreeType] = useState("Bachelor");
  const [formTotalCredits, setFormTotalCredits] = useState(0);
  const [formDescription, setFormDescription] = useState("");
  const [formActive, setFormActive] = useState(true);

  const openCreateDialog = () => {
    setEditingItem(null);
    setFormCode("");
    setFormNameTh("");
    setFormNameEn("");
    setFormDegreeType("Bachelor");
    setFormTotalCredits(0);
    setFormDescription("");
    setFormActive(true);
    setModalOpen(true);
  };

  const openEditDialog = (item: CurriculumDto) => {
    setEditingItem(item);
    setFormCode(item.code);
    setFormNameTh(item.nameTh);
    setFormNameEn(item.nameEn || "");
    setFormDegreeType(item.degreeType || "Bachelor");
    setFormTotalCredits(item.totalCredits);
    setFormDescription(item.description || "");
    setFormActive(item.isActive);
    setModalOpen(true);
  };

  const handleSave = () => {
    if (!formCode.trim() || !formNameTh.trim()) {
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
        <StatusPill tone={row.isActive ? "ok" : "off"}>
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
        <DataTable<CurriculumDto>
          state={initialItems.length === 0 ? "empty" : "data"}
          rows={initialItems}
          columns={columns}
          getRowId={(row) => row.id}
          headHeading={t("curriculum.title")}
          renderRowMenu={
            canManage
              ? (row) => (
                  <>
                    <RowMenuItem onSelect={() => openEditDialog(row)} icon={<Edit2 className="h-4 w-4" />}>
                      {t("curriculum.edit")}
                    </RowMenuItem>
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

      <LiyonDialog open={modalOpen} onOpenChange={setModalOpen}>
        <LiyonDialogHeader
          title={editingItem ? t("curriculum.edit") : t("curriculum.create")}
          description={t("curriculum.subtitle")}
        />
        <LiyonDialogBody>
          <div className="grid gap-4 py-4 md:grid-cols-2">
            <div className="col-span-2">
              <LiyonField label={t("curriculum.codeField")}>
                <input
                  className="liyon-input"
                  value={formCode}
                  onChange={(e) => setFormCode(e.target.value)}
                />
              </LiyonField>
            </div>
            <div className="col-span-2">
              <LiyonField label={t("curriculum.nameThField")}>
                <input
                  className="liyon-input"
                  value={formNameTh}
                  onChange={(e) => setFormNameTh(e.target.value)}
                />
              </LiyonField>
            </div>
            <div className="col-span-2">
              <LiyonField label={t("curriculum.nameEnField")}>
                <input
                  className="liyon-input"
                  value={formNameEn}
                  onChange={(e) => setFormNameEn(e.target.value)}
                />
              </LiyonField>
            </div>
            <div className="col-span-1">
              <LiyonField label={t("curriculum.degreeTypeField")}>
                <select
                  className="liyon-input"
                  value={formDegreeType}
                  onChange={(e) => setFormDegreeType(e.target.value)}
                >
                  <option value="Bachelor">Bachelor</option>
                  <option value="Master">Master</option>
                  <option value="Doctorate">Doctorate</option>
                </select>
              </LiyonField>
            </div>
            <div className="col-span-1">
              <LiyonField label={t("curriculum.totalCreditsField")}>
                <input
                  type="number"
                  className="liyon-input"
                  value={formTotalCredits}
                  onChange={(e) => setFormTotalCredits(Number(e.target.value))}
                />
              </LiyonField>
            </div>
            <div className="col-span-2">
              <LiyonField label={t("curriculum.descriptionField")}>
                <textarea
                  className="liyon-input min-h-[80px]"
                  value={formDescription}
                  onChange={(e) => setFormDescription(e.target.value)}
                />
              </LiyonField>
            </div>
            <div className="col-span-2 mt-2">
              <LiyonSwitchRow
                id="curriculum-active-switch"
                label={t("status.active")}
                description={t("curriculum.statusField")}
                checked={formActive}
                onCheckedChange={setFormActive}
              />
            </div>
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
            {t("common.cancel")}
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
