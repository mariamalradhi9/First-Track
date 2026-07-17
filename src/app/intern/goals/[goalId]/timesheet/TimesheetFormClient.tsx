"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import BackLink from "@/components/BackLink";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Textarea } from "@/components/ui/Textarea";
import { Button } from "@/components/ui/Button";
import { useToast } from "@/components/ui/Toast";
import { useT } from "@/lib/i18n";
import { submitTimesheet } from "../../../actions";

interface Task {
  id: string;
  name: string;
}

export function TimesheetFormClient({ goalId, goalTitle, tasks }: { goalId: string; goalTitle: string; tasks: Task[] }) {
  const t = useT();
  const router = useRouter();
  const { push } = useToast();
  const today = new Date().toISOString().slice(0, 10);

  const [taskId, setTaskId] = useState(tasks[0]?.id ?? "");
  const [date, setDate] = useState(today);
  const [checkIn, setCheckIn] = useState("09:00");
  const [checkOut, setCheckOut] = useState("17:00");
  const [progressPct, setProgressPct] = useState("0");
  const [remarks, setRemarks] = useState("");
  const [pending, startTransition] = useTransition();

  const valid = date && checkIn && checkOut && checkOut > checkIn;

  function handleSubmit() {
    if (!valid) return;
    startTransition(async () => {
      await submitTimesheet(goalId, taskId || null, date, checkIn, checkOut, Number(progressPct), remarks);
      push("Timesheet submitted.", "success");
      router.push("/intern/goals");
    });
  }

  return (
    <div className="max-w-2xl mx-auto">
      <BackLink />
      <h1 className="text-[26px] sm:text-[30px] font-semibold">{t("intern.goals.submitTimesheet")}</h1>
      <p className="mt-1.5 text-[14px] text-text-2">{goalTitle}</p>

      <Card className="mt-6 p-5 sm:p-7">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {tasks.length > 0 && (
            <div className="sm:col-span-2">
              <Select label="Task" value={taskId} onChange={(e) => setTaskId(e.target.value)}>
                {tasks.map((task) => (
                  <option key={task.id} value={task.id}>
                    {task.name}
                  </option>
                ))}
              </Select>
            </div>
          )}
          <Input label={t("common.date")} type="date" value={date} onChange={(e) => setDate(e.target.value)} />
          <Input label={t("intern.goals.progressPct")} type="number" min="0" max="100" value={progressPct} onChange={(e) => setProgressPct(e.target.value)} />
          <Input label={t("intern.goals.checkIn")} type="time" value={checkIn} onChange={(e) => setCheckIn(e.target.value)} />
          <Input label={t("intern.goals.checkOut")} type="time" value={checkOut} onChange={(e) => setCheckOut(e.target.value)} />
          <div className="sm:col-span-2">
            <Textarea label={t("common.remarks")} value={remarks} onChange={(e) => setRemarks(e.target.value)} rows={3} />
          </div>
        </div>

        <Button className="mt-6" loading={pending} disabled={!valid} onClick={handleSubmit}>
          {t("common.submit")}
        </Button>
      </Card>
    </div>
  );
}
