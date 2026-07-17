"use client";

import { useState, useTransition } from "react";
import { format } from "date-fns";
import BackLink from "@/components/BackLink";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { useToast } from "@/components/ui/Toast";
import { InitialsAvatar } from "@/components/InitialsAvatar";
import { useT } from "@/lib/i18n";
import { addTaskToGoal, updateTask } from "../../actions";

interface Task {
  id: string;
  name: string;
  description: string | null;
  startDate: string | null;
  endDate: string | null;
}
interface Goal {
  id: string;
  title: string;
  goalType: string;
  status: string;
  tasks: Task[];
}

interface FormState {
  mode: "add" | "edit";
  goalId: string;
  taskId?: string;
  name: string;
  description: string;
  startDate: string;
  endDate: string;
}

export function GoalDetailClient({ internName, goals: initialGoals }: { internName: string; goals: Goal[] }) {
  const t = useT();
  const { push } = useToast();
  const [goals, setGoals] = useState(initialGoals);
  const [form, setForm] = useState<FormState | null>(null);
  const [pending, startTransition] = useTransition();

  function openAdd(goalId: string) {
    setForm({ mode: "add", goalId, name: "", description: "", startDate: "", endDate: "" });
  }

  function openEdit(goalId: string, task: Task) {
    setForm({
      mode: "edit",
      goalId,
      taskId: task.id,
      name: task.name,
      description: task.description ?? "",
      startDate: task.startDate ? task.startDate.slice(0, 10) : "",
      endDate: task.endDate ? task.endDate.slice(0, 10) : "",
    });
  }

  function handleSave() {
    if (!form || !form.name.trim()) return;
    startTransition(async () => {
      if (form.mode === "add") {
        await addTaskToGoal(form.goalId, form.name, form.description, form.startDate || null, form.endDate || null);
        setGoals((gs) =>
          gs.map((g) =>
            g.id === form.goalId
              ? {
                  ...g,
                  tasks: [
                    ...g.tasks,
                    {
                      id: `temp-${Date.now()}`,
                      name: form.name,
                      description: form.description || null,
                      startDate: form.startDate || null,
                      endDate: form.endDate || null,
                    },
                  ],
                }
              : g
          )
        );
        push("Task added.", "success");
      } else {
        await updateTask(form.taskId!, form.name, form.description, form.startDate || null, form.endDate || null);
        setGoals((gs) =>
          gs.map((g) =>
            g.id === form.goalId
              ? {
                  ...g,
                  tasks: g.tasks.map((tk) =>
                    tk.id === form.taskId
                      ? { ...tk, name: form.name, description: form.description || null, startDate: form.startDate || null, endDate: form.endDate || null }
                      : tk
                  ),
                }
              : g
          )
        );
        push("Task updated.", "success");
      }
      setForm(null);
    });
  }

  return (
    <div className="max-w-3xl mx-auto">
      <BackLink />
      <div className="flex items-center gap-3.5">
        <InitialsAvatar name={internName} size={44} />
        <h1 className="text-[24px] sm:text-[28px] font-semibold">{internName}</h1>
      </div>

      <div className="mt-5 flex flex-col gap-4">
        {goals.length === 0 && (
          <Card className="p-6 text-center text-[13.5px] text-text-3">{t("mentor.goals.noGoals")}</Card>
        )}
        {goals.map((g) => (
          <Card key={g.id} className="p-5 sm:p-6">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.6px] text-text-3">{g.goalType}</p>
                <h2 className="mt-1 text-[16px] font-semibold text-text">{g.title}</h2>
              </div>
              <Button size="sm" variant="secondary" onClick={() => openAdd(g.id)}>
                {t("mentor.goals.addTask")}
              </Button>
            </div>

            <div className="mt-4 pt-4 border-t border-line">
              <p className="text-[11px] font-semibold uppercase tracking-[0.6px] text-text-3 mb-3">
                {t("mentor.goals.tasksLabel")}
              </p>
              {g.tasks.length === 0 ? (
                <p className="text-[13px] text-text-3">{t("mentor.goals.noTasks")}</p>
              ) : (
                <div className="flex flex-col divide-y divide-line">
                  {g.tasks.map((task) => (
                    <div key={task.id} className="py-3 flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <p className="text-[13.5px] font-medium text-text">{task.name}</p>
                        {task.description && <p className="mt-0.5 text-[12.5px] text-text-2">{task.description}</p>}
                        {(task.startDate || task.endDate) && (
                          <p className="mt-0.5 text-[11.5px] text-text-3">
                            {task.startDate ? format(new Date(task.startDate), "d MMM yyyy") : "—"}
                            {" – "}
                            {task.endDate ? format(new Date(task.endDate), "d MMM yyyy") : "—"}
                          </p>
                        )}
                      </div>
                      <Button size="sm" variant="ghost" onClick={() => openEdit(g.id, task)}>
                        {t("common.edit")}
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </Card>
        ))}
      </div>

      <Modal
        open={!!form}
        onClose={() => setForm(null)}
        title={form?.mode === "add" ? t("mentor.goals.addTask") : t("mentor.goals.editTask")}
        footer={
          <>
            <Button variant="secondary" onClick={() => setForm(null)}>
              {t("common.cancel")}
            </Button>
            <Button loading={pending} disabled={!form?.name.trim()} onClick={handleSave}>
              {t("common.save")}
            </Button>
          </>
        }
      >
        {form && (
          <div className="flex flex-col gap-4">
            <Input
              label={t("mentor.goals.taskName")}
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
            <Textarea
              label={t("mentor.goals.taskDescription")}
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              rows={3}
            />
            <div className="grid grid-cols-2 gap-4">
              <Input
                label={t("mentor.goals.startDate")}
                type="date"
                value={form.startDate}
                onChange={(e) => setForm({ ...form, startDate: e.target.value })}
              />
              <Input
                label={t("mentor.goals.endDate")}
                type="date"
                value={form.endDate}
                onChange={(e) => setForm({ ...form, endDate: e.target.value })}
              />
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
