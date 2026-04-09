"use client";

import type { SVGProps } from "react";

import { ArrowRight, Check } from "lucide-react";

import { referenceAssets } from "@/features/site/content/reference-assets";
import type { ContactIconType, ServiceIconType, SocialIconType } from "@/features/site/types";

interface IconProps {
  className?: string;
}

interface ServiceIconProps {
  type: ServiceIconType;
}

interface ContactIconProps {
  type: ContactIconType;
}

interface SocialIconProps extends IconProps {
  type: SocialIconType;
}

function SvgIcon(props: SVGProps<SVGSVGElement>) {
  return <svg fill="none" aria-hidden="true" {...props} />;
}

export function MenuIcon() {
  return (
    <SvgIcon viewBox="0 0 14 12" className="h-3 w-[14px]">
      <path
        d="M0 1C0 0.46875 0.4375 0 1 0H13C13.5312 0 14 0.46875 14 1C14 1.5625 13.5312 2 13 2H1C0.4375 2 0 1.5625 0 1ZM0 6C0 5.46875 0.4375 5 1 5H13C13.5312 5 14 5.46875 14 6C14 6.5625 13.5312 7 13 7H1C0.4375 7 0 6.5625 0 6ZM13 12H1C0.4375 12 0 11.5625 0 11C0 10.4688 0.4375 10 1 10H13C13.5312 10 14 10.4688 14 11C14 11.5625 13.5312 12 13 12Z"
        fill="currentColor"
      />
    </SvgIcon>
  );
}

export function CheckIcon() {
  return <Check className="h-4 w-4" strokeWidth={2.6} aria-hidden="true" />;
}

export function ServiceIcon({ type }: ServiceIconProps) {
  const icons: Record<ServiceIconType, { src: string; width: number; height: number; alt: string }> = {
    code: { src: referenceAssets.serviceIcons.code, width: 52, height: 42, alt: "Desarrollo de software" },
    consulting: { src: referenceAssets.serviceIcons.consulting, width: 42, height: 42, alt: "Consultorías" },
    team: { src: referenceAssets.serviceIcons.team, width: 36, height: 40, alt: "Profesionales a tu disposición" },
    spark: { src: referenceAssets.serviceIcons.spark, width: 42, height: 41, alt: "Desarrollo a la medida" },
    support: { src: referenceAssets.serviceIcons.support, width: 41, height: 42, alt: "Soporte técnico" },
    idea: { src: referenceAssets.serviceIcons.idea, width: 26, height: 36, alt: "Incubadora" }
  };
  const icon = icons[type];

  return <img src={icon.src} width={icon.width} height={icon.height} alt={icon.alt} className="h-auto w-auto" />;
}

export function ContactIcon({ type }: ContactIconProps) {
  const icons: Record<ContactIconType, { src: string; width: number; height: number; alt: string }> = {
    mail: { src: referenceAssets.contactIcons.mail, width: 32, height: 32, alt: "Correo electrónico" },
    phone: { src: referenceAssets.contactIcons.phone, width: 33, height: 34, alt: "Teléfono" },
    location: { src: referenceAssets.contactIcons.location, width: 20, height: 32, alt: "Ubicación" }
  };
  const icon = icons[type];

  return <img src={icon.src} width={icon.width} height={icon.height} alt={icon.alt} className="size-8 transition-transform hover:scale-105" />;
}

export function SocialIcon({ type, className = "size-4" }: SocialIconProps) {
  const icons: Record<SocialIconType, { src: string; alt: string }> = {
    instagram: { src: referenceAssets.socialIcons.instagram, alt: "Instagram" },
    x: { src: referenceAssets.socialIcons.x, alt: "X Twitter" },
    facebook: { src: referenceAssets.socialIcons.facebook, alt: "Facebook" },
    linkedin: { src: referenceAssets.socialIcons.linkedin, alt: "LinkedIn" },
    tiktok: { src: referenceAssets.socialIcons.tiktok, alt: "TikTok" }
  };
  const icon = icons[type];

  return <img src={icon.src} alt={icon.alt} className={className} />;
}

export function ArrowRightIcon({ className = "size-4" }: IconProps) {
  return <ArrowRight className={className} strokeWidth={2.2} aria-hidden="true" />;
}

export function WhatsAppIcon({ className = "size-8" }: IconProps) {
  return <img src={referenceAssets.whatsapp} alt="WhatsApp" className={className} />;
}

interface BrandLogoProps extends IconProps {
  variant?: "pink" | "white";
}

export function BrandLogo({ variant = "pink", className = "w-[112px]" }: BrandLogoProps) {
  const src = variant === "white" ? referenceAssets.logos.white : referenceAssets.logos.pink;

  return <img src={src} width={284} height={249} alt="AxolotlCode" className={className} />;
}
