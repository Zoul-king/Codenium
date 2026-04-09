"use client";

import { useState } from "react";

import { AuthField, AuthMessage } from "@/features/auth/components/auth-fields";
import { validateForgotPassword } from "@/features/auth/lib/auth-service";

export function ForgotPasswordForm() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const result = validateForgotPassword({ email });

    if (result.includes("válido") || result.includes("asociado")) {
      setSuccess(false);
      setMessage(result);
      return;
    }

    setSuccess(true);
    setMessage(result);
  }

  return (
    <form className="flex flex-col gap-6" onSubmit={handleSubmit}>
      <AuthField label="Correo electrónico" placeholder="tu@empresa.com" type="email" value={email} onChange={setEmail} />
      {message ? <AuthMessage tone={success ? "success" : "error"}>{message}</AuthMessage> : null}
      <button type="submit" className="primary-button w-fit">
        Enviar instrucciones mock
      </button>
    </form>
  );
}
