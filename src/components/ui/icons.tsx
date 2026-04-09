"use client";

import type { SVGProps } from "react";

import {
  ArrowRight,
  Check,
  Code2,
  Headset,
  Lightbulb,
  Mail,
  MapPin,
  Menu,
  MonitorCog,
  Phone,
  Sparkles,
  Users,
  Wrench
} from "lucide-react";

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
  return <Menu size={18} strokeWidth={2.1} aria-hidden="true" />;
}

export function CheckIcon() {
  return <Check className="h-4 w-4" strokeWidth={2.6} aria-hidden="true" />;
}

export function ServiceIcon({ type }: ServiceIconProps) {
  const className = "h-10 w-10 text-primary-500";
  const common = { className, strokeWidth: 2.1, "aria-hidden": "true" as const };

  if (type === "team") return <Users {...common} />;
  if (type === "consulting") return <MonitorCog {...common} />;
  if (type === "spark") return <Sparkles {...common} />;
  if (type === "support") return <Headset {...common} />;
  if (type === "idea") return <Lightbulb {...common} />;
  if (type === "code") return <Code2 {...common} />;

  return <Wrench {...common} />;
}

export function ContactIcon({ type }: ContactIconProps) {
  const className = "size-7 text-primary-500";
  const common = { className, strokeWidth: 2.1, "aria-hidden": "true" as const };

  if (type === "phone") return <Phone {...common} />;
  if (type === "location") return <MapPin {...common} />;

  return <Mail {...common} />;
}

export function SocialIcon({ type, className = "size-4" }: SocialIconProps) {
  const props = { className, fill: "none", "aria-hidden": "true" as const };

  if (type === "instagram") {
    return (
      <SvgIcon viewBox="0 0 24 24" {...props}>
        <rect x="4" y="4" width="16" height="16" rx="5" stroke="currentColor" strokeWidth="1.8" />
        <circle cx="12" cy="12" r="3.5" stroke="currentColor" strokeWidth="1.8" />
        <circle cx="17.2" cy="6.8" r="1" fill="currentColor" />
      </SvgIcon>
    );
  }

  if (type === "x") {
    return (
      <SvgIcon viewBox="0 0 24 24" {...props}>
        <path d="M5 4l14 16M19 4L5 20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      </SvgIcon>
    );
  }

  if (type === "facebook") {
    return (
      <SvgIcon viewBox="0 0 24 24" {...props}>
        <path d="M13.5 20v-6h2.5l.5-3h-3V9.4c0-.9.3-1.4 1.5-1.4H17V5.2c-.4-.1-1.3-.2-2.5-.2-2.5 0-4 1.5-4 4.3V11H8v3h2.5v6h3z" fill="currentColor" />
      </SvgIcon>
    );
  }

  if (type === "linkedin") {
    return (
      <SvgIcon viewBox="0 0 24 24" {...props}>
        <rect x="4" y="9" width="3" height="11" fill="currentColor" />
        <circle cx="5.5" cy="5.5" r="1.5" fill="currentColor" />
        <path d="M10 9h3v1.7c.5-1 1.8-2 3.8-2 3.2 0 4.2 2 4.2 5.2V20h-3v-5.5c0-1.7-.6-2.8-2.1-2.8-1.6 0-2.5 1.1-2.5 2.8V20h-3V9z" fill="currentColor" />
      </SvgIcon>
    );
  }

  if (type === "tiktok") {
    return (
      <SvgIcon viewBox="0 0 24 24" className={className}>
        <path d="M14 4c.4 1.7 1.8 3.3 4 3.6v2.5c-1.5 0-2.8-.4-4-1.2V15a4.5 4.5 0 11-4.5-4.5c.3 0 .7 0 1 .1v2.6a2.3 2.3 0 10.9 1.8V4H14z" fill="currentColor" />
      </SvgIcon>
    );
  }

  return (
    <SvgIcon viewBox="0 0 24 24" className={className}>
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.8" />
      <path d="M9 12h6M12 9v6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </SvgIcon>
  );
}

export function ArrowRightIcon({ className = "size-4" }: IconProps) {
  return <ArrowRight className={className} strokeWidth={2.2} aria-hidden="true" />;
}

export function WhatsAppIcon({ className = "size-8" }: IconProps) {
  return (
    <SvgIcon viewBox="0 0 32 32" className={className}>
      <path
        d="M16 3.2c-7 0-12.8 5.7-12.8 12.8 0 2.2.6 4.4 1.7 6.3L3 29l6.9-1.8a12.7 12.7 0 0 0 6.1 1.6c7 0 12.8-5.7 12.8-12.8S23 3.2 16 3.2Z"
        fill="currentColor"
        opacity=".15"
      />
      <path
        d="M16 3.2c-7 0-12.8 5.7-12.8 12.8 0 2.2.6 4.4 1.7 6.3L3 29l6.9-1.8a12.7 12.7 0 0 0 6.1 1.6c7 0 12.8-5.7 12.8-12.8S23 3.2 16 3.2Z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
      <path
        d="M12.4 10.7h1.7l1.2 3.1-1.1 1.2c1.1 2.2 2.9 4 5.1 5.2l1.3-1.1 3 1.2V22c0 .9-.8 1.6-1.6 1.6-6 0-10.9-4.9-10.9-10.9 0-.9.7-1.6 1.6-1.6Z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </SvgIcon>
  );
}

interface BrandLogoProps extends IconProps {
  variant?: "pink" | "white";
}

export function BrandLogo({ variant = "pink", className = "w-[112px]" }: BrandLogoProps) {
  const primary = variant === "white" ? "#ffffff" : "#f23d6d";
  const secondary = variant === "white" ? "#ffffff" : "#56cacc";
  const stroke = variant === "white" ? "#ffffff" : "#f23d6d";

  return (
    <SvgIcon viewBox="0 0 96 96" className={className}>
      <g>
        <path
          d="M48 24c14.4 0 26 9.8 26 22S62.4 68 48 68 22 58.2 22 46s11.6-22 26-22Z"
          stroke={stroke}
          strokeWidth="4"
        />
        <circle cx="38" cy="44" r="3.5" fill={primary} />
        <circle cx="58" cy="44" r="3.5" fill={primary} />
        <path
          d="M38 55c2.5 2.3 5.8 3.4 10 3.4 4.1 0 7.4-1.1 10-3.4"
          stroke={stroke}
          strokeWidth="3.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path d="M27 35 18 25" stroke={stroke} strokeWidth="4" strokeLinecap="round" />
        <path d="M34 31 29 18" stroke={stroke} strokeWidth="4" strokeLinecap="round" />
        <path d="M43 29 42 16" stroke={stroke} strokeWidth="4" strokeLinecap="round" />
        <path d="M69 35 78 25" stroke={stroke} strokeWidth="4" strokeLinecap="round" />
        <path d="M62 31 67 18" stroke={stroke} strokeWidth="4" strokeLinecap="round" />
        <path d="M53 29 54 16" stroke={stroke} strokeWidth="4" strokeLinecap="round" />
        <path d="M25 57 15 61" stroke={secondary} strokeWidth="4" strokeLinecap="round" />
        <path d="M71 57 81 61" stroke={secondary} strokeWidth="4" strokeLinecap="round" />
      </g>
      <path d="M28 76h40" stroke={stroke} strokeWidth="6" strokeLinecap="round" />
      <path d="M28 86h12M48 86h20" stroke={stroke} strokeWidth="6" strokeLinecap="round" />
    </SvgIcon>
  );
}
