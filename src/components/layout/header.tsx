"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Mail, Phone } from "lucide-react";

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

export function Header({ contactEmail, user }: HeaderProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    setMounted(true);

    function onScroll() {
      setScrolled(window.scrollY > 16);
    }

    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <header
        className={cn(
          "fixed inset-x-0 top-0 z-30 h-[72px] bg-white transition-shadow duration-200 ease-out",
          scrolled ? "shadow-[0_4px_18px_rgba(15,23,42,0.06)]" : "shadow-none"
        )}
      >
        <div className="site-shell flex h-full items-center justify-between px-4 sm:px-6">
          {/* Logo */}
          <Link href="/" aria-label="Inicio" className="flex-shrink-0">
            <BrandLogo variant="header" className="w-[100px] md:w-[112px]" priority />
          </Link>

          {/* Desktop nav */}
          <nav className="hidden items-center gap-6 lg:flex xl:gap-8">
            {site.nav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="nav-underline text-[13.5px] font-semibold tracking-[0.01em] text-body-color/80 transition-colors hover:text-primary-500 xl:text-sm"
              >
                <span className="relative inline-block pb-[5px]">{item.label}</span>
              </Link>
            ))}
          </nav>

          {/* Desktop CTA */}
          <div className="hidden lg:block">
            {user ? (
              <UserMenu user={user} variant="dark" />
            ) : (
              <Link
                href="/login"
                className="inline-flex items-center justify-center rounded-[6px] border border-primary-500 bg-transparent px-5 py-2 text-sm font-bold text-primary-500 transition-all duration-200 hover:bg-primary-500 hover:text-white"
              >
                Iniciar sesión
              </Link>
            )}
          </div>

          {/* Mobile burger */}
          <button
            type="button"
            className="group flex items-center gap-2 text-body-color/80 transition-colors hover:text-primary-500 type-menu-trigger lg:hidden"
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
          "absolute inset-x-0 top-0 max-h-[100dvh] overflow-y-auto bg-white px-5 pb-10 pt-5 shadow-2xl transition-transform duration-300 ease-out",
          open ? "translate-y-0" : "-translate-y-full"
        )}
      >
        {/* Header row */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-5">
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

          {/* Redes sociales con email + teléfono */}
          <div className="rounded-2xl bg-surface-soft p-5">
            <p className="mb-4 text-[11px] font-bold uppercase tracking-[0.14em] text-primary-500">Redes sociales</p>
            <ul className="flex flex-wrap gap-2">
              {site.socials.map((social) => (
                <li key={social.label}>
                  <a
                    href={social.href}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={social.label}
                    className="flex size-10 items-center justify-center rounded-lg bg-white text-slate-600 shadow-sm transition hover:bg-primary-500 hover:text-white"
                  >
                    <SocialIcon type={social.icon} className="size-[18px]" />
                  </a>
                </li>
              ))}
              <li>
                <a
                  href={`mailto:${contactEmail}`}
                  aria-label="Correo"
                  className="flex size-10 items-center justify-center rounded-lg bg-white text-slate-600 shadow-sm transition hover:bg-primary-500 hover:text-white"
                >
                  <Mail className="size-[18px]" strokeWidth={1.8} />
                </a>
              </li>
              <li>
                <a
                  href={`tel:${site.contact.phoneRaw}`}
                  aria-label="Teléfono"
                  className="flex size-10 items-center justify-center rounded-lg bg-white text-slate-600 shadow-sm transition hover:bg-primary-500 hover:text-white"
                >
                  <Phone className="size-[18px]" strokeWidth={1.8} />
                </a>
              </li>
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
