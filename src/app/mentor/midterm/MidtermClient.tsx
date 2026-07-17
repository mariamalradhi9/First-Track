"use client";

import { useState, useTransition } from "react";
import { DataTable, type Column } from "@/components/ui/DataTable";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { RatingSegmented, ConsolidatedRating } from "@/components/ui/RatingInput";
import { InitialsAvatar } from "@/components/InitialsAvatar";
import { useToast } from "@/components/ui/Toast";
import { useT } from "@/lib/i18n";
import { submitBiweeklyReview } from "../actions";

type Rating = "EXCELLENT" | "AVERAGE" | "POOR";

interface Row {
  id: string;
  name: string;
  goalCount: number;
  latestRating: number | null;
  reviewCount: number;
}

const CATEGORIES = ["Quality of Work", "Communication", "Initiative", "Punctuality"];

export function MidtermClient({ rows: initialRows }: { rows: Row[] }) {
  const t = useT();
  const { push } = useToast();
  const [rows, setRows] = useState(initialRows);
  const [target, setTarget] = useState<Row | null>(null);
  const [ratings, setRatings] = useState<Record<string, Rating>>({});
  const [pending, startTransition] = useTransition();

  function openReview(row: Row) {
    setTarget(row);
    setRatings(Object.fromEntries(CATEGORIES.map((c) => [c, "AVERAGE" as Rating])));
  }

  function handleSubmit() {
    if (!target) return;
    const payload = CATEGORIES.map((category) => ({ category, rating: ratings[category] }));
    const avgScore = payload.reduce((s, r) => s + { EXCELLENT: 5, AVERAGE: 3, POOR: 1 }[r.rating], 0) / payload.length;
    startTransition(async () => {
      await submitBiweeklyReview(target.id, payload);
      setRows((rs) => rs.map((r) => (r.id === target.id ? { ...r, latestRating: avgScore, reviewCount: r.reviewCount + 1 } : r)));
      push(`Review submitted for ${target.name}.`, "success");
      setTarget(null);
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
    { key: "goalCount", header: "Goals" },
    { key: "reviewCount", header: "Reviews" },
    { key: "latestRating", header: "Consolidated Rating", render: (r) => <ConsolidatedRating value={r.latestRating} /> },
    {
      key: "actions",
      header: t("common.actions"),
      render: (r) => (
        <Button size="sm" variant="secondary" onClick={(e) => { e.stopPropagation(); openReview(r); }}>
          Submit Review
        </Button>
      ),
    },
  ];

  return (
    <div className="max-w-6xl mx-auto">
      <h1 className="text-[26px] sm:text-[30px] font-semibold">{t("mentor.midterm.title")}</h1>
      <p className="mt-1.5 text-[14px] text-text-2">{t("mentor.midterm.lede")}</p>
      <div className="mt-5">
        <DataTable columns={columns} rows={rows} keyField="id" />
      </div>

      <Modal
        open={!!target}
        onClose={() => setTarget(null)}
        title={`Biweekly Review — ${target?.name ?? ""}`}
        footer={
          <>
            <Button variant="secondary" onClick={() => setTarget(null)}>
              {t("common.cancel")}
            </Button>
            <Button loading={pending} onClick={handleSubmit}>
              {t("common.submit")}
            </Button>
          </>
        }
      >
        <div className="flex flex-col gap-4">
          {CATEGORIES.map((c) => (
            <div key={c} className="flex items-center justify-between gap-3">
              <span className="text-[13.5px] text-text">{c}</span>
              <RatingSegmented value={ratings[c]} onChange={(v) => setRatings((r) => ({ ...r, [c]: v }))} />
            </div>
          ))}
        </div>
      </Modal>
    </div>
  );
}
