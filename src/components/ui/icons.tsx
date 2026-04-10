import Image from "next/image";
import type { SVGProps } from "react";

import { ArrowRight, Check, Wrench, X } from "lucide-react";

import type { ContactIconType, ServiceIconType, SocialIconType } from "@/features/marketing/types";
import { cn } from "@/lib/utils";

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

interface BrandLogoProps extends IconProps {
  variant?: "brand" | "white";
  priority?: boolean;
}

function SvgIcon(props: SVGProps<SVGSVGElement>) {
  return <svg fill="none" aria-hidden="true" {...props} />;
}

const serviceIcons: Record<ServiceIconType, { src: string; width: number; height: number; alt: string }> = {
  code: { src: "/icons/services/code.svg", width: 52, height: 42, alt: "Desarrollo de software" },
  consulting: { src: "/icons/services/consulting.svg", width: 42, height: 42, alt: "Consultorias" },
  team: { src: "/icons/services/team.svg", width: 36, height: 40, alt: "Profesionales a tu disposicion" },
  spark: { src: "/icons/services/spark.svg", width: 42, height: 41, alt: "Desarrollo a la medida" },
  support: { src: "/icons/services/support.svg", width: 41, height: 42, alt: "Soporte tecnico" },
  idea: { src: "/icons/services/idea.svg", width: 26, height: 36, alt: "Incubadora" }
};

const contactIcons: Record<ContactIconType, { src: string; width: number; height: number; alt: string }> = {
  mail: { src: "/icons/contact/mail.svg", width: 24, height: 24, alt: "Correo electronico" },
  phone: { src: "/icons/contact/phone.svg", width: 24, height: 24, alt: "Telefono" },
  location: { src: "/icons/contact/location.svg", width: 20, height: 24, alt: "Ubicacion" }
};

const socialIcons: Record<SocialIconType, { src: string; alt: string }> = {
  instagram: { src: "/icons/social/instagram.svg", alt: "Instagram" },
  x: { src: "/icons/social/x.svg", alt: "X" },
  facebook: { src: "/icons/social/facebook.svg", alt: "Facebook" },
  linkedin: { src: "/icons/social/linkedin.svg", alt: "LinkedIn" },
  tiktok: { src: "/icons/social/tiktok.svg", alt: "TikTok" }
};

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

export function CloseIcon({ className = "size-4" }: IconProps) {
  return <X className={className} strokeWidth={2.2} aria-hidden="true" />;
}

export function CheckIcon() {
  return <Check className="h-4 w-4" strokeWidth={2.6} aria-hidden="true" />;
}

export function ToolIcon({ className = "size-5" }: IconProps) {
  return <Wrench className={className} strokeWidth={2.1} aria-hidden="true" />;
}

export function ServiceIcon({ type }: ServiceIconProps) {
  const icon = serviceIcons[type];

  return <Image src={icon.src} width={icon.width} height={icon.height} alt={icon.alt} className="h-auto w-auto" />;
}

export function ContactIcon({ type }: ContactIconProps) {
  const icon = contactIcons[type];

  return <Image src={icon.src} width={icon.width} height={icon.height} alt={icon.alt} className="size-6 transition-transform hover:scale-105" />;
}

export function SocialIcon({ type, className = "size-4" }: SocialIconProps) {
  const icon = socialIcons[type];

  return <Image src={icon.src} width={50} height={50} alt={icon.alt} className={className} />;
}

export function ArrowRightIcon({ className = "size-4" }: IconProps) {
  return <ArrowRight className={className} strokeWidth={2.2} aria-hidden="true" />;
}

export function WhatsAppIcon({ className = "size-8" }: IconProps) {
  return <Image src="/icons/whatsapp.svg" width={32} height={32} alt="WhatsApp" className={className} />;
}

export function BrandLogo({ variant = "brand", className = "w-[112px]" }: BrandLogoProps) {
  const isWhite = variant === "white";
  const primaryColor = isWhite ? "#FFFFFF" : "#18395e"; // Dark blue/greenish base
  const dotColor = isWhite ? "#FFFFFF" : "#4f9792"; // Teal for dots

  return (
    <span className={cn("inline-flex items-center gap-3", className)} aria-label="Codenium">
      <svg
        width="44"
        height="44"
        viewBox="0 0 44 44"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="h-11 w-11 shrink-0"
      >
        {/* The "C" shape */}
        <path
          d="M34 11C30.5 7.5 25.5 5.5 20 5.5C10.8873 5.5 3.5 12.8873 3.5 22C3.5 31.1127 10.8873 38.5 20 38.5C25.5 38.5 30.5 36.5 34 33"
          stroke={primaryColor}
          strokeWidth="6"
          strokeLinecap="round"
        />
        {/* Three points on the edges of C */}
        <circle cx="34" cy="11" r="3" fill={dotColor} />
        <circle cx="3.5" cy="22" r="3" fill={dotColor} />
        <circle cx="34" cy="33" r="3" fill={dotColor} />
        {/* Central point */}
        <circle cx="20" cy="22" r="3" fill={dotColor} />
      </svg>
      <span className={cn("text-lg font-semibold tracking-[-0.04em]", isWhite ? "text-white" : "text-body-color")}>
        Codenium
      </span>
    </span>
  );
}

