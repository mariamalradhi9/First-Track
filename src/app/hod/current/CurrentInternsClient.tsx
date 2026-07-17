"use client";

import { useMemo, useState, useTransition } from "react";
import clsx from "clsx";
import { DataTable, type Column } from "@/components/ui/DataTable";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Textarea } from "@/components/ui/Textarea";
import { InitialsAvatar } from "@/components/InitialsAvatar";
import { useToast } from "@/components/ui/Toast";
import { useT } from "@/lib/i18n";
import { assignProjectMentor, sendInternMessage } from "../actions";

const TABS = ["ALL", "REGISTERED", "ACTIVE"] as const;
type Tab = (typeof TABS)[number];

interface Row {
  id: string;
  userId: string | null;
  name: string;
  projectName: string | null;
  mentorId: string | null;
  mentor: string | null;
  status: string;
}
interface Mentor {
  id: string;
  name: string;
}

export function CurrentInternsClient({ rows: initialRows, mentors }: { rows: Row[]; mentors: Mentor[] }) {
  const t = useT();
  const { push } = useToast();
  const [rows, setRows] = useState(initialRows);
  const [tab, setTab] = useState<Tab>("ALL");
  const [target, setTarget] = useState<Row | null>(null);
  const [projectName, setProjectName] = useState("");
  const [mentorId, setMentorId] = useState("");
  const [pending, startTransition] = useTransition();

  const [messageTarget, setMessageTarget] = useState<Row | null>(null);
  const [channel, setChannel] = useState<"EMAIL" | "WHATSAPP">("EMAIL");
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
  const [sending, startSending] = useTransition();

  const counts = useMemo(() => {
    const c: Record<Tab, number> = { ALL: rows.length, REGISTERED: 0, ACTIVE: 0 };
    for (const r of rows) if (r.status in c) c[r.status as Tab]++;
    return c;
  }, [rows]);

  const filteredRows = useMemo(() => (tab === "ALL" ? rows : rows.filter((r) => r.status === tab)), [rows, tab]);

  function openAssign(row: Row) {
    setTarget(row);
    setProjectName(row.projectName ?? "");
    setMentorId(row.mentorId ?? "");
  }

  function handleAssign() {
    if (!target || !projectName || !mentorId) return;
    startTransition(async () => {
      await assignProjectMentor(target.id, projectName, mentorId);
      const mentorName = mentors.find((m) => m.id === mentorId)?.name ?? null;
      setRows((rs) => rs.map((r) => (r.id === target.id ? { ...r, projectName, mentorId, mentor: mentorName, status: "ACTIVE" } : r)));
      push(`${target.name} — project and mentor assigned.`, "success");
      setTarget(null);
    });
  }

  function openMessage(row: Row) {
    setMessageTarget(row);
    setChannel("EMAIL");
    setSubject("");
    setBody("");
  }

  function handleSend() {
    if (!messageTarget?.userId || !body.trim()) return;
    startSending(async () => {
      await sendInternMessage(messageTarget.userId!, channel, subject, body);
      push(`Message queued to ${messageTarget.name} via ${t(`channel.${channel}` as never)}.`, "success");
      setMessageTarget(null);
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
    {
      key: "projectName",
      header: t("common.project"),
      render: (r) =>
        r.projectName ? (
          <span className="inline-flex items-center h-6 px-2.5 rounded-full text-[11.5px] font-medium bg-[#e0f2fe] text-[#0369a1]">{r.projectName}</span>
        ) : (
          <span className="text-text-3">—</span>
        ),
    },
    { key: "mentor", header: t("common.mentor"), hideOnMobile: true, render: (r) => r.mentor ?? "—" },
    { key: "status", header: t("common.status"), render: (r) => <StatusBadge status={r.status}>{t(`status.${r.status}` as never)}</StatusBadge> },
    {
      key: "actions",
      header: t("common.actions"),
      render: (r) => (
        <div className="flex gap-2">
          <Button size="sm" variant="secondary" onClick={(e) => { e.stopPropagation(); openAssign(r); }}>
            {t("common.assign")}
          </Button>
          <Button size="sm" variant="ghost" disabled={!r.userId} onClick={(e) => { e.stopPropagation(); openMessage(r); }}>
            {t("common.message")}
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="max-w-6xl mx-auto">
      <h1 className="text-[26px] sm:text-[30px] font-semibold">{t("hod.current.title")}</h1>
      <p className="mt-1.5 text-[14px] text-text-2">{t("hod.current.lede")}</p>

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
            {tb === "ALL" ? t("common.all") : t(`status.${tb}` as never)} · {counts[tb]}
          </button>
        ))}
      </div>

      <div className="mt-5">
        <DataTable columns={columns} rows={filteredRows} keyField="id" />
      </div>

      <Modal
        open={!!target}
        onClose={() => setTarget(null)}
        title={t("hod.current.assignTitle")}
        footer={
          <>
            <Button variant="secondary" onClick={() => setTarget(null)}>
              {t("common.cancel")}
            </Button>
            <Button loading={pending} disabled={!projectName || !mentorId} onClick={handleAssign}>
              {t("common.assign")}
            </Button>
          </>
        }
      >
        <div className="flex flex-col gap-4">
          <Input label={t("common.project")} value={projectName} onChange={(e) => setProjectName(e.target.value)} />
          <Select label={t("common.mentor")} value={mentorId} onChange={(e) => setMentorId(e.target.value)}>
            <option value="" disabled>
              {t("common.mentor")}
            </option>
            {mentors.map((m) => (
              <option key={m.id} value={m.id}>
                {m.name}
              </option>
            ))}
          </Select>
        </div>
      </Modal>

      <Modal
        open={!!messageTarget}
        onClose={() => setMessageTarget(null)}
        title={`${t("common.message")} — ${messageTarget?.name ?? ""}`}
        footer={
          <>
            <Button variant="secondary" onClick={() => setMessageTarget(null)}>
              {t("common.cancel")}
            </Button>
            <Button loading={sending} disabled={!body.trim()} onClick={handleSend}>
              {t("common.send")}
            </Button>
          </>
        }
      >
        <div className="flex flex-col gap-4">
          <Select label={t("common.channel")} value={channel} onChange={(e) => setChannel(e.target.value as "EMAIL" | "WHATSAPP")}>
            <option value="EMAIL">{t("channel.EMAIL")}</option>
            <option value="WHATSAPP">{t("channel.WHATSAPP")}</option>
          </Select>
          {channel === "EMAIL" && (
            <Input label={t("common.subject")} value={subject} onChange={(e) => setSubject(e.target.value)} />
          )}
          <Textarea label={t("common.message")} value={body} onChange={(e) => setBody(e.target.value)} rows={5} />
        </div>
      </Modal>
    </div>
  );
}
