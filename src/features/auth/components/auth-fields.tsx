import type { InputHTMLAttributes } from "react";

import { TextField } from "@/components/ui/form-controls";

interface AuthFieldProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  type?: InputHTMLAttributes<HTMLInputElement>["type"];
}

export function AuthField(props: AuthFieldProps) {
  return <TextField {...props} />;
}

export function AuthMessage({ tone, children }: { tone: "error" | "success"; children: string }) {
  const classes =
    tone === "error"
      ? "border border-primary-500/20 bg-primary-50 text-primary-600"
      : "border border-secondary-500/20 bg-secondary-500/10 text-body-color";

  return <div className={`rounded-[16px] px-4 py-3 text-sm ${classes}`}>{children}</div>;
}
