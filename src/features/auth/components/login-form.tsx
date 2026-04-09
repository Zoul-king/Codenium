"use client";

import Link from "next/link";
import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";

import { AuthField, AuthMessage } from "@/features/auth/components/auth-fields";
import { getDashboardRoute, validateLogin } from "@/features/auth/lib/auth-service";
import { writeSession } from "@/features/auth/lib/session-store";

export function LoginForm() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState<string | null>(null);

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const result = validateLogin({ email, password });

    if (typeof result === "string") {
      setMessage(result);
      return;
    }

    writeSession(result);
    setMessage(null);

    startTransition(() => {
      router.push(getDashboardRoute(result.role));
    });
  }

  return (
    <form className="flex flex-col gap-6" onSubmit={handleSubmit}>
      <div className="grid grid-cols-1 gap-6">
        <AuthField label="Correo electrónico" placeholder="tu@empresa.com" type="email" value={email} onChange={setEmail} />
        <AuthField label="Contraseña" placeholder="••••••••" type="password" value={password} onChange={setPassword} />
      </div>

      {message ? <AuthMessage tone="error">{message}</AuthMessage> : null}

      <button type="submit" className="primary-button w-fit" disabled={isPending}>
        {isPending ? "Entrando..." : "Iniciar sesión"}
      </button>

      <div className="flex flex-col gap-2 text-sm text-body-color">
        <Link href="/forgot-password" className="hover:text-primary-500">
          Olvidé mi contraseña
        </Link>
        <span>Credenciales mock sugeridas: `paola@valhui.mx`, `javier@axolotlcode.tech`, `admin@axolotlcode.tech`.</span>
      </div>
    </form>
  );
}
