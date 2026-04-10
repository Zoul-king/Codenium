import { NextResponse } from "next/server";
import { chatbotContext } from "@/features/marketing/data/chatbot-context";

type IncomingMessage = {
  role: "user" | "assistant";
  content: string;
};

export async function POST(req: Request) {
  try {
    const body = await req.json();
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