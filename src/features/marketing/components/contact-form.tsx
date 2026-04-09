import Link from "next/link";
import type { InputHTMLAttributes } from "react";

import { ContactIcon } from "@/components/ui/icons";
import { site } from "@/features/marketing/data/site";
import type { ContactIconType } from "@/features/marketing/types";

interface FormFieldProps {
  label: string;
  placeholder: string;
  type?: InputHTMLAttributes<HTMLInputElement>["type"];
}

interface ContactInfoProps {
  label: string;
  value: string;
  icon: ContactIconType;
}

export function ContactForm() {
  return (
    <section className="text-body-color" id="contact">
      <div className="site-shell px-4 py-8 sm:px-6 sm:py-12 md:px-8 lg:px-16 lg:py-16">
        <div className="contact mb-[26px] flex flex-col gap-4 text-center sm:mb-20 sm:text-left" data-animate="fadeInFromTop">
          <span className="type-kicker">Contáctanos</span>
          <h2 className="type-section-title">
            ¿Tienes algún <span className="text-secondary-500">proyecto</span> en mente?
          </h2>
          <p className="max-w-2xl text-sm text-body-color sm:text-base">
            Nosotros podemos ayudarte. Abarcamos gran parte de la Ciudad de México y alrededores.
          </p>
        </div>
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-3 lg:gap-12">
          <div className="axolotl-info flex w-full flex-col gap-4 lg:gap-8" data-animate="fadeIn">
            <ContactInfoColumn label="Correo electrónico" value={site.contact.email} icon="mail" />
            <ContactInfoColumn label="Teléfono" value={site.contact.phone} icon="phone" />
            <ContactInfoColumn label="Ubicación" value={`${site.contact.location}, ${site.contact.city}`} icon="location" />
          </div>
          <div className="col-span-1 w-full sm:col-span-2" data-animate="fadeInFromRight" data-delay="0.12">
            <form className="flex w-full flex-col gap-6">
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <FormField label="Nombre *" placeholder="Nombre" />
                <FormField label="Apellidos *" placeholder="Apellidos" />
              </div>
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <FormField label="Correo electrónico *" placeholder="Correo electrónico" type="email" />
                <FormField label="Número de teléfono *" placeholder="Número de teléfono" />
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">Mensaje *</label>
                <textarea
                  rows={4}
                  placeholder="Mensaje"
                  className="w-full rounded-[14px] border border-gray-300 px-4 py-3 text-[15px] outline-none transition-colors duration-200 focus:border-primary-500"
                />
              </div>
              <button
                type="submit"
                className="w-fit rounded-[5px] border border-primary-500 bg-primary-500 px-6 py-2 font-bold text-primary-50 transition-all duration-500 ease-in-out hover:scale-105 hover:bg-white hover:text-primary-500"
              >
                Enviar mensaje
              </button>
            </form>
          </div>
        </div>
        <div className="contact-map mt-8 h-[250px] w-full overflow-hidden rounded-xl sm:mt-12 sm:h-[300px] md:h-[350px] lg:mt-16 lg:h-[400px]" data-animate="fadeIn" data-delay="0.2">
          <iframe
            title="Ubicación"
            src={site.mapEmbedUrl}
            width="100%"
            height="100%"
            style={{ border: 0 }}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>
      </div>
    </section>
  );
}

export function ContactStrip() {
  return (
    <section className="section overflow-hidden bg-foreground">
      <div className="site-shell flex flex-col gap-5 py-16 lg:flex-row lg:gap-[50px]">
        <article className="contact flex w-full flex-col items-center gap-5 text-center lg:max-w-[540px] lg:items-start lg:gap-6 lg:text-left" data-animate="fadeInFromLeft">
          <span className="type-kicker">Contáctanos</span>
          <h2 className="type-section-title">
            ¿Tienes algún <span className="text-secondary-500">proyecto</span> en mente?
          </h2>
          <p className="max-w-2xl text-sm text-body-color sm:text-base">
            Nosotros podemos ayudarte. Abarcamos gran parte de la Ciudad de México y alrededores.
          </p>
          <Link href="/contact" className="contact-button">
            Enviar mensaje
          </Link>
        </article>
        <article className="map w-full" data-animate="fadeInFromRight" data-delay="0.12">
          <div className="h-[300px] overflow-hidden rounded-xl sm:h-[400px]">
            <iframe
              title="Ubicación"
              src={site.mapEmbedUrl}
              width="100%"
              height="100%"
              style={{ border: 0 }}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
          <div className="mt-5 grid grid-cols-1 gap-4 md:grid-cols-3 lg:grid-cols-2">
            <ContactInfoRow label="Correo electrónico" value={site.contact.email} icon="mail" />
            <ContactInfoRow label="Teléfono" value={site.contact.phone} icon="phone" />
            <ContactInfoRow label="Ubicación" value={`${site.contact.location}, ${site.contact.city}`} icon="location" />
          </div>
        </article>
      </div>
    </section>
  );
}

function FormField({ label, placeholder, type = "text" }: FormFieldProps) {
  return (
    <div>
      <label className="mb-2 block text-sm font-medium text-gray-700">{label}</label>
      <input
        type={type}
        placeholder={placeholder}
        className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-primary-500 focus:ring-primary-500"
      />
    </div>
  );
}

function ContactInfoRow({ label, value, icon }: ContactInfoProps) {
  return (
    <div className="flex w-full items-start gap-4">
      <ContactIcon type={icon} />
      <div>
        <span className="mb-1 inline-block font-semibold">{label}</span>
        <p className="text-black">{value}</p>
      </div>
    </div>
  );
}

function ContactInfoColumn({ label, value, icon }: ContactInfoProps) {
  return (
    <div className="flex flex-col gap-2 lg:gap-4">
      <ContactIcon type={icon} />
      <h3 className="text-lg font-bold sm:text-xl">{label}</h3>
      <p className="text-sm text-gray-600 sm:text-base">{value}</p>
    </div>
  );
}
