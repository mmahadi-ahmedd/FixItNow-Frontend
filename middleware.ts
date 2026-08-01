import { NextRequest, NextResponse } from "next/server";

const protectedRoutes = ["/auth/dashboard"];
const authRoutes = ["/auth/login", "/auth/register"];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get("accessToken")?.value;

  const isProtectedRoute = protectedRoutes.some((route) =>
    pathname.startsWith(route)
  );
  const isAuthRoute = authRoutes.some((route) =>
    pathname.startsWith(route)
  );

  if (isProtectedRoute && !token) {
    return NextResponse.redirect(new URL("/auth/login", request.url));
  }

  if (isAuthRoute && token) {
    return NextResponse.redirect(
      new URL("/auth/dashboard/customer", request.url)
    );
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/auth/dashboard/:path*", "/auth/login", "/auth/register"],
};
