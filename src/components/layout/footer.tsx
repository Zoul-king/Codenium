import Link from "next/link";

import { BrandLogo, SocialIcon } from "@/components/ui/icons";
import { site } from "@/features/marketing/data/site";

export function Footer() {
  return (
    <footer className="bg-[#212529]">
      <div className="section mx-auto flex max-w-7xl flex-col justify-between md:flex-row md:flex-wrap md:pb-6 md:pt-[90px] lg:pb-[76px] xl:flex-nowrap">
        <div className="flex-1 md:min-w-[530px]">
          <BrandLogo variant="white" className="w-[125px]" />
          <p className="text-sm leading-6 text-white">{site.footer.body}</p>
        </div>
        <div className="grow pt-5">
          <span className="mb-[15px] inline-block text-xl font-bold leading-6 text-primary-300">Menú</span>
          <ul className="flex flex-col gap-y-[15px]">
            {site.footerNav.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="text-sm text-white">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div className="grow py-[23px] pt-5">
          <span className="mb-[15px] inline-block text-xl font-bold leading-6 text-primary-300">Contacto</span>
          <ul className="mb-[15px] flex flex-col gap-y-[15px] text-sm text-white">
            <li>{site.contact.email}</li>
            <li>
              <a href={`tel:${site.contact.phoneRaw}`} className="hover:underline">
                {site.contact.phone}
              </a>
            </li>
          </ul>
          <ul className="flex gap-x-5">
            {site.socials.map((social) => (
              <li key={social.label} className="rounded-[5px] transition-all duration-300 ease-in-out hover:scale-105 hover:bg-white/20">
                <a href={social.href} target="_blank" rel="noreferrer" aria-label={social.label}>
                  <SocialIcon type={social.icon} className="size-[29px]" />
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="section border-t border-[#DADADA]">
        <p className="py-[30px] text-center text-white">{site.footer.legal}</p>
      </div>
    </footer>
  );
}
