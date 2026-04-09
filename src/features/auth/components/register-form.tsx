"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";

import { AuthField, AuthMessage } from "@/features/auth/components/auth-fields";
import { getDashboardRoute, validateRegister } from "@/features/auth/lib/auth-service";
import { writeSession } from "@/features/auth/lib/session-store";

export function RegisterForm() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    company: "",
    password: "",
    confirmPassword: ""
  });
  const [message, setMessage] = useState<string | null>(null);

  function updateField(key: keyof typeof form, value: string) {
    setForm((current) => ({
      ...current,
      [key]: value
    }));
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const result = validateRegister(form);

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
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <AuthField label="Nombre" placeholder="Nombre" value={form.firstName} onChange={(value) => updateField("firstName", value)} />
        <AuthField label="Apellido" placeholder="Apellido" value={form.lastName} onChange={(value) => updateField("lastName", value)} />
      </div>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <AuthField label="Correo electrónico" placeholder="tu@empresa.com" type="email" value={form.email} onChange={(value) => updateField("email", value)} />
        <AuthField label="Teléfono" placeholder="+52..." value={form.phone} onChange={(value) => updateField("phone", value)} />
      </div>
      <AuthField label="Empresa (opcional)" placeholder="Nombre de tu empresa" value={form.company} onChange={(value) => updateField("company", value)} />
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <AuthField label="Contraseña" placeholder="Mínimo 8 caracteres" type="password" value={form.password} onChange={(value) => updateField("password", value)} />
        <AuthField
          label="Confirmar contraseña"
          placeholder="Repite tu contraseña"
          type="password"
          value={form.confirmPassword}
          onChange={(value) => updateField("confirmPassword", value)}
        />
      </div>

      {message ? <AuthMessage tone="error">{message}</AuthMessage> : null}

      <button type="submit" className="primary-button w-fit" disabled={isPending}>
        {isPending ? "Creando cuenta..." : "Crear cuenta cliente"}
      </button>
    </form>
  );
}
