"use client";

import { useEffect, useRef, useState } from "react";

import { Mail } from "lucide-react";

import { ContactHubIcon, WhatsAppIcon } from "@/components/common/icons";
import { site } from "@/features/marketing/data/site";

type ChatMessage = {
  role: "user" | "assistant";
  content: string;
};

export function WhatsAppButton() {
  const [open, setOpen] = useState(false);
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
          return [
            {
              role: "assistant",
              content: "Hola, soy FrancIA, el chatbot de Codenium. Puedo ayudarte con planes, precios, servicios, cotizaciones y formas de contacto. Puedes preguntarme por el plan básico, PYMES, e-commerce, planes empresariales o servicios de mantenimiento."
            }
          ];
        }
      }
    }

    return [
      {
        role: "assistant",
        content: "Hola, soy FrancIA, el chatbot de Codenium. Puedo ayudarte con planes, precios, servicios, cotizaciones y formas de contacto. Puedes preguntarme por el plan básico, PYMES, e-commerce, planes empresariales o servicios de mantenimiento."
      }
    ];
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

  // Guardar mensajes cada vez que cambien (Paso 24)
  useEffect(() => {
    if (typeof window !== "undefined") {
      window.localStorage.setItem("francia-chat-messages", JSON.stringify(messages));
    }
  }, [messages]);

  async function handleSendMessage() {
    const trimmedMessage = input.trim();

    if (!trimmedMessage || loading) {
      return;
    }

    const normalizedMessage = trimmedMessage.toLowerCase();

    const wantsWhatsApp =
      (normalizedMessage.includes("whatsapp") ||
        normalizedMessage.includes("whats app") ||
        normalizedMessage.includes("watsap") ||
        normalizedMessage.includes("wasap")) &&
      (
        normalizedMessage.includes("abr") ||
        normalizedMessage.includes("comunicarme") ||
        normalizedMessage.includes("contactar") ||
        normalizedMessage.includes("mandar mensaje") ||
        normalizedMessage.includes("enviar mensaje") ||
        normalizedMessage.includes("hablar")
      );

    const wantsEmail =
      (normalizedMessage.includes("correo") ||
        normalizedMessage.includes("email") ||
        normalizedMessage.includes("e-mail") ||
        normalizedMessage.includes("mail")) &&
      (
        normalizedMessage.includes("abr") ||
        normalizedMessage.includes("comunicarme") ||
        normalizedMessage.includes("contactar") ||
        normalizedMessage.includes("escribir") ||
        normalizedMessage.includes("enviar") ||
        normalizedMessage.includes("mandar")
      );

    if (wantsWhatsApp) {
      setMessages((current) => [
        ...current,
        {
          role: "user",
          content: trimmedMessage
        },
        {
          role: "assistant",
          content: "Te abro WhatsApp para que puedas comunicarte con Codenium."
        }
      ]);
      setInput("");
      window.open(site.contact.whatsapp, "_blank");
      return;
    }

    if (wantsEmail) {
      setMessages((current) => [
        ...current,
        {
          role: "user",
          content: trimmedMessage
        },
        {
          role: "assistant",
          content: "Te abro el correo para que puedas escribirle al equipo de Codenium."
        }
      ]);
      setInput("");
      window.location.href = `mailto:${site.contact.email}`;
      return;
    }

    const userMessage: ChatMessage = {
      role: "user",
      content: trimmedMessage
    };

    setMessages((current) => [...current, userMessage]);
    setInput("");
    setLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          message: trimmedMessage,
          messages
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data?.error || "No se pudo obtener respuesta del servidor.");
      }

      const assistantMessage: ChatMessage = {
        role: "assistant",
        content: data.reply || "No pude responder en este momento."
      };

      setMessages((current) => [...current, assistantMessage]);
    } catch (error) {
      const errorMessage: ChatMessage = {
        role: "assistant",
        content: "Hubo un problema al conectar con FrancIA. Revisa la configuración e inténtalo otra vez."
      };

      setMessages((current) => [...current, errorMessage]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div ref={containerRef} className="fixed bottom-8 right-6 z-40 hidden md:block">
      <div className="relative">
        {chatOpen ? (
          <div className="absolute bottom-[calc(100%+12px)] right-0 flex h-[480px] w-[360px] flex-col overflow-hidden rounded-[24px] border border-slate-200 bg-white shadow-[0_18px_40px_rgba(15,23,42,0.12)]">
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

        {/* Contact hub menu */}
        <div
          className={`absolute bottom-[calc(100%+14px)] right-0 min-w-[230px] rounded-2xl border border-slate-100 bg-white p-2 shadow-[0_20px_48px_rgba(15,23,42,0.14)] transition-all duration-200 ${
            open ? "pointer-events-auto translate-y-0 opacity-100" : "pointer-events-none translate-y-2 opacity-0"
          }`}
        >
          <button
            className="contact-hub-link"
            onClick={() => {
              setOpen(false);
              setChatOpen(true);
            }}
          >
            <span className="grid size-7 shrink-0 place-items-center rounded-lg bg-primary-50 text-primary-500">
              <ContactHubIcon className="size-3.5" />
            </span>
            <span>{site.contact.assistantLabel ?? "Asistente virtual"}</span>
          </button>

          <a
            href={`mailto:${site.contact.email}`}
            className="contact-hub-link"
            onClick={() => setOpen(false)}
          >
            <span className="grid size-7 shrink-0 place-items-center rounded-lg bg-sky-50 text-sky-600">
              <Mail className="size-3.5" strokeWidth={1.9} />
            </span>
            <span>Correo electrónico</span>
          </a>

          <a
            href={site.contact.whatsapp}
            target="_blank"
            rel="noreferrer"
            className="contact-hub-link"
            onClick={() => setOpen(false)}
          >
            <span className="grid size-7 shrink-0 place-items-center rounded-lg bg-emerald-50 text-emerald-600">
              <WhatsAppIcon className="size-3.5" />
            </span>
            <span>WhatsApp</span>
          </a>
        </div>

        {/* Trigger button */}
        <button
          type="button"
          className="flex items-center gap-3 rounded-full border border-white/10 bg-slate-950 py-3 pl-3 pr-5 text-[13px] font-semibold text-white shadow-[0_8px_28px_rgba(15,23,42,0.28)] transition-all duration-200 hover:bg-primary-500 hover:shadow-[0_8px_28px_rgba(79,47,150,0.35)]"
          aria-expanded={open}
          aria-label="Abrir canales de contacto"
          onClick={() => setOpen((current) => !current)}
        >
          <span className="grid size-9 place-content-center rounded-full bg-white/10 text-white">
            <ContactHubIcon className="size-4" />
          </span>
          <span>Canales de contacto</span>
        </button>
      </div>
    </div>
  );
}