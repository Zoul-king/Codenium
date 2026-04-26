import { NextResponse } from "next/server";

import { env } from "@/config/env";

export function GET() {
  return NextResponse.json({
    ok: true,
    databaseConfigured: Boolean(env.DATABASE_URL)
  });
}
