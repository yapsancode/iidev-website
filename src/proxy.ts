import { NextResponse, type NextRequest } from "next/server";

export function proxy(request: NextRequest) {
  const response = NextResponse.next();
  if (request.nextUrl.pathname.startsWith("/internal")) response.headers.set("Cache-Control", "private, no-store");
  return response;
}

export const config = {
  matcher: ["/internal/:path*"],
};
