"use client";

import { useState, useTransition } from "react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Textarea } from "@/components/ui/Textarea";
import { Select } from "@/components/ui/Select";
import { useToast } from "@/components/ui/Toast";
import { useT } from "@/lib/i18n";
import { submitQuestionnaire } from "../actions";

const QUESTIONS = [
  { key: "expectations", label: "What do you hope to gain from this internship?", type: "textarea" },
  { key: "skills", label: "What skills would you like to develop?", type: "textarea" },
  { key: "availability", label: "Confirm your availability", type: "select", options: ["Full-time", "Part-time"] },
  { key: "priorExperience", label: "Do you have any prior internship experience?", type: "select", options: ["Yes", "No"] },
];

export function QuestionnaireClient({ existing }: { existing: Record<string, string> | null }) {
  const t = useT();
  const { push } = useToast();
  const [values, setValues] = useState<Record<string, string>>(
    existing ?? Object.fromEntries(QUESTIONS.map((q) => [q.key, ""]))
  );
  const [submitted, setSubmitted] = useState(!!existing);
  const [pending, startTransition] = useTransition();

  const allFilled = QUESTIONS.every((q) => values[q.key]?.trim());

  function handleSubmit() {
    if (!allFilled) return;
    startTransition(async () => {
      await submitQuestionnaire(values);
      setSubmitted(true);
      push("Questionnaire submitted.", "success");
    });
  }

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-[26px] sm:text-[30px] font-semibold">{t("intern.questionnaire.title")}</h1>
      <p className="mt-1.5 text-[14px] text-text-2">{t("intern.questionnaire.lede")}</p>

      <Card className="mt-6 p-5 sm:p-7">
        <div className="flex flex-col gap-4">
          {QUESTIONS.map((q) =>
            q.type === "textarea" ? (
              <Textarea
                key={q.key}
                label={q.label}
                value={values[q.key]}
                disabled={submitted}
                onChange={(e) => setValues((v) => ({ ...v, [q.key]: e.target.value }))}
              />
            ) : (
              <Select
                key={q.key}
                label={q.label}
                value={values[q.key]}
                disabled={submitted}
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

        {submitted ? (
          <p className="mt-6 text-[13.5px] text-status-approved-fg">{t("intern.questionnaire.submitted")}</p>
        ) : (
          <Button className="mt-6" loading={pending} disabled={!allFilled} onClick={handleSubmit}>
            {t("common.submit")}
          </Button>
        )}
      </Card>
    </div>
  );
}
