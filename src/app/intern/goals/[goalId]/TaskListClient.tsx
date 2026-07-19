"use client";

import { useState, useTransition } from "react";
import BackLink from "@/components/BackLink";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { useToast } from "@/components/ui/Toast";
import { useT } from "@/lib/i18n";
import { submitTaskLink } from "../../actions";

type SubmissionStatus = "NOT_SUBMITTED" | "SUBMITTED" | "CHANGES_REQUESTED" | "APPROVED";

interface Task {
  id: string;
  name: string;
  description: string | null;
  submissionLink: string | null;
  submissionStatus: SubmissionStatus;
  progressPct: number;
  mentorFeedback: string | null;
}

export function TaskListClient({ goalTitle, tasks: initialTasks }: { goalTitle: string; goalId: string; tasks: Task[] }) {
  const t = useT();
  const { push } = useToast();
  const [tasks, setTasks] = useState(initialTasks);
  const [links, setLinks] = useState<Record<string, string>>({});
  const [pendingId, setPendingId] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  function handleSubmit(taskId: string) {
    const link = (links[taskId] ?? "").trim();
    if (!link) return;
    setPendingId(taskId);
    startTransition(async () => {
      try {
        await submitTaskLink(taskId, link);
        setTasks((ts) =>
          ts.map((tk) => (tk.id === taskId ? { ...tk, submissionLink: link, submissionStatus: "SUBMITTED" } : tk))
        );
        push(t("intern.goals.submitted"), "success");
      } catch (e) {
        push(e instanceof Error ? e.message : "Failed to submit.", "error");
      } finally {
        setPendingId(null);
      }
    });
  }

  return (
    <div className="max-w-3xl mx-auto">
      <BackLink />
      <h1 className="text-[24px] sm:text-[28px] font-semibold">{goalTitle}</h1>

      <div className="mt-5 flex flex-col gap-4">
        {tasks.length === 0 && (
          <Card className="p-6 text-center text-[13.5px] text-text-3">{t("mentor.goals.noTasks")}</Card>
        )}
        {tasks.map((task) => {
          const canSubmit = task.submissionStatus === "NOT_SUBMITTED" || task.submissionStatus === "CHANGES_REQUESTED";
          return (
            <Card key={task.id} className="p-5 sm:p-6">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <h2 className="text-[15px] font-semibold text-text">{task.name}</h2>
                  {task.description && <p className="mt-1 text-[13px] text-text-2">{task.description}</p>}
                </div>
                <div className="flex items-center gap-2">
                  <StatusBadge status={task.submissionStatus}>{task.submissionStatus.replace("_", " ")}</StatusBadge>
                  <span className="text-[12.5px] text-text-3">{task.progressPct}%</span>
                </div>
              </div>

              {task.mentorFeedback && (
                <p className="mt-3 text-[12.5px] text-text-2 bg-field-bg rounded-input px-3 py-2">
                  {t("mentor.goals.feedback")}: {task.mentorFeedback}
                </p>
              )}

              {task.submissionLink && (
                <a
                  href={task.submissionLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-3 inline-block text-[12.5px] text-wine underline break-all"
                >
                  {task.submissionLink}
                </a>
              )}

              {canSubmit && (
                <div className="mt-4 flex flex-col sm:flex-row gap-3 items-end">
                  <div className="flex-1 w-full">
                    <Input
                      label={t("intern.goals.submissionLink")}
                      placeholder="https://..."
                      value={links[task.id] ?? ""}
                      onChange={(e) => setLinks((ls) => ({ ...ls, [task.id]: e.target.value }))}
                    />
                  </div>
                  <Button
                    loading={pending && pendingId === task.id}
                    disabled={!(links[task.id] ?? "").trim()}
                    onClick={() => handleSubmit(task.id)}
                    className="sm:w-auto"
                  >
                    {t("intern.goals.submitWork")}
                  </Button>
                </div>
              )}
            </Card>
          );
        })}
      </div>
    </div>
  );
}
