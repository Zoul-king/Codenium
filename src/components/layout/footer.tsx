import Link from "next/link";
import { Mail, MapPin, Phone } from "lucide-react";

import { BrandLogo, SocialIcon } from "@/components/common/icons";
import { site } from "@/features/marketing/data/site";

interface FooterProps {
  contactEmail: string;
}

export function Footer({ contactEmail }: FooterProps) {
  return (
    <footer className="bg-[#0b0f1a] text-slate-400">
      {/* Main grid */}
      <div className="site-shell px-4 py-14 sm:px-6 lg:py-20">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-12 md:gap-x-8 md:gap-y-12">
          {/* Brand col */}
          <div className="md:col-span-12 lg:col-span-5">
            <BrandLogo variant="footer" className="w-[130px] md:w-[148px]" />
            <p className="mt-5 max-w-[380px] text-[13.5px] leading-[1.85]">
              {site.footer.body}
            </p>
            <ul className="mt-7 flex flex-wrap gap-2">
              {site.socials.map((social) => (
                <li key={social.label}>
                  <a
                    href={social.href}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={social.label}
                    className="flex size-9 items-center justify-center rounded-lg bg-white/5 text-slate-400 transition-all duration-200 hover:bg-primary-500 hover:text-white"
                  >
                    <SocialIcon type={social.icon} className="size-[17px]" />
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Nav col */}
          <div className="md:col-span-6 lg:col-span-3">
            <p className="mb-5 text-[11px] font-bold uppercase tracking-[0.22em] text-white/80">Menú</p>
            <ul className="flex flex-col gap-3">
              {site.footerNav.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-[13.5px] transition-colors duration-150 hover:text-primary-400"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact col */}
          <div className="md:col-span-6 lg:col-span-4">
            <p className="mb-5 text-[11px] font-bold uppercase tracking-[0.22em] text-white/80">Contacto</p>
            <ul className="flex flex-col gap-4">
              <li>
                <a
                  href={`mailto:${contactEmail}`}
                  className="group flex items-start gap-2.5 transition-colors hover:text-primary-400"
                >
                  <Mail
                    className="mt-0.5 size-4 shrink-0 text-slate-500 transition group-hover:text-primary-400"
                    strokeWidth={1.8}
                  />
                  <span className="break-all text-[13.5px] transition group-hover:text-primary-400">
                    {contactEmail}
                  </span>
                </a>
              </li>
              <li>
                <a
                  href={`tel:${site.contact.phoneRaw}`}
                  className="group flex items-center gap-2.5 transition-colors hover:text-primary-400"
                >
                  <Phone
                    className="size-4 shrink-0 text-slate-500 transition group-hover:text-primary-400"
                    strokeWidth={1.8}
                  />
                  <span className="text-[13.5px] transition group-hover:text-primary-400">{site.contact.phone}</span>
                </a>
              </li>
              <li className="flex items-start gap-2.5">
                <MapPin className="mt-0.5 size-4 shrink-0 text-slate-500" strokeWidth={1.8} />
                <span className="text-[13.5px]">
                  {site.contact.location}, {site.contact.city}
                </span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/[0.06]">
        <div className="site-shell flex items-center justify-center px-4 py-6 sm:px-6">
          <p className="text-[12px] text-slate-600">{site.footer.legal}</p>
        </div>
      </div>
    </footer>
  );
}
