"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { Mail, X } from "lucide-react";

import { ContactHubIcon, WhatsAppIcon } from "@/components/common/icons";
import { site } from "@/features/marketing/data/site";
import { cn } from "@/lib/utils";

type ChatMessage = {
  role: "user" | "assistant";
  content: string;
};

const INITIAL_ASSISTANT_MESSAGE: ChatMessage = {
  role: "assistant",
  content:
    "Hola, soy FrancIA, el chatbot de Codenium. Puedo ayudarte con planes, precios, servicios, cotizaciones y formas de contacto. Puedes preguntarme por el plan básico, PYMES, e-commerce, planes empresariales o servicios de mantenimiento."
};

export function WhatsAppButton() {
  const [open, setOpen] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [hasHover, setHasHover] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    if (typeof window !== "undefined") {
      const savedMessages = window.localStorage.getItem("francia-chat-messages");
      if (savedMessages) {
        try {
          return JSON.parse(savedMessages) as ChatMessage[];
        } catch {
          return [INITIAL_ASSISTANT_MESSAGE];
        }
      }
    }
    return [INITIAL_ASSISTANT_MESSAGE];
  });

  const containerRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handlePointerDown(event: MouseEvent) {
      if (!containerRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    function handleEscape(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setOpen(false);
        setChatOpen(false);
      }
    }
    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("keydown", handleEscape);
    };
  }, []);

  useEffect(() => {
    if (typeof window === "undefined" || !window.matchMedia) return;
    const media = window.matchMedia("(hover: hover) and (pointer: fine)");
    const update = () => setHasHover(media.matches);
    update();
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading, chatOpen]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      window.localStorage.setItem("francia-chat-messages", JSON.stringify(messages));
    }
  }, [messages]);

  async function handleSendMessage() {
    const trimmedMessage = input.trim();
    if (!trimmedMessage || loading) return;

    const normalizedMessage = trimmedMessage.toLowerCase();
    const wantsWhatsApp =
      (normalizedMessage.includes("whatsapp") ||
        normalizedMessage.includes("whats app") ||
        normalizedMessage.includes("watsap") ||
        normalizedMessage.includes("wasap")) &&
      (normalizedMessage.includes("abr") ||
        normalizedMessage.includes("comunicarme") ||
        normalizedMessage.includes("contactar") ||
        normalizedMessage.includes("mandar mensaje") ||
        normalizedMessage.includes("enviar mensaje") ||
        normalizedMessage.includes("hablar"));
    const wantsEmail =
      (normalizedMessage.includes("correo") ||
        normalizedMessage.includes("email") ||
        normalizedMessage.includes("e-mail") ||
        normalizedMessage.includes("mail")) &&
      (normalizedMessage.includes("abr") ||
        normalizedMessage.includes("comunicarme") ||
        normalizedMessage.includes("contactar") ||
        normalizedMessage.includes("escribir") ||
        normalizedMessage.includes("enviar") ||
        normalizedMessage.includes("mandar"));

    if (wantsWhatsApp) {
      setMessages((current) => [
        ...current,
        { role: "user", content: trimmedMessage },
        { role: "assistant", content: "Te abro WhatsApp para que puedas comunicarte con Codenium." }
      ]);
      setInput("");
      window.open(site.contact.whatsapp, "_blank");
      return;
    }

    if (wantsEmail) {
      setMessages((current) => [
        ...current,
        { role: "user", content: trimmedMessage },
        { role: "assistant", content: "Te abro el correo para que puedas escribirle al equipo de Codenium." }
      ]);
      setInput("");
      window.location.href = `mailto:${site.contact.email}`;
      return;
    }

    const userMessage: ChatMessage = { role: "user", content: trimmedMessage };
    setMessages((current) => [...current, userMessage]);
    setInput("");
    setLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: trimmedMessage, messages })
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data?.error || "No se pudo obtener respuesta del servidor.");
      }
      setMessages((current) => [
        ...current,
        { role: "assistant", content: data.reply || "No pude responder en este momento." }
      ]);
    } catch {
      setMessages((current) => [
        ...current,
        { role: "assistant", content: "Hubo un problema al conectar con FrancIA. Revisa la configuración e inténtalo otra vez." }
      ]);
    } finally {
      setLoading(false);
    }
  }

  const expanded = open || (hasHover && hovered);

  const radialItems = [
    {
      key: "francia",
      label: site.contact.assistantLabel ?? "FrancIA",
      color: "bg-primary-500 text-white",
      iconBg: "bg-white/20",
      icon: <ContactHubIcon className="size-4" />,
      onClick: () => {
        setOpen(false);
        setHovered(false);
        setChatOpen(true);
      },
      delay: 0,
      // top
      offset: { x: -8, y: -92 }
    },
    {
      key: "email",
      label: "Correo electrónico",
      color: "bg-sky-600 text-white",
      iconBg: "bg-white/20",
      icon: <Mail className="size-4" strokeWidth={2} />,
      href: `mailto:${site.contact.email}`,
      delay: 60,
      // upper-left, lower than FrancIA
      offset: { x: -78, y: -48 }
    },
    {
      key: "whatsapp",
      label: "WhatsApp",
      color: "bg-emerald-600 text-white",
      iconBg: "bg-white/20",
      icon: <WhatsAppIcon className="size-4" />,
      href: site.contact.whatsapp,
      external: true,
      delay: 120,
      // left, slightly below button center
      offset: { x: -86, y: 18 }
    }
  ];

  return (
    <div
      ref={containerRef}
      className="fixed bottom-5 right-5 z-40 md:bottom-8 md:right-8"
      onMouseEnter={hasHover ? () => setHovered(true) : undefined}
      onMouseLeave={hasHover ? () => setHovered(false) : undefined}
    >
      {/* Hover bridge: enlarges the hover area to cover the radial arc so the cursor doesn't break hover when traveling to an option */}
      {hasHover && expanded ? (
        <div className="pointer-events-auto absolute bottom-[-32px] right-0 h-[200px] w-[180px]" aria-hidden />
      ) : null}
      <div className="relative flex flex-col items-end">
        {/* Chat panel (FrancIA) */}
        {chatOpen ? (
          <div className="absolute bottom-[calc(100%+28px)] right-0 flex h-[min(620px,calc(100svh-140px))] w-[min(420px,calc(100vw-32px))] flex-col overflow-hidden rounded-[28px] border border-slate-200/80 bg-white shadow-[0_30px_70px_rgba(15,23,42,0.22)] ring-1 ring-black/5">
            <div className="relative flex items-center justify-between gap-3 bg-gradient-to-br from-slate-950 via-slate-900 to-primary-700 px-5 py-4 text-white">
              <div className="flex items-center gap-3">
                <span className="grid size-10 shrink-0 place-items-center rounded-full bg-white/10 ring-1 ring-white/20 backdrop-blur">
                  <ContactHubIcon className="size-5 text-white" />
                </span>
                <div>
                  <p className="text-[15px] font-semibold leading-tight tracking-tight">FrancIA</p>
                  <p className="mt-0.5 flex items-center gap-1.5 text-[11.5px] text-slate-300">
                    <span className="relative inline-flex size-1.5">
                      <span className="absolute inset-0 animate-ping rounded-full bg-emerald-400/70" />
                      <span className="relative inline-flex size-1.5 rounded-full bg-emerald-400" />
                    </span>
                    Asistente virtual de Codenium
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setChatOpen(false)}
                aria-label="Cerrar chat"
                className="grid size-8 place-items-center rounded-full text-white/80 transition hover:bg-white/10 hover:text-white"
              >
                <X className="size-[18px]" strokeWidth={2.2} />
              </button>
            </div>
            <div className="flex-1 space-y-3 overflow-y-auto bg-gradient-to-b from-slate-50 to-white px-5 py-5">
              {messages.map((message, index) => (
                <div
                  key={`${message.role}-${index}`}
                  className={
                    message.role === "user"
                      ? "ml-auto max-w-[82%] rounded-2xl rounded-br-md bg-slate-950 px-4 py-3 text-[13.5px] leading-relaxed text-white shadow-[0_6px_18px_rgba(15,23,42,0.18)]"
                      : "max-w-[82%] rounded-2xl rounded-bl-md border border-slate-200 bg-white px-4 py-3 text-[13.5px] leading-relaxed text-slate-700 shadow-[0_4px_14px_rgba(15,23,42,0.06)]"
                  }
                >
                  {message.content}
                </div>
              ))}
              {loading ? (
                <div className="flex max-w-[82%] items-center gap-1.5 rounded-2xl rounded-bl-md border border-slate-200 bg-white px-4 py-3 text-[13.5px] text-slate-500 shadow-[0_4px_14px_rgba(15,23,42,0.06)]">
                  <span className="size-1.5 animate-bounce rounded-full bg-slate-400 [animation-delay:-0.3s]" />
                  <span className="size-1.5 animate-bounce rounded-full bg-slate-400 [animation-delay:-0.15s]" />
                  <span className="size-1.5 animate-bounce rounded-full bg-slate-400" />
                </div>
              ) : null}
              <div ref={messagesEndRef} />
            </div>
            <div className="border-t border-slate-200 bg-white p-4">
              <div className="flex items-end gap-2">
                <input
                  type="text"
                  value={input}
                  onChange={(event) => setInput(event.target.value)}
                  onKeyDown={(event) => {
                    if (event.key === "Enter") {
                      event.preventDefault();
                      void handleSendMessage();
                    }
                  }}
                  placeholder="Escribe tu mensaje..."
                  className="w-full rounded-full border border-slate-300 bg-slate-50 px-5 py-3 text-[13.5px] outline-none transition focus:border-primary-500 focus:bg-white focus:ring-2 focus:ring-primary-500/20"
                />
                <button
                  type="button"
                  onClick={() => void handleSendMessage()}
                  disabled={loading || !input.trim()}
                  aria-label="Enviar mensaje"
                  className="grid size-11 shrink-0 place-items-center rounded-full bg-primary-500 text-white shadow-[0_8px_22px_rgba(79,47,150,0.35)] transition hover:bg-primary-600 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className="size-[18px] -translate-x-px">
                    <path d="M5 12h14" />
                    <path d="m13 5 7 7-7 7" />
                  </svg>
                </button>
              </div>
              <p className="mt-2 text-center text-[10.5px] text-slate-400">FrancIA puede cometer errores. Verifica los datos importantes.</p>
            </div>
          </div>
        ) : null}

        {/* Radial sub-buttons (FrancIA / Email / WhatsApp) */}
        <div
          className={cn(
            "pointer-events-none absolute bottom-7 right-7 z-10",
            expanded ? "pointer-events-auto" : ""
          )}
          aria-hidden={!expanded}
        >
          {radialItems.map((item) => (
            <ContactRadialItem
              key={item.key}
              label={item.label}
              icon={item.icon}
              color={item.color}
              iconBg={item.iconBg}
              delay={item.delay}
              visible={expanded}
              offset={item.offset}
              href={item.href}
              external={item.external}
              onClick={item.onClick}
            />
          ))}
        </div>

        {/* Trigger circle: shows the C of the brand logo */}
        <button
          type="button"
          aria-expanded={expanded}
          aria-label={expanded ? "Cerrar canales de contacto" : "Abrir canales de contacto"}
          onClick={() => setOpen((current) => !current)}
          className={cn(
            "relative grid size-14 place-items-center overflow-hidden rounded-full bg-white text-primary-600 ring-2 ring-primary-500/40 shadow-[0_10px_30px_rgba(79,47,150,0.45)] transition-all duration-300 ease-out hover:scale-105 hover:ring-primary-500",
            expanded ? "scale-105 ring-primary-500" : ""
          )}
        >
          <span className="absolute inset-0 rounded-full bg-gradient-to-br from-primary-50 via-white to-primary-100" />
          <span className="absolute inset-[6px] overflow-hidden rounded-full">
            <Image
              src={site.assets.brand.header}
              alt="Codenium"
              fill
              sizes="56px"
              style={{ objectPosition: "50% 0%", transformOrigin: "50% 0%" }}
              className="object-cover scale-[2.05]"
              priority={false}
            />
          </span>
          <span
            className={cn(
              "pointer-events-none absolute inset-0 rounded-full ring-1 ring-inset ring-white/40 transition-opacity",
              expanded ? "opacity-100" : "opacity-0"
            )}
          />
        </button>
      </div>
    </div>
  );
}

interface RadialItemProps {
  label: string;
  icon: React.ReactNode;
  color: string;
  iconBg: string;
  delay: number;
  visible: boolean;
  offset: { x: number; y: number };
  href?: string;
  external?: boolean;
  onClick?: () => void;
}

function ContactRadialItem({
  label,
  icon,
  color,
  iconBg,
  delay,
  visible,
  offset,
  href,
  external,
  onClick
}: RadialItemProps) {
  const className = cn(
    "group/radial absolute flex size-12 items-center justify-center rounded-full shadow-[0_10px_24px_rgba(15,23,42,0.22)]",
    color,
    visible ? "" : "pointer-events-none"
  );
  const tx = visible ? offset.x : 0;
  const ty = visible ? offset.y : 0;
  const scale = visible ? 1 : 0.5;
  const style: React.CSSProperties = {
    left: 0,
    top: 0,
    opacity: visible ? 1 : 0,
    transform: `translate(calc(-50% + ${tx}px), calc(-50% + ${ty}px)) scale(${scale})`,
    transition: `transform 420ms cubic-bezier(0.34,1.56,0.64,1) ${visible ? delay : 0}ms, opacity 260ms ease-out ${visible ? delay : 0}ms`
  };

  const content = (
    <>
      <span className={cn("grid size-9 place-items-center rounded-full", iconBg)}>{icon}</span>
      <span
        className={cn(
          "pointer-events-none absolute right-full top-1/2 mr-2 -translate-y-1/2 whitespace-nowrap rounded-full bg-slate-950/90 px-2.5 py-1 text-[11px] font-semibold text-white opacity-0 shadow-md transition-opacity duration-200 group-hover/radial:opacity-100"
        )}
      >
        {label}
      </span>
    </>
  );

  if (href) {
    return (
      <a
        href={href}
        aria-label={label}
        className={className}
        style={style}
        target={external ? "_blank" : undefined}
        rel={external ? "noreferrer" : undefined}
        onClick={onClick}
      >
        {content}
      </a>
    );
  }

  return (
    <button type="button" aria-label={label} className={className} style={style} onClick={onClick}>
      {content}
    </button>
  );
}
