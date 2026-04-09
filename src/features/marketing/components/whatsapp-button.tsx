import { WhatsAppIcon } from "@/components/ui/icons";
import { site } from "@/features/marketing/data/site";

export function WhatsAppButton() {
  return (
    <div className="schedule group bottom-10 hidden md:flex">
      <div className="schedule__message hidden transition-opacity duration-300 group-hover:pointer-events-none group-hover:opacity-0 md:flex">
        {site.sticky.message}
      </div>
      <a
        className="button-sticky whatsapp peer z-40 flex rounded-full px-4 group-hover:px-4"
        href={site.sticky.href}
        target="_blank"
        rel="noreferrer"
        aria-label="Chat por WhatsApp"
      >
        <span className="grid size-10 place-content-center rounded-full bg-white text-[#19c750]">
          <WhatsAppIcon className="size-7" />
        </span>
        <span className="button-sticky-label">{site.sticky.label}</span>
      </a>
    </div>
  );
}
