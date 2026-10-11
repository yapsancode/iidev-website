import { NextResponse, type NextRequest } from "next/server";
import { isBareDomain } from "@/lib/site-host";

const WWW_ORIGIN = "https://www.iidevstudio.com";

export function proxy(request: NextRequest) {
  // One address for visitors and for Google: the bare domain always goes to www.
  if (isBareDomain(request.headers.get("host"))) {
    return NextResponse.redirect(`${WWW_ORIGIN}${request.nextUrl.pathname}${request.nextUrl.search}`, 308);
  }
  const response = NextResponse.next();
  if (request.nextUrl.pathname.startsWith("/internal")) response.headers.set("Cache-Control", "private, no-store");
  return response;
}

export const config = {
  // Everything except Next's own static files.
  matcher: ["/((?!_next/static|_next/image).*)"],
};
