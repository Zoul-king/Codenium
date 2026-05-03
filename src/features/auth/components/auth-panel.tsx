"use client";

import Link from "next/link";

import { LoginForm } from "@/features/auth/components/login-form";
import { RegisterForm } from "@/features/auth/components/register-form";
import { SessionStatus } from "@/features/auth/components/session-status";
import { cn } from "@/lib/utils";

type AuthMode = "login" | "register";

interface AuthPanelProps {
  mode: AuthMode;
  onSuccess?: () => void;
  showSessionStatus?: boolean;
}

export function AuthPanel({ mode, onSuccess, showSessionStatus = false }: AuthPanelProps) {
  return (
    <div className="rounded-[20px] bg-white p-4 shadow-[0_16px_40px_rgba(14,20,36,0.08)] sm:rounded-[24px] sm:p-8">
      <div className="mb-4 flex flex-col gap-3 sm:mb-6">
        <div className="flex gap-2 rounded-[14px] bg-surface-soft p-1.5 sm:rounded-[18px] sm:p-2">
          <Link
            href="/login"
            className={cn(
              "flex-1 rounded-[12px] px-3 py-1.5 text-center text-sm font-semibold transition-colors sm:rounded-[14px] sm:px-4 sm:py-2",
              mode === "login" ? "bg-white text-primary-500 shadow-[0_8px_18px_rgba(14,20,36,0.08)]" : "text-body-color hover:text-primary-500"
            )}
          >
            Iniciar sesión
          </Link>
          <Link
            href="/register"
            className={cn(
              "flex-1 rounded-[12px] px-3 py-1.5 text-center text-sm font-semibold transition-colors sm:rounded-[14px] sm:px-4 sm:py-2",
              mode === "register" ? "bg-white text-primary-500 shadow-[0_8px_18px_rgba(14,20,36,0.08)]" : "text-body-color hover:text-primary-500"
            )}
          >
            Crear cuenta
          </Link>
        </div>

        <div className="hidden sm:block">
          <h3 className="text-xl font-bold text-body-color">{mode === "login" ? "Accede a tu cuenta" : "Crea tu cuenta cliente"}</h3>
          <p className="mt-2 text-sm leading-6 text-body-color">
            {mode === "login"
              ? "Revisa tus cotizaciones, proyectos y mensajes en un solo lugar."
              : "Abre tu cuenta para continuar tus solicitudes y dar seguimiento a cada avance."}
          </p>
        </div>
      </div>

      {mode === "login" ? <LoginForm onSuccess={onSuccess} /> : <RegisterForm onSuccess={onSuccess} />}

      {showSessionStatus ? (
        <div className="mt-6 hidden sm:block">
          <SessionStatus />
        </div>
      ) : null}
    </div>
  );
}
