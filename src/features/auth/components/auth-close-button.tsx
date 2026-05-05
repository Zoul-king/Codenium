"use client";

import { useRouter } from "next/navigation";
import { X } from "lucide-react";

export function AuthCloseButton() {
  const router = useRouter();

  function handleClose() {
    if (typeof window !== "undefined" && window.history.length > 1) {
      router.back();
    } else {
      router.push("/");
    }
  }

  return (
    <button
      type="button"
      onClick={handleClose}
      aria-label="Cerrar y volver"
      className="fixed right-4 top-4 z-30 flex size-11 items-center justify-center rounded-full border border-slate-200 bg-white text-body-color shadow-[0_2px_12px_rgba(0,0,0,0.06)] transition-all duration-200 hover:scale-105 hover:border-primary-500 hover:text-primary-500 sm:right-6 sm:top-6"
    >
      <X className="size-5" strokeWidth={2.2} />
    </button>
  );
}
