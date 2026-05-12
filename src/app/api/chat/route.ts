import { NextResponse } from "next/server";

import { db } from "@/lib/db";
import { getCurrentSession } from "@/lib/auth/session";
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

  const session = await getCurrentSession();

  if (!session) {
    return NextResponse.json({ error: "No autorizado." }, { status: 401 });
  }

  try {
    // admin y pm ven todos los mensajes; client solo los de sus proyectos
    const where =
      session.user.role === "client"
        ? { project: { clientId: session.user.id } }
        : {};

    const messages = await db.message.findMany({
      where,
      include: {
        sender: {
          select: { firstName: true, lastName: true, role: true }
        },
        project: {
          select: { name: true, clientId: true, pmId: true, quoteId: true }
        }
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

// Marca como leídos todos los mensajes recibidos por el usuario actual en un
// proyecto (mensajes que él NO envió). Devuelve cuántos se actualizaron y los
// mensajes refrescados para que el cliente sincronice su estado local.
export async function PATCH(req: Request) {
  const session = await getCurrentSession();

  if (!session) {
    return NextResponse.json({ error: "No autorizado." }, { status: 401 });
  }

  let body: { projectId?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Cuerpo inválido." }, { status: 400 });
  }

  const projectId = typeof body.projectId === "string" ? body.projectId.trim() : "";
  if (!projectId) {
    return NextResponse.json({ error: "Falta projectId." }, { status: 400 });
  }

  const project = await db.project.findUnique({
    where: { id: projectId },
    select: { id: true, clientId: true, pmId: true }
  });

  if (!project) {
    return NextResponse.json({ error: "Proyecto no encontrado." }, { status: 404 });
  }

  const isAdmin = session.user.role === "admin";
  const isProjectClient = session.user.role === "client" && project.clientId === session.user.id;
  const isProjectPm = session.user.role === "pm" && project.pmId === session.user.id;

  if (!isAdmin && !isProjectClient && !isProjectPm) {
    return NextResponse.json({ error: "Acceso restringido." }, { status: 403 });
  }

  try {
    const result = await db.message.updateMany({
      where: {
        projectId: project.id,
        isRead: false,
        NOT: { senderId: session.user.id }
      },
      data: { isRead: true }
    });

    return NextResponse.json({ ok: true, updated: result.count });
  } catch (error) {
    console.error("[chat PATCH]", {
      error: error instanceof Error ? error.message.split("\n")[0] : String(error)
    });
    return NextResponse.json({ error: "No se pudo marcar como leído." }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();

    // Rama de mensajes de dashboard — requiere sesión activa
    if (typeof body?.projectId === "string" && typeof body?.message === "string" && !body?.messages) {
      const session = await getCurrentSession();

      if (!session) {
        return NextResponse.json({ error: "No autorizado." }, { status: 401 });
      }

      const content = body.message.trim();

      if (!content) {
        return NextResponse.json({ error: "El mensaje no puede estar vacío." }, { status: 400 });
      }

      const project = await db.project.findUnique({
        where: { id: body.projectId },
        select: { id: true, clientId: true, pmId: true }
      });

      if (!project) {
        return NextResponse.json({ error: "Proyecto no encontrado." }, { status: 404 });
      }

      const isAdmin = session.user.role === "admin";
      const isProjectClient = session.user.role === "client" && project.clientId === session.user.id;
      const isProjectPm = session.user.role === "pm" && project.pmId === session.user.id;

      if (!isAdmin && !isProjectClient && !isProjectPm) {
        return NextResponse.json({ error: "Acceso restringido." }, { status: 403 });
      }

      const created = await db.message.create({
        data: {
          projectId: project.id,
          senderId: session.user.id, // nunca del body
          content
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
