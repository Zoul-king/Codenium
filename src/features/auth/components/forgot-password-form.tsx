"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
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
import { Input } from "@/components/ui/input";
import { AuthMessage } from "@/features/auth/components/auth-fields";

const schema = z.object({
  email: z.string().min(1, "Ingresa tu correo").email("Correo inválido")
});

type Values = z.infer<typeof schema>;

export function ForgotPasswordForm() {
  const [feedback, setFeedback] = useState<{ success: boolean; message: string } | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const form = useForm<Values>({
    resolver: zodResolver(schema),
    defaultValues: { email: "" }
  });

  async function onSubmit(values: Values) {
    setSubmitting(true);
    setFeedback(null);
    try {
      const response = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values)
      });
      const result = await response.json();

      if (!response.ok) {
        setFeedback({ success: false, message: result.message ?? "No pudimos procesar la solicitud." });
        return;
      }

      setFeedback({
        success: true,
        message:
          result.message ??
          "Si la cuenta existe, te enviamos un enlace para restablecer tu contraseña."
      });
      form.reset();
    } catch {
      setFeedback({ success: false, message: "Ocurrió un error al procesar la solicitud." });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Form {...form}>
      <form className="flex flex-col gap-6" onSubmit={form.handleSubmit(onSubmit)}>
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Correo electrónico</FormLabel>
              <FormControl>
                <Input type="email" placeholder="tu@empresa.com" {...field} />
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
            {submitting ? "Enviando…" : "Enviar enlace de recuperación"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
