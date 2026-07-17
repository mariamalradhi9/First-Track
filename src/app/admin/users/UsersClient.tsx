"use client";

import { useMemo, useState, useTransition } from "react";
import clsx from "clsx";
import { DataTable, type Column } from "@/components/ui/DataTable";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { InitialsAvatar } from "@/components/InitialsAvatar";
import { useToast } from "@/components/ui/Toast";
import { useT } from "@/lib/i18n";
import { createUser, toggleUserActive, resetUserPassword } from "../actions";

const ROLES = ["HR", "HOD", "MENTOR", "INTERN", "CEO", "SUPER_ADMIN"] as const;

const ROLE_TINT: Record<string, string> = {
  HR: "bg-[#efe6ff] text-[#7c4dff]",
  HOD: "bg-[#e0f2fe] text-[#0369a1]",
  MENTOR: "bg-[#dcf5e6] text-[#1e8e5a]",
  INTERN: "bg-[#fff3d6] text-[#b8860b]",
  CEO: "bg-[#fbe6ee] text-[#c2185b]",
  SUPER_ADMIN: "bg-wine/10 text-wine",
};

function RoleBadge({ role, label }: { role: string; label: string }) {
  return (
    <span className={clsx("inline-flex items-center h-6 px-2.5 rounded-full text-[11px] font-semibold tracking-[0.4px] whitespace-nowrap", ROLE_TINT[role] ?? "bg-field-bg text-text-2")}>
      {label}
    </span>
  );
}

interface Row {
  id: string;
  cprId: string;
  name: string;
  email: string | null;
  role: string;
  department: string;
  isActive: boolean;
}

interface Dept {
  id: string;
  nameEn: string;
}

const TABS = ["ALL", "ACTIVE", "INACTIVE"] as const;
type Tab = (typeof TABS)[number];

export function UsersClient({ rows: initialRows, departments }: { rows: Row[]; departments: Dept[] }) {
  const t = useT();
  const { push } = useToast();
  const [rows, setRows] = useState(initialRows);
  const [tab, setTab] = useState<Tab>("ALL");
  const [open, setOpen] = useState(false);
  const [cprId, setCprId] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [role, setRole] = useState<(typeof ROLES)[number]>("HR");
  const [departmentId, setDepartmentId] = useState("");
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [resetTarget, setResetTarget] = useState<Row | null>(null);
  const [resetPassword, setResetPassword] = useState<string | null>(null);
  const [resetPending, startResetTransition] = useTransition();

  const counts = useMemo(
    () => ({
      ALL: rows.length,
      ACTIVE: rows.filter((r) => r.isActive).length,
      INACTIVE: rows.filter((r) => !r.isActive).length,
    }),
    [rows]
  );

  const filtered = useMemo(() => {
    if (tab === "ALL") return rows;
    return rows.filter((r) => (tab === "ACTIVE" ? r.isActive : !r.isActive));
  }, [rows, tab]);

  function handleAdd() {
    if (!cprId.trim() || !name.trim()) return;
    setError(null);
    startTransition(async () => {
      try {
        await createUser({ cprId, name, email, phone, role, departmentId: departmentId || null });
        push(`${name} added.`, "success");
        setOpen(false);
        setCprId("");
        setName("");
        setEmail("");
        setPhone("");
        setRole("HR");
        setDepartmentId("");
        window.location.reload();
      } catch (e) {
        setError(e instanceof Error ? e.message : "Failed to add user.");
      }
    });
  }

  function handleReset() {
    if (!resetTarget) return;
    startResetTransition(async () => {
      const result = await resetUserPassword(resetTarget.id);
      setResetPassword(result.password);
    });
  }

  function closeResetModal() {
    setResetTarget(null);
    setResetPassword(null);
  }

  function handleToggle(row: Row) {
    startTransition(async () => {
      await toggleUserActive(row.id, !row.isActive);
      setRows((rs) => rs.map((r) => (r.id === row.id ? { ...r, isActive: !r.isActive } : r)));
      push(`${row.name} ${row.isActive ? "deactivated" : "activated"}.`, "info");
    });
  }

  const columns: Column<Row>[] = [
    {
      key: "name",
      header: t("common.name"),
      render: (r) => (
        <span className="inline-flex items-center gap-3">
          <InitialsAvatar name={r.name} size={30} />
          <span className="font-medium text-text">{r.name}</span>
        </span>
      ),
    },
    { key: "cprId", header: "CPR ID", hideOnMobile: true },
    { key: "role", header: t("common.role"), render: (r) => <RoleBadge role={r.role} label={t(`role.${r.role}` as never)} /> },
    { key: "department", header: t("common.department"), hideOnMobile: true },
    {
      key: "isActive",
      header: t("common.status"),
      render: (r) => (
        <StatusBadge tone={r.isActive ? "approved" : "neutral"}>{r.isActive ? t("common.active") : t("common.inactive")}</StatusBadge>
      ),
    },
    {
      key: "actions",
      header: t("common.actions"),
      render: (r) => (
        <div className="flex flex-wrap gap-2">
          <Button
            size="sm"
            variant="ghost"
            onClick={(e) => {
              e.stopPropagation();
              setResetTarget(r);
            }}
          >
            {t("admin.users.resetPassword")}
          </Button>
          <Button
            size="sm"
            variant={r.isActive ? "destructive" : "secondary"}
            onClick={(e) => {
              e.stopPropagation();
              handleToggle(r);
            }}
          >
            {r.isActive ? t("common.deactivate") : t("common.activate")}
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <h1 className="text-[26px] sm:text-[30px] font-semibold">{t("admin.users.title")}</h1>
        <Button onClick={() => setOpen(true)} className="sm:w-auto">
          {t("admin.users.add")}
        </Button>
      </div>

      <div className="mt-6 flex flex-wrap gap-2">
        {TABS.map((tb) => (
          <button
            key={tb}
            type="button"
            onClick={() => setTab(tb)}
            className={clsx(
              "h-9 px-4 rounded-full text-[12.5px] font-semibold border transition-all duration-200",
              tab === tb
                ? "bg-wine text-wine-btn-text border-wine shadow-[0_10px_20px_-12px_var(--wine)]"
                : "bg-card text-text-2 border-field-line hover:border-wine hover:text-wine"
            )}
          >
            {tb === "ALL" ? t("common.all") : tb === "ACTIVE" ? t("common.active") : t("common.inactive")} · {counts[tb]}
          </button>
        ))}
      </div>

      <div className="mt-5">
        <DataTable columns={columns} rows={filtered} keyField="id" />
      </div>

      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title={t("admin.users.add")}
        footer={
          <>
            <Button variant="secondary" onClick={() => setOpen(false)}>
              {t("common.cancel")}
            </Button>
            <Button loading={pending} disabled={!cprId.trim() || !name.trim()} onClick={handleAdd}>
              {t("common.create")}
            </Button>
          </>
        }
      >
        <div className="flex flex-col gap-4">
          <Input label="CPR ID" value={cprId} onChange={(e) => setCprId(e.target.value)} />
          <Input label={t("common.name")} value={name} onChange={(e) => setName(e.target.value)} />
          <Input label={t("common.email")} type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
          <Input label={t("common.phone")} value={phone} onChange={(e) => setPhone(e.target.value)} />
          <Select label={t("common.role")} value={role} onChange={(e) => setRole(e.target.value as (typeof ROLES)[number])}>
            {ROLES.map((r) => (
              <option key={r} value={r}>
                {t(`role.${r}` as never)}
              </option>
            ))}
          </Select>
          <Select label={t("common.department")} value={departmentId} onChange={(e) => setDepartmentId(e.target.value)}>
            <option value="">—</option>
            {departments.map((d) => (
              <option key={d.id} value={d.id}>
                {d.nameEn}
              </option>
            ))}
          </Select>
          {error && <p className="text-[13px] text-status-rejected-fg">{error}</p>}
        </div>
      </Modal>

      <Modal
        open={!!resetTarget}
        onClose={closeResetModal}
        title={t("admin.users.resetPassword")}
        footer={
          resetPassword ? (
            <Button onClick={closeResetModal}>{t("common.close")}</Button>
          ) : (
            <>
              <Button variant="secondary" onClick={closeResetModal}>
                {t("common.cancel")}
              </Button>
              <Button loading={resetPending} onClick={handleReset}>
                {t("admin.users.resetPassword")}
              </Button>
            </>
          )
        }
      >
        {resetPassword ? (
          <div>
            <p className="text-[13.5px] text-text">
              {t("admin.users.resetPasswordDone")} {resetTarget?.name}.
            </p>
            <p className="mt-1 text-[12.5px] text-text-3">{t("admin.users.resetPasswordWarn")}</p>
            <div className="mt-4 p-4 rounded-input border border-status-approved-fg/30 bg-status-approved-bg/40">
              <p className="text-[11px] font-semibold uppercase tracking-[0.6px] text-text-3">{t("admin.users.newPassword")}</p>
              <p className="mt-1 text-[16px] font-mono text-text">{resetPassword}</p>
            </div>
          </div>
        ) : (
          <p className="text-[13.5px] text-text-2">
            {t("admin.users.resetPasswordConfirm")} <strong className="text-text">{resetTarget?.name}</strong>?
          </p>
        )}
      </Modal>
    </div>
  );
}
