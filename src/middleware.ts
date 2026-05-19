import { NextResponse, type NextRequest } from "next/server";

import { validateLicense } from "@/lib/license";

const SESSION_COOKIE = "codenium.sid";
const LICENSE_EXPIRED_PATH = "/license-expired";

export function middleware(request: NextRequest) {
  const { pathname, search } = request.nextUrl;

  const license = validateLicense();
  if (!license.valid) {
    if (pathname === LICENSE_EXPIRED_PATH) {
      return NextResponse.next();
    }
    const url = new URL(LICENSE_EXPIRED_PATH, request.url);
    return NextResponse.rewrite(url);
  }

  if (pathname === LICENSE_EXPIRED_PATH) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  if (pathname.startsWith("/dashboard")) {
    const hasSession = Boolean(request.cookies.get(SESSION_COOKIE)?.value);
    if (!hasSession) {
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("redirect", pathname + search);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|icons/|images/|fonts/|api/health).*)"]
};
