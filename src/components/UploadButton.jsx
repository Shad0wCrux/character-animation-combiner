import React, { useMemo, useState } from "react";

export default function UploadButton({
  label = "Upload",
  accept,
  multiple = false,
  onUpload,
  hint,
}) {
  const [names, setNames] = useState([]);

  const display = useMemo(() => {
    if (!names.length) return "No file selected";
    if (names.length === 1) return names[0];
    return `${names.length} files selected`;
  }, [names]);

  return (
    <div className="flex w-full items-center justify-between gap-3">
      <div className="flex items-center gap-3">
        <label className="inline-flex cursor-pointer items-center justify-center bg-teal-600 px-4 py-2 text-sm font-semibold text-white hover:bg-teal-500">
          {label}
          <input
            type="file"
            accept={accept}
            multiple={multiple}
            onChange={(e) => {
              const files = Array.from(e.target.files || []);
              setNames(files.map((f) => f.name));
              onUpload?.(e);
            }}
            className="hidden"
          />
        </label>

        <div className="min-w-0">
          <div className="truncate text-xs text-white/70">{display}</div>
          {hint ? (
            <div className="truncate text-[11px] text-white/50">{hint}</div>
          ) : accept ? (
            <div className="truncate text-[11px] text-white/50">
              Accepted: {accept}
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}

