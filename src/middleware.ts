import { NextResponse } from "next/server";
import { auth } from "@/auth";

export default auth((req) => {
  const isLoggedIn = !!req.auth;
  const { pathname } = req.nextUrl;
  const isPublic = pathname === "/login" || pathname.startsWith("/api/auth");

  if (!isLoggedIn && !isPublic) {
    const url = new URL("/login", req.nextUrl.origin);
    return NextResponse.redirect(url);
  }
  if (isLoggedIn && pathname === "/login") {
    const url = new URL("/", req.nextUrl.origin);
    return NextResponse.redirect(url);
  }
  return NextResponse.next();
});

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|glb|js)$).*)"],
};
