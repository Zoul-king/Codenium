"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import { BrandLogo, CloseIcon, MenuIcon, SocialIcon } from "@/components/common/icons";
import { UserMenu } from "@/features/auth/components/user-menu";
import { getDashboardRoute } from "@/features/auth/lib/auth-service";
import { site } from "@/features/marketing/data/site";
import type { HeaderVariant } from "@/features/marketing/types";
import type { PublicUser } from "@/lib/auth/session";
import { cn } from "@/lib/utils";

interface HeaderProps {
  variant: HeaderVariant;
  contactEmail: string;
  user: PublicUser | null;
}

export function Header({ variant, contactEmail, user }: HeaderProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

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
            {user ? (
              <UserMenu user={user} variant={isLight ? "light" : "dark"} />
            ) : (
              <Link
                href="/login"
                className="inline-flex items-center justify-center rounded-[5px] border border-primary-500 bg-white px-6 py-2 text-sm font-extrabold text-primary-500 transition-all duration-500 ease-in-out hover:bg-primary-500 hover:text-white lg:text-base"
              >
                Iniciar sesión
              </Link>
            )}
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

      {mounted ? (
        <MobileMenu open={mobileOpen} onClose={() => setMobileOpen(false)} contactEmail={contactEmail} user={user} />
      ) : null}
    </>
  );
}

interface MobileMenuProps {
  open: boolean;
  onClose: () => void;
  contactEmail: string;
  user: PublicUser | null;
}

function MobileMenu({ open, onClose, contactEmail, user }: MobileMenuProps) {
  return (
    <div className={cn("fixed inset-0 z-50 lg:hidden", open ? "pointer-events-auto" : "pointer-events-none")} aria-hidden={!open}>
      <div className={cn("absolute inset-0 bg-surface-soft transition-opacity duration-500", open ? "opacity-100" : "opacity-0")} onClick={onClose} />
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
                className="block rounded-[18px] bg-surface-soft px-4 py-4 text-lg font-semibold transition-colors hover:text-primary-500"
                onClick={onClose}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {user ? <MobileUserBlock user={user} onClose={onClose} /> : <MobileAuthCtas onClose={onClose} />}

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

function MobileAuthCtas({ onClose }: { onClose: () => void }) {
  return (
    <div className="flex flex-col gap-3">
      <Link
        href="/login"
        onClick={onClose}
        className="inline-flex items-center justify-center rounded-[5px] bg-primary-500 px-6 py-3 text-base font-extrabold text-white transition-colors hover:bg-primary-600"
      >
        Iniciar sesión
      </Link>
      <Link
        href="/register"
        onClick={onClose}
        className="inline-flex items-center justify-center rounded-[5px] border border-primary-500 bg-white px-6 py-3 text-base font-extrabold text-primary-500 transition-colors hover:bg-primary-500 hover:text-white"
      >
        Crear cuenta
      </Link>
    </div>
  );
}

function MobileUserBlock({ user, onClose }: { user: PublicUser; onClose: () => void }) {
  return (
    <div className="rounded-[18px] bg-surface-soft p-5">
      <p className="text-sm font-semibold text-body-color">{user.name}</p>
      <p className="mt-0.5 truncate text-xs text-body-color/70">{user.email}</p>
      <div className="mt-4 flex flex-col gap-3">
        <Link
          href={getDashboardRoute(user.role)}
          onClick={onClose}
          className="inline-flex items-center justify-center rounded-[5px] bg-primary-500 px-6 py-3 text-base font-extrabold text-white transition-colors hover:bg-primary-600"
        >
          Mi cuenta
        </Link>
        <MobileLogoutButton onClose={onClose} />
      </div>
    </div>
  );
}

function MobileLogoutButton({ onClose }: { onClose: () => void }) {
  const [isLoading, setIsLoading] = useState(false);

  async function handleClick() {
    setIsLoading(true);
    const { logout } = await import("@/features/auth/lib/session-store");
    await logout();
    onClose();
    window.location.href = "/";
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={isLoading}
      className="inline-flex items-center justify-center rounded-[5px] border border-primary-500 bg-white px-6 py-3 text-base font-extrabold text-primary-500 transition-colors hover:bg-primary-500 hover:text-white disabled:opacity-60"
    >
      {isLoading ? "Cerrando…" : "Cerrar sesión"}
    </button>
  );
}
