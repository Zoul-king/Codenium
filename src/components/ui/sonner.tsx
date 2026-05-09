"use client";

import {
  CircleCheck,
  Info,
  Loader2,
  OctagonAlert,
  TriangleAlert
} from "lucide-react";
import { Toaster as Sonner, type ToasterProps } from "sonner";

const Toaster = ({ ...props }: ToasterProps) => {
  return (
    <Sonner
      theme="light"
      className="codenium-toaster"
      position="top-right"
      offset={20}
      visibleToasts={4}
      gap={12}
      toastOptions={{
        classNames: {
          toast:
            "codenium-toast group flex w-full items-start gap-3 rounded-2xl border bg-white px-4 py-3 shadow-[0_18px_40px_rgba(15,23,42,0.10)] backdrop-blur-sm",
          title: "text-sm font-semibold leading-tight text-slate-950",
          description: "mt-0.5 text-[13px] leading-snug text-slate-600",
          icon: "shrink-0 mt-0.5",
          closeButton:
            "!left-auto !right-2 !top-2 !translate-x-0 !translate-y-0 !rounded-full !border-slate-200 !bg-white !text-slate-500 hover:!bg-slate-50",
          actionButton:
            "!bg-[#224a78] !text-white !rounded-lg !px-3 !py-1.5 !text-xs !font-semibold hover:!opacity-90",
          cancelButton:
            "!bg-slate-100 !text-slate-700 !rounded-lg !px-3 !py-1.5 !text-xs !font-semibold hover:!bg-slate-200"
        }
      }}
      icons={{
        success: <CircleCheck className="size-5 text-[#059669]" />,
        info: <Info className="size-5 text-[#224a78]" />,
        warning: <TriangleAlert className="size-5 text-[#d97706]" />,
        error: <OctagonAlert className="size-5 text-[#dc2626]" />,
        loading: <Loader2 className="size-5 animate-spin text-[#4f2f96]" />
      }}
      {...props}
    />
  );
};

export { Toaster };
