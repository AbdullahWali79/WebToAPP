"use client";

import { useMemo } from "react";
import { useEffect } from "react";

interface UploadFieldProps {
  id: string;
  label: string;
  helperText: string;
  file: File | null;
  onChange: (file: File | null) => void;
}

export function UploadField({
  id,
  label,
  helperText,
  file,
  onChange
}: UploadFieldProps): JSX.Element {
  const previewUrl = useMemo(() => {
    if (!file) return "";
    return URL.createObjectURL(file);
  }, [file]);

  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  return (
    <div className="form-field">
      <label htmlFor={id}>{label}</label>
      <label htmlFor={id} className="upload-box">
        <input
          id={id}
          type="file"
          accept="image/*"
          onChange={(event) => onChange(event.target.files?.[0] || null)}
        />
        <span>{file ? file.name : "Click to choose image"}</span>
        <small>{helperText}</small>
      </label>
      {previewUrl ? (
        <div className="upload-preview">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={previewUrl} alt={`${label} preview`} />
        </div>
      ) : null}
    </div>
  );
}
