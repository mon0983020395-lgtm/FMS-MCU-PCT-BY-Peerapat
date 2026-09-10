"use client";

import { useState, useTransition } from "react";
import { Plus, Edit2, Trash2, Users, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import { useT, useLocale } from "@/shared/lib/i18n/client";
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
import type { PersonnelDto } from "@/features/personnel";
import {
  savePersonnelAction,
  deletePersonnelAction,
} from "@/features/personnel/actions";

interface Props {
  initialItems: PersonnelDto[];
  canManage: boolean;
}

export function PersonnelClient({ initialItems, canManage }: Props) {
  const t = useT();
  const [items, setItems] = useState<PersonnelDto[]>(initialItems);
  const [isPending, startTransition] = useTransition();

  const [modalOpen, setModalOpen] = useState(false);
  const [deleteConfirmItem, setDeleteConfirmItem] = useState<PersonnelDto | null>(null);
  const [editingItem, setEditingItem] = useState<PersonnelDto | null>(null);
  
  const [formFirstName, setFormFirstName] = useState("");
  const [formLastName, setFormLastName] = useState("");
  const [formPosition, setFormPosition] = useState("");
  const [formDepartment, setFormDepartment] = useState("");
  const [formEmail, setFormEmail] = useState("");
  const [formPhone, setFormPhone] = useState("");
  const [formActive, setFormActive] = useState(true);

  const openCreateDialog = () => {
    setEditingItem(null);
    setFormFirstName("");
    setFormLastName("");
    setFormPosition("");
    setFormDepartment("");
    setFormEmail("");
    setFormPhone("");
    setFormActive(true);
    setModalOpen(true);
  };

  const openEditDialog = (item: PersonnelDto) => {
    setEditingItem(item);
    setFormFirstName(item.firstName);
    setFormLastName(item.lastName);
    setFormPosition(item.position || "");
    setFormDepartment(item.department || "");
    setFormEmail(item.email || "");
    setFormPhone(item.phone || "");
    setFormActive(item.isActive);
    setModalOpen(true);
  };

  const handleSave = () => {
    if (!formFirstName.trim() || !formLastName.trim()) {
      toast.error(t("error.validation"));
      return;
    }

    startTransition(async () => {
      const res = await savePersonnelAction({
        id: editingItem?.id,
        firstName: formFirstName.trim(),
        lastName: formLastName.trim(),
        position: formPosition.trim() || undefined,
        department: formDepartment.trim() || undefined,
        email: formEmail.trim() || undefined,
        phone: formPhone.trim() || undefined,
        isActive: formActive,
      });
      if (res.ok) {
        toast.success(editingItem ? t("personnel.updateSuccess") : t("personnel.createSuccess"));
        setModalOpen(false);
        window.location.reload();
      } else {
        toast.error(t("common.error"));
      }
    });
  };

  const handleDelete = (item: PersonnelDto) => {
    startTransition(async () => {
      const res = await deletePersonnelAction(item.id);
      if (res.ok) {
        toast.success(t("personnel.deleteSuccess"));
        setDeleteConfirmItem(null);
        window.location.reload();
      } else {
        toast.error(t("common.error"));
      }
    });
  };

  const columns: DataTableColumn<PersonnelDto>[] = [
    {
      key: "name",
      header: t("personnel.nameField"),
      render: (row) => <span className="font-medium text-foreground">{row.firstName} {row.lastName}</span>,
    },
    {
      key: "position",
      header: t("personnel.positionField"),
      render: (row) => <span className="text-muted-foreground text-sm">{row.position || "—"}</span>,
    },
    {
      key: "department",
      header: t("personnel.departmentField"),
      render: (row) => <span className="text-muted-foreground text-sm">{row.department || "—"}</span>,
    },
    {
      key: "status",
      header: t("personnel.statusField"),
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
          <h1 className="text-2xl font-bold tracking-tight">{t("personnel.title")}</h1>
          <p className="text-sm text-muted-foreground">{t("personnel.subtitle")}</p>
        </div>
        {canManage && (
          <Button onClick={openCreateDialog} className="gap-2">
            <Plus className="h-4 w-4" />
            {t("personnel.create")}
          </Button>
        )}
      </div>

      <LiyonCard>
        {/* @ts-ignore */}
        <DataTable<PersonnelDto>
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
                      {t("personnel.edit")}
                    </RowMenuItem>
                    {/* @ts-ignore */}
                    <RowMenuItem onSelect={() => setDeleteConfirmItem(row)} danger icon={<Trash2 className="h-4 w-4" />}>
                      {t("personnel.delete")}
                    </RowMenuItem>
                  </>
                )
              : undefined
          }
          empty={{
            icon: <Users className="h-10 w-10 text-muted-foreground/50" />,
            title: t("personnel.empty"),
            description: t("personnel.subtitle"),
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
          title={editingItem ? t("personnel.edit") : t("personnel.create")}
          description={t("personnel.subtitle")}
        />
        <LiyonDialogBody>
          <div className="grid gap-4 py-4 md:grid-cols-2">
            <div className="col-span-1">
              <label className="text-sm font-medium">{t("personnel.firstNameField")}</label>
              <input
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                value={formFirstName}
                onChange={(e) => setFormFirstName(e.target.value)}
              />
            </div>
            <div className="col-span-1">
              <label className="text-sm font-medium">{t("personnel.lastNameField")}</label>
              <input
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                value={formLastName}
                onChange={(e) => setFormLastName(e.target.value)}
              />
            </div>
            <div className="col-span-2">
              <label className="text-sm font-medium">{t("personnel.positionField")}</label>
              <input
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                value={formPosition}
                onChange={(e) => setFormPosition(e.target.value)}
              />
            </div>
            <div className="col-span-2">
              <label className="text-sm font-medium">{t("personnel.departmentField")}</label>
              <input
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                value={formDepartment}
                onChange={(e) => setFormDepartment(e.target.value)}
              />
            </div>
            <div className="col-span-1">
              <label className="text-sm font-medium">{t("personnel.emailField")}</label>
              <input
                type="email"
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                value={formEmail}
                onChange={(e) => setFormEmail(e.target.value)}
              />
            </div>
            <div className="col-span-1">
              <label className="text-sm font-medium">{t("personnel.phoneField")}</label>
              <input
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                value={formPhone}
                onChange={(e) => setFormPhone(e.target.value)}
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
          title={t("personnel.delete")}
          description={t("personnel.deleteConfirm")}
        />
        <LiyonDialogBody>
          <p className="text-sm text-muted-foreground">
            {deleteConfirmItem?.firstName} {deleteConfirmItem?.lastName}
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
            {t("personnel.delete")}
          </Button>
        </LiyonDialogFooter>
      </LiyonDialog>
    </div>
  );
}
