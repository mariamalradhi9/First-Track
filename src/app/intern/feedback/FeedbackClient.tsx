"use client";

import { useState, useTransition } from "react";
import { Card } from "@/components/ui/Card";
import { Textarea } from "@/components/ui/Textarea";
import { Select } from "@/components/ui/Select";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { useToast } from "@/components/ui/Toast";
import { useT } from "@/lib/i18n";
import { submitPostInternshipFeedback } from "../actions";

const QUESTIONS = [
  { key: "overallExperience", label: "How would you rate your overall internship experience?", type: "select", options: ["Excellent", "Good", "Average", "Poor"] },
  { key: "mentorSupport", label: "How supportive was your mentor?", type: "select", options: ["Excellent", "Good", "Average", "Poor"] },
  { key: "skillsGained", label: "What skills did you gain during this internship?", type: "textarea" },
  { key: "suggestions", label: "Any suggestions for improving the program?", type: "textarea" },
];

export function FeedbackClient({ eligible, alreadySubmitted }: { eligible: boolean; alreadySubmitted: boolean }) {
  const t = useT();
  const { push } = useToast();
  const [values, setValues] = useState<Record<string, string>>(Object.fromEntries(QUESTIONS.map((q) => [q.key, ""])));
  const [submitted, setSubmitted] = useState(alreadySubmitted);
  const [pending, startTransition] = useTransition();

  const allFilled = QUESTIONS.every((q) => values[q.key]?.trim());

  function handleSubmit() {
    if (!allFilled) return;
    startTransition(async () => {
      await submitPostInternshipFeedback(values);
      setSubmitted(true);
      push("Feedback submitted.", "success");
    });
  }

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-[26px] sm:text-[30px] font-semibold">{t("intern.feedback.title")}</h1>
      <p className="mt-1.5 text-[14px] text-text-2">{t("intern.feedback.lede")}</p>

      {!eligible && !submitted ? (
        <div className="mt-6">
          <EmptyState title={t("intern.feedback.gated")} />
        </div>
      ) : submitted ? (
        <Card className="mt-6 p-5 sm:p-7">
          <p className="text-[13.5px] text-status-approved-fg">Thank you — your feedback has been submitted.</p>
        </Card>
      ) : (
        <Card className="mt-6 p-5 sm:p-7">
          <div className="flex flex-col gap-4">
            {QUESTIONS.map((q) =>
              q.type === "textarea" ? (
                <Textarea
                  key={q.key}
                  label={q.label}
                  value={values[q.key]}
                  onChange={(e) => setValues((v) => ({ ...v, [q.key]: e.target.value }))}
                />
              ) : (
                <Select
                  key={q.key}
                  label={q.label}
                  value={values[q.key]}
                  onChange={(e) => setValues((v) => ({ ...v, [q.key]: e.target.value }))}
                >
                  <option value="" disabled>
                    {q.label}
                  </option>
                  {q.options!.map((o) => (
                    <option key={o} value={o}>
                      {o}
                    </option>
                  ))}
                </Select>
              )
            )}
          </div>

          <Button className="mt-6" loading={pending} disabled={!allFilled} onClick={handleSubmit}>
            {t("common.submit")}
          </Button>
        </Card>
      )}
    </div>
  );
}
