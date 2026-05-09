"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useRouter, useSearchParams } from "next/navigation";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@/components/ui/form";
import { PasswordInput } from "@/components/ui/password-input";
import { AuthMessage } from "@/features/auth/components/auth-fields";

const schema = z
  .object({
    password: z.string().min(8, "Mínimo 8 caracteres"),
    confirmPassword: z.string()
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Las contraseñas no coinciden",
    path: ["confirmPassword"]
  });

type Values = z.infer<typeof schema>;

export function ResetPasswordForm() {
  const router = useRouter();
  const params = useSearchParams();
  const token = params.get("token") ?? "";

  const [feedback, setFeedback] = useState<{ success: boolean; message: string } | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const form = useForm<Values>({
    resolver: zodResolver(schema),
    defaultValues: { password: "", confirmPassword: "" }
  });

  if (!token) {
    return (
      <AuthMessage tone="error">
        Falta el token de recuperación. Solicita un nuevo enlace desde &quot;Olvidé mi contraseña&quot;.
      </AuthMessage>
    );
  }

  async function onSubmit(values: Values) {
    setSubmitting(true);
    setFeedback(null);
    try {
      const response = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...values, token })
      });
      const result = await response.json();

      if (!response.ok) {
        setFeedback({ success: false, message: result.message ?? "No pudimos actualizar la contraseña." });
        return;
      }

      setFeedback({
        success: true,
        message: "Contraseña actualizada. Te llevamos al inicio de sesión."
      });
      setTimeout(() => router.push("/login"), 1500);
    } catch {
      setFeedback({ success: false, message: "Ocurrió un error al actualizar la contraseña." });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Form {...form}>
      <form className="flex flex-col gap-6" onSubmit={form.handleSubmit(onSubmit)}>
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nueva contraseña</FormLabel>
              <FormControl>
                <PasswordInput placeholder="Mín. 8 caracteres" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="confirmPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Confirmar contraseña</FormLabel>
              <FormControl>
                <PasswordInput placeholder="Repite la contraseña" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {feedback ? (
          <AuthMessage tone={feedback.success ? "success" : "error"}>{feedback.message}</AuthMessage>
        ) : null}

        <div className="flex justify-center pt-2">
          <Button type="submit" className="primary-button w-full max-w-xs" disabled={submitting}>
            {submitting ? "Actualizando…" : "Actualizar contraseña"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
