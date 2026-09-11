"use client";

import { useState, useTransition } from "react";
import { Plus, Edit2, Trash2, FileText, AlertCircle, CheckCircle, XCircle } from "lucide-react";
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
  LiyonSelect,
  type StatusPillTone,
} from "@/shared/components/liyon";
import { Button } from "@/components/ui/button";
import type { DocumentDto } from "@/features/document";
import {
  saveDocumentAction,
  deleteDocumentAction,
} from "@/features/document/actions";

interface Props {
  initialItems: DocumentDto[];
  canManage: boolean;
  canApprove: boolean;
}

export function DocumentClient({ initialItems, canManage, canApprove }: Props) {
  const t = useT();
  const [isPending, startTransition] = useTransition();

  const [modalOpen, setModalOpen] = useState(false);
  const [deleteConfirmItem, setDeleteConfirmItem] = useState<DocumentDto | null>(null);
  const [editingItem, setEditingItem] = useState<DocumentDto | null>(null);
  
  const [formDocType, setFormDocType] = useState("");
  const [formTitle, setFormTitle] = useState("");
  const [formRemarks, setFormRemarks] = useState("");
  const [formStatus, setFormStatus] = useState<"PENDING" | "APPROVED" | "REJECTED">("PENDING");

  const openCreateDialog = () => {
    setEditingItem(null);
    setFormDocType("");
    setFormTitle("");
    setFormRemarks("");
    setFormStatus("PENDING");
    setModalOpen(true);
  };

  const openEditDialog = (item: DocumentDto) => {
    setEditingItem(item);
    setFormDocType(item.docType);
    setFormTitle(item.title);
    setFormRemarks(item.remarks || "");
    setFormStatus(item.status);
    setModalOpen(true);
  };

  const handleSave = () => {
    if (!formDocType.trim() || !formTitle.trim()) {
      toast.error(t("error.validation"));
      return;
    }

    startTransition(async () => {
      const res = await saveDocumentAction({
        id: editingItem?.id,
        docType: formDocType.trim(),
        title: formTitle.trim(),
        remarks: formRemarks.trim() || undefined,
        status: formStatus,
      });
      if (res.ok) {
        toast.success(editingItem ? t("document.updateSuccess") : t("document.createSuccess"));
        setModalOpen(false);
        window.location.reload();
      } else {
        toast.error(t("common.error"));
      }
    });
  };

  const handleDelete = (item: DocumentDto) => {
    startTransition(async () => {
      const res = await deleteDocumentAction(item.id);
      if (res.ok) {
        toast.success(t("document.deleteSuccess"));
        setDeleteConfirmItem(null);
        window.location.reload();
      } else {
        toast.error(t("common.error"));
      }
    });
  };

  const handleApproveReject = (item: DocumentDto, newStatus: "APPROVED" | "REJECTED") => {
    startTransition(async () => {
      const res = await saveDocumentAction({
        id: item.id,
        docType: item.docType,
        title: item.title,
        remarks: item.remarks || undefined,
        status: newStatus,
      });
      if (res.ok) {
        toast.success(t("document.updateSuccess"));
        window.location.reload();
      } else {
        toast.error(t("common.error"));
      }
    });
  };

  const columns: DataTableColumn<DocumentDto>[] = [
    {
      key: "docType",
      header: t("document.docTypeField"),
      render: (row) => <span className="font-medium">{row.docType}</span>,
    },
    {
      key: "title",
      header: t("document.titleField"),
      render: (row) => <span>{row.title}</span>,
    },
    {
      key: "requester",
      header: "ผู้ยื่นคำร้อง",
      render: (row) => <span className="text-muted-foreground">{row.requesterName || "—"}</span>,
    },
    {
      key: "status",
      header: t("document.statusField"),
      render: (row) => {
        let tone: StatusPillTone = "info";
        if (row.status === "APPROVED") tone = "ok";
        if (row.status === "REJECTED") tone = "bad";
        if (row.status === "PENDING") tone = "warn";
        return <StatusPill tone={tone}>{row.status}</StatusPill>;
      },
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">{t("document.title")}</h1>
          <p className="text-sm text-muted-foreground">{t("document.subtitle")}</p>
        </div>
        {canManage && (
          <Button onClick={openCreateDialog} className="gap-2">
            <Plus className="h-4 w-4" />
            {t("document.create")}
          </Button>
        )}
      </div>

      <LiyonCard>
        <DataTable<DocumentDto>
          state={initialItems.length === 0 ? "empty" : "data"}
          rows={initialItems}
          columns={columns}
          getRowId={(row) => row.id}
          headHeading={t("document.title")}
          renderRowMenu={
            canManage || canApprove
              ? (row) => (
                  <>
                    {canManage && (
                      <RowMenuItem onSelect={() => openEditDialog(row)} icon={<Edit2 className="h-4 w-4" />}>
                        {t("document.edit")}
                      </RowMenuItem>
                    )}
                    {canApprove && row.status === "PENDING" && (
                      <>
                        <RowMenuItem onSelect={() => handleApproveReject(row, "APPROVED")} icon={<CheckCircle className="h-4 w-4 text-green-600" />}>
                          {t("document.approve")}
                        </RowMenuItem>
                        <RowMenuItem onSelect={() => handleApproveReject(row, "REJECTED")} icon={<XCircle className="h-4 w-4 text-red-600" />}>
                          {t("document.reject")}
                        </RowMenuItem>
                      </>
                    )}
                    {canManage && (
                      <RowMenuItem onSelect={() => setDeleteConfirmItem(row)} danger icon={<Trash2 className="h-4 w-4" />}>
                        {t("document.delete")}
                      </RowMenuItem>
                    )}
                  </>
                )
              : undefined
          }
          empty={{
            icon: <FileText className="h-10 w-10 text-muted-foreground/50" />,
            title: t("document.empty"),
            description: t("document.subtitle"),
          }}
          error={{
            icon: <AlertCircle className="h-10 w-10 text-danger" />,
            title: t("common.error"),
          }}
        />
      </LiyonCard>

      <LiyonDialog open={modalOpen} onOpenChange={setModalOpen}>
        <LiyonDialogHeader
          title={editingItem ? t("document.edit") : t("document.create")}
          description={t("document.subtitle")}
        />
        <LiyonDialogBody>
          <div className="grid gap-4 py-4 md:grid-cols-1">
            <LiyonField label={t("document.docTypeField")}>
              <input
                className="liyon-input"
                value={formDocType}
                onChange={(e) => setFormDocType(e.target.value)}
                placeholder="เช่น คำร้องขอลาป่วย, เอกสารเบิกจ่าย"
              />
            </LiyonField>
            <LiyonField label={t("document.titleField")}>
              <input
                className="liyon-input"
                value={formTitle}
                onChange={(e) => setFormTitle(e.target.value)}
              />
            </LiyonField>
            <LiyonField label={t("document.remarksField")}>
              <textarea
                className="liyon-input min-h-[80px]"
                value={formRemarks}
                onChange={(e) => setFormRemarks(e.target.value)}
              />
            </LiyonField>
            {canApprove && editingItem && (
              <LiyonField label={t("document.statusField")}>
                <LiyonSelect
                  value={formStatus}
                  onChange={(e) => setFormStatus(e.target.value as "PENDING" | "APPROVED" | "REJECTED")}
                >
                  <option value="PENDING">PENDING</option>
                  <option value="APPROVED">APPROVED</option>
                  <option value="REJECTED">REJECTED</option>
                </LiyonSelect>
              </LiyonField>
            )}
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
          title={t("document.delete")}
          description={t("document.deleteConfirm")}
        />
        <LiyonDialogBody>
          <p className="text-sm text-muted-foreground">
            {deleteConfirmItem?.docType} - {deleteConfirmItem?.title}
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
            {t("document.delete")}
          </Button>
        </LiyonDialogFooter>
      </LiyonDialog>
    </div>
  );
}
