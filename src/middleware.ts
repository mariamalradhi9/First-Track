import { NextResponse } from "next/server";
import type { NextFetchEvent, NextMiddleware, NextRequest } from "next/server";
import NextAuth from "next-auth";
import type { NextAuthRequest } from "next-auth";
import { authConfig } from "@/auth.config";

const { auth } = NextAuth(authConfig);
const authMiddleware = auth as unknown as (
  request: NextAuthRequest,
  event: NextFetchEvent
) => ReturnType<NextMiddleware>;

function hasValidBasicAuth(req: NextRequest) {
  const adminPassword = process.env.ADMIN_PASSWORD;
  if (!adminPassword) return true;

  const header = req.headers.get("authorization");
  if (!header?.startsWith("Basic ")) return false;

  const [, password] = atob(header.slice(6)).split(":");
  return password === adminPassword;
}

export default function middleware(req: NextRequest, event: NextFetchEvent) {
  if (!hasValidBasicAuth(req)) {
    return new NextResponse("Authentication required", {
      status: 401,
      headers: { "WWW-Authenticate": 'Basic realm="Restricted"' },
    });
  }
  return authMiddleware(req as NextAuthRequest, event);
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|glb|js)$).*)"],
};
