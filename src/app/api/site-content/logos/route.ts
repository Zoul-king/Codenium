import { NextResponse } from "next/server";

import { getCurrentSession } from "@/lib/auth/session";
import { getManagedLogos, setManagedLogos } from "@/server/services/site-content-service";

export async function GET() {
  try {
    const items = await getManagedLogos();
    return NextResponse.json(items);
  } catch {
    return NextResponse.json({ error: "No se pudieron cargar los logos." }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  const session = await getCurrentSession();
  if (!session) return NextResponse.json({ error: "No autorizado." }, { status: 401 });
  if (session.user.role !== "admin")
    return NextResponse.json({ error: "Acceso restringido." }, { status: 403 });

  try {
    const body = await request.json();
    const saved = await setManagedLogos(Array.isArray(body) ? body : []);
    return NextResponse.json(saved);
  } catch {
    return NextResponse.json({ error: "No se pudieron guardar los logos." }, { status: 500 });
  }
}
