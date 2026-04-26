"use client";

import { useState } from "react";

import { ForgotPasswordForm } from "@/features/auth/components/forgot-password-form";
import { LoginForm } from "@/features/auth/components/login-form";
import { RegisterForm } from "@/features/auth/components/register-form";
import { SessionStatus } from "@/features/auth/components/session-status";
import { cn } from "@/lib/utils";

type AuthMode = "login" | "register" | "forgot";

interface AuthPanelProps {
  initialMode?: Exclude<AuthMode, "forgot">;
  onSuccess?: () => void;
  compact?: boolean;
  showSessionStatus?: boolean;
}

export function AuthPanel({ initialMode = "login", onSuccess, compact = false, showSessionStatus = false }: AuthPanelProps) {
  const [mode, setMode] = useState<AuthMode>(initialMode);

  return (
    <div className={cn("rounded-[24px] bg-white p-6 shadow-[0_16px_40px_rgba(14,20,36,0.08)] sm:p-8", compact ? "p-0 shadow-none sm:p-0" : "")}>
      <div className={cn("flex flex-col gap-3", compact ? "" : "mb-6")}>
        <div className="flex gap-2 rounded-[18px] bg-surface-soft p-2">
          <button
            type="button"
            onClick={() => setMode("login")}
            className={cn(
              "flex-1 rounded-[14px] px-4 py-2 text-sm font-semibold transition-colors",
              mode === "login" ? "bg-white text-primary-500 shadow-[0_8px_18px_rgba(14,20,36,0.08)]" : "text-body-color hover:text-primary-500"
            )}
          >
            Iniciar sesión
          </button>
          <button
            type="button"
            onClick={() => setMode("register")}
            className={cn(
              "flex-1 rounded-[14px] px-4 py-2 text-sm font-semibold transition-colors",
              mode === "register" ? "bg-white text-primary-500 shadow-[0_8px_18px_rgba(14,20,36,0.08)]" : "text-body-color hover:text-primary-500"
            )}
          >
            Crear cuenta
          </button>
        </div>

        {mode === "forgot" ? (
          <div>
            <h3 className="text-xl font-bold text-body-color">Recupera tu acceso</h3>
            <p className="mt-2 text-sm leading-6 text-body-color">Déjanos tu correo y te mostraremos el siguiente paso.</p>
          </div>
        ) : (
          <div>
            <h3 className="text-xl font-bold text-body-color">{mode === "login" ? "Accede a tu cuenta" : "Crea tu cuenta cliente"}</h3>
            <p className="mt-2 text-sm leading-6 text-body-color">
              {mode === "login"
                ? "Revisa tus cotizaciones, proyectos y mensajes en un solo lugar."
                : "Abre tu cuenta para continuar tus solicitudes y dar seguimiento a cada avance."}
            </p>
          </div>
        )}
      </div>

      {mode === "login" ? <LoginForm onSuccess={onSuccess} onForgotPassword={() => setMode("forgot")} showSupportText /> : null}
      {mode === "register" ? <RegisterForm onSuccess={onSuccess} /> : null}
      {mode === "forgot" ? <ForgotPasswordForm onBack={() => setMode("login")} /> : null}

      {showSessionStatus ? (
        <div className="mt-6">
          <SessionStatus />
        </div>
      ) : null}
    </div>
  );
}
