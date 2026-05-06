import { NextResponse } from "next/server";

import { getCurrentSession } from "@/lib/auth/session";

// Stub de la integración con Mercado Pago.
//
// La interfaz visual y la estructura del flujo de pago están listas en el
// dashboard del cliente, pero el checkout real no está activo. Este endpoint
// queda como punto de entrada para cuando se conecten las credenciales del
// API de Mercado Pago (preference creation + webhook). Mientras tanto
// devuelve 503 explícito para que cualquier llamada accidental quede clara.
//
// TODO: integrar con el SDK oficial de Mercado Pago:
//   import { MercadoPagoConfig, Preference } from "mercadopago";
//   const client = new MercadoPagoConfig({ accessToken: env.MERCADOPAGO_ACCESS_TOKEN });
//   const preference = await new Preference(client).create({ body: { ... } });
//   return NextResponse.json({ initPoint: preference.init_point });

export async function POST(request: Request) {
  const session = await getCurrentSession();

  if (!session) {
    return NextResponse.json({ error: "No autorizado." }, { status: 401 });
  }

  // Lee el body solo para validar forma; no lo usamos todavía.
  try {
    await request.json();
  } catch {
    // payload opcional
  }

  return NextResponse.json(
    {
      enabled: false,
      provider: "mercadopago",
      message:
        "La integración con Mercado Pago aún no está activa. La interfaz visual y la estructura del endpoint ya están preparadas; solo falta conectar las credenciales y habilitar el checkout."
    },
    { status: 503 }
  );
}
