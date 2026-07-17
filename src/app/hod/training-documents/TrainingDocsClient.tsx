"use client";

import { useState, useTransition } from "react";
import { format } from "date-fns";
import { DataTable, type Column } from "@/components/ui/DataTable";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { FileUpload } from "@/components/ui/FileUpload";
import { useToast } from "@/components/ui/Toast";
import { useT } from "@/lib/i18n";
import { uploadTrainingResource, deleteTrainingResource } from "../actions";

interface Row {
  id: string;
  title: string;
  type: string;
  fileUrl: string;
  fileName: string;
  uploadedBy: string;
  createdAt: string;
}

export function TrainingDocsClient({ rows: initialRows }: { rows: Row[] }) {
  const t = useT();
  const { push } = useToast();
  const [rows, setRows] = useState(initialRows);
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [type, setType] = useState("DOCUMENT");
  const [file, setFile] = useState<File | null>(null);
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  function handleUpload() {
    if (!title || !file) return;
    setError(null);
    const fd = new FormData();
    fd.set("title", title);
    fd.set("type", type);
    fd.set("file", file);
    startTransition(async () => {
      try {
        await uploadTrainingResource(fd);
        push(`"${title}" uploaded.`, "success");
        setOpen(false);
        setTitle("");
        setFile(null);
        window.location.reload();
      } catch (e) {
        setError(e instanceof Error ? e.message : "Upload failed.");
      }
    });
  }

  function handleDelete(id: string, docTitle: string) {
    startTransition(async () => {
      await deleteTrainingResource(id);
      setRows((rs) => rs.filter((r) => r.id !== id));
      push(`"${docTitle}" removed.`, "info");
    });
  }

  const columns: Column<Row>[] = [
    { key: "title", header: "Title", render: (r) => (
      <a href={r.fileUrl} target="_blank" rel="noreferrer" className="text-pink hover:opacity-80 font-medium">
        {r.title}
      </a>
    ) },
    { key: "type", header: "Type", hideOnMobile: true },
    { key: "uploadedBy", header: "Uploaded By", hideOnMobile: true },
    { key: "createdAt", header: t("common.date"), hideOnMobile: true, render: (r) => format(new Date(r.createdAt), "d MMM yyyy") },
    {
      key: "actions",
      header: t("common.actions"),
      render: (r) => (
        <Button size="sm" variant="destructive" onClick={(e) => { e.stopPropagation(); handleDelete(r.id, r.title); }}>
          {t("common.delete")}
        </Button>
      ),
    },
  ];

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-[26px] sm:text-[30px] font-semibold">{t("hod.training.title")}</h1>
          <p className="mt-1.5 text-[14px] text-text-2">{t("hod.training.lede")}</p>
        </div>
        <Button onClick={() => setOpen(true)} className="sm:w-auto">
          {t("common.upload")}
        </Button>
      </div>

      <div className="mt-5">
        <DataTable columns={columns} rows={rows} keyField="id" />
      </div>

      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title={t("common.upload")}
        footer={
          <>
            <Button variant="secondary" onClick={() => setOpen(false)}>
              {t("common.cancel")}
            </Button>
            <Button loading={pending} disabled={!title || !file} onClick={handleUpload}>
              {t("common.upload")}
            </Button>
          </>
        }
      >
        <div className="flex flex-col gap-4">
          <Input label={t("hod.training.titleLabel")} value={title} onChange={(e) => setTitle(e.target.value)} />
          <Select label="Type" value={type} onChange={(e) => setType(e.target.value)}>
            <option value="DOCUMENT">Document</option>
            <option value="AUDIO">Audio</option>
            <option value="VIDEO">Video</option>
          </Select>
          <FileUpload file={file} onChange={setFile} uploading={pending} />
          {error && <p className="text-[13px] text-status-rejected-fg">{error}</p>}
        </div>
      </Modal>
    </div>
  );
}
