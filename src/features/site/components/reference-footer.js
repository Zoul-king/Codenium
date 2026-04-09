import Link from "next/link";
import { BrandLogo, SocialIcon } from "@/components/ui/icons";
import { sharedSite } from "@/features/site/content/site-pages";

export function ReferenceFooter() {
  return (
    <footer className="bg-[#212529]">
      <div className="section mx-auto flex max-w-7xl flex-col justify-between md:flex-row md:flex-wrap md:pt-[90px] md:pb-6 xl:flex-nowrap lg:pb-[76px]">
        <div className="min-w-0 flex-1 md:min-w-[530px]">
          <div className="mb-4">
            <BrandLogo variant="white" className="w-[86px]" />
          </div>
          <p className="text-sm leading-6 text-white">{sharedSite.footer.body}</p>
        </div>
        <div className="grow pt-5">
          <span className="mb-[15px] inline-block text-xl font-bold leading-6 text-primary-300">Menu</span>
          <ul className="flex flex-col gap-y-[15px]">
            {sharedSite.footerMenu.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="text-sm text-white transition-colors hover:text-primary-200">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div className="grow pt-5 py-[23px]">
          <span className="mb-[15px] inline-block text-xl font-bold leading-6 text-primary-300">Contacto</span>
          <ul className="mb-[15px] flex flex-col gap-y-[15px] text-sm text-white">
            <li>{sharedSite.overlay.email}</li>
            <li>
              <a href={`tel:${sharedSite.overlay.phoneRaw}`} className="hover:underline">
                {sharedSite.overlay.phone}
              </a>
            </li>
          </ul>
          <ul className="flex gap-x-5">
            {sharedSite.socials.map((social) => (
              <li key={social.label} className="rounded-[5px] transition-all duration-300 ease-in-out hover:scale-105 hover:bg-white/20">
                <a href={social.href} target="_blank" rel="noreferrer" aria-label={social.label} className="grid size-[29px] place-content-center text-white">
                  <SocialIcon type={social.icon} className="size-4" />
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="section border-t border-[#DADADA]">
        <p className="py-[30px] text-center text-white">{sharedSite.footer.legal}</p>
      </div>
    </footer>
  );
}
