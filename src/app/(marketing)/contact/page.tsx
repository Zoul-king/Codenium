import { ContactForm } from "@/features/marketing/components/contact-form";
import { Faq } from "@/features/marketing/components/faq";
import { Hero } from "@/features/marketing/components/hero";
import { MarketingShell } from "@/features/marketing/components/marketing-shell";
import { contactPage, faqs } from "@/features/marketing/data/contact";
import { createMetadata } from "@/features/marketing/lib/metadata";
import { parseQuoteSelectionParams } from "@/lib/quote-selection";
import { getPublicContactEmail } from "@/server/email/config";

export const metadata = createMetadata(contactPage);

interface ContactPageProps {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
}

export default async function ContactPage({ searchParams }: ContactPageProps) {
  const resolved = (await searchParams) ?? {};
  const params = new URLSearchParams();

  for (const [key, value] of Object.entries(resolved)) {
    if (Array.isArray(value)) {
      value.forEach((entry) => params.append(key, entry));
    } else if (typeof value === "string") {
      params.set(key, value);
    }
  }

  const selection = parseQuoteSelectionParams(params);
  const selectedService = selection?.source === "service" ? selection.label : null;
  const contactEmail = getPublicContactEmail();

  return (
    <MarketingShell headerVariant={contactPage.headerVariant}>
      <Hero hero={contactPage.hero} />
      <Faq items={faqs} />
      <ContactForm
        source="contact"
        contactEmail={contactEmail}
        summary={
          selectedService ? (
            <div className="rounded-[20px] border border-accent-200 bg-white px-5 py-5 shadow-[0_12px_24px_rgba(15,23,42,0.04)]">
              <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-accent-500">Servicio seleccionado</p>
              <h3 className="mt-2 text-xl font-semibold text-slate-950">{selectedService}</h3>
              <p className="mt-2 text-sm leading-6 text-slate-600">Ya llegaste con el servicio elegido. Usa el formulario para contarnos contexto, tiempos o dudas puntuales.</p>
            </div>
          ) : undefined
        }
        hiddenFields={selectedService ? { selected_service: selectedService, intake_source: "service" } : undefined}
      />
    </MarketingShell>
  );
}
