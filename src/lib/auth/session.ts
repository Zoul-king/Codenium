import "server-only";

import { randomBytes } from "node:crypto";
import { cookies } from "next/headers";
import type { User } from "@prisma/client";

import { db } from "@/lib/db";
import { env } from "@/config/env";

const SESSION_COOKIE = "codenium.sid";
const SESSION_TTL_MS = 1000 * 60 * 60 * 24 * 7; // 7 días

export interface PublicUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  name: string;
  role: "client" | "pm" | "admin";
}

export function toPublicUser(user: User): PublicUser {
  return {
    id: user.id,
    email: user.email,
    firstName: user.firstName,
    lastName: user.lastName,
    name: `${user.firstName} ${user.lastName}`.trim(),
    role: user.role.toLowerCase() as PublicUser["role"]
  };
}

function generateToken() {
  return randomBytes(32).toString("hex");
}

export async function createSession(userId: string) {
  const token = generateToken();
  const expiresAt = new Date(Date.now() + SESSION_TTL_MS);

  await db.session.create({
    data: {
      userId,
      token,
      expiresAt
    }
  });

  const jar = await cookies();
  jar.set(SESSION_COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: env.NODE_ENV === "production",
    path: "/",
    expires: expiresAt
  });

  return { token, expiresAt };
}

export async function getCurrentSession() {
  const jar = await cookies();
  const token = jar.get(SESSION_COOKIE)?.value;

  if (!token) {
    return null;
  }

  const session = await db.session.findUnique({
    where: { token },
    include: { user: true }
  });

  if (!session) {
    return null;
  }

  if (session.expiresAt.getTime() < Date.now()) {
    await db.session.delete({ where: { id: session.id } }).catch(() => {});
    return null;
  }

  return {
    sessionId: session.id,
    user: toPublicUser(session.user)
  };
}

export async function destroyCurrentSession() {
  const jar = await cookies();
  const token = jar.get(SESSION_COOKIE)?.value;

  if (token) {
    await db.session.deleteMany({ where: { token } }).catch(() => {});
  }

  jar.set(SESSION_COOKIE, "", {
    httpOnly: true,
    sameSite: "lax",
    secure: env.NODE_ENV === "production",
    path: "/",
    expires: new Date(0)
  });
}
