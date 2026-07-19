"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Textarea } from "@/components/ui/Textarea";
import { useToast } from "@/components/ui/Toast";
import { useT } from "@/lib/i18n";
import { submitQuestionnaire } from "../actions";

const QUESTIONS = [
  { key: "expectations", label: "What is your expectation of ACME Internship program - what skills or experience do you hope to gain?" },
  { key: "trainingWanted", label: "Describe the training programs and certifications you want us to include in our internship program?" },
  { key: "coursework", label: "Describe your Coursework. In what ways is it relevant to ACME internship program." },
  { key: "proudProject", label: "Tell us about a Project or Accomplishment you are proud of - what you did well, the challenges you faced and how did you overcome it?" },
  { key: "prioritiesStrengths", label: "How do you prioritize your work and what are your strengths?" },
  { key: "leadership", label: "Tell us brief about your Leadership, Interpersonal and Problem-solving skills?" },
  { key: "passion", label: "What are you most passionate about learning - personally or professionally and why?" },
  { key: "knowAcme", label: "What do you know about ACME? What questions do you still have?" },
  { key: "knowIndustry", label: "What do you know about the industry?" },
  { key: "outsideClassroom", label: "What have you learned from your experiences, outside the classroom?" },
  { key: "goalsAfterGraduation", label: "What are your goals after graduation? How do you think this internship shall prepare you for your future career goals?" },
  { key: "createValue", label: "In what ways would you like to create value to ACME, as an Intern?" },
  { key: "otherQuestions", label: "Do you have any other questions for us?" },
] as const;

export function QuestionnaireClient({
  existing,
  profileComplete,
}: {
  existing: Record<string, string> | null;
  profileComplete: boolean;
}) {
  const t = useT();
  const { push } = useToast();
  const [values, setValues] = useState<Record<string, string>>(
    existing ?? Object.fromEntries(QUESTIONS.map((q) => [q.key, ""]))
  );
  const [step, setStep] = useState(0);
  const [submitted, setSubmitted] = useState(!!existing);
  const [pending, startTransition] = useTransition();

  const current = QUESTIONS[step];
  const currentFilled = values[current.key]?.trim().length > 0;
  const isLast = step === QUESTIONS.length - 1;

  function handleNext() {
    if (!currentFilled) return;
    if (isLast) {
      startTransition(async () => {
        await submitQuestionnaire(values);
        setSubmitted(true);
        push("Questionnaire submitted.", "success");
      });
    } else {
      setStep((s) => s + 1);
    }
  }

  if (submitted) {
    return (
      <div className="max-w-2xl mx-auto">
        <h1 className="text-[26px] sm:text-[30px] font-semibold">{t("intern.questionnaire.title")}</h1>
        <Card className="mt-6 p-8 sm:p-10 flex flex-col items-center text-center gap-3">
          <span className="text-[40px]" aria-hidden>
            🎉
          </span>
          <h2 className="text-[19px] font-semibold text-text">{t("intern.questionnaire.doneTitle")}</h2>
          <p className="text-[14px] text-text-2 max-w-sm">
            {profileComplete ? t("intern.questionnaire.doneAllSet") : t("intern.questionnaire.doneNextProfile")}
          </p>
          {!profileComplete && (
            <Link href="/intern/profile" className="mt-3">
              <Button>{t("intern.questionnaire.goToProfile")}</Button>
            </Link>
          )}
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-[26px] sm:text-[30px] font-semibold">{t("intern.questionnaire.title")}</h1>
      <p className="mt-1.5 text-[14px] text-text-2">{t("intern.questionnaire.lede")}</p>

      <p className="mt-5 text-[12px] font-semibold uppercase tracking-[0.6px] text-text-3">
        {t("intern.questionnaire.questionOf").replace("{current}", String(step + 1)).replace("{total}", String(QUESTIONS.length))}
      </p>
      <div className="mt-2 h-1.5 rounded-full bg-field-bg overflow-hidden">
        <div
          className="h-full rounded-full bg-wine transition-all duration-300"
          style={{ width: `${((step + 1) / QUESTIONS.length) * 100}%` }}
        />
      </div>

      <Card className="mt-5 p-5 sm:p-7">
        <Textarea
          key={current.key}
          label={current.label}
          value={values[current.key]}
          onChange={(e) => setValues((v) => ({ ...v, [current.key]: e.target.value }))}
          rows={5}
          autoFocus
        />

        <div className="mt-6 flex items-center justify-between gap-3">
          <Button variant="secondary" disabled={step === 0} onClick={() => setStep((s) => s - 1)}>
            {t("common.back")}
          </Button>
          <Button loading={pending} disabled={!currentFilled} onClick={handleNext}>
            {isLast ? t("common.submit") : t("common.next")}
          </Button>
        </div>
      </Card>
    </div>
  );
}
