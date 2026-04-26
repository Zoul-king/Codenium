"use client";

export function ProgressBar({ value }: { value: number }) {
  const safe = Math.max(0, Math.min(100, value));

  return (
    <div className="h-2.5 rounded-full bg-slate-200">
      <div
        className="h-full rounded-full bg-[linear-gradient(90deg,var(--role-strong,#224a78)_0%,var(--role,#4a88ae)_55%,var(--color-secondary-500)_100%)] transition-[width] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]"
        style={{ width: `${safe}%` }}
      />
    </div>
  );
}
