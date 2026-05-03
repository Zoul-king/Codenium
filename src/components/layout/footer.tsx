import Link from "next/link";
import { Mail, MapPin, Phone } from "lucide-react";

import { BrandLogo, SocialIcon } from "@/components/common/icons";
import { site } from "@/features/marketing/data/site";

interface FooterProps {
  contactEmail: string;
}

export function Footer({ contactEmail }: FooterProps) {
  return (
    <footer className="bg-[#0b0f1a]">
      {/* Main grid */}
      <div className="site-shell grid gap-10 px-4 py-14 sm:px-6 md:grid-cols-2 md:gap-12 lg:grid-cols-12 lg:py-20">

        {/* Brand col */}
        <div className="lg:col-span-5">
          <BrandLogo variant="footer" className="w-[130px] md:w-[148px]" />
          <p className="mt-5 max-w-[340px] text-[13.5px] leading-[1.85] text-slate-400">
            {site.footer.body}
          </p>
          <div className="mt-7 flex flex-wrap gap-2">
            {site.socials.map((social) => (
              <a
                key={social.label}
                href={social.href}
                target="_blank"
                rel="noreferrer"
                aria-label={social.label}
                className="flex size-9 items-center justify-center rounded-lg bg-white/6 text-slate-400 transition-all duration-200 hover:bg-primary-500 hover:text-white"
              >
                <SocialIcon type={social.icon} className="size-[17px]" />
              </a>
            ))}
          </div>
        </div>

        {/* Nav col */}
        <div className="lg:col-span-3 lg:col-start-7">
          <p className="mb-5 text-[11px] font-bold uppercase tracking-[0.22em] text-white/80">Menú</p>
          <ul className="flex flex-col gap-3">
            {site.footerNav.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="text-[13.5px] text-slate-400 transition-colors duration-150 hover:text-primary-400"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Contact col */}
        <div className="lg:col-span-4">
          <p className="mb-5 text-[11px] font-bold uppercase tracking-[0.22em] text-white/80">Contacto</p>
          <ul className="flex flex-col gap-4">
            <li>
              <a
                href={`mailto:${contactEmail}`}
                className="group flex items-start gap-2.5 transition-colors hover:text-primary-400"
              >
                <Mail className="mt-0.5 size-3.5 shrink-0 text-slate-500 transition group-hover:text-primary-400" strokeWidth={1.8} />
                <span className="text-[13.5px] text-slate-400 transition group-hover:text-primary-400">{contactEmail}</span>
              </a>
            </li>
            <li>
              <a
                href={`tel:${site.contact.phoneRaw}`}
                className="group flex items-center gap-2.5 transition-colors hover:text-primary-400"
              >
                <Phone className="size-3.5 shrink-0 text-slate-500 transition group-hover:text-primary-400" strokeWidth={1.8} />
                <span className="text-[13.5px] text-slate-400 transition group-hover:text-primary-400">{site.contact.phone}</span>
              </a>
            </li>
            <li className="flex items-center gap-2.5">
              <MapPin className="size-3.5 shrink-0 text-slate-500" strokeWidth={1.8} />
              <span className="text-[13.5px] text-slate-400">
                {site.contact.location}, {site.contact.city}
              </span>
            </li>
          </ul>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/[0.06] px-4 py-6 sm:px-6">
        <div className="site-shell flex flex-col items-center justify-between gap-3 sm:flex-row">
          <p className="text-[12px] text-slate-600">{site.footer.legal}</p>
          <Link
            href="/privacy"
            className="text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-600 transition hover:text-slate-400"
          >
            Aviso de privacidad
          </Link>
        </div>
      </div>
    </footer>
  );
}
