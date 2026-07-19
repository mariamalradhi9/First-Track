"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { DataTable, type Column } from "@/components/ui/DataTable";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Textarea } from "@/components/ui/Textarea";
import { InitialsAvatar } from "@/components/InitialsAvatar";
import { useToast } from "@/components/ui/Toast";
import { useT } from "@/lib/i18n";
import { addGoal } from "../actions";

interface Row {
  id: string;
  name: string;
  projectName: string | null;
  goalCount: number;
}

const GOAL_TYPES = ["Project Milestone", "Skill Development", "Process Improvement", "Documentation"];

export function GoalsClient({ rows: initialRows }: { rows: Row[] }) {
  const t = useT();
  const router = useRouter();
  const { push } = useToast();
  const [rows, setRows] = useState(initialRows);
  const [target, setTarget] = useState<Row | null>(null);
  const [goalType, setGoalType] = useState(GOAL_TYPES[0]);
  const [goalName, setGoalName] = useState("");
  const [targetDate, setTargetDate] = useState("");
  const [remarks, setRemarks] = useState("");
  const [pending, startTransition] = useTransition();

  function handleAdd() {
    if (!target || !goalName) return;
    startTransition(async () => {
      await addGoal(target.id, goalType, goalName, targetDate || null, remarks);
      setRows((rs) => rs.map((r) => (r.id === target.id ? { ...r, goalCount: r.goalCount + 1, projectName: goalName } : r)));
      push(`Goal added for ${target.name}.`, "success");
      setTarget(null);
      setGoalName("");
      setTargetDate("");
      setRemarks("");
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
    { key: "goalCount", header: "Goals" },
    {
      key: "actions",
      header: t("common.actions"),
      render: (r) => (
        <div className="flex flex-wrap gap-2">
          <Button size="sm" variant="secondary" onClick={(e) => { e.stopPropagation(); setTarget(r); }}>
            {t("mentor.goals.addGoal")}
          </Button>
          <Button size="sm" variant="ghost" onClick={(e) => { e.stopPropagation(); router.push(`/mentor/goals/${r.id}`); }}>
            {t("mentor.goals.viewGoals")}
          </Button>
          <Button size="sm" variant="ghost" onClick={(e) => { e.stopPropagation(); router.push(`/mentor/goals/${r.id}/timesheets`); }}>
            {t("mentor.goals.viewTimesheets")}
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="max-w-6xl mx-auto">
      <h1 className="text-[26px] sm:text-[30px] font-semibold">{t("mentor.goals.title")}</h1>
      <p className="mt-1.5 text-[14px] text-text-2">{t("mentor.goals.lede")}</p>
      <div className="mt-5">
        <DataTable columns={columns} rows={rows} keyField="id" />
      </div>

      <Modal
        open={!!target}
        onClose={() => setTarget(null)}
        title={`${t("mentor.goals.addGoal")} — ${target?.name ?? ""}`}
        footer={
          <>
            <Button variant="secondary" onClick={() => setTarget(null)}>
              {t("common.cancel")}
            </Button>
            <Button loading={pending} disabled={!goalName} onClick={handleAdd}>
              {t("common.create")}
            </Button>
          </>
        }
      >
        <div className="flex flex-col gap-4">
          <Select label={t("mentor.goals.goalType")} value={goalType} onChange={(e) => setGoalType(e.target.value)}>
            {GOAL_TYPES.map((g) => (
              <option key={g} value={g}>
                {g}
              </option>
            ))}
          </Select>
          <Input label={t("mentor.goals.goalName")} value={goalName} onChange={(e) => setGoalName(e.target.value)} />
          <Input label={t("mentor.goals.targetDate")} type="date" value={targetDate} onChange={(e) => setTargetDate(e.target.value)} />
          <Textarea label={t("common.remarks")} value={remarks} onChange={(e) => setRemarks(e.target.value)} rows={3} />
        </div>
      </Modal>
    </div>
  );
}
