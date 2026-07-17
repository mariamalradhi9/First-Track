"use client";

import { useState, useTransition } from "react";
import { DataTable, type Column } from "@/components/ui/DataTable";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { InitialsAvatar } from "@/components/InitialsAvatar";
import { useToast } from "@/components/ui/Toast";
import { useT } from "@/lib/i18n";
import { createTrainingTopic } from "../actions";

interface Row {
  id: string;
  nameEn: string;
  nameAr: string;
  department: string;
}

interface Dept {
  id: string;
  nameEn: string;
}

export function TopicsClient({ rows, departments }: { rows: Row[]; departments: Dept[] }) {
  const t = useT();
  const { push } = useToast();
  const [open, setOpen] = useState(false);
  const [nameEn, setNameEn] = useState("");
  const [nameAr, setNameAr] = useState("");
  const [departmentId, setDepartmentId] = useState("");
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  function handleAdd() {
    if (!nameEn.trim() || !nameAr.trim()) return;
    setError(null);
    startTransition(async () => {
      try {
        await createTrainingTopic(nameEn, nameAr, departmentId || null);
        push(`"${nameEn}" added.`, "success");
        setOpen(false);
        setNameEn("");
        setNameAr("");
        setDepartmentId("");
        window.location.reload();
      } catch (e) {
        setError(e instanceof Error ? e.message : "Failed to add topic.");
      }
    });
  }

  const columns: Column<Row>[] = [
    {
      key: "nameEn",
      header: "Name (EN)",
      render: (r) => (
        <span className="inline-flex items-center gap-3">
          <InitialsAvatar name={r.nameEn} size={30} />
          <span className="font-medium text-text">{r.nameEn}</span>
        </span>
      ),
    },
    { key: "nameAr", header: "Name (AR)" },
    {
      key: "department",
      header: t("common.department"),
      hideOnMobile: true,
      render: (r) => <span className="inline-flex items-center h-6 px-2.5 rounded-full text-[11.5px] font-medium bg-[#e0f2fe] text-[#0369a1]">{r.department}</span>,
    },
  ];

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <h1 className="text-[26px] sm:text-[30px] font-semibold">{t("admin.topics.title")}</h1>
        <Button onClick={() => setOpen(true)} className="sm:w-auto">
          {t("admin.topics.add")}
        </Button>
      </div>

      <div className="mt-5">
        <DataTable columns={columns} rows={rows} keyField="id" />
      </div>

      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title={t("admin.topics.add")}
        footer={
          <>
            <Button variant="secondary" onClick={() => setOpen(false)}>
              {t("common.cancel")}
            </Button>
            <Button loading={pending} disabled={!nameEn.trim() || !nameAr.trim()} onClick={handleAdd}>
              {t("common.create")}
            </Button>
          </>
        }
      >
        <div className="flex flex-col gap-4">
          <Input label="Name (English)" value={nameEn} onChange={(e) => setNameEn(e.target.value)} />
          <Input label="Name (Arabic)" value={nameAr} onChange={(e) => setNameAr(e.target.value)} dir="rtl" />
          <Select label={t("common.department")} value={departmentId} onChange={(e) => setDepartmentId(e.target.value)}>
            <option value="">{t("admin.topics.allDepartments")}</option>
            {departments.map((d) => (
              <option key={d.id} value={d.id}>
                {d.nameEn}
              </option>
            ))}
          </Select>
          {error && <p className="text-[13px] text-status-rejected-fg">{error}</p>}
        </div>
      </Modal>
    </div>
  );
}
