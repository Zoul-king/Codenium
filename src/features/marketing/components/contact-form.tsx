"use client";

import Link from "next/link";
import { useMemo, useState, type ReactNode } from "react";

import { ContactIcon } from "@/components/ui/icons";
import { TextAreaField, TextField } from "@/components/ui/form-controls";
import { site } from "@/features/marketing/data/site";
import type { ContactIconType } from "@/features/marketing/types";

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
  kicker?: string;
  title?: string;
  description?: string;
  submitLabel?: string;
  summary?: ReactNode;
  successMessage?: string;
  initialValues?: Partial<ContactFormValues>;
}

const defaultValues: ContactFormValues = {
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  message: ""
};

export function ContactForm({
  kicker = "Contáctanos",
  title = "Cuéntanos qué necesitas",
  description = "Compártenos el contexto y te ayudaremos a aterrizar el siguiente paso.",
  submitLabel = "Enviar mensaje",
  summary,
  successMessage = "Recibimos tu mensaje. Muy pronto daremos seguimiento para continuar contigo.",
  initialValues
}: ContactFormProps) {
  const [values, setValues] = useState<ContactFormValues>({ ...defaultValues, ...initialValues });
  const [submitted, setSubmitted] = useState(false);
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

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (isDisabled) {
      return;
    }

    setSubmitted(true);
  }

  return (
    <section className="text-body-color" id="contact">
      <div className="site-shell px-4 py-8 sm:px-6 sm:py-12 md:px-8 lg:px-16 lg:py-16">
        <div className="contact mb-[26px] flex flex-col gap-4 text-center sm:mb-14 sm:text-left" data-animate="fadeInFromTop">
          <span className="type-kicker">{kicker}</span>
          <h2 className="type-section-title">{title}</h2>
          <p className="max-w-2xl text-sm text-body-color sm:text-base">{description}</p>
        </div>

        {submitted ? (
          <div className="rounded-[24px] bg-white p-8 shadow-[0_16px_40px_rgba(14,20,36,0.08)]" data-animate="fadeIn">
            <span className="type-kicker">Solicitud enviada</span>
            <h3 className="mt-4 text-2xl font-bold text-body-color">Gracias por compartir tu informacion</h3>
            <p className="type-body mt-4">{successMessage}</p>
          </div>
        ) : (
          <div className={hasSummary ? "grid grid-cols-1 gap-8 lg:grid-cols-[0.6fr_1.4fr] lg:gap-10" : "grid grid-cols-1 gap-8 sm:grid-cols-3 lg:gap-12"}>
            <div className={hasSummary ? "flex flex-col gap-6" : "contact-info-stack flex w-full flex-col gap-4 lg:gap-8"} data-animate="fadeIn">
              {hasSummary ? <div>{summary}</div> : null}
              {!hasSummary ? (
                <>
                  <ContactInfoColumn label="Correo electrónico" value={site.contact.email} icon="mail" boxed={false} />
                  <ContactInfoColumn label="Teléfono" value={site.contact.phone} icon="phone" boxed={false} />
                  <ContactInfoColumn label="Ubicación" value={`${site.contact.location}, ${site.contact.city}`} icon="location" boxed={false} />
                </>

              ) : null}
            </div>

            <div className={hasSummary ? "" : "col-span-1 w-full sm:col-span-2"} data-animate="fadeInFromRight" data-delay="0.12">
              <form
                className={hasSummary ? "flex w-full flex-col gap-6 rounded-[24px] bg-white p-6 shadow-[0_16px_40px_rgba(14,20,36,0.08)] sm:p-8" : "flex w-full flex-col gap-6"}
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
                <TextAreaField label="Mensaje *" placeholder="Cuéntanos brevemente qué necesitas" value={values.message} onChange={(value) => updateValue("message", value)} />

                <button type="submit" disabled={isDisabled} className="primary-button w-fit disabled:cursor-not-allowed disabled:opacity-70">
                  {submitLabel}
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
      <div className="site-shell flex flex-col gap-10 py-16 lg:flex-row lg:items-center lg:justify-between lg:gap-[50px]">
        <article className="contact flex w-full flex-col items-center gap-5 text-center lg:max-w-[640px] lg:items-start lg:gap-6 lg:text-left" data-animate="fadeInFromLeft">
          <span className="type-kicker">Contáctanos</span>
          <h2 className="type-section-title">
            ¿Tienes algún <span className="text-primary-500">proyecto</span> en mente?
          </h2>
          <p className="max-w-xl text-sm leading-7 text-slate-600 sm:text-base">
            Comparte tu idea y te ayudaremos a convertirla en un siguiente paso claro.
            Nuestro equipo está listo para asesorarte en la mejor ruta técnica para tu negocio.
          </p>
          <div className="flex flex-col gap-4 sm:flex-row">
            <Link href="/quote" className="primary-button">
              Cotizar proyecto
            </Link>
            <Link href="/contact" className="inline-flex items-center justify-center rounded-[5px] border border-primary-500 bg-white px-6 py-2 text-sm font-extrabold text-primary-500 transition-all duration-500 ease-in-out hover:bg-primary-500 hover:text-white lg:text-base">
              Enviar mensaje
            </Link>
          </div>
        </article>
        <article className="info-cards grid w-full gap-4 sm:grid-cols-3 lg:w-auto lg:shrink-0 lg:grid-cols-1" data-animate="fadeInFromRight" data-delay="0.12">
          <ContactInfoRow label="Correo electrónico" value={site.contact.email} icon="mail" />
          <ContactInfoRow label="Teléfono" value={site.contact.phone} icon="phone" />
          <ContactInfoRow label="Ubicación" value={`${site.contact.location}, ${site.contact.city}`} icon="location" />
        </article>
      </div>
    </section>
  );
}


function ContactInfoRow({ label, value, icon }: ContactInfoProps) {
  return (
    <div className="flex w-full items-start gap-3 rounded-2xl border border-slate-100 bg-white p-4 shadow-sm transition-all hover:bg-primary-50">
      <ContactIcon type={icon} />
      <div>
        <span className="mb-1 inline-block text-xs font-semibold uppercase tracking-wider text-slate-500">{label}</span>
        <p className="text-sm font-medium text-slate-900">{value}</p>
      </div>
    </div>

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
