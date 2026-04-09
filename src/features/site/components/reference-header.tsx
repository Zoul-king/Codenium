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
      <header className="absolute inset-x-0 top-0 z-30 h-28">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-3 py-2 text-white">
          <Link href="/" aria-label="Inicio">
            <BrandLogo variant={whiteHeader ? "white" : "pink"} className="w-[112px] xl:ml-[-16px]" />
          </Link>
          <button
            type="button"
            className={`group flex items-center gap-2 transition-colors ${topHeaderTextClass} type-menu-trigger`}
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
          <header className="absolute inset-x-0 top-0 z-10 h-28 text-body-color">
            <div className="mx-auto flex max-w-7xl items-center justify-between px-3 py-2 text-white">
              <Link href="/" aria-label="Inicio" onClick={() => setOpen(false)}>
                <BrandLogo variant="pink" className="w-[112px] xl:ml-[-16px]" />
              </Link>
              <button
                type="button"
                className="group flex items-center gap-2 text-white transition-colors hover:text-primary-500 type-menu-trigger"
                aria-expanded={open}
                aria-label="Cerrar menú"
                onClick={() => setOpen(false)}
              >
                <MenuIcon />
                Menú
              </button>
            </div>
          </header>

          <div
            className={`mx-auto mt-[90px] flex h-[calc(90vh-50px)] max-w-7xl flex-col items-center justify-start overflow-y-scroll px-4 pb-8 transition-all duration-700 ease-in-out md:justify-around md:overflow-y-hidden xl:mt-[115px] xl:h-[calc(80vh)] ${open ? "translate-y-0 opacity-100" : "translate-y-5 opacity-0"}`}
          >
            <div className="mt-10 flex h-[calc(100dvh-20px)] w-full flex-col items-center justify-start divide-y divide-body-color pb-8 sm:h-[calc(80dvh-50px)] sm:flex-row sm:divide-x sm:divide-y-0 md:mt-0 md:justify-between">
              <div className="w-full">
                <nav className="mx-auto w-full p-4 md:max-w-[400px]">
                  <ol className="flex flex-col justify-center gap-y-5 lg:gap-y-12">
                    {sharedSite.menu.map((item, index) => (
                      <li key={item.href} className="flex items-end gap-x-2">
                        <span className="type-overlay-index">{String(index + 1).padStart(2, "0")}</span>
                        <Link href={item.href} className="type-overlay-link transition-colors hover:underline" onClick={() => setOpen(false)}>
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
                    <span className="type-overlay-title font-bold">{sharedSite.overlay.location}</span>
                    <span className="text-lg font-light lg:text-xl">{sharedSite.overlay.city}</span>
                  </div>
                  <div className="mb-4 flex flex-col gap-y-[5px] lg:mb-[26px]">
                    <span className="type-overlay-title text-primary-500">Contacto</span>
                    <ul className="mb-[15px] text-lg font-light lg:text-xl lg:leading-9">
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
                    <span className="mb-2 text-2xl leading-9 text-primary-500 lg:text-[32px]">Redes sociales</span>
                    <ul className="flex gap-x-[15px] text-sm">
                      {sharedSite.socials.map((social) => (
                        <li key={social.label} className="rounded-[5px] transition-all duration-300 ease-in-out hover:scale-105 hover:bg-primary-100/50">
                          <a href={social.href} target="_blank" rel="noreferrer" aria-label={social.label}>
                            <SocialIcon type={social.icon} className="size-[50px]" />
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
