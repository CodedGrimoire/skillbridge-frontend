"use client";

import { ReactNode } from "react";
import classNames from "classnames";

type Props = {
  label: string;
  htmlFor?: string;
  hint?: string;
  error?: string;
  required?: boolean;
  children: ReactNode;
};

export default function FormField({ label, htmlFor, hint, error, required, children }: Props) {
  return (
    <div className="space-y-1">
      <label htmlFor={htmlFor} className="sb-label flex items-center gap-1">
        {label}
        {required && <span className="text-danger">*</span>}
      </label>
      {children}
      {hint && !error && <p className="text-xs text-muted">{hint}</p>}
      {error && <p className="text-xs text-danger">{error}</p>}
    </div>
  );
}

