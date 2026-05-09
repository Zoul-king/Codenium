import { NextResponse } from "next/server";

import { getCurrentSession } from "@/lib/auth/session";
import { getManagedPlanTexts, setManagedPlanTexts } from "@/server/services/site-content-service";

export async function GET() {
  try {
    const data = await getManagedPlanTexts();
    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ error: "No se pudieron cargar los textos." }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  const session = await getCurrentSession();
  if (!session) return NextResponse.json({ error: "No autorizado." }, { status: 401 });
  if (session.user.role !== "admin")
    return NextResponse.json({ error: "Acceso restringido." }, { status: 403 });

  try {
    const body = await request.json();
    const saved = await setManagedPlanTexts(body && typeof body === "object" ? body : {});
    return NextResponse.json(saved);
  } catch {
    return NextResponse.json({ error: "No se pudieron guardar los textos." }, { status: 500 });
  }
}
