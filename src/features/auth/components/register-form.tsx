"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useState, useTransition } from "react";
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
import { Input } from "@/components/ui/input";
import { PasswordInput } from "@/components/ui/password-input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AuthMessage } from "@/features/auth/components/auth-fields";
import { getDashboardRoute } from "@/features/auth/lib/auth-service";
import { DEFAULT_LADA, ladaCodes } from "@/features/auth/lib/lada-codes";
import { resolveAuthRedirect } from "@/features/auth/lib/redirect";
import { cn } from "@/lib/utils";

const registerSchema = z
  .object({
    firstName: z.string().min(2, "Mínimo 2 caracteres"),
    lastName: z.string().min(2, "Mínimo 2 caracteres"),
    email: z.string().min(1, "Ingresa tu correo").email("Correo inválido"),
    phone: z.string().min(8, "Mínimo 8 dígitos"),
    company: z.string().optional(),
    password: z.string().min(8, "Mínimo 8 caracteres"),
    confirmPassword: z.string()
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Las contraseñas no coinciden",
    path: ["confirmPassword"]
  });

type RegisterValues = z.infer<typeof registerSchema>;

interface RegisterFormProps {
  onSuccess?: () => void;
  submitClassName?: string;
}

export function RegisterForm({ onSuccess, submitClassName }: RegisterFormProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectParam = searchParams.get("redirect");
  const [isPending, startTransition] = useTransition();
  const [lada, setLada] = useState<string>(DEFAULT_LADA);

  const form = useForm<RegisterValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      company: "",
      password: "",
      confirmPassword: ""
    }
  });

  async function onSubmit(values: RegisterValues) {
    form.clearErrors("root");
    try {
      const fullPhone = `${lada} ${values.phone}`.trim();
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...values, phone: fullPhone })
      });
      const result = await response.json();

      if (!response.ok) {
        form.setError("root", { message: result.error || "No se pudo crear la cuenta." });
        return;
      }

      onSuccess?.();
      startTransition(() => {
        const target = resolveAuthRedirect(redirectParam) ?? getDashboardRoute(result.role);
        router.push(target);
      });
    } catch {
      form.setError("root", { message: "Ocurrió un error al crear la cuenta." });
    }
  }

  return (
    <Form {...form}>
      <form className="flex flex-col gap-3 sm:gap-6" onSubmit={form.handleSubmit(onSubmit)}>
        <div className="grid grid-cols-2 gap-3 sm:gap-6">
          <FormField control={form.control} name="firstName" render={({ field }) => (
            <FormItem>
              <FormLabel>Nombre</FormLabel>
              <FormControl><Input placeholder="Nombre" {...field} /></FormControl>
              <FormMessage />
            </FormItem>
          )} />
          <FormField control={form.control} name="lastName" render={({ field }) => (
            <FormItem>
              <FormLabel>Apellido</FormLabel>
              <FormControl><Input placeholder="Apellido" {...field} /></FormControl>
              <FormMessage />
            </FormItem>
          )} />
        </div>

        <div className="grid grid-cols-2 gap-3 sm:gap-6">
          <FormField control={form.control} name="email" render={({ field }) => (
            <FormItem>
              <FormLabel>Correo</FormLabel>
              <FormControl><Input type="email" placeholder="tu@empresa.com" {...field} /></FormControl>
              <FormMessage />
            </FormItem>
          )} />
          <FormField control={form.control} name="phone" render={({ field }) => (
            <FormItem>
              <FormLabel>Teléfono</FormLabel>
              <FormControl>
                <div className="flex items-stretch gap-2">
                  <Select value={lada} onValueChange={setLada}>
                    <SelectTrigger
                      aria-label="Código de país"
                      className="h-10 w-[110px] shrink-0"
                    >
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="max-h-72">
                      {ladaCodes.map((item) => (
                        <SelectItem key={item.code} value={item.code}>
                          <span className="mr-2">{item.flag}</span>
                          <span className="font-mono">{item.code}</span>
                          <span className="ml-2 text-slate-500">{item.country}</span>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Input
                    type="tel"
                    inputMode="tel"
                    placeholder="55 1234 5678"
                    {...field}
                  />
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )} />
        </div>

        <FormField control={form.control} name="company" render={({ field }) => (
          <FormItem>
            <FormLabel>Empresa (opcional)</FormLabel>
            <FormControl><Input placeholder="Nombre de tu empresa" {...field} /></FormControl>
            <FormMessage />
          </FormItem>
        )} />

        <div className="grid grid-cols-2 gap-3 sm:gap-6">
          <FormField control={form.control} name="password" render={({ field }) => (
            <FormItem>
              <FormLabel>Contraseña</FormLabel>
              <FormControl><PasswordInput placeholder="Mín. 8 caracteres" {...field} /></FormControl>
              <FormMessage />
            </FormItem>
          )} />
          <FormField control={form.control} name="confirmPassword" render={({ field }) => (
            <FormItem>
              <FormLabel>Confirmar</FormLabel>
              <FormControl><PasswordInput placeholder="Repite la contraseña" {...field} /></FormControl>
              <FormMessage />
            </FormItem>
          )} />
        </div>

        {form.formState.errors.root ? <AuthMessage tone="error">{form.formState.errors.root.message ?? ""}</AuthMessage> : null}

        <div className="flex justify-center pt-2">
          <Button
            type="submit"
            className={cn("primary-button w-full max-w-xs", submitClassName)}
            disabled={isPending || form.formState.isSubmitting}
          >
            {isPending || form.formState.isSubmitting ? "Creando cuenta…" : "Crear cuenta"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
