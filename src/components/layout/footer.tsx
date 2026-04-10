import Link from "next/link";

import { BrandLogo, SocialIcon } from "@/components/ui/icons";
import { site } from "@/features/marketing/data/site";

export function Footer() {
  return (
    <footer className="bg-[#0b0f1a]">
      <div className="section site-shell grid gap-12 py-16 md:grid-cols-2 lg:grid-cols-4 lg:py-24">
        <div className="lg:col-span-2">
          <BrandLogo variant="footer" className="w-[132px] md:w-[156px]" />
          <p className="mt-6 max-w-sm text-sm leading-8 text-slate-400">
            {site.footer.body}
          </p>
          <div className="mt-8 flex gap-x-4">
            {site.socials.map((social) => (
              <a 
                key={social.label} 
                href={social.href} 
                target="_blank" 
                rel="noreferrer" 
                aria-label={social.label}
                className="flex size-10 items-center justify-center rounded-xl bg-white/5 text-white transition-all hover:bg-primary-500 hover:text-white"
              >
                <SocialIcon type={social.icon} className="size-5" />
              </a>
            ))}
          </div>
        </div>

        <div>
          <span className="mb-6 block text-xs font-bold uppercase tracking-[0.2em] text-white">Menú</span>
          <ul className="flex flex-col gap-y-4">
            {site.footerNav.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="text-sm text-slate-400 transition-colors hover:text-primary-400">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <span className="mb-6 block text-xs font-bold uppercase tracking-[0.2em] text-white">Contacto</span>
          <ul className="flex flex-col gap-y-4">
            <li className="text-sm text-slate-400">{site.contact.email}</li>
            <li>
              <a href={`tel:${site.contact.phoneRaw}`} className="text-sm text-slate-400 transition-colors hover:text-primary-400">
                {site.contact.phone}
              </a>
            </li>
            <li className="text-sm text-slate-400">
              {site.contact.location}, {site.contact.city}
            </li>
          </ul>
        </div>
      </div>
      <div className="section border-t border-white/5 py-8">
        <div className="site-shell flex flex-col items-center justify-between gap-4 sm:flex-row">
          <p className="text-sm text-slate-500">{site.footer.legal}</p>
          <p className="text-[10px] font-bold uppercase tracking-widest text-slate-600">Built by Codenium Team</p>
        </div>
      </div>
    </footer>

  );
}
