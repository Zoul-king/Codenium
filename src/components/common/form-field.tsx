import type { InputHTMLAttributes, TextareaHTMLAttributes } from "react";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
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

const fieldClass =
  "h-auto w-full rounded-[14px] border-slate-200 bg-slate-50 px-4 py-3 text-base text-slate-900 shadow-none placeholder:text-slate-400 focus-visible:border-primary-300 focus-visible:bg-white focus-visible:ring-0";

export function TextField({ label, placeholder, type = "text", value, onChange, className, disabled = false }: TextFieldProps) {
  return (
    <div className={cn("space-y-2", className)}>
      <Label className="text-sm font-medium text-body-color">{label}</Label>
      <Input
        type={type}
        value={value}
        disabled={disabled}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className={fieldClass}
      />
    </div>
  );
}

export function TextAreaField({ label, placeholder, value, onChange, rows = 6, className, disabled = false }: TextAreaFieldProps) {
  return (
    <div className={cn("space-y-2", className)}>
      <Label className="text-sm font-medium text-body-color">{label}</Label>
      <Textarea
        rows={rows}
        value={value}
        disabled={disabled}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className={cn(fieldClass, "min-h-[6rem] resize-none")}
      />
    </div>
  );
}
