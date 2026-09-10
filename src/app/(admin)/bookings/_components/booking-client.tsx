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
} from "@/shared/components/liyon";
import { Button } from "@/components/ui/button";
import type { BookingDto } from "@/features/booking/server";
import {
  saveBookingAction,
  deleteBookingAction,
} from "@/features/booking/actions";

interface Props {
  initialItems: BookingDto[];
  facilities: { id: string; name: string }[];
  canManage: boolean;
}

export function BookingClient({ initialItems, facilities, canManage }: Props) {
  const t = useT();
  const [items, setItems] = useState<BookingDto[]>(initialItems);
  const [isPending, startTransition] = useTransition();

  const [modalOpen, setModalOpen] = useState(false);
  const [deleteConfirmItem, setDeleteConfirmItem] = useState<BookingDto | null>(null);
  const [editingItem, setEditingItem] = useState<BookingDto | null>(null);
  
  const [formFacilityId, setFormFacilityId] = useState("");
  const [formPurpose, setFormPurpose] = useState("");
  const [formStartTime, setFormStartTime] = useState("");
  const [formEndTime, setFormEndTime] = useState("");
  const [formStatus, setFormStatus] = useState<"PENDING" | "APPROVED" | "REJECTED">("PENDING");

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
        let tone = "neutral";
        if (row.status === "APPROVED") tone = "positive";
        if (row.status === "REJECTED") tone = "danger";
        // @ts-ignore
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
        {/* @ts-ignore */}
        <DataTable<BookingDto>
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
                      {t("booking.edit")}
                    </RowMenuItem>
                    {/* @ts-ignore */}
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

      {/* @ts-ignore */}
      <LiyonDialog open={modalOpen} onOpenChange={setModalOpen}>
        <LiyonDialogHeader
          title={editingItem ? t("booking.edit") : t("booking.create")}
          description={t("booking.subtitle")}
        />
        <LiyonDialogBody>
          <div className="grid gap-4 py-4 md:grid-cols-2">
            <div className="col-span-2">
              <label className="text-sm font-medium">{t("booking.facilityField")}</label>
              <select
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                value={formFacilityId}
                onChange={(e) => setFormFacilityId(e.target.value)}
              >
                <option value="">-- เลือกสถานที่/ยานพาหนะ --</option>
                {facilities.map((f) => (
                  <option key={f.id} value={f.id}>{f.name}</option>
                ))}
              </select>
            </div>
            <div className="col-span-2">
              <label className="text-sm font-medium">{t("booking.purposeField")}</label>
              <input
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                value={formPurpose}
                onChange={(e) => setFormPurpose(e.target.value)}
              />
            </div>
            <div className="col-span-1">
              <label className="text-sm font-medium">{t("booking.startTimeField")}</label>
              <input
                type="datetime-local"
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                value={formStartTime}
                onChange={(e) => setFormStartTime(e.target.value)}
              />
            </div>
            <div className="col-span-1">
              <label className="text-sm font-medium">{t("booking.endTimeField")}</label>
              <input
                type="datetime-local"
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                value={formEndTime}
                onChange={(e) => setFormEndTime(e.target.value)}
              />
            </div>
            {editingItem && (
              <div className="col-span-2">
                <label className="text-sm font-medium">{t("booking.statusField")}</label>
                <select
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  value={formStatus}
                  onChange={(e) => setFormStatus(e.target.value as any)}
                >
                  <option value="PENDING">PENDING</option>
                  <option value="APPROVED">APPROVED</option>
                  <option value="REJECTED">REJECTED</option>
                </select>
              </div>
            )}
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
            {t("sample.cancel")}
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
