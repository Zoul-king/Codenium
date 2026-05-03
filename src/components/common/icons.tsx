"use client";

import Image from "next/image";
import type { SVGProps } from "react";

import { ArrowRight, Check, Mail, MapPin, MessagesSquare, Phone, X } from "lucide-react";

import { site } from "@/features/marketing/data/site";
import type { ContactIconType, ServiceIconType, SocialIconType } from "@/features/marketing/types";
import { cn } from "@/lib/utils";

interface IconProps {
  className?: string;
}

interface ServiceIconProps {
  type: ServiceIconType;
}

interface ContactIconProps extends IconProps {
  type: ContactIconType;
}

interface SocialIconProps extends IconProps {
  type: SocialIconType;
}

interface BrandLogoProps extends IconProps {
  variant?: "brand" | "white" | "header" | "footer";
  priority?: boolean;
}

function SvgIcon(props: SVGProps<SVGSVGElement>) {
  return <svg fill="none" aria-hidden="true" {...props} />;
}

const serviceIcons: Record<ServiceIconType, { src: string; width: number; height: number; alt: string }> = {
  code: { src: "/icons/services/code.svg", width: 52, height: 42, alt: "Desarrollo de software" },
  consulting: { src: "/icons/services/consulting.svg", width: 42, height: 42, alt: "Consultorías" },
  team: { src: "/icons/services/team.svg", width: 36, height: 40, alt: "Profesionales a tu disposición" },
  spark: { src: "/icons/services/spark.svg", width: 42, height: 41, alt: "Desarrollo a la medida" },
  support: { src: "/icons/services/support.svg", width: 41, height: 42, alt: "Soporte técnico" },
  idea: { src: "/icons/services/idea.svg", width: 26, height: 36, alt: "Incubadora" }
};

// ─── Iconos de contacto con Lucide ─────────────────────────────────────────

const lucideContactIcons: Record<ContactIconType, React.ComponentType<{ className?: string; strokeWidth?: number }>> = {
  mail: Mail,
  phone: Phone,
  location: MapPin
};

export function ContactIcon({ type, className = "size-5" }: ContactIconProps) {
  const LucideIcon = lucideContactIcons[type];
  return <LucideIcon className={className} strokeWidth={1.8} aria-hidden="true" />;
}

// ─── Iconos de redes sociales (inline SVG con currentColor) ────────────────

function InstagramIcon({ className }: IconProps) {
  return (
    <SvgIcon viewBox="0 0 24 24" className={className} stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
    </SvgIcon>
  );
}

function XIcon({ className }: IconProps) {
  return (
    <SvgIcon viewBox="0 0 24 24" className={className} fill="currentColor">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </SvgIcon>
  );
}

function FacebookIcon({ className }: IconProps) {
  return (
    <SvgIcon viewBox="0 0 24 24" className={className} fill="currentColor">
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
    </SvgIcon>
  );
}

function LinkedInIcon({ className }: IconProps) {
  return (
    <SvgIcon viewBox="0 0 24 24" className={className} fill="currentColor">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </SvgIcon>
  );
}

function TikTokIcon({ className }: IconProps) {
  return (
    <SvgIcon viewBox="0 0 24 24" className={className} fill="currentColor">
      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.27 6.27 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.79a8.18 8.18 0 0 0 4.78 1.52V6.88a4.85 4.85 0 0 1-1.01-.19z" />
    </SvgIcon>
  );
}

const socialIconComponents: Record<SocialIconType, React.ComponentType<IconProps>> = {
  instagram: InstagramIcon,
  x: XIcon,
  facebook: FacebookIcon,
  linkedin: LinkedInIcon,
  tiktok: TikTokIcon
};

export function SocialIcon({ type, className = "size-5" }: SocialIconProps) {
  const Icon = socialIconComponents[type];
  return <Icon className={className} />;
}

// ─── Icono de contacto hub (botón flotante) ───────────────────────────────

export function ContactHubIcon({ className = "size-5" }: IconProps) {
  return <MessagesSquare className={className} strokeWidth={1.8} aria-hidden="true" />;
}

// ─── Iconos de servicio ────────────────────────────────────────────────────

export function ServiceIcon({ type }: ServiceIconProps) {
  const icon = serviceIcons[type];
  return <Image src={icon.src} width={icon.width} height={icon.height} alt={icon.alt} className="h-auto w-auto" />;
}

// ─── Iconos de UI ─────────────────────────────────────────────────────────

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

export function ArrowRightIcon({ className = "size-4" }: IconProps) {
  return <ArrowRight className={className} strokeWidth={2.2} aria-hidden="true" />;
}

export function WhatsAppIcon({ className = "size-5" }: IconProps) {
  return (
    <SvgIcon viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden="true">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z" />
    </SvgIcon>
  );
}

export function BrandLogo({ variant = "brand", className = "w-[112px]", priority = false }: BrandLogoProps) {
  const asset =
    variant === "white"
      ? site.assets.brand.white
      : variant === "header"
        ? site.assets.brand.header
        : variant === "footer"
          ? site.assets.brand.footer
          : site.assets.brand.pink;

  return (
    <span className={cn("relative inline-flex items-center", className)} aria-label="Codenium">
      <Image
        src={asset}
        alt="Codenium Technologies"
        width={320}
        height={120}
        className="h-auto w-full object-contain"
        priority={priority}
      />
    </span>
  );
}
