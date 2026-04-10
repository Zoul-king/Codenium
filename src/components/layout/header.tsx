"use client";

import Link from "next/link";
import { useState } from "react";

import { BrandLogo, CloseIcon, MenuIcon, SocialIcon } from "@/components/ui/icons";
import { AuthPanel } from "@/features/auth/components/auth-panel";
import { site } from "@/features/marketing/data/site";
import type { HeaderVariant } from "@/features/marketing/types";
import { cn } from "@/lib/utils";

interface HeaderProps {
  variant: HeaderVariant;
  contactEmail: string;
}

export function Header({ variant, contactEmail }: HeaderProps) {
  const [accessOpen, setAccessOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const isLight = variant === "white";
  const textClassName = isLight ? "text-white" : "text-body-color";
  const navClassName = isLight ? "text-white/90 hover:text-primary-500" : "text-body-color hover:text-primary-500";

  return (
    <>
      <header className="absolute inset-x-0 top-0 z-30 h-28">
        <div className={cn("site-shell flex items-center justify-between px-3 py-6", textClassName)}>
          <Link href="/" aria-label="Inicio">
            <BrandLogo variant="header" className="w-[96px] md:w-[112px] xl:ml-[-4px]" priority />
          </Link>

          <nav className="hidden items-center gap-7 lg:flex">
            {site.nav.map((item) => (
              <Link key={item.href} href={item.href} className={cn("nav-underline text-sm font-semibold transition-colors", navClassName)}>
                <span className="relative inline-block pb-[6px]">{item.label}</span>
              </Link>
            ))}
          </nav>

          <div className="hidden lg:block">
            <button
              type="button"
              className="inline-flex items-center justify-center rounded-[5px] border border-primary-500 bg-white px-6 py-2 text-sm font-extrabold text-primary-500 transition-all duration-500 ease-in-out hover:bg-primary-500 hover:text-white lg:text-base"
              onClick={() => setAccessOpen(true)}
            >
              Iniciar sesión
            </button>
          </div>

          <button
            type="button"
            className={cn("group flex items-center gap-2 transition-colors type-menu-trigger lg:hidden", navClassName)}
            aria-expanded={mobileOpen}
            aria-label={mobileOpen ? "Cerrar menú" : "Abrir menú"}
            onClick={() => setMobileOpen((current) => !current)}
          >
            {mobileOpen ? <CloseIcon className="size-4" /> : <MenuIcon />}
            Menú
          </button>
        </div>
      </header>

      <AccessOverlay open={accessOpen} onClose={() => setAccessOpen(false)} />
      <MobileMenu open={mobileOpen} onClose={() => setMobileOpen(false)} contactEmail={contactEmail} />
    </>
  );
}

interface OverlayProps {
  open: boolean;
  onClose: () => void;
}

function AccessOverlay({ open, onClose }: OverlayProps) {
  return (
    <div className={cn("fixed inset-0 z-50 hidden lg:block", open ? "pointer-events-auto" : "pointer-events-none")} aria-hidden={!open}>
      <div className={cn("absolute inset-0 bg-foreground/90 transition-opacity duration-500", open ? "opacity-100" : "opacity-0")} onClick={onClose} />
      <div className="absolute inset-0 flex items-center justify-center p-6">
        <div
          className={cn(
            "w-full max-w-[1080px] rounded-[30px] bg-white p-8 text-body-color shadow-[0_24px_60px_rgba(14,20,36,0.18)] transition-all duration-500",
            open ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"
          )}
        >
          <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
            <div className="rounded-[24px] bg-foreground p-8">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <span className="type-kicker">Bienvenido</span>
                  <h2 className="mt-4 text-[32px] font-bold leading-10 text-body-color">Accede o crea tu cuenta</h2>
                  <p className="type-body mt-4 max-w-[28rem]">
                    Revisa tu estimado, sigue el avance de tus proyectos y mantén la conversación en un solo lugar.
                  </p>
                </div>
                <button type="button" onClick={onClose} className="rounded-full border border-black/10 p-3 text-body-color transition hover:text-primary-500" aria-label="Cerrar acceso">
                  <CloseIcon className="size-4" />
                </button>
              </div>

              <div className="mt-8 space-y-4">
                <div className="rounded-[18px] bg-white p-4 shadow-[0_12px_24px_rgba(14,20,36,0.06)]">
                  <span className="text-sm font-semibold text-primary-500">Cotización y seguimiento</span>
                  <p className="mt-2 text-sm leading-6 text-body-color">Consulta tu estimado inicial, tus proyectos y los mensajes más recientes.</p>
                </div>
                <div className="rounded-[18px] bg-white p-4 shadow-[0_12px_24px_rgba(14,20,36,0.06)]">
                  <span className="text-sm font-semibold text-secondary-600">Todo en continuidad</span>
                  <p className="mt-2 text-sm leading-6 text-body-color">Tu cuenta conserva el contexto para no empezar desde cero cada vez.</p>
                </div>
              </div>
            </div>

            <AuthPanel compact onSuccess={onClose} />
          </div>
        </div>
      </div>
    </div>
  );
}

function MobileMenu({ open, onClose, contactEmail }: OverlayProps & { contactEmail: string }) {
  return (
    <div className={cn("fixed inset-0 z-50 lg:hidden", open ? "pointer-events-auto" : "pointer-events-none")} aria-hidden={!open}>
      <div className={cn("absolute inset-0 bg-foreground transition-opacity duration-500", open ? "opacity-100" : "opacity-0")} onClick={onClose} />
      <div
        className={cn(
          "absolute inset-x-0 top-0 min-h-dvh overflow-y-auto bg-white px-5 pb-8 pt-6 text-body-color transition-transform duration-500",
          open ? "translate-y-0" : "-translate-y-full"
        )}
      >
        <div className="flex items-center justify-between">
          <Link href="/" aria-label="Inicio" onClick={onClose}>
            <BrandLogo variant="header" className="w-[94px]" />
          </Link>
          <button type="button" onClick={onClose} className="group flex items-center gap-2 text-body-color transition-colors hover:text-primary-500 type-menu-trigger">
            <CloseIcon className="size-4" />
            Cerrar
          </button>
        </div>

        <div className="mt-10 space-y-8">
          <nav className="space-y-3">
            {site.nav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="block rounded-[18px] bg-foreground px-4 py-4 text-lg font-semibold transition-colors hover:text-primary-500"
                onClick={onClose}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="rounded-[24px] bg-foreground p-5">
            <span className="type-kicker">Acceso</span>
            <h3 className="mt-4 text-2xl font-bold text-body-color">Entra o crea tu cuenta</h3>
            <p className="type-body mt-3">Consulta tus cotizaciones, proyectos y mensajes desde un solo lugar.</p>
            <div className="mt-6">
              <AuthPanel compact onSuccess={onClose} />
            </div>
          </div>

          <div>
            <p className="text-sm font-semibold text-primary-500">Contacto</p>
            <div className="mt-3 space-y-2 text-sm text-body-color">
              <a href={`mailto:${contactEmail}`} className="block hover:text-primary-500">
                {contactEmail}
              </a>
              <a href={`tel:${site.contact.phoneRaw}`} className="block hover:text-primary-500">
                {site.contact.phone}
              </a>
            </div>
            <ul className="mt-5 flex gap-3">
              {site.socials.map((social) => (
                <li key={social.label} className="rounded-[5px] transition-all duration-300 ease-in-out hover:scale-105 hover:bg-primary-100/50">
                  <a href={social.href} target="_blank" rel="noreferrer" aria-label={social.label}>
                    <SocialIcon type={social.icon} className="size-[44px]" />
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
