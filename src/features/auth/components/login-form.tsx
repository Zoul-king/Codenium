"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";

import { AuthField, AuthMessage } from "@/features/auth/components/auth-fields";
import { getDashboardRoute } from "@/features/auth/lib/auth-service";
import { writeSession } from "@/features/auth/lib/session-store";
import { cn } from "@/lib/utils";

interface LoginFormProps {
  onSuccess?: () => void;
  onForgotPassword?: () => void;
  showSupportText?: boolean;
  submitClassName?: string;
}

export function LoginForm({ onSuccess, onForgotPassword, showSupportText = false, submitClassName }: LoginFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState<string | null>(null);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage(null);

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ email, password })
      });

      const result = await response.json();

      if (!response.ok) {
        setMessage(result.error || "No se pudo iniciar sesión.");
        return;
      }

      writeSession({
        userId: result.userId,
        role: result.role,
        name: result.name,
        email: result.email,
        permissions: []
      });

      onSuccess?.();

      startTransition(() => {
        router.push(getDashboardRoute(result.role));
      });
    } catch {
      setMessage("Ocurrió un error al iniciar sesión.");
    }
  }

  return (
    <form className="flex flex-col gap-6" onSubmit={handleSubmit}>
      <div className="grid grid-cols-1 gap-6">
        <AuthField label="Correo electrónico" placeholder="tu@empresa.com" type="email" value={email} onChange={setEmail} />
        <AuthField label="Contraseña" placeholder="••••••••" type="password" value={password} onChange={setPassword} />
      </div>

      {message ? <AuthMessage tone="error">{message}</AuthMessage> : null}

      <button type="submit" className={cn("primary-button w-fit", submitClassName)} disabled={isPending}>
        {isPending ? "Entrando..." : "Iniciar sesión"}
      </button>

      <div className="flex flex-col gap-2 text-sm text-body-color">
        <button type="button" onClick={onForgotPassword} className="w-fit text-left transition-colors hover:text-primary-500">
          Olvidé mi contraseña
        </button>
        {showSupportText ? (
          <span>Prueba con `client@codenium.com`, `pm@codenium.com` o `admin@codenium.com`. Contraseña: `123provisional`.</span>
        ) : null}
      </div>
    </form>
  );
}