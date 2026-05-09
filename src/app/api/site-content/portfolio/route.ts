import { NextResponse } from "next/server";

import { getCurrentSession } from "@/lib/auth/session";
import { getManagedPortfolio, setManagedPortfolio } from "@/server/services/site-content-service";

export async function GET() {
  try {
    const items = await getManagedPortfolio();
    return NextResponse.json(items);
  } catch {
    return NextResponse.json({ error: "No se pudo cargar el portafolio." }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  const session = await getCurrentSession();
  if (!session) return NextResponse.json({ error: "No autorizado." }, { status: 401 });
  if (session.user.role !== "admin")
    return NextResponse.json({ error: "Acceso restringido." }, { status: 403 });

  try {
    const body = await request.json();
    const saved = await setManagedPortfolio(Array.isArray(body) ? body : []);
    return NextResponse.json(saved);
  } catch {
    return NextResponse.json({ error: "No se pudo guardar el portafolio." }, { status: 500 });
  }
}
