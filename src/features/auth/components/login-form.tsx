"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useTransition } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
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
import { getDashboardRoute } from "@/features/auth/lib/auth-service";
import { writeSession } from "@/features/auth/lib/session-store";
import { cn } from "@/lib/utils";

const loginSchema = z.object({
  email: z.string().min(1, "Ingresa tu correo").email("Correo inválido"),
  password: z.string().min(1, "Ingresa tu contraseña")
});

type LoginValues = z.infer<typeof loginSchema>;

interface LoginFormProps {
  onSuccess?: () => void;
  onForgotPassword?: () => void;
  submitClassName?: string;
}

export function LoginForm({ onSuccess, onForgotPassword, submitClassName }: LoginFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const form = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" }
  });

  async function onSubmit(values: LoginValues) {
    form.clearErrors("root");
    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values)
      });

      const result = await response.json();

      if (!response.ok) {
        form.setError("root", { message: result.error || "No se pudo iniciar sesión." });
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
      form.setError("root", { message: "Ocurrió un error al iniciar sesión." });
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
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Contraseña</FormLabel>
              <FormControl>
                <Input type="password" placeholder="••••••••" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {form.formState.errors.root ? <AuthMessage tone="error">{form.formState.errors.root.message ?? ""}</AuthMessage> : null}

        <Button type="submit" className={cn("primary-button w-fit", submitClassName)} disabled={isPending || form.formState.isSubmitting}>
          {isPending || form.formState.isSubmitting ? "Entrando…" : "Iniciar sesión"}
        </Button>

        {onForgotPassword ? (
          <div className="flex flex-col gap-2 text-sm text-body-color">
            <button type="button" onClick={onForgotPassword} className="w-fit text-left transition-colors hover:text-primary-500">
              Olvidé mi contraseña
            </button>
          </div>
        ) : null}
      </form>
    </Form>
  );
}
