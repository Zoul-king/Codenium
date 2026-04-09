import { ContactForm } from "@/features/marketing/components/contact-form";
import { Faq } from "@/features/marketing/components/faq";
import { Hero } from "@/features/marketing/components/hero";
import { MarketingShell } from "@/features/marketing/components/marketing-shell";
import { contactPage, faqs } from "@/features/marketing/data/contact";
import { createMetadata } from "@/features/marketing/lib/metadata";

export const metadata = createMetadata(contactPage);

export default function ContactPage() {
  return (
    <MarketingShell headerVariant={contactPage.headerVariant}>
      <Hero hero={contactPage.hero} />
      <Faq items={faqs} />
      <ContactForm />
    </MarketingShell>
  );
}
