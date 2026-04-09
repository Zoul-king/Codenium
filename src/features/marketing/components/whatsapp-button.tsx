import Link from "next/link";

import { ContactIcon, ToolIcon, WhatsAppIcon } from "@/components/ui/icons";
import { site } from "@/features/marketing/data/site";

export function WhatsAppButton() {
  return (
    <div className="schedule group bottom-10 hidden md:flex">
      <div className="schedule__message hidden transition-opacity duration-300 group-hover:pointer-events-none group-hover:opacity-0 md:flex">
        {site.sticky.message}
      </div>
      <div className="relative">
        <button className="button-sticky bg-slate-950 peer flex rounded-full px-4 text-white group-hover:px-4" aria-label="Abrir herramientas de contacto">
          <span className="grid size-10 place-content-center rounded-full bg-white text-slate-900">
            <ToolIcon className="size-5" />
          </span>
          <span className="button-sticky-label">{site.sticky.label}</span>
        </button>
        <div className="pointer-events-none absolute bottom-[calc(100%+12px)] right-0 grid min-w-[210px] gap-2 rounded-[20px] border border-slate-200 bg-white p-3 opacity-0 shadow-[0_18px_40px_rgba(15,23,42,0.12)] transition-all duration-300 group-hover:pointer-events-auto group-hover:translate-y-0 group-hover:opacity-100">
          <a href={site.contact.whatsapp} target="_blank" rel="noreferrer" className="contact-hub-link">
            <WhatsAppIcon className="size-4" />
            WhatsApp
          </a>
          <a href={`mailto:${site.contact.email}`} className="contact-hub-link">
            <ContactIcon type="mail" />
            Correo
          </a>
          <Link href={site.contact.assistantHref ?? "/contact"} className="contact-hub-link">
            <ToolIcon className="size-4" />
            {site.contact.assistantLabel ?? "Asistente"}
          </Link>
        </div>
      </div>
    </div>
  );
}
