"use client";

import { useState, useTransition } from "react";
import { Plus, Edit2, Trash2, Calendar, AlertCircle } from "lucide-react";
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
import type { BookingDto, FacilityDto } from "@/features/booking";
import {
  saveBookingAction,
  deleteBookingAction,
} from "@/features/booking/actions";

interface Props {
  initialItems: BookingDto[];
  facilities: FacilityDto[];
  canManage: boolean;
}

export function BookingClient({ initialItems, facilities, canManage }: Props) {
  const t = useT();
  const [isPending, startTransition] = useTransition();

  const [modalOpen, setModalOpen] = useState(false);
  const [deleteConfirmItem, setDeleteConfirmItem] = useState<BookingDto | null>(null);
  const [editingItem, setEditingItem] = useState<BookingDto | null>(null);
  
  const [formFacilityId, setFormFacilityId] = useState("");
  const [formPurpose, setFormPurpose] = useState("");
  const [formStartTime, setFormStartTime] = useState("");
  const [formEndTime, setFormEndTime] = useState("");
  const [formStatus, setFormStatus] = useState<"PENDING" | "APPROVED" | "REJECTED" | "CANCELLED">("PENDING");

  const openCreateDialog = () => {
    setEditingItem(null);
    setFormFacilityId(facilities[0]?.id || "");
    setFormPurpose("");
    setFormStartTime("");
    setFormEndTime("");
    setFormStatus("PENDING");
    setModalOpen(true);
  };

  const openEditDialog = (item: BookingDto) => {
    setEditingItem(item);
    setFormFacilityId(item.facilityId);
    setFormPurpose(item.purpose);
    setFormStartTime(new Date(item.startTime).toISOString().slice(0, 16));
    setFormEndTime(new Date(item.endTime).toISOString().slice(0, 16));
    setFormStatus(item.status);
    setModalOpen(true);
  };

  const handleSave = () => {
    if (!formFacilityId || !formPurpose.trim() || !formStartTime || !formEndTime) {
      toast.error(t("error.validation"));
      return;
    }

    startTransition(async () => {
      const res = await saveBookingAction({
        id: editingItem?.id,
        facilityId: formFacilityId,
        purpose: formPurpose.trim(),
        startTime: new Date(formStartTime).toISOString(),
        endTime: new Date(formEndTime).toISOString(),
        status: formStatus,
      });
      if (res.ok) {
        toast.success(editingItem ? t("booking.updateSuccess") : t("booking.createSuccess"));
        setModalOpen(false);
        window.location.reload();
      } else {
        toast.error(t("common.error"));
      }
    });
  };

  const handleDelete = (item: BookingDto) => {
    startTransition(async () => {
      const res = await deleteBookingAction(item.id);
      if (res.ok) {
        toast.success(t("booking.deleteSuccess"));
        setDeleteConfirmItem(null);
        window.location.reload();
      } else {
        toast.error(t("common.error"));
      }
    });
  };

  const columns: DataTableColumn<BookingDto>[] = [
    {
      key: "facility",
      header: t("booking.facilityField"),
      render: (row) => <span className="font-medium">{row.facilityName || "—"}</span>,
    },
    {
      key: "purpose",
      header: t("booking.purposeField"),
      render: (row) => <span>{row.purpose}</span>,
    },
    {
      key: "time",
      header: "เวลา",
      render: (row) => (
        <span className="text-muted-foreground text-sm">
          {new Date(row.startTime).toLocaleString("th-TH")} - {new Date(row.endTime).toLocaleString("th-TH")}
        </span>
      ),
    },
    {
      key: "status",
      header: t("booking.statusField"),
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
          <h1 className="text-2xl font-bold tracking-tight">{t("booking.title")}</h1>
          <p className="text-sm text-muted-foreground">{t("booking.subtitle")}</p>
        </div>
        {canManage && (
          <Button onClick={openCreateDialog} className="gap-2">
            <Plus className="h-4 w-4" />
            {t("booking.create")}
          </Button>
        )}
      </div>

      <LiyonCard>
        <DataTable<BookingDto>
          state={initialItems.length === 0 ? "empty" : "data"}
          rows={initialItems}
          columns={columns}
          getRowId={(row) => row.id}
          headHeading={t("booking.title")}
          renderRowMenu={
            canManage
              ? (row) => (
                  <>
                    <RowMenuItem onSelect={() => openEditDialog(row)} icon={<Edit2 className="h-4 w-4" />}>
                      {t("booking.edit")}
                    </RowMenuItem>
                    <RowMenuItem onSelect={() => setDeleteConfirmItem(row)} danger icon={<Trash2 className="h-4 w-4" />}>
                      {t("booking.delete")}
                    </RowMenuItem>
                  </>
                )
              : undefined
          }
          empty={{
            icon: <Calendar className="h-10 w-10 text-muted-foreground/50" />,
            title: t("booking.empty"),
            description: t("booking.subtitle"),
          }}
          error={{
            icon: <AlertCircle className="h-10 w-10 text-danger" />,
            title: t("common.error"),
          }}
        />
      </LiyonCard>

      <LiyonDialog open={modalOpen} onOpenChange={setModalOpen}>
        <LiyonDialogHeader
          title={editingItem ? t("booking.edit") : t("booking.create")}
          description={t("booking.subtitle")}
        />
        <LiyonDialogBody>
          <div className="grid gap-4 py-4 md:grid-cols-2">
            <div className="col-span-2">
              <LiyonField label={t("booking.facilityField")}>
                <LiyonSelect
                  value={formFacilityId}
                  onChange={(e) => setFormFacilityId(e.target.value)}
                >
                  <option value="">-- เลือกสถานที่/ยานพาหนะ --</option>
                  {facilities.map((f) => (
                    <option key={f.id} value={f.id}>{f.name}</option>
                  ))}
                </LiyonSelect>
              </LiyonField>
            </div>
            <div className="col-span-2">
              <LiyonField label={t("booking.purposeField")}>
                <input
                  className="liyon-input"
                  value={formPurpose}
                  onChange={(e) => setFormPurpose(e.target.value)}
                />
              </LiyonField>
            </div>
            <div className="col-span-1">
              <LiyonField label={t("booking.startTimeField")}>
                <input
                  type="datetime-local"
                  className="liyon-input"
                  value={formStartTime}
                  onChange={(e) => setFormStartTime(e.target.value)}
                />
              </LiyonField>
            </div>
            <div className="col-span-1">
              <LiyonField label={t("booking.endTimeField")}>
                <input
                  type="datetime-local"
                  className="liyon-input"
                  value={formEndTime}
                  onChange={(e) => setFormEndTime(e.target.value)}
                />
              </LiyonField>
            </div>
            {editingItem && (
              <div className="col-span-2">
                <LiyonField label={t("booking.statusField")}>
                  <LiyonSelect
                    value={formStatus}
                    onChange={(e) => setFormStatus(e.target.value as "PENDING" | "APPROVED" | "REJECTED")}
                  >
                    <option value="PENDING">PENDING</option>
                    <option value="APPROVED">APPROVED</option>
                    <option value="REJECTED">REJECTED</option>
                  </LiyonSelect>
                </LiyonField>
              </div>
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
          title={t("booking.delete")}
          description={t("booking.deleteConfirm")}
        />
        <LiyonDialogBody>
          <p className="text-sm text-muted-foreground">
            {deleteConfirmItem?.purpose}
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
            {t("booking.delete")}
          </Button>
        </LiyonDialogFooter>
      </LiyonDialog>
    </div>
  );
}
