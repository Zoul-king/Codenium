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
import { validateForgotPassword } from "@/features/auth/lib/auth-service";

const schema = z.object({
  email: z.string().min(1, "Ingresa tu correo").email("Correo inválido")
});

type Values = z.infer<typeof schema>;

interface ForgotPasswordFormProps {
  onBack?: () => void;
}

export function ForgotPasswordForm({ onBack }: ForgotPasswordFormProps) {
  const [feedback, setFeedback] = useState<{ success: boolean; message: string } | null>(null);
  const form = useForm<Values>({
    resolver: zodResolver(schema),
    defaultValues: { email: "" }
  });

  function onSubmit(values: Values) {
    const result = validateForgotPassword({ email: values.email });

    if (result.includes("válido") || result.includes("asociado")) {
      setFeedback({ success: false, message: result });
      return;
    }

    setFeedback({ success: true, message: result });
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

        {feedback ? <AuthMessage tone={feedback.success ? "success" : "error"}>{feedback.message}</AuthMessage> : null}

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <Button type="submit" className="primary-button w-fit">
            Continuar
          </Button>
          {onBack ? (
            <button type="button" onClick={onBack} className="text-sm font-semibold text-body-color transition-colors hover:text-primary-500">
              Volver al acceso
            </button>
          ) : null}
        </div>
      </form>
    </Form>
  );
}
