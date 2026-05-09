import { NextResponse } from "next/server";

import { db } from "@/lib/db";
import { getCurrentSession } from "@/lib/auth/session";

export async function GET() {
  const session = await getCurrentSession();

  if (!session) {
    return NextResponse.json({ user: null }, { status: 200 });
  }

  try {
    const dbUser = await db.user.findUnique({
      where: { id: session.user.id },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        phone: true,
        company: true,
        role: true,
        status: true,
        createdAt: true
      }
    });

    if (dbUser) {
      return NextResponse.json({
        user: {
          id: dbUser.id,
          firstName: dbUser.firstName,
          lastName: dbUser.lastName,
          name: `${dbUser.firstName} ${dbUser.lastName}`.trim(),
          email: dbUser.email,
          phone: dbUser.phone ?? "",
          company: dbUser.company ?? null,
          role: String(dbUser.role).toLowerCase(),
          status: String(dbUser.status).toLowerCase(),
          createdAt: dbUser.createdAt
        }
      });
    }
  } catch {
    // Fallthrough al payload mínimo de la sesión.
  }

  return NextResponse.json({ user: session.user });
}
