import Link from "next/link";
import type { ReactNode } from "react";

interface AuthCardProps {
  kicker: string;
  title: string;
  description: string;
  children: ReactNode;
  footer?: ReactNode;
}

export function AuthCard({ kicker, title, description, children, footer }: AuthCardProps) {
  return (
    <div className="mx-auto grid max-w-6xl grid-cols-1 gap-8 lg:grid-cols-[0.8fr_1.2fr]">
      <article className="rounded-[24px] bg-white p-8 shadow-[0_16px_40px_rgba(14,20,36,0.08)]" data-animate="fadeInFromLeft">
        <span className="type-kicker">{kicker}</span>
        <h2 className="mt-4 text-[28px] font-bold leading-8 text-body-color lg:text-[40px] lg:leading-[48px]">{title}</h2>
        <p className="type-body mt-4">{description}</p>
        <div className="mt-8 space-y-4">
          <div className="rounded-[18px] bg-foreground p-4">
            <span className="text-sm font-semibold text-primary-500">Cuenta cliente</span>
            <p className="mt-2 text-sm text-body-color">Desde aquí puedes dar seguimiento a tus cotizaciones, proyectos y mensajes en un solo lugar.</p>
          </div>
          <div className="rounded-[18px] bg-foreground p-4">
            <span className="text-sm font-semibold text-primary-500">Cuentas internas</span>
            <p className="mt-2 text-sm text-body-color">Los perfiles de PM y administración se gestionan por separado para mantener el control operativo.</p>
          </div>
        </div>
      </article>

      <article className="rounded-[24px] bg-white p-6 shadow-[0_16px_40px_rgba(14,20,36,0.08)] sm:p-8" data-animate="fadeInFromRight">
        {children}
        {footer ? <div className="mt-6 border-t border-black/10 pt-6">{footer}</div> : null}
      </article>
    </div>
  );
}

export function AuthFooterLinks() {
  return (
    <div className="flex flex-col gap-3 text-sm text-body-color sm:flex-row sm:items-center sm:justify-between">
      <Link href="/register" className="hover:text-primary-500">
        Crear cuenta cliente
      </Link>
      <Link href="/forgot-password" className="hover:text-primary-500">
        Recuperar acceso
      </Link>
    </div>
  );
}
