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
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    setMounted(true);

    function onScroll() {
      setScrolled(window.scrollY > 32);
    }

    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // When scrolled, always use dark text regardless of variant
  const isLight = !scrolled && variant === "white";
  const textClassName = isLight ? "text-white" : "text-body-color";
  const navClassName = isLight
    ? "text-white/90 hover:text-white"
    : "text-body-color/80 hover:text-primary-500";

  return (
    <>
      <header
        className={cn(
          "fixed inset-x-0 top-0 z-30 transition-all duration-300",
          scrolled
            ? "h-[72px] border-b border-slate-200/60 bg-white/95 shadow-[0_2px_16px_rgba(0,0,0,0.06)] backdrop-blur-md"
            : "h-28 bg-transparent"
        )}
      >
        <div className={cn("site-shell flex h-full items-center justify-between px-4 sm:px-6", textClassName)}>
          {/* Logo */}
          <Link href="/" aria-label="Inicio" className="flex-shrink-0">
            <BrandLogo
              variant={isLight ? "white" : "header"}
              className={cn("transition-all duration-300", scrolled ? "w-[100px]" : "w-[96px] md:w-[108px]")}
              priority
            />
          </Link>

          {/* Desktop nav */}
          <nav className="hidden items-center gap-6 lg:flex xl:gap-8">
            {site.nav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "nav-underline text-[13.5px] font-semibold tracking-[0.01em] transition-colors xl:text-sm",
                  navClassName
                )}
              >
                <span className="relative inline-block pb-[5px]">{item.label}</span>
              </Link>
            ))}
          </nav>

          {/* Desktop CTA */}
          <div className="hidden lg:block">
            {user ? (
              <UserMenu user={user} variant={isLight ? "light" : "dark"} />
            ) : (
              <Link
                href="/login"
                className={cn(
                  "inline-flex items-center justify-center rounded-[6px] px-5 py-2 text-sm font-bold transition-all duration-200",
                  scrolled || !isLight
                    ? "border border-primary-500 bg-transparent text-primary-500 hover:bg-primary-500 hover:text-white"
                    : "border border-white/70 bg-white/10 text-white backdrop-blur-sm hover:bg-white hover:text-primary-500"
                )}
              >
                Iniciar sesión
              </Link>
            )}
          </div>

          {/* Mobile burger */}
          <button
            type="button"
            className={cn(
              "group flex items-center gap-2 transition-colors type-menu-trigger lg:hidden",
              navClassName
            )}
            aria-expanded={mobileOpen}
            aria-label={mobileOpen ? "Cerrar menú" : "Abrir menú"}
            onClick={() => setMobileOpen((v) => !v)}
          >
            {mobileOpen ? <CloseIcon className="size-4" /> : <MenuIcon />}
            <span className="text-[13px] font-bold">Menú</span>
          </button>
        </div>
      </header>

      {mounted ? (
        <MobileMenu
          open={mobileOpen}
          onClose={() => setMobileOpen(false)}
          contactEmail={contactEmail}
          user={user}
        />
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
    <div
      className={cn("fixed inset-0 z-50 lg:hidden", open ? "pointer-events-auto" : "pointer-events-none")}
      aria-hidden={!open}
    >
      {/* Backdrop */}
      <div
        className={cn(
          "absolute inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity duration-300",
          open ? "opacity-100" : "opacity-0"
        )}
        onClick={onClose}
      />

      {/* Drawer panel */}
      <div
        className={cn(
          "absolute inset-x-0 top-0 overflow-y-auto bg-white px-5 pb-10 pt-5 shadow-2xl transition-transform duration-300 ease-out",
          open ? "translate-y-0" : "-translate-y-full"
        )}
      >
        {/* Header row */}
        <div className="flex items-center justify-between pb-5 border-b border-slate-100">
          <Link href="/" aria-label="Inicio" onClick={onClose}>
            <BrandLogo variant="header" className="w-[90px]" />
          </Link>
          <button
            type="button"
            onClick={onClose}
            className="flex items-center gap-1.5 rounded-full border border-slate-200 px-3 py-1.5 text-xs font-bold text-body-color transition hover:border-primary-500 hover:text-primary-500"
          >
            <CloseIcon className="size-3.5" />
            Cerrar
          </button>
        </div>

        <div className="mt-6 space-y-7">
          {/* Nav links */}
          <nav className="space-y-1">
            {site.nav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-center justify-between rounded-xl px-4 py-3.5 text-[15px] font-semibold text-body-color transition-colors hover:bg-surface-soft hover:text-primary-500"
                onClick={onClose}
              >
                {item.label}
                <span className="text-slate-300">›</span>
              </Link>
            ))}
          </nav>

          {/* Auth block */}
          {user ? <MobileUserBlock user={user} onClose={onClose} /> : <MobileAuthCtas onClose={onClose} />}

          {/* Contact info */}
          <div className="rounded-2xl bg-surface-soft p-5">
            <p className="mb-3 text-[11px] font-bold uppercase tracking-[0.14em] text-primary-500">Contacto</p>
            <div className="space-y-2 text-sm text-body-color">
              <a href={`mailto:${contactEmail}`} className="block transition hover:text-primary-500">
                {contactEmail}
              </a>
              <a href={`tel:${site.contact.phoneRaw}`} className="block transition hover:text-primary-500">
                {site.contact.phone}
              </a>
            </div>
            <ul className="mt-4 flex gap-2">
              {site.socials.map((social) => (
                <li key={social.label}>
                  <a
                    href={social.href}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={social.label}
                    className="flex size-9 items-center justify-center rounded-lg bg-white text-slate-600 shadow-sm transition hover:bg-primary-500 hover:text-white"
                  >
                    <SocialIcon type={social.icon} className="size-4" />
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
        className="inline-flex items-center justify-center rounded-xl bg-primary-500 px-6 py-3.5 text-sm font-bold text-white transition hover:bg-primary-600"
      >
        Iniciar sesión
      </Link>
      <Link
        href="/register"
        onClick={onClose}
        className="inline-flex items-center justify-center rounded-xl border border-primary-500 bg-white px-6 py-3.5 text-sm font-bold text-primary-500 transition hover:bg-primary-500 hover:text-white"
      >
        Crear cuenta
      </Link>
    </div>
  );
}

function MobileUserBlock({ user, onClose }: { user: PublicUser; onClose: () => void }) {
  return (
    <div className="rounded-2xl border border-slate-100 bg-surface-soft p-5">
      <div className="flex items-center gap-3">
        <div className="grid size-10 shrink-0 place-items-center rounded-full bg-primary-500 text-sm font-bold text-white">
          {user.firstName?.[0] ?? user.name[0]}
        </div>
        <div className="min-w-0">
          <p className="text-sm font-semibold text-body-color">{user.name}</p>
          <p className="truncate text-xs text-body-color/60">{user.email}</p>
        </div>
      </div>
      <div className="mt-4 flex flex-col gap-3">
        <Link
          href={getDashboardRoute(user.role)}
          onClick={onClose}
          className="inline-flex items-center justify-center rounded-xl bg-primary-500 px-6 py-3 text-sm font-bold text-white transition hover:bg-primary-600"
        >
          Mi dashboard
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
      className="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white px-6 py-3 text-sm font-bold text-body-color transition hover:border-error-500 hover:text-error-600 disabled:opacity-60"
    >
      {isLoading ? "Cerrando…" : "Cerrar sesión"}
    </button>
  );
}
