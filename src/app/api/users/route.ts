import { NextResponse } from "next/server";

import { db } from "@/lib/db";

export async function GET() {
  try {
    const users = await db.user.findMany();

    return NextResponse.json(users);
  } catch {
    return NextResponse.json(
      { error: "No se pudieron obtener los usuarios." },
      { status: 500 }
    );
  }
}