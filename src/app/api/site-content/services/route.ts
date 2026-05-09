import { NextResponse } from "next/server";

import { getCurrentSession } from "@/lib/auth/session";
import { getManagedServices, setManagedServices } from "@/server/services/site-content-service";

export async function GET() {
  try {
    const items = await getManagedServices();
    return NextResponse.json(items);
  } catch {
    return NextResponse.json({ error: "No se pudieron cargar los servicios." }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  const session = await getCurrentSession();
  if (!session) return NextResponse.json({ error: "No autorizado." }, { status: 401 });
  if (session.user.role !== "admin")
    return NextResponse.json({ error: "Acceso restringido." }, { status: 403 });

  try {
    const body = await request.json();
    const saved = await setManagedServices(Array.isArray(body) ? body : []);
    return NextResponse.json(saved);
  } catch {
    return NextResponse.json({ error: "No se pudieron guardar los servicios." }, { status: 500 });
  }
}
