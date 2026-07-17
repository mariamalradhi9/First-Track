"use client";

import { useCallback, useEffect, useRef, useState, type DragEvent } from "react";
import clsx from "clsx";

interface Props {
  name?: string;
  label?: string;
  hint?: string;
  accept?: string;
  file?: File | null;
  onChange: (file: File | null) => void;
  error?: string;
  uploading?: boolean;
}

const ATTACH_DELAY_MS = 700;

export function FileUpload({
  name,
  label,
  hint = "Drag & drop a file here, or click to browse",
  accept,
  file,
  onChange,
  error,
  uploading = false,
}: Props) {
  const [dragOver, setDragOver] = useState(false);
  const [attaching, setAttaching] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const prevFileKey = useRef<string | null>(null);

  useEffect(() => {
    const key = file ? `${file.name}-${file.size}-${file.lastModified}` : null;
    if (key && key !== prevFileKey.current) {
      setAttaching(true);
      const timer = setTimeout(() => setAttaching(false), ATTACH_DELAY_MS);
      prevFileKey.current = key;
      return () => clearTimeout(timer);
    }
    prevFileKey.current = key;
  }, [file]);

  const busy = attaching || uploading;

  const handleDrop = useCallback(
    (e: DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      setDragOver(false);
      const f = e.dataTransfer.files?.[0];
      if (f) {
        // Reflect the dropped file onto the real <input> so native FormData
        // submission (no drag/drop event) still picks it up.
        if (inputRef.current) {
          const dt = new DataTransfer();
          dt.items.add(f);
          inputRef.current.files = dt.files;
        }
        onChange(f);
      }
    },
    [onChange]
  );

  return (
    <div className="field">
      {label && <label className="block font-semibold text-[11px] tracking-[1.2px] uppercase text-text-3 mb-2">{label}</label>}
      <div
        onClick={() => inputRef.current?.click()}
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
        className={clsx(
          "relative flex flex-col items-center justify-center gap-2 text-center border border-dashed rounded-input px-4 py-7 cursor-pointer transition-colors overflow-hidden",
          dragOver ? "border-pink bg-focus-ring" : "border-field-line hover:border-field-hover bg-field-bg",
          error && "border-status-rejected-fg"
        )}
      >
        {attaching && (
          <div className="absolute inset-x-0 top-0 h-[3px] bg-field-line overflow-hidden">
            <div className="h-full w-1/3 bg-pink animate-[fileProgress_.7s_ease-in-out]" />
          </div>
        )}
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} className="w-6 h-6 text-text-3">
          <path d="M12 16V4M12 4l-4 4M12 4l4 4" />
          <path d="M4 16v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-2" />
        </svg>
        {file ? (
          <span className="inline-flex items-center gap-2 bg-card border border-card-line rounded-full px-3 py-1 text-[12.5px] text-text mt-1">
            {busy && (
              <svg viewBox="0 0 24 24" fill="none" className="w-3.5 h-3.5 animate-spin text-pink" aria-hidden>
                <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2.5" opacity="0.25" />
                <path d="M21 12a9 9 0 0 0-9-9" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
              </svg>
            )}
            {attaching ? `Attaching ${file.name}…` : file.name}
            {!busy && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onChange(null);
                  if (inputRef.current) inputRef.current.value = "";
                }}
                className="text-text-3 hover:text-status-rejected-fg"
                aria-label="Remove file"
              >
                ×
              </button>
            )}
          </span>
        ) : (
          <span className="text-[13px] text-text-2">{hint}</span>
        )}
        <input
          ref={inputRef}
          type="file"
          name={name}
          accept={accept}
          className="hidden"
          onChange={(e) => onChange(e.target.files?.[0] ?? null)}
        />
      </div>
      {error && <p className="mt-1.5 text-[12px] text-status-rejected-fg">{error}</p>}
    </div>
  );
}
