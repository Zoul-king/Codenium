import type { InputHTMLAttributes, TextareaHTMLAttributes } from "react";

import { cn } from "@/lib/utils";

interface BaseFieldProps {
  label: string;
  className?: string;
}

interface TextFieldProps extends BaseFieldProps {
  placeholder: string;
  type?: InputHTMLAttributes<HTMLInputElement>["type"];
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
}

interface TextAreaFieldProps extends BaseFieldProps {
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
  rows?: TextareaHTMLAttributes<HTMLTextAreaElement>["rows"];
  disabled?: boolean;
}

const controlClassName =
  "w-full rounded-[16px] border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-primary-300 focus:bg-white disabled:cursor-not-allowed disabled:opacity-70";

export function TextField({ label, placeholder, type = "text", value, onChange, className, disabled = false }: TextFieldProps) {
  return (
    <div className={className}>
      <label className="mb-2 block text-sm font-medium text-body-color">{label}</label>
      <input
        type={type}
        value={value}
        disabled={disabled}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className={controlClassName}
      />
    </div>
  );
}

export function TextAreaField({ label, placeholder, value, onChange, rows = 6, className, disabled = false }: TextAreaFieldProps) {
  return (
    <div className={className}>
      <label className="mb-2 block text-sm font-medium text-body-color">{label}</label>
      <textarea
        rows={rows}
        value={value}
        disabled={disabled}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className={cn(controlClassName, "resize-none")}
      />
    </div>
  );
}
