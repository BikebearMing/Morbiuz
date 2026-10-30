import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { MAINTENANCE_MODE } from "@/lib/maintenance";

// While in maintenance, serve the placeholder for every page URL (the address
// bar keeps the requested path).
export function proxy(request: NextRequest) {
  if (!MAINTENANCE_MODE || request.nextUrl.pathname === "/maintenance") {
    return NextResponse.next();
  }
  return NextResponse.rewrite(new URL("/maintenance", request.url));
}

export const config = {
  // Skip Next internals, API routes, static/proxied assets, and SEO files.
  matcher: [
    "/((?!_next/|api/|media/|fonts/|assets/|icon\\.png|favicon\\.ico|robots\\.txt|sitemap\\.xml).*)",
  ],
};
