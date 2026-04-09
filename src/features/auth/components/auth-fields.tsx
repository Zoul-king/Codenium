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
      <label className="mb-2 block text-sm font-medium text-gray-700">{label}</label>
      <input
        type={type}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-primary-500 focus:ring-primary-500"
      />
    </div>
  );
}

export function AuthMessage({ tone, children }: { tone: "error" | "success"; children: string }) {
  const classes =
    tone === "error"
      ? "border border-primary-500/20 bg-primary-50 text-primary-600"
      : "border border-secondary-500/20 bg-white text-body-color";

  return <div className={`rounded-[16px] px-4 py-3 text-sm ${classes}`}>{children}</div>;
}
