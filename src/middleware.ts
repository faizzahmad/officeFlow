import { getSessionCookie } from "better-auth/cookies";
import { NextRequest, NextResponse } from "next/server";

const publicPaths = ["/", "/login", "/register", "/signup"];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const isPublic =
    publicPaths.includes(pathname) ||
    pathname.startsWith("/api/auth") ||
    pathname.startsWith("/api/uploadthing");

  if (isPublic) {
    return NextResponse.next();
  }

  const sessionCookie = getSessionCookie(request);
  if (!sessionCookie) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
