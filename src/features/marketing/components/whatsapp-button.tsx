"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";

import { ContactIcon, ToolIcon, WhatsAppIcon } from "@/components/ui/icons";
import { site } from "@/features/marketing/data/site";

export function WhatsAppButton() {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handlePointerDown(event: MouseEvent) {
      if (!containerRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    }

    function handleEscape(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("keydown", handleEscape);
    };
  }, []);

  return (
    <div ref={containerRef} className="fixed bottom-8 right-6 z-40 hidden md:block">
      <div className="relative">
        <div
          className={`absolute bottom-[calc(100%+12px)] right-0 grid min-w-[220px] gap-2 rounded-[20px] border border-slate-200 bg-white p-3 shadow-[0_18px_40px_rgba(15,23,42,0.12)] transition-all duration-200 ${
            open ? "pointer-events-auto translate-y-0 opacity-100" : "pointer-events-none translate-y-2 opacity-0"
          }`}
        >
          <Link href={site.contact.assistantHref ?? "/contact"} className="contact-hub-link" onClick={() => setOpen(false)}>
            <ToolIcon className="size-4" />
            {site.contact.assistantLabel ?? "Asistente"}
          </Link>
          <a href={`mailto:${site.contact.email}`} className="contact-hub-link" onClick={() => setOpen(false)}>
            <ContactIcon type="mail" />
            Correo
          </a>
          <a href={site.contact.whatsapp} target="_blank" rel="noreferrer" className="contact-hub-link" onClick={() => setOpen(false)}>
            <WhatsAppIcon className="size-4" />
            WhatsApp
          </a>
        </div>

        <button
          type="button"
          className="flex items-center gap-3 rounded-full border border-slate-200 bg-slate-950 px-4 py-3 text-sm font-semibold text-white shadow-[0_12px_26px_rgba(15,23,42,0.22)] transition hover:bg-primary-500"
          aria-expanded={open}
          aria-label="Abrir canales de contacto"
          onClick={() => setOpen((current) => !current)}
        >
          <span className="grid size-10 place-content-center rounded-full bg-white text-slate-900">
            <ToolIcon className="size-5" />
          </span>
          <span className="pr-1">Canales de contacto</span>
        </button>
      </div>
    </div>
  );
}
