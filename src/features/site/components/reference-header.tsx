"use client";

import Link from "next/link";
import type { Dispatch, SetStateAction } from "react";

import { BrandLogo, MenuIcon, SocialIcon } from "@/components/ui/icons";
import { sharedSite } from "@/features/site/content/site-pages";
import type { SitePageDefinition } from "@/features/site/types";

interface ReferenceHeaderProps {
  page: SitePageDefinition;
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
}

export function ReferenceHeader({ page, open, setOpen }: ReferenceHeaderProps) {
  const whiteHeader = page.headerVariant === "white";
  const topHeaderTextClass = whiteHeader ? "text-white hover:text-primary-500" : "text-body-color hover:text-primary-500";

  return (
    <>
      <header className="absolute inset-x-0 top-0 z-30 h-24">
        <div className="mx-auto flex max-w-[1180px] items-center justify-between px-4 py-3 md:px-6 lg:px-10 lg:py-4">
          <Link href="/" aria-label="Inicio">
            <BrandLogo variant={whiteHeader ? "white" : "pink"} className="w-[54px] md:w-[64px]" />
          </Link>
          <button
            type="button"
            className={`group flex items-center gap-2 text-base font-normal leading-7 transition-colors ${topHeaderTextClass}`}
            aria-expanded={open}
            aria-label="Abrir menú"
            onClick={() => setOpen((current) => !current)}
          >
            <MenuIcon />
            Menú
          </button>
        </div>
      </header>

      <div
        className={`fixed inset-0 z-40 bg-[#EFEFEF] transition-opacity duration-700 ease-in-out ${open ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"}`}
        onClick={() => setOpen(false)}
      />

      <div
        className={`fixed inset-x-0 bottom-0 z-50 h-full transition-transform duration-700 ease-in-out ${open ? "pointer-events-auto translate-y-0 opacity-100" : "pointer-events-none translate-y-full opacity-0"}`}
      >
        <div className="absolute inset-0 bg-white">
          <header className="absolute inset-x-0 top-0 z-10 h-24 text-body-color">
            <div className="mx-auto flex max-w-[1180px] items-center justify-between px-4 py-3 md:px-6 lg:px-10 lg:py-4">
              <Link href="/" aria-label="Inicio" onClick={() => setOpen(false)}>
                <BrandLogo variant="pink" className="w-[54px] md:w-[64px]" />
              </Link>
              <button
                type="button"
                className="group flex items-center gap-2 text-base font-normal leading-7 text-body-color transition-colors hover:text-primary-500"
                aria-expanded={open}
                aria-label="Cerrar menú"
                onClick={() => setOpen(false)}
              >
                <span className="text-xl leading-none">x</span>
                Cerrar
              </button>
            </div>
          </header>

          <div
            className={`mx-auto mt-[82px] flex h-[calc(90vh-50px)] max-w-[1180px] flex-col items-center justify-start overflow-y-scroll px-4 pb-8 transition-all duration-700 ease-in-out md:overflow-y-hidden xl:mt-[96px] xl:h-[calc(80vh)] ${open ? "translate-y-0 opacity-100" : "translate-y-5 opacity-0"}`}
          >
            <div className="flex h-[calc(100dvh-20px)] w-full flex-col items-center justify-start divide-y divide-body-color pb-8 sm:h-[calc(80dvh-50px)] sm:flex-row sm:divide-x sm:divide-y-0 md:justify-between">
              <div className="w-full">
                <nav className="mx-auto w-full p-4 md:max-w-[400px]">
                  <ol className="flex flex-col justify-center gap-y-5 lg:gap-y-9">
                    {sharedSite.menu.map((item, index) => (
                      <li key={item.href} className="flex items-end gap-x-2">
                        <span className="inline-block text-base text-primary-500 md:text-lg lg:text-xl xl:text-2xl">
                          {String(index + 1).padStart(2, "0")}
                        </span>
                        <Link
                          href={item.href}
                          className="text-[30px] leading-none transition-colors hover:underline md:text-[34px] lg:text-[36px]"
                          onClick={() => setOpen(false)}
                        >
                          {item.label}
                        </Link>
                      </li>
                    ))}
                  </ol>
                </nav>
              </div>

              <div className="w-full">
                <div className="mx-auto w-full p-4 md:max-w-[400px]">
                  <div className="mb-8 flex flex-col gap-y-[5px] lg:mb-[68px]">
                    <span className="text-[28px] font-normal leading-8 lg:text-[30px]">{sharedSite.overlay.location}</span>
                    <span className="text-base font-normal lg:text-lg">{sharedSite.overlay.city}</span>
                  </div>
                  <div className="mb-4 flex flex-col gap-y-[5px] lg:mb-[26px]">
                    <span className="text-[28px] font-normal text-primary-500 lg:text-[30px] lg:leading-9">Contacto</span>
                    <ul className="mb-[15px] text-base font-normal lg:text-lg lg:leading-8">
                      <li>
                        <a href={`mailto:${sharedSite.overlay.email}`} className="hover:underline">
                          {sharedSite.overlay.email}
                        </a>
                      </li>
                      <li>
                        <a href={`tel:${sharedSite.overlay.phoneRaw}`} className="hover:underline">
                          {sharedSite.overlay.phone}
                        </a>
                      </li>
                    </ul>
                  </div>
                  <div className="flex flex-col gap-y-2">
                    <span className="mb-2 text-[28px] font-normal leading-9 text-primary-500 lg:text-[30px]">Redes sociales</span>
                    <ul className="flex gap-x-[15px] text-sm">
                      {sharedSite.socials.map((social) => (
                        <li key={social.label} className="rounded-[5px] transition-all duration-300 ease-in-out hover:scale-105 hover:bg-primary-100/50">
                          <a
                            href={social.href}
                            target="_blank"
                            rel="noreferrer"
                            aria-label={social.label}
                            className="grid size-[46px] place-content-center rounded-[5px] border border-primary-100 text-primary-500"
                          >
                            <SocialIcon type={social.icon} className="size-5" />
                          </a>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
