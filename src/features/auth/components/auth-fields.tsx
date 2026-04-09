import type { InputHTMLAttributes } from "react";

interface AuthFieldProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  type?: InputHTMLAttributes<HTMLInputElement>["type"];
}

export function AuthField({ label, value, onChange, placeholder, type = "text" }: AuthFieldProps) {
  return (
    <div>
      <label className="mb-2 block text-sm font-medium text-body-color">{label}</label>
      <input
        type={type}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className="w-full rounded-[14px] border border-black/10 bg-foreground px-4 py-3 text-body-color outline-none transition placeholder:text-body-color/55 focus:border-primary-500 focus:bg-white"
      />
    </div>
  );
}

export function AuthMessage({ tone, children }: { tone: "error" | "success"; children: string }) {
  const classes =
    tone === "error"
      ? "border border-primary-500/20 bg-primary-50 text-primary-600"
      : "border border-secondary-500/20 bg-secondary-500/10 text-body-color";

  return <div className={`rounded-[16px] px-4 py-3 text-sm ${classes}`}>{children}</div>;
}
