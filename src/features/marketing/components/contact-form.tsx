"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, type ReactNode } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Mail, MapPin, Phone } from "lucide-react";

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
import { Textarea } from "@/components/ui/textarea";
import { site } from "@/features/marketing/data/site";
import { submitPublicLead } from "@/lib/api/client";
import type { PublicLeadSource } from "@/server/email/types";
import { cn } from "@/lib/utils";

const contactSchema = z.object({
  firstName: z.string().min(2, "Tu nombre"),
  lastName: z.string().min(2, "Tus apellidos"),
  email: z.string().min(1, "Tu correo").email("Correo inválido"),
  phone: z.string().min(8, "Mínimo 8 dígitos"),
  message: z.string().min(10, "Mínimo 10 caracteres")
});

type ContactValues = z.infer<typeof contactSchema>;

interface ContactInfoProps {
  label: string;
  value: string;
  icon: "mail" | "phone" | "location";
  href?: string;
}

interface ContactFormProps {
  source?: PublicLeadSource;
  kicker?: string;
  title?: string;
  description?: string;
  submitLabel?: string;
  summary?: ReactNode;
  successMessage?: string;
  initialValues?: Partial<ContactValues>;
  reverseColumns?: boolean;
  hideContactInfo?: boolean;
  formCard?: boolean;
  hiddenFields?: Record<string, string>;
  contactEmail?: string;
  embedded?: boolean;
}

const defaultValues: ContactValues = {
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  message: ""
};

export function ContactForm({
  source = "contact",
  kicker = "Contactanos",
  title = "Cuentanos que necesitas",
  description = "Compartenos el contexto y te ayudaremos a aterrizar el siguiente paso.",
  submitLabel = "Enviar mensaje",
  summary,
  successMessage = "Recibimos tu mensaje. Muy pronto daremos seguimiento para continuar contigo.",
  initialValues,
  reverseColumns = false,
  hideContactInfo = false,
  formCard = true,
  hiddenFields = {},
  contactEmail = site.contact.email,
  embedded = false
}: ContactFormProps) {
  const pathname = usePathname();
  const [submitted, setSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState("");

  const form = useForm<ContactValues>({
    resolver: zodResolver(contactSchema),
    defaultValues: { ...defaultValues, ...initialValues }
  });

  const hasSummary = Boolean(summary);

  async function onSubmit(values: ContactValues) {
    setSubmitError("");
    try {
      await submitPublicLead({
        source,
        firstName: values.firstName.trim(),
        lastName: values.lastName.trim(),
        email: values.email.trim(),
        phone: values.phone.trim(),
        message: values.message.trim(),
        originPath: pathname || `/${source}`,
        hiddenFields
      });

      setSubmitted(true);
      form.reset(defaultValues);
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : "No pudimos enviar tu solicitud. Intenta de nuevo.");
    }
  }

  const wrapperClassName = hasSummary
    ? cn("grid grid-cols-1 gap-8 lg:gap-10", reverseColumns ? "lg:grid-cols-[1.4fr_0.6fr]" : "lg:grid-cols-[0.6fr_1.4fr]")
    : hideContactInfo
      ? "grid grid-cols-1 gap-8"
      : "grid grid-cols-1 gap-8 sm:grid-cols-3 lg:gap-12";

  return (
    <section className="text-body-color" id="contact">
      <div className={embedded ? "px-0 py-0" : "site-shell px-4 py-8 sm:px-6 sm:py-12 md:px-8 lg:px-16 lg:py-16"}>
        {kicker || title || description ? (
          <div className="contact mb-[26px] flex flex-col gap-4 text-center sm:mb-14 sm:text-left" data-animate="fadeInFromTop">
            {kicker ? <span className="type-kicker">{kicker}</span> : null}
            {title ? <h2 className="type-section-title">{title}</h2> : null}
            {description ? <p className="max-w-2xl text-sm text-body-color sm:text-base">{description}</p> : null}
          </div>
        ) : null}

        {submitted ? (
          <div className="rounded-[24px] bg-white p-8 shadow-[0_16px_40px_rgba(14,20,36,0.08)]" data-animate="fadeIn">
            <span className="type-kicker">Solicitud enviada</span>
            <h3 className="mt-4 text-2xl font-bold text-body-color">Gracias por compartir tu información</h3>
            <p className="type-body mt-4">{successMessage}</p>
          </div>
        ) : (
          <div className={wrapperClassName}>
            {!hideContactInfo ? (
              <div
                className={cn(
                  hasSummary ? "flex flex-col gap-6" : "contact-info-stack flex w-full flex-col gap-4 lg:gap-8",
                  reverseColumns && hasSummary ? "lg:order-last" : ""
                )}
                data-animate="fadeIn"
              >
                {hasSummary ? <div>{summary}</div> : null}
                {!hasSummary ? (
                  <>
                    <ContactInfoCard label="Correo electrónico" value={contactEmail} icon="mail" href={`mailto:${contactEmail}`} />
                    <ContactInfoCard label="Teléfono" value={site.contact.phone} icon="phone" href={`tel:${site.contact.phoneRaw}`} />
                    <ContactInfoCard label="Ubicación" value={`${site.contact.location}, ${site.contact.city}`} icon="location" />
                  </>
                ) : null}
              </div>
            ) : null}

            <div
              className={cn(
                hasSummary ? (reverseColumns ? "lg:order-first" : "") : hideContactInfo ? "w-full max-w-4xl" : "col-span-1 w-full sm:col-span-2"
              )}
              data-animate="fadeInFromRight"
              data-delay="0.12"
            >
              <Form {...form}>
                <form
                  className={
                    hasSummary || hideContactInfo
                      ? cn("flex w-full flex-col gap-6", formCard ? "rounded-[24px] bg-white p-6 shadow-[0_16px_40px_rgba(14,20,36,0.08)] sm:p-8" : "p-0")
                      : "flex w-full flex-col gap-6"
                  }
                  onSubmit={form.handleSubmit(onSubmit)}
                >
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6">
                    <FormField control={form.control} name="firstName" render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nombre *</FormLabel>
                        <FormControl><Input placeholder="Nombre" {...field} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                    <FormField control={form.control} name="lastName" render={({ field }) => (
                      <FormItem>
                        <FormLabel>Apellidos *</FormLabel>
                        <FormControl><Input placeholder="Apellidos" {...field} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                  </div>

                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6">
                    <FormField control={form.control} name="email" render={({ field }) => (
                      <FormItem>
                        <FormLabel>Correo electrónico *</FormLabel>
                        <FormControl><Input type="email" placeholder="Correo electrónico" {...field} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                    <FormField control={form.control} name="phone" render={({ field }) => (
                      <FormItem>
                        <FormLabel>Número de teléfono *</FormLabel>
                        <FormControl><Input placeholder="Número de teléfono" {...field} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                  </div>

                  <FormField control={form.control} name="message" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Mensaje *</FormLabel>
                      <FormControl><Textarea rows={6} placeholder="Cuéntanos brevemente que necesitas" {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />

                  {Object.entries(hiddenFields).map(([name, value]) => (
                    <input key={name} type="hidden" name={name} value={value} />
                  ))}

                  {submitError ? <p className="text-sm font-medium text-rose-600">{submitError}</p> : null}

                  <Button
                    type="submit"
                    disabled={form.formState.isSubmitting}
                    className="primary-button w-fit disabled:cursor-not-allowed disabled:opacity-70"
                  >
                    {form.formState.isSubmitting ? "Enviando…" : submitLabel}
                  </Button>
                </form>
              </Form>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

export function ContactStrip() {
  return (
    <section className="section overflow-hidden bg-surface-soft">
      <div className="site-shell flex flex-col gap-10 py-16">
        <article
          className="contact flex w-full flex-col items-center gap-5 text-center lg:max-w-[860px] lg:items-start lg:gap-6 lg:text-left"
          data-animate="fadeInFromLeft"
        >
          <span className="type-kicker-accent">Contactanos</span>
          <h2 className="type-section-title">
            Tienes algun <span className="text-primary-500">proyecto</span> en mente?
          </h2>
          <p className="max-w-[760px] text-sm leading-7 text-slate-600 sm:text-base">
            Comparte tu idea y te ayudaremos a convertirla en un siguiente paso claro. Nuestro equipo esta listo para asesorarte en la mejor ruta tecnica para tu negocio.
          </p>
          <div className="flex flex-col gap-4 sm:flex-row">
            <Link href="/quote" className="primary-button">
              Cotizar proyecto
            </Link>
            <Link href="/contact" className="accent-button">
              Enviar mensaje
            </Link>
          </div>
        </article>
      </div>
    </section>
  );
}

const contactIconComponents = {
  mail: Mail,
  phone: Phone,
  location: MapPin
} as const;

function ContactInfoCard({ label, value, icon, href }: ContactInfoProps) {
  const LucideIcon = contactIconComponents[icon];
  const content = (
    <div className="group flex items-start gap-4 rounded-2xl border border-slate-100 bg-white p-5 shadow-[0_2px_12px_rgba(0,0,0,0.04)] transition-all duration-200 hover:border-primary-200 hover:shadow-[0_4px_18px_rgba(34,74,120,0.08)]">
      <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-primary-50 text-primary-500 transition group-hover:bg-primary-500 group-hover:text-white">
        <LucideIcon className="size-4" strokeWidth={1.8} />
      </span>
      <div className="min-w-0">
        <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-slate-400">{label}</p>
        <p className="mt-1 text-[14px] font-semibold text-body-color">{value}</p>
      </div>
    </div>
  );

  if (href) {
    return <a href={href}>{content}</a>;
  }

  return content;
}
