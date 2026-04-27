import { NextResponse } from "next/server";

import { db } from "@/lib/db";
import { chatbotContext } from "@/features/marketing/data/chatbot-context";

type IncomingMessage = {
  role: "user" | "assistant";
  content: string;
};

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);

  if (searchParams.get("scope") !== "dashboard") {
    return NextResponse.json({ error: "Ruta no soportada." }, { status: 400 });
  }

  try {
    const messages = await db.message.findMany({
      include: {
        sender: true,
        project: true
      },
      orderBy: {
        createdAt: "asc"
      }
    });

    return NextResponse.json(messages.map(mapDashboardMessage));
  } catch {
    return NextResponse.json({ error: "No se pudieron obtener los mensajes." }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();

    if (typeof body?.projectId === "string" && typeof body?.senderId === "string" && typeof body?.message === "string") {
      const created = await db.message.create({
        data: {
          projectId: body.projectId,
          senderId: body.senderId,
          content: body.message.trim()
        },
        include: {
          sender: true,
          project: true
        }
      });

      return NextResponse.json(mapDashboardMessage(created));
    }

    const message = body?.message;
    const messages = body?.messages;

    if (!message || typeof message !== "string") {
      return NextResponse.json({ error: "Mensaje inválido" }, { status: 400 });
    }

    const apiKey = process.env.GROQ_API_KEY;

    if (!apiKey) {
      return NextResponse.json({ error: "Falta GROQ_API_KEY en .env.local" }, { status: 500 });
    }

    const safeMessages: IncomingMessage[] = Array.isArray(messages)
      ? messages
          .filter(
            (item): item is IncomingMessage =>
              item &&
              (item.role === "user" || item.role === "assistant") &&
              typeof item.content === "string"
          )
          .slice(-10)
      : [];

    const groqResponse = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: "llama-3.1-8b-instant",
        messages: [
          {
            role: "system",
            content: chatbotContext
          },
          ...safeMessages,
          {
            role: "user",
            content: message
          }
        ],
        temperature: 0.7,
        max_tokens: 400
      })
    });

    const data = await groqResponse.json();

    if (!groqResponse.ok) {
      return NextResponse.json(
        { error: data?.error?.message || "Error al consultar Groq" },
        { status: groqResponse.status }
      );
    }

    const reply = data?.choices?.[0]?.message?.content ?? "No pude responder en este momento.";

    return NextResponse.json({ reply });
  } catch {
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
  }
}

function mapDashboardMessage(message: {
  id: string;
  projectId: string;
  senderId: string;
  content: string;
  isRead: boolean;
  createdAt: Date;
  sender: { firstName: string; lastName: string; role: string };
  project: { name: string; clientId: string; pmId: string | null; quoteId: string };
}) {
  const senderName = `${message.sender.firstName} ${message.sender.lastName}`.trim();
  const senderRole = message.sender.role.toLowerCase();

  return {
    id: message.id,
    thread: message.project.name,
    senderId: message.senderId,
    recipientId: senderRole === "client" ? message.project.pmId : message.project.clientId,
    projectId: message.projectId,
    quoteId: message.project.quoteId,
    senderName,
    role: senderRole,
    preview: message.content,
    sentAt: new Intl.DateTimeFormat("es-MX", {
      dateStyle: "short",
      timeStyle: "short",
      timeZone: "America/Mexico_City"
    }).format(new Date(message.createdAt)),
    status: message.isRead ? "read" : "unread"
  };
}
