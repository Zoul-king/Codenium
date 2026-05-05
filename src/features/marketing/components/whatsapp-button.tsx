"use client";

import { useEffect, useRef, useState } from "react";
import { Mail } from "lucide-react";

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

  const expanded = open || hovered;

  return (
    <div
      ref={containerRef}
      className="fixed bottom-5 right-5 z-40 md:bottom-8 md:right-8"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div className="relative flex flex-col items-end">
        {/* Chat panel (FrancIA) */}
        {chatOpen ? (
          <div className="absolute bottom-[calc(100%+12px)] right-0 flex h-[min(480px,calc(100svh-120px))] w-[min(360px,calc(100vw-32px))] flex-col overflow-hidden rounded-[24px] border border-slate-200 bg-white shadow-[0_18px_40px_rgba(15,23,42,0.12)]">
            <div className="flex items-center justify-between border-b border-slate-200 bg-slate-950 px-4 py-3 text-white">
              <div>
                <p className="text-sm font-semibold">FrancIA</p>
                <p className="text-xs text-slate-300">Asistente virtual de Codenium</p>
              </div>
              <button
                type="button"
                onClick={() => setChatOpen(false)}
                className="rounded-full px-3 py-1 text-xs font-medium text-white transition hover:bg-white/10"
              >
                Cerrar
              </button>
            </div>
            <div className="flex-1 space-y-3 overflow-y-auto bg-slate-50 px-4 py-4">
              {messages.map((message, index) => (
                <div
                  key={`${message.role}-${index}`}
                  className={
                    message.role === "user"
                      ? "ml-auto max-w-[85%] rounded-2xl rounded-br-md bg-slate-950 px-4 py-3 text-sm text-white shadow-sm"
                      : "max-w-[85%] rounded-2xl rounded-bl-md bg-white px-4 py-3 text-sm text-slate-700 shadow-sm"
                  }
                >
                  {message.content}
                </div>
              ))}
              {loading ? (
                <div className="max-w-[85%] rounded-2xl rounded-bl-md bg-white px-4 py-3 text-sm text-slate-500 shadow-sm">
                  FrancIA está escribiendo...
                </div>
              ) : null}
              <div ref={messagesEndRef} />
            </div>
            <div className="border-t border-slate-200 bg-white p-3">
              <div className="flex gap-2">
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
                  className="w-full rounded-2xl border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-slate-950"
                />
                <button
                  type="button"
                  onClick={() => void handleSendMessage()}
                  disabled={loading || !input.trim()}
                  className="rounded-2xl bg-slate-950 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  Enviar
                </button>
              </div>
            </div>
          </div>
        ) : null}

        {/* Sub-buttons stack (FrancIA / Email / WhatsApp) */}
        <div
          className={cn(
            "mb-3 flex flex-col items-end gap-2.5 transition-all duration-300 ease-out",
            open
              ? "pointer-events-auto translate-y-0 opacity-100"
              : "pointer-events-none translate-y-3 opacity-0"
          )}
        >
          <ContactSubButton
            label={site.contact.assistantLabel ?? "FrancIA"}
            color="bg-primary-500 text-white"
            iconBg="bg-white/20"
            delay={0}
            visible={open}
            onClick={() => {
              setOpen(false);
              setChatOpen(true);
            }}
            icon={<ContactHubIcon className="size-4" />}
          />
          <ContactSubButton
            label="Correo electrónico"
            color="bg-sky-600 text-white"
            iconBg="bg-white/20"
            delay={60}
            visible={open}
            href={`mailto:${site.contact.email}`}
            icon={<Mail className="size-4" strokeWidth={2} />}
          />
          <ContactSubButton
            label="WhatsApp"
            color="bg-emerald-600 text-white"
            iconBg="bg-white/20"
            delay={120}
            visible={open}
            href={site.contact.whatsapp}
            external
            icon={<WhatsAppIcon className="size-4" />}
          />
        </div>

        {/* Trigger pill: circle with C, expands on hover or open */}
        <button
          type="button"
          aria-expanded={open}
          aria-label={open ? "Cerrar canales de contacto" : "Abrir canales de contacto"}
          onClick={() => setOpen((current) => !current)}
          className={cn(
            "group flex h-14 items-center overflow-hidden rounded-full bg-primary-500 text-white shadow-[0_8px_28px_rgba(79,47,150,0.35)] transition-all duration-300 ease-out hover:bg-primary-600",
            expanded ? "w-[230px] px-4" : "w-14 px-0 justify-center"
          )}
        >
          <span
            className={cn(
              "flex size-10 shrink-0 items-center justify-center rounded-full text-lg font-extrabold tracking-tight transition-colors",
              expanded ? "bg-white/15" : "bg-transparent"
            )}
          >
            C
          </span>
          <span
            className={cn(
              "ml-3 whitespace-nowrap text-[13.5px] font-bold transition-all duration-300",
              expanded ? "translate-x-0 opacity-100" : "-translate-x-2 opacity-0"
            )}
          >
            Canales de contacto
          </span>
        </button>
      </div>
    </div>
  );
}

interface SubButtonProps {
  label: string;
  icon: React.ReactNode;
  color: string;
  iconBg: string;
  delay: number;
  visible: boolean;
  href?: string;
  external?: boolean;
  onClick?: () => void;
}

function ContactSubButton({ label, icon, color, iconBg, delay, visible, href, external, onClick }: SubButtonProps) {
  const className = cn(
    "flex h-11 items-center gap-2.5 rounded-full px-4 pr-5 text-[13px] font-bold shadow-[0_8px_22px_rgba(15,23,42,0.18)] transition-all duration-300 ease-out hover:-translate-x-0.5 hover:scale-[1.02]",
    color,
    visible ? "translate-y-0 opacity-100" : "translate-y-2 opacity-0"
  );
  const style = { transitionDelay: visible ? `${delay}ms` : "0ms" };

  const content = (
    <>
      <span className={cn("grid size-7 place-items-center rounded-full", iconBg)}>{icon}</span>
      <span>{label}</span>
    </>
  );

  if (href) {
    return (
      <a
        href={href}
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
    <button type="button" className={className} style={style} onClick={onClick}>
      {content}
    </button>
  );
}
