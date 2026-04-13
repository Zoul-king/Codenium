"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useMemo, useState, type ReactNode } from "react";

import { ContactIcon } from "@/components/ui/icons";
import { TextAreaField, TextField } from "@/components/ui/form-controls";
import { submitPublicLead } from "@/lib/client-api";
import type { PublicLeadSource } from "@/lib/email-payloads";
import { site } from "@/features/marketing/data/site";
import type { ContactIconType } from "@/features/marketing/types";
import { cn } from "@/lib/utils";

interface ContactInfoProps {
  label: string;
  value: string;
  icon: ContactIconType;
}

interface ContactFormValues {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  message: string;
}

interface ContactFormProps {
  source?: PublicLeadSource;
  kicker?: string;
  title?: string;
  description?: string;
  submitLabel?: string;
  summary?: ReactNode;
  successMessage?: string;
  initialValues?: Partial<ContactFormValues>;
  reverseColumns?: boolean;
  hideContactInfo?: boolean;
  formCard?: boolean;
  hiddenFields?: Record<string, string>;
  contactEmail?: string;
  embedded?: boolean;
}

const defaultValues: ContactFormValues = {
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
  const [values, setValues] = useState<ContactFormValues>({ ...defaultValues, ...initialValues });
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const hasSummary = Boolean(summary);

  const isDisabled = useMemo(
    () => !values.firstName.trim() || !values.lastName.trim() || !values.email.trim() || !values.phone.trim() || !values.message.trim(),
    [values]
  );

  function updateValue(key: keyof ContactFormValues, value: string) {
    setValues((current) => ({
      ...current,
      [key]: value
    }));
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (isDisabled || submitting) {
      return;
    }

    try {
      setSubmitting(true);
      setErrorMessage("");

      // 1. Notificación vía Email/Lead (lo que ya funcionaba)
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

      // 2. Persistencia en DB (Guardado de cotización)
      // Usamos "user-client" temporal para evitar errores de validación de clientId
      await fetch("/api/quotes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          title: hiddenFields.project_category || "Proyecto sin título",
          description: values.message || "",
          projectType: hiddenFields.project_category || "OTHER",
          planCategory: hiddenFields.selected_plan?.includes("Business") ? "BUSINESS" : "PERSONAL",
          planTier: "BASIC",
          billingModel: "ONE_TIME",
          estimatedPrice: 0,
          estimatedTimeline: hiddenFields.timeline || "",
          clientId: "user-client" 
        })
      });

      setSubmitted(true);
      setValues({ ...defaultValues });
    } catch (error) {
      console.error("Error submitting form:", error);
      setErrorMessage(error instanceof Error ? error.message : "No pudimos enviar tu solicitud. Intenta de nuevo.");
    } finally {
      setSubmitting(false);
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
              <div className={cn(hasSummary ? "flex flex-col gap-6" : "contact-info-stack flex w-full flex-col gap-4 lg:gap-8", reverseColumns && hasSummary ? "lg:order-last" : "")} data-animate="fadeIn">
                {hasSummary ? <div>{summary}</div> : null}
                {!hasSummary ? (
                  <>
                    <ContactInfoColumn label="Correo electrónico" value={contactEmail} icon="mail" boxed={false} />
                    <ContactInfoColumn label="Teléfono" value={site.contact.phone} icon="phone" boxed={false} />
                    <ContactInfoColumn label="Ubicación" value={`${site.contact.location}, ${site.contact.city}`} icon="location" boxed={false} />
                  </>
                ) : null}
              </div>
            ) : null}

            <div className={cn(hasSummary ? (reverseColumns ? "lg:order-first" : "") : hideContactInfo ? "w-full max-w-4xl" : "col-span-1 w-full sm:col-span-2")} data-animate="fadeInFromRight" data-delay="0.12">
              <form
                className={
                  hasSummary || hideContactInfo
                    ? cn("flex w-full flex-col gap-6", formCard ? "rounded-[24px] bg-white p-6 shadow-[0_16px_40px_rgba(14,20,36,0.08)] sm:p-8" : "p-0")
                    : "flex w-full flex-col gap-6"
                }
                onSubmit={handleSubmit}
              >
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                  <TextField label="Nombre *" placeholder="Nombre" value={values.firstName} onChange={(value) => updateValue("firstName", value)} />
                  <TextField label="Apellidos *" placeholder="Apellidos" value={values.lastName} onChange={(value) => updateValue("lastName", value)} />
                </div>
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                  <TextField label="Correo electrónico *" placeholder="Correo electrónico" type="email" value={values.email} onChange={(value) => updateValue("email", value)} />
                  <TextField label="Número de teléfono *" placeholder="Número de teléfono" value={values.phone} onChange={(value) => updateValue("phone", value)} />
                </div>
                <TextAreaField label="Mensaje *" placeholder="Cuéntanos brevemente que necesitas" value={values.message} onChange={(value) => updateValue("message", value)} />
                
                {hiddenFields
                  ? Object.entries(hiddenFields).map(([name, value]) => <input key={name} type="hidden" name={name} value={value} />)
                  : null}

                {errorMessage && !submitted ? <p className="text-sm font-medium text-rose-600">{errorMessage}</p> : null}

                <button type="submit" disabled={isDisabled || submitting} className="primary-button w-fit disabled:cursor-not-allowed disabled:opacity-70">
                  {submitting ? "Enviando..." : submitLabel}
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

export function ContactStrip() {
  return (
    <section className="section overflow-hidden bg-foreground">
      <div className="site-shell flex flex-col gap-10 py-16">
        <article className="contact flex w-full flex-col items-center gap-5 text-center lg:max-w-[860px] lg:items-start lg:gap-6 lg:text-left" data-animate="fadeInFromLeft">
          <span className="type-kicker-accent">Contactanos</span>
          <h2 className="type-section-title">
            Tienes algun <span className="text-primary-500">proyecto</span> en mente?
          </h2>
          <p className="max-w-[760px] text-sm leading-7 text-slate-600 sm:text-base">
            Comparte tu idea y te ayudaremos a convertirla en un siguiente paso claro.
            Nuestro equipo esta listo para asesorarte en la mejor ruta tecnica para tu negocio.
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

function ContactInfoColumn({ label, value, icon, boxed = false }: ContactInfoProps & { boxed?: boolean }) {
  return <ContactInfoCard label={label} value={value} icon={icon} boxed={boxed} />;
}

function ContactInfoCard({ label, value, icon, boxed }: ContactInfoProps & { boxed: boolean }) {
  return (
    <div className={boxed ? "rounded-[20px] bg-white p-5 shadow-[0_16px_40px_rgba(14,20,36,0.08)]" : ""}>
      <div className="flex flex-col gap-2 lg:gap-3">
        <ContactIcon type={icon} />
        <h3 className="text-base font-semibold sm:text-lg">{label}</h3>
        <p className="text-sm text-gray-600">{value}</p>
      </div>
    </div>
  );
}